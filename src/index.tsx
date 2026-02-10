import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import AppNavigator from './Navigation/AppNavigator';
import Toast from 'react-native-toast-message';
import { COLORS } from './Assets/Theme/colors';

const NavTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: COLORS.black,
  },
};

const AppWrapper = () => {
  return (
    <NavigationContainer theme={NavTheme}>
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
