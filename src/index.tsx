import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import AppNavigator from './Navigation/AppNavigator';
import Toast from 'react-native-toast-message';
import { COLORS } from './Assets/Theme/colors';
import './i18n'; // Initialize i18n
import { useAtom, Provider } from 'jotai';
import { languageAtom, userTokenAtom } from '@/Jotai/Atoms';
import { store } from '@/Jotai/Store';
import { useTranslation } from 'react-i18next';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { StatusBar } from 'react-native';
import SocketService from '@/Services/SocketService';

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
    if (
      language &&
      typeof language === 'string' &&
      i18n.language !== language
    ) {
      i18n.changeLanguage(language);
    }
  }, [language, i18n]);

  return null;
};

const SocketInitializer = () => {
  const [token] = useAtom(userTokenAtom);

  useEffect(() => {
    if (token) {
      SocketService.connect(token);
    } else {
      SocketService.disconnect();
    }
  }, [token]);

  return null;
};

const AppWrapper = () => {
  return (
    <NavigationContainer theme={NavTheme}>
      <LanguageInitializer />
      <SocketInitializer />
      <AppNavigator />
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <SafeAreaProvider>
      {/*
        StatusBar must be rendered here (JS layer) in addition to the native
        theme settings. On Android, React Native's StatusBar component sends
        a bridge command that overrides native theme values at runtime.

        - translucent={true}   → makes the status bar area part of the layout
                                  (edge-to-edge), so content draws behind it.
        - backgroundColor="transparent" → removes any white/coloured background
                                          the system might have applied.
        - barStyle="light-content" → white icons / text on the dark app.
      */}
      <StatusBar
        translucent={true}
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <Provider store={store}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <KeyboardProvider
            statusBarTranslucent={true}
            navigationBarTranslucent={true}
          >
            <AppWrapper />
            <Toast />
          </KeyboardProvider>
        </GestureHandlerRootView>
      </Provider>
    </SafeAreaProvider>
  );
};

export default App;
