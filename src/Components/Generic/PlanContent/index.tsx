import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from '@/Components/Core/Icons';
import styles from './style';
import { COLORS } from '@/Assets/Theme/colors';
import { features } from '@/Constants/customData';

const PlanContent = ({ item, isGradient = false, onStartNow }) => {
  const planFeatures = item?.features || features;
  const renderFeatureText = (text: string) => {
    if (!text.includes('**')) {
      return text;
    }

    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <Text key={index} style={styles.boldText}>
            {part.slice(2, -2)}
          </Text>
        );
      }
      return part;
    });
  };

  return (
    <>
      <Text style={[styles.cardTitle, isGradient && styles.commonColor]}>
        {item?.name || item?.title}
      </Text>

      <Text style={[styles.cardPrice, isGradient && styles.commonColor]}>
        {'$' + item?.price}{' '}
        <Text style={[styles.month, isGradient && styles.commonColor]}>
          / {item?.period || 'Month'}
        </Text>
      </Text>

      <Text style={styles.descAbove}>{item?.descriptionAbove}</Text>

      <TouchableOpacity
        style={[styles.startBtn, isGradient ? styles.bgWhite : styles.bgBlack]}
        onPress={() => onStartNow(item)}
      >
        <Text style={[styles.startBtnText, isGradient && styles.commonColor2]}>
          {(item?.isEnterprise && item?.buttonText) || 'Start Now'}
        </Text>
      </TouchableOpacity>

      <Text style={[styles.includedText, isGradient && styles.commonColor]}>
        What's included:
      </Text>

      {planFeatures.map((f, index) => (
        <View key={index} style={styles.featureRow}>
          <Icon
            name="CircleCheckBig"
            size={16}
            color={isGradient ? COLORS.white : COLORS.green}
          />
          <Text style={[styles.featureText, isGradient && styles.commonColor]}>
            {renderFeatureText(f)}
          </Text>
        </View>
      ))}
    </>
  );
};

export default PlanContent;
