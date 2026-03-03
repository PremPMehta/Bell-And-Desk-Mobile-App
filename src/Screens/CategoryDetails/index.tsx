import Icon from '@/Components/Core/Icons';
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  Animated,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styles from './style';
import { COLORS } from '@/Assets/Theme/colors';
import { useNavigation } from '@/Hooks/Utils/use-navigation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { vs, width } from '@/Assets/Theme/fontStyle';
import useUserApi from '@/Hooks/Apis/UserApis/use-user-api';
import { useRoute } from '@react-navigation/native';
import { Config } from '@/Config';
import { useRequireAuth } from '@/Hooks/Utils/use-require-auth';
import WebView from 'react-native-webview';
import CategoryDetailsSkeleton from '@/Components/Core/Skeleton/CategoryDetailsSkeleton';

const CategoryDetails = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { slug } = route.params || {};

  const {
    getCommunitiesSlug,
    apiGetCommunitiesSlugLoading,
    apiGetCommunitiesSlug,
  } = useUserApi();
  const { requireAuth } = useRequireAuth();
  const [webHeight, setWebHeight] = useState(600);

  const communityData = apiGetCommunitiesSlug?.data?.community || {};
  console.log('🚀 ~ CategoryDetails ~ communityData:', communityData);

  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [activeIndex, setActiveIndex] = useState(0);
  // const isStaging = __DEV__;
  const isStaging = Config.APP_ENV === 'staging';
  console.log('🚀 ~ CategoryDetails ~ isStaging:', isStaging);
  const copyUrl = isStaging ? Config.STAGING_URL : Config.LIVE_URL;
  const backIcon = Platform.OS === 'ios' ? 'ChevronLeft' : 'ArrowLeft';

  useEffect(() => {
    if (slug) {
      const query = `/${slug}`;
      getCommunitiesSlug(query);
    }
  }, [slug]);

  const mediaList =
    communityData?.introImages?.length > 0
      ? communityData.introImages.map((m: any) => ({
          type: m?.type === 'video' ? 'video' : 'image',
          uri: m?.url || m?.uri,
        }))
      : [{ type: 'image', uri: 'https://picsum.photos/800/900?random=1' }];

  const activeItem = mediaList[activeIndex] || mediaList[0];

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

  if (apiGetCommunitiesSlugLoading && !communityData?.name) {
    return <CategoryDetailsSkeleton />;
  }

  const handleJoinNow = () => {
    requireAuth();
  };

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
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon
            name={backIcon}
            color={COLORS.white}
            size={Platform.OS === 'ios' ? 30 : 24}
          />
        </TouchableOpacity>
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
          {activeItem?.type === 'image' ? (
            <Image
              source={{ uri: activeItem.uri }}
              style={styles.bannerImage}
            />
          ) : (
            <Image
              source={{ uri: 'https://picsum.photos/800/900?blur=3' }}
              style={styles.bannerImage}
            />
          )}

          {/* Play Icon only for video */}
          {activeItem?.type === 'video' && (
            <View style={styles.playButton}>
              <Icon name="CirclePlay" color={COLORS.white} size={40} />
            </View>
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
              <Image
                source={{
                  uri:
                    item.uri?.includes('mp4') || item.type === 'video'
                      ? 'https://picsum.photos/200/300?blur=2'
                      : item.uri,
                }}
                style={styles.thumbnail}
              />

              {item.type === 'video' && (
                <View style={styles.videoSmallIcon}>
                  <Icon name="CirclePlay" color={COLORS.white} size={24} />
                </View>
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
            <TouchableOpacity style={styles.joinNow} onPress={handleJoinNow}>
              <Text style={styles.joinText}>Join Now</Text>
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
              <TouchableOpacity
                onPress={() => Linking.openURL(`${copyUrl}${slug}`)}
                style={styles.linkRow}
              >
                <Text style={styles.linkText}>{`${copyUrl}${slug}`}</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Icon name="Copy" color={COLORS.white} size={18} />
              </TouchableOpacity>
            </View>
          )}

          <Text style={styles.descTop}>{communityData?.description || ''}</Text>

          {/* Stats */}
          <View style={styles.statsRow}>
            {[
              {
                number: communityData?.coursesCount || '0',
                label: 'Courses',
                icon: 'GraduationCap',
              },
              {
                number: communityData?.videosCount || '0',
                label: 'Videos',
                icon: 'CirclePlay',
              },
              {
                number: communityData?.chaptersCount || '0',
                label: 'Chapters',
                icon: 'BookOpenText',
              },
            ].map((item, index) => (
              <View key={index} style={styles.statCard}>
                <View style={styles.statIcon}>
                  <Icon name={item.icon} color={COLORS.white} size={24} />
                </View>
                <View>
                  <Text style={styles.statNumber}>{item.number}</Text>
                  <Text style={styles.statLabel}>{item.label}</Text>
                </View>
              </View>
            ))}
          </View>

          {communityData?.welcomeMessage && (
            <View style={{ marginTop: 20 }}>
              {/<[a-z/][\s\S]*?>/i.test(communityData.welcomeMessage) ? (
                <WebView
                  originWhitelist={['*']}
                  scrollEnabled={false}
                  nestedScrollEnabled
                  showsVerticalScrollIndicator={false}
                  style={{
                    width: '100%',
                    height: webHeight,
                    backgroundColor: 'black',
                  }}
                  source={{
                    html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                body {
                  margin: 0;
                  padding: 0;
                  background-color: #000;
                  color: #fff;
                  font-family: -apple-system, system-ui;
                }
                img {
                  max-width: 100%;
                  height: auto;
                }
              </style>
            </head>
            <body>
              ${communityData.welcomeMessage}
              <script>
                function sendHeight() {
                  window.ReactNativeWebView.postMessage(
                    document.body.scrollHeight
                  );
                }
                window.onload = sendHeight;
                setTimeout(sendHeight, 500);
              </script>
            </body>
          </html>
        `,
                  }}
                  onMessage={event => {
                    const height = Number(event.nativeEvent.data);
                    if (height > 0) {
                      setWebHeight(height);
                    }
                  }}
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
          )}

          {!communityData?.welcomeMessage && (
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
