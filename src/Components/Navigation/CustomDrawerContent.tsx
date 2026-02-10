import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { COLORS } from '@/Assets/Theme/colors';
import { AppImages } from '@/Assets/Images';
import { ms, sc, vs } from '@/Assets/Theme/fontStyle';

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  return (
    <View style={styles.container}>
      {/* Company Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={AppImages.companyLogo}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Drawer Items */}
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.drawerContent}
      >
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  logoContainer: {
    paddingVertical: vs(15),
    paddingHorizontal: ms(16),
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
  },
  logo: {
    width: sc(120),
    height: vs(25),
  },
  drawerContent: {
    paddingTop: ms(20),
  },
});

export default CustomDrawerContent;
