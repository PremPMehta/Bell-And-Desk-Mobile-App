import Icon from '@/Components/Core/Icons';
import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  Animated,
  Platform,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styles from './style';
import { COLORS } from '@/Assets/Theme/colors';
import { useNavigation } from '@/Hooks/Utils/use-navigation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { vs } from '@/Assets/Theme/fontStyle';
import useUserApi from '@/Hooks/Apis/UserApis/use-user-api';
import { useRoute } from '@react-navigation/native';
import { Config } from '@/Config';
import { useRequireAuth } from '@/Hooks/Utils/use-require-auth';
import WebView from 'react-native-webview';
import CategoryDetailsSkeleton from '@/Components/Core/Skeleton/CategoryDetailsSkeleton';
import { useSetAtom } from 'jotai';
import { objectAtomFamily } from '@/Jotai/Atoms';
import { AtomKeys } from '@/Jotai/AtomKeys';
import Clipboard from '@react-native-clipboard/clipboard';
import ToastModule from '@/Components/Core/Toast';

import { api } from '@/ApiService';
import { ApiEndPoints } from '@/ApiService/api-end-points';

const CategoryDetails = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { slug } = route.params || {};
  console.log('🚀 ~ CategoryDetails ~ slug:', slug);

  const {
    getCommunitiesSlug,
    apiGetCommunitiesSlugLoading,
    apiGetCommunitiesSlug,
    joinCommunity,
    apiJoinCommunityLoading,
    getUserAccessRequests,
    apiGetUserAccessRequestsLoading,
    apiGetUserAccessRequests,
  } = useUserApi();
  const { requireAuth, isLoggedIn } = useRequireAuth();

  // Local state for background stats (isolates logic from the main hook)
  const [coursesStats, setCoursesStats] = useState<any>(null);
  const [isStatsLoading, setIsStatsLoading] = useState(false);

  // Directly access the setter for the slug atom to clear stale data
  const clearCommunitiesSlugAtom = useSetAtom(
    objectAtomFamily(AtomKeys.apiGetCommunitiesSlug),
  );

  // Track which slug we last fetched to avoid redundant re-fetches
  const lastFetchedSlugRef = useRef<string | null>(null);
  // Track which community _id we last fetched stats for (prevents duplicate stats calls)
  const lastFetchedCommunityIdRef = useRef<string | null>(null);
  // Guard against WebView height update loop
  const isUpdatingHeightRef = useRef(false);

  // WebView height — start at 1 (invisible) until content reports its actual height
  const [webHeight, setWebHeight] = useState(1);
  const [localRequestStatus, setLocalJoinStatus] = useState<string | null>(null);

  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [activeIndex, setActiveIndex] = useState(0);

  const isStaging = Config.APP_ENV === 'staging';
  const copyUrl = isStaging ? Config.STAGING_URL : Config.LIVE_URL;
  const backIcon = Platform.OS === 'ios' ? 'ChevronLeft' : 'ArrowLeft';

  useEffect(() => {
    if (!slug) return;

    // Avoid re-fetching the same slug (prevents redundant API calls & re-renders)
    if (lastFetchedSlugRef.current === slug) return;
    lastFetchedSlugRef.current = slug;

    // 1. Reset WebView height for the incoming community
    setWebHeight(1);
    isUpdatingHeightRef.current = false;

    // 2. Clear stale atom data from the previously-viewed community so we never
    //    show old communityData while the new request is in-flight
    clearCommunitiesSlugAtom(null as any);

    // 3. Reset the stats fetch guard, clear stale stats, and clear local join status
    lastFetchedCommunityIdRef.current = null;
    setCoursesStats(null);
    setLocalJoinStatus(null);

    // 4. Fetch fresh data for the current slug
    getCommunitiesSlug(`/${slug}`);
  }, [slug]);

  // Derive community data — only use it when it belongs to the current slug
  const communityData = useMemo(() => {
    return apiGetCommunitiesSlug?.data?.community || {};
  }, [apiGetCommunitiesSlug]);

  // Compute courses / chapters / videos counts from the background stats response
  // Traverses the structure: courses[] -> chapters[] -> videos[]
  const courseStats = useMemo(() => {
    const courses: any[] = coursesStats?.courses || [];
    let chaptersCount = 0;
    let videosCount = 0;
    courses.forEach((course: any) => {
      const chapters: any[] = course?.chapters || [];
      chaptersCount += chapters.length;
      chapters.forEach((chapter: any) => {
        videosCount += (chapter?.videos || []).length;
      });
    });
    return {
      coursesCount: courses.length,
      chaptersCount,
      videosCount,
    };
  }, [coursesStats]);

  // Background fetch: load courses stats once communityData._id is known.
  // Performs a direct API call to avoid useUserApi hook complexity/errors.
  const getStats = useCallback(async (communityId: string) => {
    try {
      setIsStatsLoading(true);
      const res: any = await api.get(
        `${ApiEndPoints.communityCourses}?community=${communityId}`,
      );
      setCoursesStats(res);
      setIsStatsLoading(false);
    } catch (error) {
      console.error('Error fetching community courses stats:', error);
      setIsStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    const communityId = communityData?._id;
    if (!communityId) return;
    if (lastFetchedCommunityIdRef.current === communityId) return;
    lastFetchedCommunityIdRef.current = communityId;
    getStats(communityId);

    // Also fetch user access requests if logged in to manage the "Join Now" button status correctly
    if (isLoggedIn) {
      getUserAccessRequests();
    }
  }, [communityData?._id, getStats, isLoggedIn]);

  console.log('🚀 ~ CategoryDetails ~ communityData:', communityData);

  const getVideoThumbnail = (url: string) => {
    if (!url) return null;

    // YouTube
    const ytMatch = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    );
    if (ytMatch) {
      return `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;
    }

    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
    if (vimeoMatch) {
      // Vimeo requires API for thumbnail normally, fallback placeholder
      return `https://vumbnail.com/${vimeoMatch[1]}.jpg`;
    }

    return null;
  };

  // Build media list: intro videos first (from introVideoLinks), then intro images
  const mediaList = useMemo(() => {
    const videos: any[] = (communityData?.introVideoLinks || []).map(
      (v: any) => ({
        type: 'video',
        uri: v?.url || '',
        platform: v?.platform || '', // e.g. 'vimeo', 'youtube'
        title: v?.title || '',
        videoThumbnail: getVideoThumbnail(v?.url || ''),
      }),
    );

    const images: any[] = (communityData?.introImages || []).map((m: any) => ({
      type: 'image',
      uri: m?.url || m?.uri || '',
    }));

    const combined = [...videos, ...images];
    // Fallback placeholder if nothing from the API
    return combined.length > 0
      ? combined
      : [{ type: 'image', uri: 'https://picsum.photos/800/900?random=1' }];
  }, [communityData?.introVideoLinks, communityData?.introImages]);

  const activeItem = mediaList[activeIndex] || mediaList[0];

  // Build an embeddable content for the active video item
  const videoSource = useMemo(() => {
    if (activeItem?.type !== 'video' || !activeItem?.uri) return null;
    const rawUrl: string = activeItem.uri;

    // Vimeo: standard embed URL logic
    const vimeoMatch = rawUrl.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
    if (vimeoMatch) {
      return {
        uri: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=0&muted=0&controls=1`,
      };
    }

    const ytMatch = rawUrl.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    );
    if (ytMatch) {
      // Use local HTML injection with ReferrerPolicy to satisfy YouTube's strict verification
      const videoId = ytMatch[1];
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body, html { margin: 0; padding: 0; background-color: black; width: 100%; height: 100%; overflow: hidden; }
              .video-container { position: relative; width: 100%; height: 100%; }
              iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0; }
            </style>
          </head>
          <body>
            <div class="video-container">
              <iframe 
                src="https://www.youtube.com/embed/${videoId}?rel=0&autoplay=0&controls=1&playsinline=1" 
                frameborder="0" 
                allow="autoplay; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen
                referrerpolicy="strict-origin-when-cross-origin">
              </iframe>
            </div>
          </body>
        </html>
      `;
      return {
        html,
        baseUrl: 'https://www.youtube.com',
        headers: { Referer: 'https://www.youtube.com' },
      };
    }

    return { uri: rawUrl };
  }, [activeItem]);

  const handleCopyUrl = (url: string) => {
    Clipboard.setString(url);
    ToastModule.successTop({ msg: 'Copied to Clipboard' });
  };

  const headerBgColor = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: ['transparent', COLORS.header],
    extrapolate: 'clamp',
  });

  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [0, 80, 120],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp',
  });

  const backButtonBgColor = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: ['rgba(0,0,0,0.4)', 'transparent'],
    extrapolate: 'clamp',
  });

  // Build WebView HTML only when welcomeMessage changes — never re-generated mid-render
  const welcomeMessageHtml = useMemo(() => {
    const htmlContent = communityData?.welcomeMessage || '';
    if (!htmlContent) return null;
    return {
      html: `<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
    <style>
      html, body {
        margin: 0 !important;
        padding: 0 !important;
        background-color: #000 !important;
        color: #fff;
        font-family: -apple-system, system-ui, Roboto, "Helvetica Neue", Arial, sans-serif;
        /* CRITICAL: do NOT set overflow:hidden here — it clips content.
           The WebView itself has scrollEnabled=false so no double-scroll. */
        overflow-x: hidden;
        width: 100%;
      }

      /* ── Override vh-based min-heights from the server HTML ──
         Sections use min-height:100vh which in a WebView resolves to the
         WebView frame height, not the page height. Force them to auto so
         the content determines its own size. */
      * {
        min-height: 0 !important;
        box-sizing: border-box;
      }

      /* Keep images responsive */
      img { max-width: 100% !important; height: auto !important; display: block; }

      /* Prevent horizontal overflow from fixed widths */
      section, div { max-width: 100% !important; }

      /* Allow grids to collapse to single column on mobile */
      [style*="grid-template-columns"] {
        grid-template-columns: 1fr !important;
      }

      /* Tone down huge font sizes for mobile */
      h1 { font-size: 2rem !important; }
      h2 { font-size: 1.6rem !important; }
      h3 { font-size: 1.25rem !important; }

      /* Reduce excessive padding/margin from the desktop layout */
      section {
        padding-top: 40px !important;
        padding-bottom: 40px !important;
        padding-left: 16px !important;
        padding-right: 16px !important;
      }

      /* Flex wrap for CTA button groups */
      [style*="display: flex"] {
        flex-wrap: wrap !important;
      }
    </style>
  </head>
  <body>
    <div id="cw">${htmlContent}</div>
    <script>
      // Report the full scrollable height to React Native.
      // We use document.body.scrollHeight (not getBoundingClientRect) because
      // getBoundingClientRect only returns the *visible* area when content
      // uses min-height or overflow constraints.
      var lastReported = 0;
      var reportCount = 0;
      var MAX_REPORTS = 6;

      function reportHeight() {
        if (reportCount >= MAX_REPORTS) return;

        // scrollHeight always reflects the full content height regardless
        // of CSS overflow settings.
        var height = Math.max(
          document.body.scrollHeight,
          document.documentElement.scrollHeight,
          document.getElementById('cw') ? document.getElementById('cw').scrollHeight : 0
        );

        if (height > 0 && Math.abs(height - lastReported) > 10) {
          lastReported = height;
          reportCount++;
          window.ReactNativeWebView.postMessage(String(height));
        }
      }

      // Fire at multiple points: immediate, after styles applied, after images loaded
      reportHeight();
      setTimeout(reportHeight, 100);
      setTimeout(reportHeight, 400);
      setTimeout(reportHeight, 800);
      setTimeout(reportHeight, 1500);

      window.addEventListener('load', reportHeight);

      // Watch for images that load late and change the layout height
      document.querySelectorAll('img').forEach(function(img) {
        img.addEventListener('load', function() { setTimeout(reportHeight, 100); });
        img.addEventListener('error', function() { setTimeout(reportHeight, 100); });
      });
    </script>
  </body>
</html>`,
    };
  }, [communityData?.welcomeMessage]);

  // onMessage handler — the JS side already deduplicates (max 6 reports, >10px change).
  // We accept every meaningful update here so later reports (after images load) can
  // still resize the WebView to the correct final height.
  // Determine enrollment status from userAccessRequests API response
  const userRequestStatus = useMemo(() => {
    const requests: any[] = apiGetUserAccessRequests?.data?.requests || [];
    const communityId = communityData?._id;
    if (!communityId || !isLoggedIn) return null;

    const currentRequest = requests.find(
      (req: any) =>
        (req?.communityId?._id === communityId ||
          req?.communityId === communityId) &&
        req?.status === 'pending',
    );

    return currentRequest ? 'pending' : null;
  }, [apiGetUserAccessRequests, communityData?._id, isLoggedIn]);

  const handleWebViewMessage = useCallback(
    (event: any) => {
      const height = Number(event.nativeEvent.data);
      if (height > 0 && Math.abs(height - webHeight) > 5) {
        setWebHeight(height + 16); // small bottom padding
      }
    },
    [webHeight],
  );

  const handleJoinNow = async () => {
    if (requireAuth()) {
      const communityId = communityData?._id;
      if (!communityId) return;

      const body = {
        message: 'I would like to join this community',
      };

      joinCommunity(communityId, body).then((res: any) => {
        if (res?.success) {
          // Instant feedback
          setLocalJoinStatus('pending');

          // Re-fetch community data and user requests to update status globally
          getCommunitiesSlug(`/${slug}`);
          getUserAccessRequests();
        }
      });
    }
  };

  // Show skeleton while we're loading the current slug's community data
  const isFetchingCurrent =
    apiGetCommunitiesSlugLoading || !communityData?.name;
  if (isFetchingCurrent && lastFetchedSlugRef.current === slug) {
    return <CategoryDetailsSkeleton />;
  }

  const hasHtml =
    communityData?.welcomeMessage &&
    /<[a-z/][\s\S]*?>/i.test(communityData.welcomeMessage);

  return (
    <View style={styles.container}>
      {/* ---------------------- CUSTOM ANIMATED HEADER ---------------------- */}
      <Animated.View
        style={[
          styles.header,
          {
            paddingTop: insets.top - vs(5),
            backgroundColor: headerBgColor,
            height: insets.top + vs(32),
          },
        ]}
      >
        <Animated.View
          style={[styles.backButton, { backgroundColor: backButtonBgColor }]}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              width: '100%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon
              name={backIcon}
              color={COLORS.white}
              size={Platform.OS === 'ios' ? 30 : 24}
            />
          </TouchableOpacity>
        </Animated.View>
        <Animated.Text
          style={[
            styles.headerTitle,
            { opacity: headerTitleOpacity, color: COLORS.white },
          ]}
        >
          {communityData?.name || 'Category Details'}
        </Animated.Text>
      </Animated.View>

      <Animated.ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
        scrollEventThrottle={16}
      >
        {/* ---------------------- HEADER MEDIA ---------------------- */}
        <View style={styles.bannerContainer}>
          {activeItem?.type === 'video' && videoSource ? (
            /* Video banner — use an iframe WebView for vimeo/youtube/external URLs */
            <WebView
              key={`video-banner-${activeIndex}`}
              source={videoSource}
              style={[styles.bannerImage, { backgroundColor: '#000' }]}
              allowsFullscreenVideo
              allowsInlineMediaPlayback
              mediaPlaybackRequiresUserAction={false}
              javaScriptEnabled
              domStorageEnabled={true}
              originWhitelist={['*']}
              mixedContentMode="always"
              scrollEnabled={false}
              nestedScrollEnabled={false}
              overScrollMode="never"
            />
          ) : (
            <Image
              source={{ uri: activeItem?.uri }}
              style={styles.bannerImage}
            />
          )}

          {/* GRADIENT SHADOW AT BOTTOM */}
          <LinearGradient
            colors={['transparent', COLORS.grLight, COLORS.grDark]}
            style={styles.headerGradient}
          />
        </View>

        {/* ---------------------- THUMBNAILS ---------------------- */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.carousel}
          contentContainerStyle={styles.carouselContainer}
        >
          {mediaList.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setActiveIndex(index)}
              style={[
                styles.thumbWrapper,
                activeIndex === index && styles.activeThumb,
              ]}
            >
              {item.type === 'video' ? (
                <>
                  {item.videoThumbnail ? (
                    <Image
                      source={{ uri: item.videoThumbnail }}
                      style={styles.thumbnail}
                    />
                  ) : (
                    <View
                      style={[
                        styles.thumbnail,
                        {
                          backgroundColor: '#111',
                          justifyContent: 'center',
                          alignItems: 'center',
                        },
                      ]}
                    >
                      <Icon name="CirclePlay" color={COLORS.white} size={28} />
                      {item.title ? (
                        <Text
                          numberOfLines={2}
                          style={{
                            color: COLORS.white,
                            fontSize: 9,
                            textAlign: 'center',
                            marginTop: 4,
                            paddingHorizontal: 4,
                          }}
                        >
                          {item.title}
                        </Text>
                      ) : null}
                    </View>
                  )}
                  <View style={styles.videoSmallIcon}>
                    <Icon name="CirclePlay" size={24} color={COLORS.white} />
                  </View>
                </>
              ) : (
                /* Image thumbnail */
                <Image source={{ uri: item.uri }} style={styles.thumbnail} />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ---------------------- CONTENT ---------------------- */}
        <View style={{ paddingHorizontal: 16 }}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>
              {communityData?.name || 'Title name'}
            </Text>
            <TouchableOpacity
              style={[
                styles.joinNow,
                (communityData?.isRequested ||
                  communityData?.requestStatus === 'pending' ||
                  userRequestStatus === 'pending' ||
                  localRequestStatus === 'pending' ||
                  communityData?.isMember) && {
                  backgroundColor: COLORS.cardBG,
                  borderColor: COLORS.border,
                  borderWidth: 1,
                },
              ]}
              onPress={handleJoinNow}
              disabled={
                apiJoinCommunityLoading ||
                apiGetUserAccessRequestsLoading ||
                communityData?.isRequested ||
                communityData?.requestStatus === 'pending' ||
                userRequestStatus === 'pending' ||
                localRequestStatus === 'pending' ||
                communityData?.isMember
              }
            >
              {apiJoinCommunityLoading || apiGetUserAccessRequestsLoading ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <Text style={styles.joinText}>
                  {communityData?.isMember
                    ? 'Joined'
                    : communityData?.isRequested ||
                        communityData?.requestStatus === 'pending' ||
                        userRequestStatus === 'pending' ||
                        localRequestStatus === 'pending'
                      ? 'Pending'
                      : 'Join Now'}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.socialRow}>
            {communityData?.instagramLink && (
              <TouchableOpacity
                onPress={() => Linking.openURL(communityData.instagramLink)}
              >
                <Icon name="Instagram" color={COLORS.white} size={24} />
              </TouchableOpacity>
            )}
            {communityData?.linkedinLink && (
              <TouchableOpacity
                onPress={() => Linking.openURL(communityData.linkedinLink)}
              >
                <Icon name="Linkedin" color={COLORS.white} size={24} />
              </TouchableOpacity>
            )}
            {communityData?.youtubeLink && (
              <TouchableOpacity
                onPress={() => Linking.openURL(communityData.youtubeLink)}
              >
                <Icon name="Youtube" color={COLORS.white} size={24} />
              </TouchableOpacity>
            )}
            {communityData?.telegramLink && (
              <TouchableOpacity
                onPress={() => Linking.openURL(communityData.telegramLink)}
              >
                <Icon name="Send" color={COLORS.white} size={24} />
              </TouchableOpacity>
            )}
            {communityData?.externalLink && (
              <TouchableOpacity
                onPress={() => Linking.openURL(communityData.externalLink)}
              >
                <Icon name="Link2" color={COLORS.white} size={24} />
              </TouchableOpacity>
            )}
          </View>

          {slug && (
            <View style={styles.linkRowWrapper}>
              {/* <TouchableOpacity
                onPress={() => Linking.openURL(`${copyUrl}${slug}`)}
                style={styles.linkRow}
              > */}
              <Text style={styles.linkText}>{`${copyUrl}${slug}`}</Text>
              {/* </TouchableOpacity> */}
              <TouchableOpacity
                onPress={() => handleCopyUrl(`${copyUrl}${slug}`)}
              >
                <Icon name="Copy" color={COLORS.white} size={18} />
              </TouchableOpacity>
            </View>
          )}

          <Text style={styles.descTop}>{communityData?.description || ''}</Text>

          {/* Stats */}
          <View style={styles.statsRow}>
            {[
              {
                number: courseStats.coursesCount,
                label: 'Courses',
                icon: 'GraduationCap',
              },
              {
                number: courseStats.videosCount,
                label: 'Videos',
                icon: 'CirclePlay',
              },
              {
                number: courseStats.chaptersCount,
                label: 'Chapters',
                icon: 'BookOpenText',
              },
            ].map((item, index) => (
              <View key={index} style={styles.statCard}>
                <View style={styles.statIcon}>
                  <Icon name={item.icon} color={COLORS.white} size={24} />
                </View>
                <View>
                  {isStatsLoading ? (
                    <ActivityIndicator
                      size="small"
                      color={COLORS.white}
                      style={{ marginVertical: 4 }}
                    />
                  ) : (
                    <Text style={styles.statNumber}>{item.number}</Text>
                  )}
                  <Text style={styles.statLabel}>{item.label}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Welcome Message */}
          {communityData?.welcomeMessage ? (
            <View style={{ marginTop: 20 }}>
              {hasHtml && welcomeMessageHtml ? (
                <WebView
                  key={`webview-${slug}`}
                  originWhitelist={['*']}
                  scrollEnabled={false}
                  nestedScrollEnabled={false}
                  showsVerticalScrollIndicator={false}
                  overScrollMode="never"
                  javaScriptEnabled={true}
                  domStorageEnabled={false}
                  onShouldStartLoadWithRequest={() => true}
                  style={{
                    width: '100%',
                    height: webHeight,
                    backgroundColor: 'black',
                    // Hide the WebView until the content reports its real height
                    opacity: webHeight > 1 ? 1 : 0,
                  }}
                  source={welcomeMessageHtml}
                  onMessage={handleWebViewMessage}
                />
              ) : (
                <>
                  {/* <Text style={styles.heading}>
                    Bienvenido A {communityData.name}
                  </Text> */}
                  <Text style={styles.subText}>
                    {communityData.welcomeMessage}
                  </Text>
                </>
              )}
            </View>
          ) : (
            <Text style={styles.subText}>Welcome to our community!</Text>
          )}

          {communityData?.highlights &&
            communityData.highlights.map((text: string, index: number) => (
              <View key={index} style={styles.bulletRow}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletText}>{text}</Text>
              </View>
            ))}

          {communityData?.bonusText && (
            <Text style={[styles.subText, { marginTop: 12 }]}>
              🔥 Bonus: {communityData.bonusText}
            </Text>
          )}
        </View>
      </Animated.ScrollView>
    </View>
  );
};

export default CategoryDetails;
