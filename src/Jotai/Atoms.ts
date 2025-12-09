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
export const addMediaVisibleAtom = atom(false);
export const onMediaAddedAtom = atom<((media: any) => void) | null>(null);
export const createPostVisibleAtom = atom(false);
export const editingPostAtom = atom<Post | null>(null);
export const onCreatePostMediaAddedAtom = atom<((media: any) => void) | null>(
  null,
);

export interface Post {
  id: string;
  author: {
    name: string;
    avatar: string; // URL or Initials
  };
  timestamp: string; // ISO string
  content: string;
  media?: any[]; // Assets from image-picker
  isPoll?: boolean;
  pollData?: {
    question: string;
    options: {
      id: string;
      text: string;
      votes: number;
    }[];
    totalVotes: number;
    allowMultipleAnswers: boolean;
    userVotedOptionIds?: string[]; // IDs of options user voted for
  };
  likes: number;
  comments: number;
  isLiked?: boolean;
}

export const postsAtom = atomWithStorage<Post[]>('community_posts', [], storage as any);

export const mediaPreviewAtom = atom<{
  visible: boolean;
  uri: string;
  type: 'image' | 'video';
}>({
  visible: false,
  uri: '',
  type: 'image',
});

