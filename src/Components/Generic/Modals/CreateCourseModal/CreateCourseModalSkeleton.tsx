import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing, type ViewStyle } from 'react-native';
import { COLORS } from '@/Assets/Theme/colors';
import { ms, vs } from '@/Assets/Theme/fontStyle';

type Props = {
  backgroundColor?: string;
  style?: ViewStyle;
};

type SkeletonWidth = number | 'auto' | `${number}%`;

const SkeletonBlock = ({
  height,
  width = '100%' as const,
  radius = ms(10),
  style,
  shimmerOpacity,
}: {
  height: number;
  width?: SkeletonWidth;
  radius?: number;
  style?: ViewStyle;
  shimmerOpacity: Animated.AnimatedInterpolation<number>;
}) => {
  return (
    <Animated.View
      style={[
        {
          height,
          width,
          borderRadius: radius,
          backgroundColor: COLORS.primaryLight,
          opacity: shimmerOpacity,
        },
        style,
      ]}
    />
  );
};

const CreateCourseModalSkeleton: React.FC<Props> = ({
  backgroundColor = COLORS.cardBG,
  style,
}) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 900,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [shimmerAnim]);

  const shimmerOpacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.45, 0.9],
  });

  return (
    <View
      style={[
        {
          flex: 1,
          paddingHorizontal: ms(20),
          paddingBottom: ms(16),
          backgroundColor,
        },
        style,
      ]}
    >
      {/* "Course Basic Information" Section */}
      <SkeletonBlock
        shimmerOpacity={shimmerOpacity}
        height={ms(24)}
        width="60%"
        style={{ marginTop: ms(10) }}
      />
      <SkeletonBlock
        shimmerOpacity={shimmerOpacity}
        height={ms(16)}
        width="90%"
        style={{ marginTop: ms(8) }}
      />

      {/* "Course title" box */}
      <SkeletonBlock
        shimmerOpacity={shimmerOpacity}
        height={ms(52)}
        style={{ marginTop: ms(30) }}
        radius={ms(10)}
      />

      {/* "Course Description" box */}
      <SkeletonBlock
        shimmerOpacity={shimmerOpacity}
        height={vs(80)}
        style={{ marginTop: ms(16) }}
        radius={ms(10)}
      />

      {/* Row (Target Audience + Category) boxes */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          gap: ms(12),
          marginTop: ms(16),
        }}
      >
        <SkeletonBlock
          shimmerOpacity={shimmerOpacity}
          height={ms(52)}
          style={{ flex: 1 }}
          radius={ms(10)}
        />
        <SkeletonBlock
          shimmerOpacity={shimmerOpacity}
          height={ms(52)}
          style={{ flex: 1 }}
          radius={ms(10)}
        />
      </View>

      {/* "Course Type" box */}
      <SkeletonBlock
        shimmerOpacity={shimmerOpacity}
        height={ms(52)}
        style={{ marginTop: ms(16) }}
        radius={ms(10)}
      />

      {/* "Primary Content Type" Section Label */}
      <SkeletonBlock
        shimmerOpacity={shimmerOpacity}
        height={ms(24)}
        width="50%"
        style={{ marginTop: ms(24) }}
      />
      
      {/* "Content Type" box */}
      <SkeletonBlock
        shimmerOpacity={shimmerOpacity}
        height={ms(52)}
        style={{ marginTop: ms(16) }}
        radius={ms(10)}
      />

      {/* "Course Thumbnail" Label */}
      <SkeletonBlock
        shimmerOpacity={shimmerOpacity}
        height={ms(18)}
        width="35%"
        style={{ marginTop: ms(24) }}
      />
      {/* Image Upload Box */}
      <SkeletonBlock
        shimmerOpacity={shimmerOpacity}
        height={ms(120)}
        style={{ marginTop: ms(10) }}
        radius={ms(12)}
      />

      {/* Footer sticky-at-bottom skeleton */}
      <View
        style={{
          marginTop: 'auto',
          flexDirection: 'row',
          justifyContent: 'space-between',
          gap: ms(12),
          paddingTop: ms(20),
          paddingBottom: ms(10),
        }}
      >
        <SkeletonBlock
          shimmerOpacity={shimmerOpacity}
          height={vs(32)}
          style={{ flex: 1 }}
          radius={ms(30)}
        />
        <SkeletonBlock
          shimmerOpacity={shimmerOpacity}
          height={vs(32)}
          style={{ flex: 1 }}
          radius={ms(30)}
        />
      </View>
    </View>
  );
};

export default React.memo(CreateCourseModalSkeleton);
