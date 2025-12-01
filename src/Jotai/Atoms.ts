import AsyncStorage from '@react-native-async-storage/async-storage';
import { atomFamily, atomWithStorage, createJSONStorage } from 'jotai/utils';
import { atom } from 'jotai/vanilla';
import { AtomKeys } from './AtomKeys';
import { Appearance } from 'react-native';
import { darkTheme, lightTheme } from '@/Assets/Theme/theme';
const systemTheme = Appearance.getColorScheme();
const storage = createJSONStorage(() => AsyncStorage);

export const stringAtomFamily = atomFamily(key => atom(''));
export const objectAtomFamily = atomFamily(key => atom({} as any));
export const arrayAtomFamily = atomFamily(key => atom([] as any));
export const booleanDefaultFalseAtomFamily = atomFamily(key => atom(false));
export const booleanDefaultTrueAtomFamily = atomFamily(key => atom(true));
export const themeAtom = atomWithStorage(
  AtomKeys.appTheme,
  'dark', // by default theme is dark
  storage,
);

// Auth Atom
export const authStudentSigninAtom = atom(false);

// Computed theme based on preference and system
export const activeThemeAtom = atom(async get => {
  const preference = (await get(themeAtom)) || 'system';
  return preference === 'system'
    ? systemTheme === 'dark'
      ? darkTheme
      : lightTheme
    : preference === 'dark'
    ? darkTheme
    : lightTheme;
});

// User Atom
export const userAtom = atomWithStorage(AtomKeys.userInfo, {}, storage);

// User Login Token
export const userTokenAtom = atomWithStorage(AtomKeys.authToken, '', storage);

export const userRoleAtom = atomWithStorage(AtomKeys.userRole, '', storage);

export const logoutVisibleAtom = atom(false);
