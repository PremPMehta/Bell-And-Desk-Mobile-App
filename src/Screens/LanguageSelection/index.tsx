import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import AppHeader from '@/Components/Navigation/AppHeader';
import styles from './style';
import Icon from '@/Components/Core/Icons';
import { COLORS } from '@/Assets/Theme/colors';
import { useAtom } from 'jotai';
import { languageAtom } from '@/Jotai/Atoms';
import { useTranslation } from 'react-i18next';
import { LANGUAGES } from '@/Constants/customData';

const LanguageSelection = () => {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useAtom(languageAtom);

  const handleLanguageChange = async (languageCode: string) => {
    try {
      await i18n.changeLanguage(languageCode);
      setLanguage(languageCode);
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* <AppHeader /> */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t('language.selectLanguage')}
          </Text>
          <View style={styles.itemsCard}>
            {LANGUAGES.map((lang, index) => (
              <React.Fragment key={lang.code}>
                <TouchableOpacity
                  style={styles.itemContainer}
                  activeOpacity={0.7}
                  onPress={() => handleLanguageChange(lang.code)}
                >
                  <View style={styles.itemContent}>
                    <View
                      style={[
                        styles.iconBackground,
                        { backgroundColor: COLORS.primary },
                      ]}
                    >
                      <Icon name="Languages" size={18} color={COLORS.white} />
                    </View>
                    <View>
                      <Text style={styles.itemText}>{lang.nativeName}</Text>
                      <Text style={styles.itemSubText}>{lang.name}</Text>
                    </View>
                  </View>
                  {language === lang.code && (
                    <Icon name="Check" size={20} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
                {index !== LANGUAGES.length - 1 && (
                  <View style={styles.divider} />
                )}
              </React.Fragment>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default LanguageSelection;
