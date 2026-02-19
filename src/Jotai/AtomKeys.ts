import { api } from '@/ApiService';

export const AtomKeys = {
  appTheme: 'app-theme',
  userInfo: 'user-info',
  authToken: 'auth-token',
  userRole: 'user-role',
  appLanguage: 'app-language',

  // Auth
  apiUnifiedLoginLoading: 'apiUnifiedLoginLoading',
  apiUnifiedLogin: 'apiUnifiedLogin',

  apiUnifiedSignupLoading: 'apiUnifiedSignupLoading',
  apiUnifiedSignup: 'apiUnifiedSignup',

  apiForgotPasswordLoading: 'apiForgotPasswordLoading',
  apiForgotPassword: 'apiForgotPassword',

  apiUpdateUserProfileLoading: 'apiUpdateUserProfileLoading',
  apiUpdateUserProfile: 'apiUpdateUserProfile',

  /* Home Screen */

  // Site-Settings
  apiGetSiteSettingsLoading: 'apiGetSiteSettingsLoading',
  apiGetSiteSettings: 'apiGetSiteSettings',

  // Communities
  apiGetCommunitiesLoading: 'apiGetCommunitiesLoading',
  apiGetCommunities: 'apiGetCommunities',
};
