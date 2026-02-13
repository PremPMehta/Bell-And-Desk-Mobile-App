import { api } from '@/ApiService';
import { ApiEndPoints } from '@/ApiService/api-end-points';
import ToastModule from '@/Components/Core/Toast';
import { AtomKeys } from '@/Jotai/AtomKeys';
import {
  booleanDefaultFalseAtomFamily,
  objectAtomFamily,
  userTokenAtom,
  userAtom,
} from '@/Jotai/Atoms';
import { useAtom, useSetAtom } from 'jotai';

const useUserApi = () => {
  // User Unified Login Apis
  const [apiUnifiedLoginLoading, setApiUnifiedLoginLoading] = useAtom(
    booleanDefaultFalseAtomFamily(AtomKeys.apiUnifiedLoginLoading),
  );
  const [apiUnifiedLogin, setApiUnifiedLogin] = useAtom(
    objectAtomFamily(AtomKeys.apiUnifiedLogin),
  );
  const setUserToken = useSetAtom(userTokenAtom);
  const setUser = useSetAtom(userAtom);

  // User Unified Login
  async function getUserUnifiedLogin(body: any) {
    try {
      setApiUnifiedLoginLoading(true);
      const uniLoginInfo: any = await api.post(ApiEndPoints.unifiedLogin, body);
      const userName =
        uniLoginInfo?.data?.user?.firstName +
        ' ' +
        uniLoginInfo?.data?.user?.lastName;
      console.log('uniLoginInfo', uniLoginInfo);

      if (uniLoginInfo?.data?.token) {
        setUserToken(uniLoginInfo?.data?.token);
      }
      if (uniLoginInfo?.data?.user) {
        setUser(uniLoginInfo?.data?.user);
      }
      ToastModule.welcomeTop({
        title: `Welcome Back, ${userName}!🎉`,
        msg: '',
      });
      setApiUnifiedLogin(uniLoginInfo);
      setApiUnifiedLoginLoading(false);
      return uniLoginInfo;
    } catch (error) {
      console.error('Error fetching user signin info:', error);
      setApiUnifiedLoginLoading(false);
    }
  }

  return {
    getUserUnifiedLogin,
    apiUnifiedLoginLoading,
    apiUnifiedLogin,
  };
};

export default useUserApi;
