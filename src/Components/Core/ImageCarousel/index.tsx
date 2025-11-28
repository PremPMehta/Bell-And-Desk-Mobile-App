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

const { width } = Dimensions.get('window');

const ImageCarousel = ({
  data,
  buttonText = 'Start Your Own Community',
  onPressButton,
}) => {
  const scrollOffsetValue = useSharedValue(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const renderCarouselItem = ({ item }) => (
    <View style={styles.carouselContainer}>
      <ImageBackground source={{ uri: item }} style={styles.carouselImg}>
        <View style={styles.middleMainContainer}>
          <Text style={styles.title}>Ready to Engage Your Community?</Text>

          <Text style={styles.subtitle}>
            Jump back into your courses, connect with students & continue
            building.
          </Text>

          {/* SHOW BUTTON ONLY IF onPressButton is passed */}
          {onPressButton && (
            <TouchableOpacity style={styles.button} onPress={onPressButton}>
              <Text style={styles.buttonText}>{buttonText}</Text>
            </TouchableOpacity>
          )}
        </View>
      </ImageBackground>
    </View>
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
