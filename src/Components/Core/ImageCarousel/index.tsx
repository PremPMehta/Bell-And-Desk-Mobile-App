import React, { useState } from 'react';
import {
  View,
  ImageBackground,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { useSharedValue } from 'react-native-reanimated';
import styles from './style';
import { sc, vs } from '@/Assets/Theme/fontStyle';
import { COLORS } from '@/Assets/Theme/colors';
import LinearGradient from 'react-native-linear-gradient';
import { AppImages } from '@/Assets/Images';
import { useAtom } from 'jotai';
import { userAtom } from '@/Jotai/Atoms';
import Icon from '../Icons';

const { width } = Dimensions.get('window');

const ImageCarousel = ({
  data,
  primaryButtonText,
  onPressPrimaryButton,
  buttonText,
  onPressButton,
  exploreButtonText,
  onPressExploreButton,
}) => {
  const [user]: any = useAtom(userAtom);
  const userName = user?.firstName + ' ' + user?.lastName;
  const scrollOffsetValue = useSharedValue(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const getImageSource = (source: any) => {
    if (!source) return AppImages.homeBanner;
    if (typeof source === 'number') return source; // Local require()
    if (typeof source === 'string') {
      if (source.trim().length === 0) return AppImages.homeBanner;
      return { uri: source };
    }
    if (typeof source === 'object') {
      if (source.uri && typeof source.uri === 'string') return source; // Already {uri: '...'}
      // Handle cases where the object is passed but doesn't have a valid uri string
      return AppImages.homeBanner;
    }
    return AppImages.homeBanner;
  };

  const renderCarouselItem = ({ item }) => {
    const bannerSource = getImageSource(item?.heroImage || item);

    return (
      <LinearGradient
        colors={[COLORS.black, COLORS.blue]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradientBorder}
      >
        <View style={styles.carouselContainer}>
          <ImageBackground source={bannerSource} style={styles.carouselImg}>
            {/* LEFT → RIGHT BLACK GRADIENT */}
            <LinearGradient
              colors={[
                'rgba(0,0,0,0.85)', // Left (strong)
                'rgba(0,0,0,0.55)',
                'rgba(0,0,0,0.25)',
                'rgba(0,0,0,0.05)', // Right (light)
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientOverlay}
            />

            <View style={styles.middleMainContainer}>
              <View style={styles.tagContainer}>
                <Text style={styles.tag}>
                  {item?.tag ? item?.tag : 'Welcome Back, ' + userName}
                </Text>
              </View>
              {item?.headingTitle && (
                <Text style={styles.title}>{item?.headingTitle}</Text>
              )}

              {item?.subHeaderTitle && (
                <Text style={styles.subtitle}>{item?.subHeaderTitle}</Text>
              )}

              {onPressPrimaryButton && primaryButtonText && (
                <View style={styles.primaryButtonContainer}>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={onPressPrimaryButton}
                    style={styles.primaryButton}
                  >
                    <Icon name="BellRing" size={14} color={COLORS.white} />
                    <Text style={styles.buttonText}>{primaryButtonText}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={onPressExploreButton}
                    style={styles.buttonShadow}
                  >
                    <Text style={styles.buttonText}>{exploreButtonText}</Text>
                  </TouchableOpacity>
                </View>
              )}

              {onPressButton && buttonText && (
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={onPressButton}
                    style={styles.buttonShadow}
                  >
                    <Text style={styles.buttonText}>{buttonText}</Text>
                  </TouchableOpacity>
                  {onPressExploreButton && exploreButtonText && (
                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={onPressExploreButton}
                      style={styles.buttonShadow}
                    >
                      <Text style={styles.buttonText}>{exploreButtonText}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          </ImageBackground>
        </View>
      </LinearGradient>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <Carousel
        loop
        // width={width - 32}
        width={sc(322)}
        height={vs(145)}
        pagingEnabled
        snapEnabled
        data={data || []}
        defaultScrollOffsetValue={scrollOffsetValue}
        onSnapToItem={setActiveIndex}
        renderItem={renderCarouselItem}
      />

      {/* FIXED PAGINATION */}
      <View style={styles.paginationWrapper}>
        {(data || []).map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                width: i === activeIndex ? 18 : 8,
                backgroundColor:
                  i === activeIndex ? COLORS.white : COLORS.pageDots,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

export default ImageCarousel;
