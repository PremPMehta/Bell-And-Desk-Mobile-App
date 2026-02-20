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

  const communityData = apiGetCommunitiesSlug?.data?.community || {};
  console.log('🚀 ~ CategoryDetails ~ communityData:', communityData);

  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [activeIndex, setActiveIndex] = useState(0);
  const isStaging = __DEV__;
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
    return (
      <View
        style={[
          styles.container,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
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
            {communityData?.instagram && (
              <TouchableOpacity
                onPress={() => Linking.openURL(communityData.instagram)}
              >
                <Icon name="Instagram" color={COLORS.white} size={24} />
              </TouchableOpacity>
            )}
            {communityData?.linkedin && (
              <TouchableOpacity
                onPress={() => Linking.openURL(communityData.linkedin)}
              >
                <Icon name="Linkedin" color={COLORS.white} size={24} />
              </TouchableOpacity>
            )}
            {communityData?.youtube && (
              <TouchableOpacity
                onPress={() => Linking.openURL(communityData.youtube)}
              >
                <Icon name="Youtube" color={COLORS.white} size={24} />
              </TouchableOpacity>
            )}
            {communityData?.twitter && (
              <TouchableOpacity
                onPress={() => Linking.openURL(communityData.twitter)}
              >
                <Icon name="Twitter" color={COLORS.white} size={24} />
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
            <>
              <Text style={styles.heading}>
                Bienvenido A {communityData.name}
              </Text>
              <Text style={styles.subText}>{communityData.welcomeMessage}</Text>
            </>
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
