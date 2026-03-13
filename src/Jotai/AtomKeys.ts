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

  apiGetCourseDetailsLoading: 'apiGetCourseDetailsLoading',
  apiGetCourseDetails: 'apiGetCourseDetails',

  /* Community Board Screen */
  // Get Social Feed Categories
  apiGetSocialFeedCategoriesLoading: 'apiGetSocialFeedCategoriesLoading',
  apiGetSocialFeedCategories: 'apiGetSocialFeedCategories',

  // Create Social Feed Category
  apiCreateSocialFeedCategoryLoading: 'apiCreateSocialFeedCategoryLoading',
  apiCreateSocialFeedCategory: 'apiCreateSocialFeedCategory',

  // Update Social Feed Category
  apiUpdateSocialFeedCategoryLoading: 'apiUpdateSocialFeedCategoryLoading',
  apiUpdateSocialFeedCategory: 'apiUpdateSocialFeedCategory',

  // Delete Social Feed Category
  apiDeleteSocialFeedCategoryLoading: 'apiDeleteSocialFeedCategoryLoading',
  apiDeleteSocialFeedCategory: 'apiDeleteSocialFeedCategory',

  // Get Social Feeds
  apiGetSocialFeedsLoading: 'apiGetSocialFeedsLoading',
  apiGetSocialFeeds: 'apiGetSocialFeeds',

  // Create Social Feed
  apiCreateSocialFeedLoading: 'apiCreateSocialFeedLoading',
  apiCreateSocialFeed: 'apiCreateSocialFeed',

  // Update Social Feed
  apiUpdateSocialFeedLoading: 'apiUpdateSocialFeedLoading',
  apiUpdateSocialFeed: 'apiUpdateSocialFeed',

  // Delete Social Feed
  apiDeleteSocialFeedLoading: 'apiDeleteSocialFeedLoading',
  apiDeleteSocialFeed: 'apiDeleteSocialFeed',

  // Vote on Polls Post
  apiVoteOnPollLoading: 'apiVoteOnPollLoading',
  apiVoteOnPoll: 'apiVoteOnPoll',

  // Like Post
  apiLikePostLoading: 'apiLikePostLoading',
  apiLikePost: 'apiLikePost',

  // Refresh Social Feeds
  refreshSocialFeeds: 'refreshSocialFeeds',

  // Community Members
  apiGetCommunityMembersLoading: 'apiGetCommunityMembersLoading',
  apiGetCommunityMembers: 'apiGetCommunityMembers',
  apiExportCommunityMembersLoading: 'apiExportCommunityMembersLoading',
  apiGetCommunityAccessRequestsLoading: 'apiGetCommunityAccessRequestsLoading',
  apiGetCommunityAccessRequests: 'apiGetCommunityAccessRequests',
  apiGetCommunityModeratorsLoading: 'apiGetCommunityModeratorsLoading',
  apiGetCommunityModerators: 'apiGetCommunityModerators',
  apiGetAvailableMembersLoading: 'apiGetAvailableMembersLoading',
  apiGetAvailableMembers: 'apiGetAvailableMembers',
  apiAddModeratorLoading: 'apiAddModeratorLoading',
  apiAddModerator: 'apiAddModerator',
  apiDeleteModeratorLoading: 'apiDeleteModeratorLoading',
  apiDeleteModerator: 'apiDeleteModerator',
  apiUpdateModeratorLoading: 'apiUpdateModeratorLoading',
  apiUpdateModerator: 'apiUpdateModerator',

  // Referral Settings
  apiGetReferralSettingsLoading: 'apiGetReferralSettingsLoading',
  apiGetReferralSettings: 'apiGetReferralSettings',
  apiUpdateReferralSettingsLoading: 'apiUpdateReferralSettingsLoading',
};
