import React from 'react';
import { View, Text, ScrollView, Linking } from 'react-native';
import RenderHTML from 'react-native-render-html';
import styles from './style';
import { TERMS_TEXT } from '@/Constants/termsContent';
import { width } from '@/Assets/Theme/fontStyle';

// Note: Please check all points with web version

const TermsAndConditions = () => {
  const handleLinkPress = (event, href) => {
    if (href) {
      Linking.openURL(href);
    }
  };
  return (
    <ScrollView style={styles.wrapper}>
      <View style={styles.container}>
        <RenderHTML
          contentWidth={width}
          source={{ html: TERMS_TEXT }}
          renderersProps={{
            a: {
              onPress: handleLinkPress,
            },
          }}
          tagsStyles={{
            h1: styles.h1,
            h2: styles.h2,
            h3: styles.h3,
            p: styles.p,
            strong: styles.strong,
            ul: styles.ul,
            li: styles.li,
            b: styles.b,
            a: styles.a,
          }}
        />
      </View>
    </ScrollView>
  );
};

export default TermsAndConditions;
