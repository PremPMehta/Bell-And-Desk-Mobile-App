import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CustomDrawerContent from '@/Components/Navigation/CustomDrawerContent';
import { COLORS } from '@/Assets/Theme/colors';
import Icon from '@/Components/Core/Icons';

import Home from '@/Screens/Home';
import MyCommunities from '@/Screens/MyCommunities';
import CommunityLayout from '@/Screens/CommunityLayout';
import Settings from '@/Screens/Settings';
import Profile from '@/Screens/Profile';
import { THEME } from '@/Assets/Theme';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

/* ================================
   My Communities Stack
================================ */
const MyCommunitiesStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.black },
        animation: 'fade',
        freezeOnBlur: true,
      }}
    >
      <Stack.Screen name="MyCommunitiesMain" component={MyCommunities} />
      <Stack.Screen name="CommunityLayout" component={CommunityLayout} />
    </Stack.Navigator>
  );
};

/* ================================
   Settings Stack (FIXED)
================================ */
// const SettingsStack = () => {
//   return (
//     <Stack.Navigator
//       screenOptions={{
//         headerShown: false,
//         contentStyle: { backgroundColor: COLORS.black },

//         // 🔥 THIS IS THE KEY FIX
//         animation: 'slide_from_right',
//         presentation: 'card',

//         // prevents re-render flicker
//         freezeOnBlur: true,
//       }}
//     >
//       <Stack.Screen name="Settings" component={Settings} />
//       <Stack.Screen
//         name="Profile"
//         component={Profile}
//         options={{
//           ...getDefaultStackHeaderOptions(),
//           headerShown: true,
//           title: 'Profile',
//         }}
//       />
//     </Stack.Navigator>
//   );
// };

/* ================================
   Drawer Navigator
================================ */
const UserDrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
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
      <Drawer.Screen
        name="Home"
        component={Home}
        options={{
          drawerLabel: 'Home',
          drawerIcon: ({ color }) => (
            <Icon name="House" size={22} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="MyCommunities"
        component={MyCommunitiesStack}
        options={{
          drawerLabel: 'My Communities',
          drawerIcon: ({ color }) => (
            <Icon name="Users" size={22} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="Settings"
        component={Settings}
        options={{
          drawerLabel: 'Settings',
          drawerIcon: ({ color }) => (
            <Icon name="Settings" size={22} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default UserDrawerNavigator;
