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

const { width } = Dimensions.get('window');

const ImageCarousel = ({
  data,
  buttonText = 'Start Your Own Community',
  onPressButton,
}) => {
  const scrollOffsetValue = useSharedValue(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const renderCarouselItem = ({ item }) => (
    <LinearGradient
      colors={['#000000', '#00426D']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.gradientBorder}
    >
      <View style={styles.carouselContainer}>
        <ImageBackground
          source={AppImages.homeBanner} // Replace with your image - { uri: item }
          style={styles.carouselImg}
        >
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
            <Text style={styles.title}>Ready to Engage Your Community?</Text>

            <Text style={styles.subtitle}>
              Jump back into your courses, connect with students & continue
              building.
            </Text>

            {/* SHOW BUTTON ONLY IF onPressButton is passed */}
            {onPressButton && (
              <TouchableOpacity style={styles.button} onPress={onPressButton}>
                <LinearGradient
                  colors={['#041A37', '#0A4DFF']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradientButton}
                >
                  <Text style={styles.buttonText}>{buttonText}</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        </ImageBackground>
      </View>
    </LinearGradient>
  );

  return (
    <View style={styles.mainContainer}>
      <Carousel
        loop
        // width={width - 32}
        width={sc(322)}
        height={vs(145)}
        pagingEnabled
        snapEnabled
        data={data}
        defaultScrollOffsetValue={scrollOffsetValue}
        onSnapToItem={setActiveIndex}
        renderItem={renderCarouselItem}
      />

      {/* FIXED PAGINATION */}
      <View style={styles.paginationWrapper}>
        {data.map((_, i) => (
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
