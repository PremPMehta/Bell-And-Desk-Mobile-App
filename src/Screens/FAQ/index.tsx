import { faqList } from '@/Constants/customData';
import React, { useState } from 'react';
import {
  View,
  Text,
  LayoutAnimation,
  UIManager,
  Platform,
  ScrollView,
  Pressable,
} from 'react-native';
import styles from './style';
import Icon from '@/Components/Core/Icons';
import { COLORS } from '@/Assets/Theme/colors';

// Enable animation for Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FAQ = ({ navigation }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = index => {
    LayoutAnimation.easeInEaseOut();
    // LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    setActiveIndex(activeIndex === index ? null : index);
  };

  const renderCountries = countries => (
    <View style={styles.countryGrid}>
      {countries.map((item, index) => (
        <Text key={index} style={styles.countryItem}>
          • {item}
        </Text>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* HEADER */}
      {/* <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>FAQ</Text>
        <View style={{ width: 26 }} />
      </View> */}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.pageTitle}>Frequently Asked Questions</Text>

        {faqList?.map((item, index) => (
          <View key={index} style={styles.accordionContainer}>
            <Pressable
              onPress={() => toggleAccordion(index)}
              style={styles.accordionHeader}
            >
              <Text style={styles.accordionTitle}>{item.title}</Text>
              <Icon
                name={activeIndex === index ? 'ChevronUp' : 'ChevronDown'}
                size={22}
                color={COLORS.white}
              />
            </Pressable>

            {activeIndex === index && (
              <View style={styles.accordionBody}>
                <Text style={styles.description}>{item.description}</Text>

                {item.countries && renderCountries(item.countries)}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default FAQ;
