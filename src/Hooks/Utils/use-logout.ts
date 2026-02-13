import { useSetAtom } from 'jotai';
import {
  authStudentSigninAtom,
  logoutVisibleAtom,
  userAtom,
  userRoleAtom,
  userTokenAtom,
} from '@/Jotai/Atoms';
import { useNavigation } from '@/Hooks/Utils/use-navigation';

export const useLogout = () => {
  const navigation = useNavigation();
  const setUserToken = useSetAtom(userTokenAtom);
  const setUser = useSetAtom(userAtom);
  const setUserRole = useSetAtom(userRoleAtom);
  const setAuthStudentSignin = useSetAtom(authStudentSigninAtom);
  const setLogoutModalVisible = useSetAtom(logoutVisibleAtom);

  const logout = async () => {
    // 1. Close the modal
    setLogoutModalVisible(false);

    // 2. Clear state
    setUserToken('');
    setUser({});
    setUserRole('');
    setAuthStudentSignin(false);

    // 3. Reset navigation to UserDrawer (Home) to clear stack
    // Using a timeout to allow the modal to close smoothly before navigation
    setTimeout(() => {
      navigation.navigate('Home');
    }, 300);
  };

  return { logout };
};
