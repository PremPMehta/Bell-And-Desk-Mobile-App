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
  apiCreateCourseLoading: 'apiCreateCourseLoading',
  apiCreateCourse: 'apiCreateCourse',
  apiDeleteCourseLoading: 'apiDeleteCourseLoading',
  apiDeleteCourse: 'apiDeleteCourse',
  apiUpdateCourseLoading: 'apiUpdateCourseLoading',
  apiUpdateCourse: 'apiUpdateCourse',

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

  // Coupons Apis
  apiGetCouponsLoading: 'apiGetCouponsLoading',
  apiGetCoupons: 'apiGetCoupons',
  apiCreateCouponLoading: 'apiCreateCouponLoading',
  apiCreateCoupon: 'apiCreateCoupon',
  apiUpdateCouponLoading: 'apiUpdateCouponLoading',
  apiUpdateCoupon: 'apiUpdateCoupon',
  apiDeleteCouponLoading: 'apiDeleteCouponLoading',
  apiDeleteCoupon: 'apiDeleteCoupon',
  apiGetCouponHistoryLoading: 'apiGetCouponHistoryLoading',
  apiGetCouponHistory: 'apiGetCouponHistory',
  apiGetAvailableCouponsLoading: 'apiGetAvailableCouponsLoading',
  apiGetAvailableCoupons: 'apiGetAvailableCoupons',
  apiValidateCouponLoading: 'apiValidateCouponLoading',
  apiValidateCoupon: 'apiValidateCoupon',
  apiGetSubscriptionSettingsLoading: 'apiGetSubscriptionSettingsLoading',
  apiGetSubscriptionSettings: 'apiGetSubscriptionSettings',
  apiUpdateSubscriptionSettingsLoading: 'apiUpdateSubscriptionSettingsLoading',
  apiGetSubscriptionCheckLoading: 'apiGetSubscriptionCheckLoading',
  apiGetSubscriptionCheck: 'apiGetSubscriptionCheck',
  apiGetSubscriptionDetailsLoading: 'apiGetSubscriptionDetailsLoading',
  apiGetSubscriptionDetails: 'apiGetSubscriptionDetails',

  // Member Auto Approve
  apiUpdateMemberAutoApproveLoading: 'apiUpdateMemberAutoApproveLoading',
  apiUpdateMemberAutoApprove: 'apiUpdateMemberAutoApprove',
  apiGetMemberAutoApproveLoading: 'apiGetMemberAutoApproveLoading',
  apiGetMemberAutoApprove: 'apiGetMemberAutoApprove',

  // Member Transactions
  apiGetMemberTransactionsLoading: 'apiGetMemberTransactionsLoading',
  apiGetMemberTransactions: 'apiGetMemberTransactions',

  // One-Time Payment Settings
  apiGetOneTimePaymentSettingsLoading: 'apiGetOneTimePaymentSettingsLoading',
  apiGetOneTimePaymentSettings: 'apiGetOneTimePaymentSettings',

  // Stripe Connect
  apiGetStripeAccountStatusLoading: 'apiGetStripeAccountStatusLoading',
  apiGetStripeAccountStatus: 'apiGetStripeAccountStatus',
  apiGetStripePayoutsLoading: 'apiGetStripePayoutsLoading',
  apiGetStripePayouts: 'apiGetStripePayouts',
  apiCreateStripeConnectAccountLoading: 'apiCreateStripeConnectAccountLoading',
  apiUnlinkStripeAccountLoading: 'apiUnlinkStripeAccountLoading',

  // Billing
  apiGetOwnerDashboardBillingLoading: 'apiGetOwnerDashboardBillingLoading',
  apiGetOwnerDashboardBilling: 'apiGetOwnerDashboardBilling',

  // Blogs
  apiGetBlogsLoading: 'apiGetBlogsLoading',
  apiGetBlogs: 'apiGetBlogs',
  apiGetBlogDetailsLoading: 'apiGetBlogDetailsLoading',
  apiGetBlogDetails: 'apiGetBlogDetails',

  // Referral Code
  apiGetReferralCodeLoading: 'apiGetReferralCodeLoading',
  apiGetReferralCode: 'apiGetReferralCode',
  apiGetReferralBalanceLoading: 'apiGetReferralBalanceLoading',
  apiGetReferralBalance: 'apiGetReferralBalance',

  // Leave Community
  apiLeaveCommunityLoading: 'apiLeaveCommunityLoading',

  // Join Community
  apiJoinCommunityLoading: 'apiJoinCommunityLoading',
  apiJoinCommunity: 'apiJoinCommunity',

  // User Access Requests
  apiGetUserAccessRequestsLoading: 'apiGetUserAccessRequestsLoading',
  apiGetUserAccessRequests: 'apiGetUserAccessRequests',

  // Community Access Requests Actions
  apiApproveAccessRequestLoading: 'apiApproveAccessRequestLoading',
  apiRejectAccessRequestLoading: 'apiRejectAccessRequestLoading',
  apiUpdateMemberStatusLoading: 'apiUpdateMemberStatusLoading',

  // Update Community
  apiUpdateCommunityLoading: 'apiUpdateCommunityLoading',
  apiUpdateCommunity: 'apiUpdateCommunity',

  // Upload Community Media
  apiUploadCommunityMediaLoading: 'apiUploadCommunityMediaLoading',
  apiUploadCommunityMedia: 'apiUploadCommunityMedia',

  // Create Community
  apiCreateCommunityLoading: 'apiCreateCommunityLoading',
  apiCreateCommunity: 'apiCreateCommunity',

  // Check Community Slug
  apiCheckCommunitySlugLoading: 'apiCheckCommunitySlugLoading',
  apiCheckCommunitySlug: 'apiCheckCommunitySlug',

  // Video Bank
  apiGetVideoBankLoading: 'apiGetVideoBankLoading',
  apiGetVideoBank: 'apiGetVideoBank',
  apiDeleteVideoBankItemLoading: 'apiDeleteVideoBankItemLoading',
  apiDeleteVideoBankItem: 'apiDeleteVideoBankItem',
  apiUpdateVideoBankItemLoading: 'apiUpdateVideoBankItemLoading',
  apiUpdateVideoBankItem: 'apiUpdateVideoBankItem',
  apiAddVideoBankItemLoading: 'apiAddVideoBankItemLoading',
  apiAddVideoBankItem: 'apiAddVideoBankItem',

  // Upload PDF
  apiUploadPdfLoading: 'apiUploadPdfLoading',
  apiUploadPdf: 'apiUploadPdf',
};
