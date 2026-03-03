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

  /* Category Details Screen */
  apiGetCommunitiesSlugLoading: 'apiGetCommunitiesSlugLoading',
  apiGetCommunitiesSlug: 'apiGetCommunitiesSlug',

  /* Choose Plan Screen */
  apiGetCommunitiesPlansLoading: 'apiGetCommunitiesPlansLoading',
  apiGetCommunitiesPlans: 'apiGetCommunitiesPlans',

  /* My Communities Screen */
  apiGetUserDataLoading: 'apiGetUserDataLoading',
  apiGetUserData: 'apiGetUserData',

  /* Community Courses Screen */
  apiGetCommunityCoursesLoading: 'apiGetCommunityCoursesLoading',
  apiGetCommunityCourses: 'apiGetCommunityCourses',

  /* Community Board Screen */
  apiGetSocialFeedCategoriesLoading: 'apiGetSocialFeedCategoriesLoading',
  apiGetSocialFeedCategories: 'apiGetSocialFeedCategories',

  apiCreateSocialFeedCategoryLoading: 'apiCreateSocialFeedCategoryLoading',
  apiCreateSocialFeedCategory: 'apiCreateSocialFeedCategory',

  apiUpdateSocialFeedCategoryLoading: 'apiUpdateSocialFeedCategoryLoading',
  apiUpdateSocialFeedCategory: 'apiUpdateSocialFeedCategory',

  apiDeleteSocialFeedCategoryLoading: 'apiDeleteSocialFeedCategoryLoading',
  apiDeleteSocialFeedCategory: 'apiDeleteSocialFeedCategory',

  apiGetSocialFeedsLoading: 'apiGetSocialFeedsLoading',
  apiGetSocialFeeds: 'apiGetSocialFeeds',

  apiCreateSocialFeedLoading: 'apiCreateSocialFeedLoading',
  apiCreateSocialFeed: 'apiCreateSocialFeed',
  apiUpdateSocialFeedLoading: 'apiUpdateSocialFeedLoading',
  apiUpdateSocialFeed: 'apiUpdateSocialFeed',
  apiDeleteSocialFeedLoading: 'apiDeleteSocialFeedLoading',
  apiDeleteSocialFeed: 'apiDeleteSocialFeed',
  apiVoteOnPollLoading: 'apiVoteOnPollLoading',
  apiVoteOnPoll: 'apiVoteOnPoll',
  refreshSocialFeeds: 'refreshSocialFeeds',
};
