import { api } from '@/ApiService';
import { ApiEndPoints } from '@/ApiService/api-end-points';
import ToastModule from '@/Components/Core/Toast';
import { useNavigation } from '@/Hooks/Utils/use-navigation';
import { AtomKeys } from '@/Jotai/AtomKeys';
import {
  booleanDefaultFalseAtomFamily,
  objectAtomFamily,
  userTokenAtom,
  userAtom,
} from '@/Jotai/Atoms';
import { useAtom, useSetAtom } from 'jotai';

const useUserApi = () => {
  const navigation = useNavigation();
  const setUserToken = useSetAtom(userTokenAtom);
  const setUser = useSetAtom(userAtom);

  // User Unified Login Apis
  const [apiUnifiedLoginLoading, setApiUnifiedLoginLoading] = useAtom(
    booleanDefaultFalseAtomFamily(AtomKeys.apiUnifiedLoginLoading),
  );
  const [apiUnifiedLogin, setApiUnifiedLogin] = useAtom(
    objectAtomFamily(AtomKeys.apiUnifiedLogin),
  );

  // User Unified Signup Apis
  const [apiUnifiedSignupLoading, setApiUnifiedSignupLoading] = useAtom(
    booleanDefaultFalseAtomFamily(AtomKeys.apiUnifiedSignupLoading),
  );
  const [apiUnifiedSignup, setApiUnifiedSignup] = useAtom(
    objectAtomFamily(AtomKeys.apiUnifiedSignup),
  );

  // User Forgot Password Apis
  const [apiForgotPasswordLoading, setApiForgotPasswordLoading] = useAtom(
    booleanDefaultFalseAtomFamily(AtomKeys.apiForgotPasswordLoading),
  );
  const [apiForgotPassword, setApiForgotPassword] = useAtom(
    objectAtomFamily(AtomKeys.apiForgotPassword),
  );

  // Update User Profile Apis
  const [apiUpdateUserProfileLoading, setApiUpdateUserProfileLoading] = useAtom(
    booleanDefaultFalseAtomFamily(AtomKeys.apiUpdateUserProfileLoading),
  );
  const [apiUpdateUserProfile, setApiUpdateUserProfile] = useAtom(
    objectAtomFamily(AtomKeys.apiUpdateUserProfile),
  );

  // Get Site Settings Apis
  const [apiGetSiteSettingsLoading, setApiGetSiteSettingsLoading] = useAtom(
    booleanDefaultFalseAtomFamily(AtomKeys.apiGetSiteSettingsLoading),
  );
  const [apiGetSiteSettings, setApiGetSiteSettings] = useAtom(
    objectAtomFamily(AtomKeys.apiGetSiteSettings),
  );

  // Get Communities Apis
  const [apiGetCommunitiesLoading, setApiGetCommunitiesLoading] = useAtom(
    booleanDefaultFalseAtomFamily(AtomKeys.apiGetCommunitiesLoading),
  );
  const [apiGetCommunities, setApiGetCommunities] = useAtom(
    objectAtomFamily(AtomKeys.apiGetCommunities),
  );

  // Get Communities Slug Apis
  const [apiGetCommunitiesSlugLoading, setApiGetCommunitiesSlugLoading] =
    useAtom(
      booleanDefaultFalseAtomFamily(AtomKeys.apiGetCommunitiesSlugLoading),
    );
  const [apiGetCommunitiesSlug, setApiGetCommunitiesSlug] = useAtom(
    objectAtomFamily(AtomKeys.apiGetCommunitiesSlug),
  );

  // Get Communities Plans Apis
  const [apiGetCommunitiesPlansLoading, setApiGetCommunitiesPlansLoading] =
    useAtom(
      booleanDefaultFalseAtomFamily(AtomKeys.apiGetCommunitiesPlansLoading),
    );
  const [apiGetCommunitiesPlans, setApiGetCommunitiesPlans] = useAtom(
    objectAtomFamily(AtomKeys.apiGetCommunitiesPlans),
  );

  // Get User Data Apis
  const [apiGetUserDataLoading, setApiGetUserDataLoading] = useAtom(
    booleanDefaultFalseAtomFamily(AtomKeys.apiGetUserDataLoading),
  );
  const [apiGetUserData, setApiGetUserData] = useAtom(
    objectAtomFamily(AtomKeys.apiGetUserData),
  );

  // Get Community Courses Apis
  const [apiGetCommunityCoursesLoading, setApiGetCommunityCoursesLoading] =
    useAtom(
      booleanDefaultFalseAtomFamily(AtomKeys.apiGetCommunityCoursesLoading),
    );
  const [apiGetCommunityCourses, setApiGetCommunityCourses] = useAtom(
    objectAtomFamily(AtomKeys.apiGetCommunityCourses),
  );

  // User Unified Login
  async function getUserUnifiedLogin(body: any) {
    try {
      setApiUnifiedLoginLoading(true);
      const uniLoginInfo: any = await api.post(ApiEndPoints.unifiedLogin, body);
      console.log('uniLoginInfo', uniLoginInfo);

      if (uniLoginInfo?.data?.token) {
        setUserToken(uniLoginInfo?.data?.token);

        // Fetch User Data after successful login
        const userDataRes: any = await api.get(ApiEndPoints.userData);
        console.log('userDataRes', userDataRes);

        if (userDataRes?.data) {
          setUser(userDataRes?.data);
          const userName =
            userDataRes?.data?.firstName + ' ' + userDataRes?.data?.lastName;
          ToastModule.welcomeTop({
            title: `Welcome Back, ${userName.trim()}!🎉`,
            msg: '',
          });
        }
      }

      setApiUnifiedLogin(uniLoginInfo);
      setApiUnifiedLoginLoading(false);
      return uniLoginInfo;
    } catch (error: any) {
      console.error('Error fetching user signin info:', error);
      ToastModule.errorBottom({
        msg: error?.resError?.message || error?.message,
      });
      setApiUnifiedLoginLoading(false);
    }
  }

  // User Unified Signup
  async function getUserUnifiedSignup(body: any) {
    try {
      setApiUnifiedSignupLoading(true);
      const uniSignupInfo: any = await api.post(
        ApiEndPoints.unifiedSignup,
        body,
      );
      const userName =
        uniSignupInfo?.data?.user?.firstName +
        ' ' +
        uniSignupInfo?.data?.user?.lastName;
      console.log('uniSignupInfo', uniSignupInfo);

      if (uniSignupInfo?.data?.token) {
        setUserToken(uniSignupInfo?.data?.token);
      }
      if (uniSignupInfo?.data?.user) {
        setUser(uniSignupInfo?.data?.user);
      }
      ToastModule.welcomeTop({
        title: `Welcome Back, ${userName}!🎉`,
        msg: '',
      });
      setApiUnifiedSignup(uniSignupInfo);
      setApiUnifiedSignupLoading(false);
      return uniSignupInfo;
    } catch (error: any) {
      console.error('Error fetching user signup info:', error);
      ToastModule.errorBottom({
        msg: error?.resError?.message || error?.message,
      });
      setApiUnifiedSignupLoading(false);
    }
  }

  // User Forgot Password
  async function getUserForgotPassword(body: any) {
    try {
      setApiForgotPasswordLoading(true);
      const forgotPassword: any = await api.post(
        ApiEndPoints.forgotPassword,
        body,
      );
      console.log('forgotPassword', forgotPassword);

      ToastModule.successTop({
        msg: forgotPassword?.message,
      });
      setApiForgotPassword(forgotPassword);
      setApiForgotPasswordLoading(false);
      navigation.goBack();
      return forgotPassword;
    } catch (error: any) {
      console.error('Error fetching user forgot password info:', error);
      ToastModule.errorBottom({
        msg: error?.resError?.message || error?.message,
      });
      setApiForgotPasswordLoading(false);
    }
  }

  // Update User Profile
  async function updateUserProfile(body: any) {
    const header = { 'Content-Type': 'multipart/form-data' };
    try {
      setApiUpdateUserProfileLoading(true);
      const updateUserProfileInfo: any = await api.put(
        ApiEndPoints.updateUserProfile,
        body,
        header,
      );
      console.log('updateUserProfileInfo', updateUserProfileInfo);
      ToastModule.successTop({
        msg: updateUserProfileInfo?.message,
      });
      setApiUpdateUserProfile(updateUserProfileInfo);
      setApiUpdateUserProfileLoading(false);
      return updateUserProfileInfo;
    } catch (error: any) {
      console.error('Error fetching update user profile info:', error);
      ToastModule.errorBottom({
        msg: error?.resError?.message || error?.message,
      });
      setApiUpdateUserProfileLoading(false);
    }
  }

  // Get Site-Settings for Home Screen
  async function getSiteSettings() {
    try {
      setApiGetSiteSettingsLoading(true);
      const siteSettingsInfo: any = await api.get(ApiEndPoints.siteSettings);
      setApiGetSiteSettings(siteSettingsInfo);
      setApiGetSiteSettingsLoading(false);
      return siteSettingsInfo;
    } catch (error: any) {
      console.error('Error fetching site settings info:', error);
      ToastModule.errorBottom({
        msg: error?.resError?.message || error?.message,
      });
      setApiGetSiteSettingsLoading(false);
    }
  }

  // Get Communities for Home Screen
  async function getCommunities() {
    try {
      setApiGetCommunitiesLoading(true);
      const communitiesList: any = await api.get(ApiEndPoints.communities);
      setApiGetCommunities(communitiesList);
      setApiGetCommunitiesLoading(false);
      return communitiesList;
    } catch (error: any) {
      console.error('Error fetching communities info:', error);
      ToastModule.errorBottom({
        msg: error?.resError?.message || error?.message,
      });
      setApiGetCommunitiesLoading(false);
    }
  }

  // Get Community Details for Category Details Screen
  async function getCommunitiesSlug(query: any) {
    try {
      setApiGetCommunitiesSlugLoading(true);
      const communityInfo: any = await api.get(
        ApiEndPoints.communitiesSlug + query,
      );
      setApiGetCommunitiesSlug(communityInfo);
      setApiGetCommunitiesSlugLoading(false);
      return communityInfo;
    } catch (error) {
      console.error('Error fetching community info:', error);
      setApiGetCommunitiesSlugLoading(false);
    }
  }

  // Get Communities Plans for Choose Plan Screen
  async function getPlansPublic() {
    try {
      setApiGetCommunitiesPlansLoading(true);
      const plans: any = await api.get(ApiEndPoints.plansPublic);
      setApiGetCommunitiesPlans(plans);
      setApiGetCommunitiesPlansLoading(false);
      return plans;
    } catch (error: any) {
      console.error('Error fetching communities plans info:', error);
      ToastModule.errorBottom({
        msg: error?.resError?.message || error?.message,
      });
      setApiGetCommunitiesPlansLoading(false);
    }
  }

  // Get User Data for My Communities Screen
  async function getUserData() {
    try {
      setApiGetUserDataLoading(true);
      const userDataInfo: any = await api.get(ApiEndPoints.userData);
      if (userDataInfo?.data) {
        setUser(userDataInfo?.data);
      }
      setApiGetUserData(userDataInfo);
      setApiGetUserDataLoading(false);
      return userDataInfo;
    } catch (error: any) {
      console.error('Error fetching user data info:', error);
      ToastModule.errorBottom({
        msg: error?.resError?.message || error?.message,
      });
      setApiGetUserDataLoading(false);
    }
  }

  // Get Courses for Community Courses Screen
  async function getCommunityCourses(query: any) {
    try {
      setApiGetCommunityCoursesLoading(true);
      const communityCourses: any = await api.get(
        ApiEndPoints.communityCourses + query,
      );
      setApiGetCommunityCourses(communityCourses);
      setApiGetCommunityCoursesLoading(false);
      return communityCourses;
    } catch (error) {
      console.error('Error fetching community courses info:', error);
      setApiGetCommunityCoursesLoading(false);
    }
  }

  return {
    // Auth Apis
    getUserUnifiedLogin,
    apiUnifiedLoginLoading,
    apiUnifiedLogin,

    getUserUnifiedSignup,
    apiUnifiedSignupLoading,
    apiUnifiedSignup,

    getUserForgotPassword,
    apiForgotPasswordLoading,
    apiForgotPassword,

    updateUserProfile,
    apiUpdateUserProfileLoading,
    apiUpdateUserProfile,

    /* Home Screen Apis */

    // Site-Settings
    getSiteSettings,
    apiGetSiteSettingsLoading,
    apiGetSiteSettings,

    // Communities
    getCommunities,
    apiGetCommunitiesLoading,
    apiGetCommunities,

    /* Category Details Screen Apis */
    getCommunitiesSlug,
    apiGetCommunitiesSlugLoading,
    apiGetCommunitiesSlug,

    /* Choose Plan Screen Apis */
    getPlansPublic,
    apiGetCommunitiesPlansLoading,
    apiGetCommunitiesPlans,

    /* My Communities Screen Apis */
    getUserData,
    apiGetUserDataLoading,
    apiGetUserData,

    /* Community Courses Screen Apis */
    getCommunityCourses,
    apiGetCommunityCoursesLoading,
    apiGetCommunityCourses,
  };
};

export default useUserApi;
