import React from 'react';
import { View, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styles from './style';
import PlanContent from '@/Components/Generic/PlanContent';

const PlanCard = ({ item, onStartNow }) => {
  const isWhite = !item.gradient;

  return (
    <View style={styles.cardWrapper}>
      {item.popular && (
        <View style={styles.popularBadge}>
          <Text style={styles.badgeText}>MOST POPULAR</Text>
        </View>
      )}

      {isWhite ? (
        <View style={[styles.card, styles.cardBGStyle]}>
          <PlanContent item={item} onStartNow={onStartNow} />
        </View>
      ) : (
        <LinearGradient colors={item.gradient} style={styles.gradientBorder}>
          <View style={styles.card}>
            <PlanContent item={item} isGradient onStartNow={onStartNow} />
          </View>
        </LinearGradient>
      )}
    </View>
  );
};

export default PlanCard;
