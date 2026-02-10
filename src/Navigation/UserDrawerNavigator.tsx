import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import CustomDrawerContent from '@/Components/Navigation/CustomDrawerContent';
import { COLORS } from '@/Assets/Theme/colors';
import Icon from '@/Components/Core/Icons';
import Home from '@/Screens/Home';
import MyCommunities from '@/Screens/MyCommunities';
import MyReferral from '@/Screens/MyReferral';
import CommunityLayout from '@/Screens/CommunityLayout';
import Settings from '@/Screens/Settings';
import Support from '@/Screens/Support';
import ChoosePlan from '@/Screens/ChoosePlan';
import FAQ from '@/Screens/FAQ';
import TermsAndConditions from '@/Screens/TermsAndConditions';
import PrivacyPolicy from '@/Screens/PrivacyPolicy';
import CookiePolicy from '@/Screens/CookiePolicy';
import Profile from '@/Screens/Profile';

const UserDrawer = createDrawerNavigator();
const Stack = createStackNavigator();

const MyCommunitiesStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: COLORS.black },
      }}
    >
      <Stack.Screen name="MyCommunitiesMain" component={MyCommunities} />
      <Stack.Screen name="CommunityLayout" component={CommunityLayout} />
    </Stack.Navigator>
  );
};

// const SettingsStack = () => {
//   return (
//     <Stack.Navigator
//       screenOptions={{
//         headerShown: false,
//         cardStyle: { backgroundColor: COLORS.black },
//       }}
//     >
//       <Stack.Screen name="SettingsMain" component={Settings} />
//       <Stack.Screen name="Profile" component={Profile} />
//       <Stack.Screen name="MyReferral" component={MyReferral} />
//       <Stack.Screen name="FAQ" component={FAQ} />
//       <Stack.Screen name="Support" component={Support} />
//       <Stack.Screen name="ChoosePlan" component={ChoosePlan} />
//       <Stack.Screen name="TermsAndConditions" component={TermsAndConditions} />
//       <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
//       <Stack.Screen name="CookiePolicy" component={CookiePolicy} />
//     </Stack.Navigator>
//   );
// };

const UserDrawerNavigator = () => {
  return (
    <UserDrawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: COLORS.black,
          width: 280,
        },
        drawerActiveTintColor: COLORS.primary,
        drawerInactiveTintColor: COLORS.white,
        drawerItemStyle: {
          marginVertical: 4,
          paddingHorizontal: 8,
        },
      }}
    >
      <UserDrawer.Screen
        name="Home"
        component={Home}
        options={{
          drawerLabel: 'Home',
          drawerIcon: ({ color, size }) => (
            <Icon name="House" size={22} color={color} />
          ),
        }}
      />
      <UserDrawer.Screen
        name="MyCommunities"
        component={MyCommunitiesStack}
        options={{
          drawerLabel: 'My Communities',
          drawerIcon: ({ color, size }) => (
            <Icon name="Users" size={22} color={color} />
          ),
        }}
      />
      <UserDrawer.Screen
        name="Settings"
        component={Settings}
        options={{
          drawerLabel: 'Settings',
          drawerIcon: ({ color, size }) => (
            <Icon name="Settings" size={22} color={color} />
          ),
        }}
      />
    </UserDrawer.Navigator>
  );
};

export default UserDrawerNavigator;
