import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SignIn from '@/Screens/SignIn';
import SignUp from '@/Screens/SignUp';
import ForgotPassword from '@/Screens/ForgotPassword';
import Home from '@/Screens/Home';
import { THEME } from '@/Assets/Theme';
import { COLORS } from '@/Assets/Theme/colors';
import CategoryDetails from '@/Screens/CategoryDetails';
import FAQ from '@/Screens/FAQ';
import TermsAndConditions from '@/Screens/TermsAndConditions';
import PrivacyPolicy from '@/Screens/PrivacyPolicy';
import Support from '@/Screens/Support';
import CookiePolicy from '@/Screens/CookiePolicy';
import ChoosePlan from '@/Screens/ChoosePlan';
import ModalLayout from '@/Components/Generic/Layout/ModalLayout';
import CreateCommunity from '@/Screens/CreateCommunity';
import MyCommunities from '@/Screens/MyCommunities';

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
    <>
      <MainStack.Navigator screenOptions={{ headerShown: false }}>
        {/* <MainStack.Screen
          name="CreateCommunity"
          component={CreateCommunity}
          options={{ headerShown: false }}
        /> */}
        <MainStack.Screen
          name="MyCommunities"
          component={MyCommunities}
          options={{ headerShown: false }}
        />
        {/* <MainStack.Screen name="SignIn" component={SignIn} />
      <MainStack.Screen name="SignUp" component={SignUp} />
      <MainStack.Screen name="ForgotPassword" component={ForgotPassword} /> */}
        {/* <MainStack.Screen
        name="Home"
        component={Home}
        options={{
          ...getDefaultStackHeaderOptions(),
          headerShown: true,
          title: 'Home',
        }}
      /> */}
        {/* <MainStack.Screen
        name="CategoryDetails"
        component={CategoryDetails}
        options={{
          ...getDefaultStackHeaderOptions(),
          headerShown: true,
          title: 'Category Details',
          }}
          /> */}
        {/* <MainStack.Screen
        name="FAQ"
        component={FAQ}
        options={{
          ...getDefaultStackHeaderOptions(),
          headerShown: true,
          title: 'FAQ', // Frequently Asked Questions
        }}
      /> */}
        {/* <MainStack.Screen
        name="TermsAndConditions"
        component={TermsAndConditions}
        options={{
          ...getDefaultStackHeaderOptions(),
          headerShown: true,
          title: 'Terms and Conditions',
        }}
      /> */}
        {/* <MainStack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicy}
        options={{
          ...getDefaultStackHeaderOptions(),
          headerShown: true,
          title: 'Privacy Policy',
        }}
      /> */}
        {/* <MainStack.Screen
        name="Support"
        component={Support}
        options={{
          ...getDefaultStackHeaderOptions(),
          headerShown: true,
          title: 'Support',
        }}
      /> */}
        {/* <MainStack.Screen
        name="CookiePolicy"
        component={CookiePolicy}
        options={{
          ...getDefaultStackHeaderOptions(),
          headerShown: true,
          title: 'Cookie Policy',
        }}
      /> */}
        {/* <MainStack.Screen
          name="ChoosePlan"
          component={ChoosePlan}
          options={{
            ...getDefaultStackHeaderOptions(),
            headerShown: true,
            title: 'Choose Your Plan',
          }}
        /> */}
      </MainStack.Navigator>
      <ModalLayout />
    </>
  );
};

export default AppNavigator;
