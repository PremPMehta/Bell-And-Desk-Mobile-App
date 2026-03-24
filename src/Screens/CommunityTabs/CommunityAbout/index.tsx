import {
  View,
  Animated,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from 'react';
import styles from './style';
import Icon from '@/Components/Core/Icons';
import { getFullImageUrl } from '@/Utils/ImageUtils';
import { COLORS } from '@/Assets/Theme/colors';
import { useNavigation } from '@/Hooks/Utils/use-navigation';
import useUserApi from '@/Hooks/Apis/UserApis/use-user-api';
import WebView from 'react-native-webview';
import CommunityAboutSkeleton from '@/Components/Core/Skeleton/CommunityAboutSkeleton';
import { useSetAtom } from 'jotai';
import { objectAtomFamily } from '@/Jotai/Atoms';
import { AtomKeys } from '@/Jotai/AtomKeys';
import { Config } from '@/Config';
import Clipboard from '@react-native-clipboard/clipboard';
import ToastModule from '@/Components/Core/Toast';

interface Props {
  communityId?: string;
  slug?: string;
  onScroll?: (...args: any[]) => void;
  scrollEventThrottle?: number;
}

const CommunityAbout = ({
  communityId,
  slug,
  onScroll,
  scrollEventThrottle,
}: Props) => {
  const navigation = useNavigation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [webHeight, setWebHeight] = useState(1);

  const {
    getCommunitiesSlug,
    apiGetCommunitiesSlugLoading,
    apiGetCommunitiesSlug,
  } = useUserApi();

  const clearCommunitiesSlugAtom = useSetAtom(
    objectAtomFamily(AtomKeys.apiGetCommunitiesSlug),
  );

  const lastFetchedSlugRef = useRef<string | null>(null);

  const isStaging = Config.APP_ENV === 'staging';
  const copyUrl = isStaging ? Config.STAGING_URL : Config.LIVE_URL;

  useEffect(() => {
    // We need the slug to fetch community details, fallback to communityId just in case
    const fetchId = slug || communityId;
    if (!fetchId) return;

    if (lastFetchedSlugRef.current === fetchId) return;
    lastFetchedSlugRef.current = fetchId;

    setWebHeight(1);
    setActiveIndex(0);

    clearCommunitiesSlugAtom(null as any);
    getCommunitiesSlug(`/${fetchId}`);
  }, [slug, communityId]);

  const communityData = useMemo(() => {
    return apiGetCommunitiesSlug?.data?.community || {};
  }, [apiGetCommunitiesSlug]);
  console.log('🚀 ~ CommunityAbout ~ communityData:', communityData);

  // Build WebView HTML only when welcomeMessage changes
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
        overflow-x: hidden;
        width: 100%;
      }
      * {
        min-height: 0 !important;
        box-sizing: border-box;
      }
      img { max-width: 100% !important; height: auto !important; display: block; }
      section, div { max-width: 100% !important; }
      [style*="grid-template-columns"] {
        grid-template-columns: 1fr !important;
      }
      h1 { font-size: 2rem !important; }
      h2 { font-size: 1.6rem !important; }
      h3 { font-size: 1.25rem !important; }
      section {
        padding-top: 40px !important;
        padding-bottom: 40px !important;
        padding-left: 16px !important;
        padding-right: 16px !important;
      }
      [style*="display: flex"] {
        flex-wrap: wrap !important;
      }
    </style>
  </head>
  <body>
    <div id="cw">${htmlContent}</div>
    <script>
      var lastReported = 0;
      var reportCount = 0;
      var MAX_REPORTS = 6;

      function reportHeight() {
        if (reportCount >= MAX_REPORTS) return;
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

      reportHeight();
      setTimeout(reportHeight, 100);
      setTimeout(reportHeight, 400);
      setTimeout(reportHeight, 800);
      setTimeout(reportHeight, 1500);

      window.addEventListener('load', reportHeight);

      document.querySelectorAll('img').forEach(function(img) {
        img.addEventListener('load', function() { setTimeout(reportHeight, 100); });
        img.addEventListener('error', function() { setTimeout(reportHeight, 100); });
      });
    </script>
  </body>
</html>`,
    };
  }, [communityData?.welcomeMessage]);

  const handleWebViewMessage = useCallback(
    (event: any) => {
      const height = Number(event.nativeEvent.data);
      if (height > 0 && Math.abs(height - webHeight) > 5) {
        setWebHeight(height + 16);
      }
    },
    [webHeight],
  );

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

    return getFullImageUrl(url);
  };

  const mediaList = useMemo(() => {
    const videos: any[] = (communityData?.introVideoLinks || []).map(
      (v: any, index: number) => {
        const urlStr = typeof v === 'string' ? v : v?.url || v?.uri || '';
        return {
          id: `video-${index}`,
          uri: urlStr,
          platform: typeof v === 'string' ? '' : v?.platform || '',
          title: typeof v === 'string' ? '' : v?.title || '',
          type: 'video',
          videoThumbnail: getVideoThumbnail(urlStr),
        };
      },
    );

    const images: any[] = (communityData?.introImages || []).map(
      (m: any, index: number) => {
        const urlStr = typeof m === 'string' ? m : m?.url || m?.uri || '';
        return {
          id: `image-${index}`,
          uri: urlStr,
          type: 'image',
        };
      },
    );

    const combined = [...videos, ...images];
    return combined.length > 0
      ? combined
      : [
        {
          id: 'placeholder',
          uri: 'https://picsum.photos/800/900?random=1',
          type: 'image',
        },
      ];
  }, [communityData?.introVideoLinks, communityData?.introImages]);

  const activeItem = mediaList[activeIndex] || mediaList[0];

  const videoSource = useMemo(() => {
    if (activeItem?.type !== 'video' || !activeItem?.uri) return null;
    const rawUrl: string = activeItem.uri;

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
        headers: { Referer: 'https://www.youtube.com' }
      };
    }

    return { uri: rawUrl };
  }, [activeItem]);

  const handleEditPress = () => {
    navigation.navigate('CreateCommunity');
  };

  const handleCopyUrl = (url: string) => {
    Clipboard.setString(url);
    ToastModule.successTop({ msg: 'Copied to Clipboard' });
  };

  // Check if data is currently being fetched OR if we have stale data from a previous community
  const belongsToCurrentId = (id: string | undefined, slug: string | undefined, data: any) => {
    if (!id && !slug) return true;
    const searchId = slug || id;
    if (!searchId) return true;

    // Check against slug, ID or subdomain in data
    return (
      data?.slug === searchId ||
      data?._id === searchId ||
      data?.id === searchId ||
      data?.subdomain === searchId
    );
  };

  const isFetchingCurrent =
    apiGetCommunitiesSlugLoading ||
    !communityData?.name ||
    !belongsToCurrentId(communityId, slug, communityData);

  if (isFetchingCurrent) {
    return <CommunityAboutSkeleton />;
  }

  const bulletPoints = communityData?.highlights || [];

  const hasHtml =
    communityData?.welcomeMessage &&
    /<[a-z/][\s\S]*?>/i.test(communityData.welcomeMessage);

  return (
    <Animated.ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      onScroll={onScroll}
      scrollEventThrottle={scrollEventThrottle}
    >
      {/* Header Section */}
      <View style={styles.headerRow}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Image
              source={{
                uri: getFullImageUrl(communityData?.logo) || '',
              }}
              style={{ width: '100%', height: '100%', borderRadius: 100 }}
            />
          </View>
          <Text style={styles.userName}>
            {communityData?.creatorName || communityData?.name || 'Community'}
          </Text>
        </View>
        <TouchableOpacity style={styles.editButton} onPress={handleEditPress}>
          <Icon name="Pencil" size={14} color={COLORS.white} />
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>

      {/* Main Video/Media Section */}
      <View style={styles.mainVideoContainer}>
        {activeItem?.type === 'video' && videoSource ? (
          <WebView
            key={`video-banner-${activeIndex}`}
            source={videoSource}
            style={{ width: '100%', height: '100%', backgroundColor: '#000' }}
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
            source={{ uri: getFullImageUrl(activeItem?.uri) || '' }}
            style={{
              width: '100%',
              height: '100%',
              resizeMode: 'cover',
            }}
          />
        )}
      </View>

      {/* Thumbnails Gallery */}
      {mediaList.length > 1 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.thumbnailList}
        >
          {mediaList.map((item, index) => {
            console.log('🚀 ~ CommunityAbout ~ item:', item);
            return (
              <TouchableOpacity
                key={item.id || index.toString()}
                style={[
                  styles.thumbnailItem,
                  activeIndex === index && styles.activeThumbnail,
                ]}
                onPress={() => setActiveIndex(index)}
              >
                {item.type === 'video' ? (
                  <>
                    {item.videoThumbnail ? (
                      <Image
                        source={{ uri: item.videoThumbnail }}
                        style={styles.thumbnailImage}
                      />
                    ) : (
                      <View
                        style={[
                          styles.thumbnailImage,
                          {
                            backgroundColor: '#111',
                            justifyContent: 'center',
                            alignItems: 'center',
                          },
                        ]}
                      >
                        <Icon
                          name="CirclePlay"
                          size={28}
                          color={COLORS.white}
                        />
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
                    <View style={styles.thumbnailPlayIcon}>
                      <Icon name="CirclePlay" size={24} color={COLORS.white} />
                    </View>
                  </>
                ) : (
                  <Image
                    source={{ uri: getFullImageUrl(item.uri) || '' }}
                    style={styles.thumbnailImage}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {/* Community Info Section */}
      <View style={styles.communityInfo}>
        <View style={styles.communityNameRow}>
          <Text style={styles.communityTitle}>{communityData?.name}</Text>
          <TouchableOpacity style={styles.inviteButton}>
            <Text style={styles.inviteButtonText}>Invite People</Text>
          </TouchableOpacity>
        </View>
        {communityData?.subdomain && (
          <View style={styles.communityLinkRow}>
            <Text style={styles.communityLink}>
              {`${copyUrl}${communityData.subdomain}`}
            </Text>
            <TouchableOpacity
              onPress={() =>
                handleCopyUrl(`${copyUrl}${communityData.subdomain}`)
              }
            >
              <Icon name="Copy" size={14} color={COLORS.subText} />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.socialIconsRow}>
          {communityData?.instagramLink && (
            <TouchableOpacity
              style={styles.socialIcon}
              onPress={() => Linking.openURL(communityData.instagramLink)}
            >
              <Icon name="Instagram" size={24} color={COLORS.white} />
            </TouchableOpacity>
          )}
          {communityData?.linkedinLink && (
            <TouchableOpacity
              style={styles.socialIcon}
              onPress={() => Linking.openURL(communityData.linkedinLink)}
            >
              <Icon name="Linkedin" size={24} color={COLORS.white} />
            </TouchableOpacity>
          )}
          {communityData?.youtubeLink && (
            <TouchableOpacity
              style={styles.socialIcon}
              onPress={() => Linking.openURL(communityData.youtubeLink)}
            >
              <Icon name="Youtube" size={24} color={COLORS.white} />
            </TouchableOpacity>
          )}
          {communityData?.telegramLink && (
            <TouchableOpacity
              style={styles.socialIcon}
              onPress={() => Linking.openURL(communityData.telegramLink)}
            >
              <Icon name="Send" size={24} color={COLORS.white} />
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

        <Text style={styles.communityDescription}>
          {communityData?.description}
        </Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Icon name="GraduationCap" size={20} color={COLORS.white} />
          </View>
          <View style={styles.statValueContainer}>
            <Text style={styles.statValue}>
              {communityData?.coursesCount || '0'}
            </Text>
            <Text style={styles.statLabel}>Courses</Text>
          </View>
        </View>
        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Icon name="Play" size={20} color={COLORS.white} />
          </View>
          <View>
            <Text style={styles.statValue}>
              {communityData?.videosCount || '0'}
            </Text>
            <Text style={styles.statLabel}>Videos</Text>
          </View>
        </View>
        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Icon name="BookOpen" size={20} color={COLORS.white} />
          </View>
          <View>
            <Text style={styles.statValue}>
              {communityData?.chaptersCount || '0'}
            </Text>
            <Text style={styles.statLabel}>Chapters</Text>
          </View>
        </View>
      </View>

      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        {communityData?.welcomeMessage ? (
          <View style={{ marginTop: 0 }}>
            {hasHtml && welcomeMessageHtml ? (
              <WebView
                key={`webview-${slug || communityId}`}
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
                  opacity: webHeight > 1 ? 1 : 0,
                }}
                source={welcomeMessageHtml}
                onMessage={handleWebViewMessage}
              />
            ) : (
              <>
                {/* <Text style={styles.welcomeHeader}>
                  Bienvenido A {communityData?.name || 'la Comunidad'}
                </Text> */}
                <Text style={styles.welcomeDescription}>
                  {communityData.welcomeMessage.replace(/<[^>]+>/g, '')}
                </Text>
              </>
            )}
          </View>
        ) : (
          <Text style={styles.subText}>Welcome to our community!</Text>
        )}

        {/* {bulletPoints.map((point: string, index: number) => (
          <View key={index} style={styles.bulletPointRow}>
            <View style={styles.bulletIcon}>
              <Icon name="Dot" size={24} color={COLORS.white} />
            </View>
            <View style={styles.bulletTextContainer}>
              <Text style={styles.bulletText}>{point}</Text>
            </View>
          </View>
        ))} */}
      </View>

      {/* Footer Notes */}
      {/* {communityData?.bonusText ? (
        <View style={styles.footerNote}>
          <Text style={styles.footerNoteText}>
            🎁 Bonus: {communityData.bonusText}
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.footerNote}>
            <Text style={styles.footerNoteText}>
              ❗️Todos Los Cursos Son Flexibles, Grabados Y Sin Relleno
            </Text>
          </View>
          <View style={styles.footerNote}>
            <Text style={styles.footerNoteText}>
              🎁 Bonus: Trade Ideas Semanales Y Ejemplos Reales Todo Esto, Por
              Solo $27 Al Mes.
            </Text>
          </View>
        </>
      )} */}
    </Animated.ScrollView>
  );
};

export default CommunityAbout;
