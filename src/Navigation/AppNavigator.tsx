import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SignIn from '@/Screens/SignIn';
import SignUp from '@/Screens/SignUp';
import ForgotPassword from '@/Screens/ForgotPassword';
import Home from '@/Screens/Home';
import { THEME } from '@/Assets/Theme';
import { COLORS } from '@/Assets/Theme/colors';
import CategoryDetails from '@/Screens/CategoryDetails';

export type StackNavigationProp<T> = any;
export type RootStackParamList = {
  [key: string]: undefined | { [key: string]: any };
};

const MainStack = createStackNavigator();

const getDefaultStackHeaderOptions = () => ({
  headerStyle: { backgroundColor: COLORS.header },
  headerTitleStyle: {
    ...THEME.fontStyle.h4SemiBold,
    lineHeight: 22,
    color: COLORS.white,
  },
  headerTintColor: COLORS.white,
});

const AppNavigator = () => {
  return (
    <MainStack.Navigator screenOptions={{ headerShown: false }}>
      {/* <MainStack.Screen name="SignIn" component={SignIn} />
      <MainStack.Screen name="SignUp" component={SignUp} />
      <MainStack.Screen name="ForgotPassword" component={ForgotPassword} /> */}
      <MainStack.Screen
        name="Home"
        component={Home}
        options={{
          ...getDefaultStackHeaderOptions(),
          headerShown: true,
          title: 'Home',
        }}
      />
      {/* <MainStack.Screen
        name="CategoryDetails"
        component={CategoryDetails}
        options={{
          ...getDefaultStackHeaderOptions(),
          headerShown: true,
          title: 'Category Details',
        }}
      /> */}
    </MainStack.Navigator>
  );
};

export default AppNavigator;
