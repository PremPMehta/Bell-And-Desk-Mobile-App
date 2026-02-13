import { useAtomValue } from 'jotai';
import { userTokenAtom } from '@/Jotai/Atoms';
import { useNavigation } from '@/Hooks/Utils/use-navigation';

export const useRequireAuth = () => {
  const userToken = useAtomValue(userTokenAtom);
  const navigation = useNavigation();

  const requireAuth = (screenName?: string, params?: any) => {
    if (!userToken) {
      navigation.navigate('SignIn', {
        redirectTo: screenName,
        redirectParams: params,
      });
      return false;
    }

    if (screenName) {
      navigation.navigate(screenName, params);
    }

    return true;
  };

  return { requireAuth, isLoggedIn: !!userToken };
};
