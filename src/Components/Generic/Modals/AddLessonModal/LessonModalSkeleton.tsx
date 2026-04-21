import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing, type ViewStyle } from 'react-native';
import { COLORS } from '@/Assets/Theme/colors';
import { ms } from '@/Assets/Theme/fontStyle';

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

const LessonModalSkeleton: React.FC<Props> = ({
  backgroundColor = COLORS.modalBG,
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
          paddingHorizontal: ms(16),
          paddingBottom: ms(16),
          backgroundColor,
        },
        style,
      ]}
    >
      {/* Tabs skeleton */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          gap: ms(12),
        }}
      >
        <SkeletonBlock
          shimmerOpacity={shimmerOpacity}
          height={ms(38)}
          width="48%"
          radius={ms(8)}
        />
        <SkeletonBlock
          shimmerOpacity={shimmerOpacity}
          height={ms(38)}
          width="48%"
          radius={ms(8)}
        />
      </View>

      {/* Inputs skeleton */}
      <SkeletonBlock
        shimmerOpacity={shimmerOpacity}
        height={ms(18)}
        width="45%"
        style={{ marginTop: ms(18) }}
      />
      <SkeletonBlock
        shimmerOpacity={shimmerOpacity}
        height={ms(52)}
        style={{ marginTop: ms(12) }}
      />

      <SkeletonBlock
        shimmerOpacity={shimmerOpacity}
        height={ms(18)}
        width="55%"
        style={{ marginTop: ms(16) }}
      />
      <SkeletonBlock
        shimmerOpacity={shimmerOpacity}
        height={ms(100)}
        style={{ marginTop: ms(12) }}
      />

      {/* Editor skeleton */}
      <SkeletonBlock
        shimmerOpacity={shimmerOpacity}
        height={ms(18)}
        width="50%"
        style={{ marginTop: ms(16) }}
      />
      <SkeletonBlock
        shimmerOpacity={shimmerOpacity}
        height={ms(180)}
        style={{ marginTop: ms(12) }}
      />

      <SkeletonBlock
        shimmerOpacity={shimmerOpacity}
        height={ms(18)}
        width="55%"
        style={{ marginTop: ms(16) }}
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          gap: ms(12),
          marginTop: ms(12),
        }}
      >
        <SkeletonBlock
          shimmerOpacity={shimmerOpacity}
          height={ms(40)}
          width="48%"
          radius={ms(8)}
        />
        <SkeletonBlock
          shimmerOpacity={shimmerOpacity}
          height={ms(40)}
          width="48%"
          radius={ms(8)}
        />
      </View>

      {/* Bottom buttons skeleton */}
      <View
        style={{
          marginTop: ms(18),
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignSelf: 'center',
          gap: ms(12),
          position: 'absolute',
          bottom: ms(16),
          width: '100%',
        }}
      >
        <SkeletonBlock
          shimmerOpacity={shimmerOpacity}
          height={ms(38)}
          width="35%"
          radius={ms(20)}
        />
        <SkeletonBlock
          shimmerOpacity={shimmerOpacity}
          height={ms(38)}
          width="45%"
          radius={ms(20)}
        />
      </View>
    </View>
  );
};

export default React.memo(LessonModalSkeleton);
