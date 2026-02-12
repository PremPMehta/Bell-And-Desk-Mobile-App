import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import AppNavigator from './Navigation/AppNavigator';
import Toast from 'react-native-toast-message';
import { COLORS } from './Assets/Theme/colors';
import './i18n'; // Initialize i18n
import { useAtom } from 'jotai';
import { languageAtom } from './Jotai/Atoms';
import { useTranslation } from 'react-i18next';

const NavTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: COLORS.black,
  },
};

const LanguageInitializer = () => {
  const { i18n } = useTranslation();
  const [language] = useAtom(languageAtom);

  useEffect(() => {
    if (language && typeof language === 'string' && i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [language, i18n]);

  return null;
};

const AppWrapper = () => {
  return (
    <NavigationContainer theme={NavTheme}>
      <LanguageInitializer />
      <AppNavigator />
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AppWrapper />
        <Toast />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

export default App;
