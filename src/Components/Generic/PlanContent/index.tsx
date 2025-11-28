import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from '@/Components/Core/Icons';
import styles from './style';
import { COLORS } from '@/Assets/Theme/colors';
import { features } from '@/Constants/customData';

const PlanContent = ({ item, isGradient = false, onStartNow }) => {
  return (
    <>
      <Text style={[styles.cardTitle, isGradient && styles.commonColor]}>
        {item.title}
      </Text>

      <Text style={[styles.cardPrice, isGradient && styles.commonColor]}>
        {item.price}{' '}
        <Text style={[styles.month, isGradient && styles.commonColor]}>
          / Month
        </Text>
      </Text>

      <TouchableOpacity
        style={[styles.startBtn, isGradient ? styles.bgWhite : styles.bgBlack]}
        onPress={() => onStartNow(item)}
      >
        <Text style={[styles.startBtnText, isGradient && styles.commonColor2]}>
          Start Now
        </Text>
      </TouchableOpacity>

      <Text style={[styles.includedText, isGradient && styles.commonColor]}>
        What's included:
      </Text>

      {features.map((f, index) => (
        <View key={index} style={styles.featureRow}>
          <Icon
            name="CircleCheckBig"
            size={16}
            color={isGradient ? COLORS.white : COLORS.green}
          />
          <Text style={[styles.featureText, isGradient && styles.commonColor]}>
            {f}
          </Text>
        </View>
      ))}
    </>
  );
};

export default PlanContent;
