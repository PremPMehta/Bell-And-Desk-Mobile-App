import React from 'react';
import { View, StyleSheet } from 'react-native';
import Skeleton from './index';
import { COLORS } from '@/Assets/Theme/colors';
import { ms, sc } from '@/Assets/Theme/fontStyle';

const AccessRequestsSkeleton = () => {
  return (
    <View style={styles.container}>
      {/* Header Skeleton */}
      <View style={styles.headerContainer}>
        <Skeleton
          width={220}
          height={ms(24)}
          borderRadius={ms(4)}
          style={{ marginBottom: ms(8) }}
        />
        <Skeleton width={300} height={ms(16)} borderRadius={ms(4)} />
      </View>

      {/* Content Skeleton */}
      <View style={styles.contentContainer}>
        <View style={styles.optionContainer}>
          <View style={styles.optionContent}>
            <Skeleton
              width={200}
              height={ms(20)}
              borderRadius={ms(4)}
              style={{ marginBottom: ms(8) }}
            />
            <Skeleton width={sc(225)} height={ms(32)} borderRadius={ms(4)} />
          </View>
          <Skeleton width={ms(45)} height={ms(25)} borderRadius={ms(15)} />
        </View>

        <View style={styles.infoContainer}>
          <Skeleton
            width={ms(20)}
            height={ms(20)}
            borderRadius={ms(10)}
            style={{ marginRight: ms(8) }}
          />
          <Skeleton width="85%" height={ms(40)} borderRadius={ms(4)} />
        </View>
      </View>

      {/* Button Skeleton */}
      <Skeleton
        width={ms(120)}
        height={ms(36)}
        borderRadius={ms(24)}
        style={{ alignSelf: 'flex-end' }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: ms(16),
    padding: ms(12),
    backgroundColor: COLORS.cardBG,
    borderRadius: ms(8),
  },
  headerContainer: {
    marginBottom: ms(16),
  },
  contentContainer: {
    marginBottom: ms(16),
    backgroundColor: COLORS.innerCardBG,
    borderRadius: ms(8),
    padding: ms(12),
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionContent: {
    width: sc(225),
  },
  infoContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.newInnerCardBG,
    borderRadius: ms(8),
    padding: ms(12),
    marginTop: ms(12),
  },
});

export default AccessRequestsSkeleton;
