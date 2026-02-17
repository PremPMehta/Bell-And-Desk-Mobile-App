import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignIn from '@/Screens/SignIn';
import SignUp from '@/Screens/SignUp';
import ForgotPassword from '@/Screens/ForgotPassword';
import { THEME } from '@/Assets/Theme';
import { COLORS } from '@/Assets/Theme/colors';
import ModalLayout from '@/Components/Generic/Layout/ModalLayout';
import UserDrawerNavigator from '@/Navigation/UserDrawerNavigator';
import MyReferral from '@/Screens/MyReferral';
import Profile from '@/Screens/Profile';
import ChoosePlan from '@/Screens/ChoosePlan';
import CookiePolicy from '@/Screens/CookiePolicy';
import Support from '@/Screens/Support';
import PrivacyPolicy from '@/Screens/PrivacyPolicy';
import TermsAndConditions from '@/Screens/TermsAndConditions';
import FAQ from '@/Screens/FAQ';
import LanguageSelection from '@/Screens/LanguageSelection';

export type StackNavigationProp<T> = any;
export type RootStackParamList = {
  [key: string]: undefined | { [key: string]: any };
};

const MainStack = createNativeStackNavigator();

const getDefaultStackHeaderOptions = () => ({
  headerStyle: { backgroundColor: COLORS.header },
  headerTitleStyle: {
    ...THEME.fontStyle.h4SemiBold,
    lineHeight: 22,
    color: COLORS.white,
  },
  headerTintColor: COLORS.white,
  headerBackButtonDisplayMode: 'minimal' as const,
});

const AppNavigator = () => {
  return (
    <>
      <MainStack.Navigator
        initialRouteName="UserDrawer"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          presentation: 'card',
          freezeOnBlur: true,
        }}
      >
        {/* ROOT - Always mounted */}
        <MainStack.Screen
          name="UserDrawer"
          component={UserDrawerNavigator}
          options={{
            headerShown: false,
          }}
        />

        {/* AUTH SCREENS */}
        <MainStack.Screen
          name="SignIn"
          component={SignIn}
          options={{
            presentation: 'card', // 👈 Important improvement
            animation: 'slide_from_bottom',
          }}
        />
        <MainStack.Screen
          name="SignUp"
          component={SignUp}
          options={{
            presentation: 'card',
          }}
        />
        <MainStack.Screen name="ForgotPassword" component={ForgotPassword} />

        {/* <MainStack.Screen
          name="CreateCommunity"  // Edit community screen from the about edit
          component={CreateCommunity}
          options={{ headerShown: false }}
        /> */}

        {/* Combined screens */}
        {/* <MainStack.Screen
          name="MyCommunities"
          component={MyCommunities}
          options={{ headerShown: false }}
        />
        <MainStack.Screen
          name="CommunityLayout"
          component={CommunityLayout}
          options={{ headerShown: false }}
        /> */}

        {/* <MainStack.Screen
          name="CreateCourses"
          component={CreateCourses}
          options={{ headerShown: false }}
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

        {/* PUBLIC / INFO SCREENS */}
        <MainStack.Screen
          name="FAQ"
          component={FAQ}
          options={{
            ...getDefaultStackHeaderOptions(),
            headerShown: true,
            title: 'FAQ', // Frequently Asked Questions
          }}
        />
        <MainStack.Screen
          name="TermsAndConditions"
          component={TermsAndConditions}
          options={{
            ...getDefaultStackHeaderOptions(),
            headerShown: true,
            title: 'Terms and Conditions',
          }}
        />
        <MainStack.Screen
          name="PrivacyPolicy"
          component={PrivacyPolicy}
          options={{
            ...getDefaultStackHeaderOptions(),
            headerShown: true,
            title: 'Privacy Policy',
          }}
        />
        <MainStack.Screen
          name="Support"
          component={Support}
          options={{
            ...getDefaultStackHeaderOptions(),
            headerShown: true,
            title: 'Support',
          }}
        />
        <MainStack.Screen
          name="CookiePolicy"
          component={CookiePolicy}
          options={{
            ...getDefaultStackHeaderOptions(),
            headerShown: true,
            title: 'Cookie Policy',
          }}
        />
        <MainStack.Screen
          name="ChoosePlan"
          component={ChoosePlan}
          options={{
            ...getDefaultStackHeaderOptions(),
            headerShown: true,
            title: 'Choose Your Plan',
          }}
        />
        <MainStack.Screen
          name="MyReferral"
          component={MyReferral}
          options={{
            ...getDefaultStackHeaderOptions(),
            headerShown: true,
            title: 'My Referral Links',
          }}
        />
        <MainStack.Screen
          name="LanguageSelection"
          component={LanguageSelection}
          options={{
            ...getDefaultStackHeaderOptions(),
            headerShown: true,
            title: 'Language',
          }}
        />
        <MainStack.Screen
          name="Profile"
          component={Profile}
          options={{
            ...getDefaultStackHeaderOptions(),
            headerShown: true,
            title: 'Profile',
          }}
        />
      </MainStack.Navigator>
      <ModalLayout />
    </>
  );
};

export default AppNavigator;
