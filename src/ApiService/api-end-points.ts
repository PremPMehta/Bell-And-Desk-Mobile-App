export const ApiEndPoints = {
  // Auth
  unifiedLogin: 'auth/unified-login',
  unifiedSignup: 'auth/unified-signup',
  userData: 'auth/user-data',
  forgotPassword: 'auth/forgot-password',
  updateUserProfile: 'auth/update-profile',

  /* Home Screen */

  // Site-Settings
  siteSettings: 'site-settings',

  // Communities
  communities: 'communities',

  /* Category Details Screen */

  communitiesSlug: 'communities/slug',

  /* Choose Plan Screen */

  plansPublic: 'plans/public',

  /* Community Courses Screen */

  communityCourses: 'courses',
  courseDetails: 'courses/:courseId',

  /* Community Board Screen */

  socialFeedCategories: 'social-feed/categories',
  socialFeeds: 'social-feed',
  communityMembers: 'communities/:communityId/members',
  communityMembersExport: 'communities/:communityId/members/export',
  communityAccessRequests: 'communities/:communityId/access-requests',

  /* Community Settings Screen */
  // Moderators Tab
  communityModerators: 'community-moderators/community/:communityId',
  availableMembers:
    'community-moderators/community/:communityId/available-members',
  addModerator: 'community-moderators',
  deleteModerator: 'community-moderators/:moderatorId',
  updateModerator: 'community-moderators/:moderatorId',

  // Referral Settings
  referralSettings: 'referrals/admin/settings/:communityId',

  // Coupons
  coupons: 'coupons/:slug',
  couponHistory: 'coupons/:slug/:couponId/history',
  availableCoupons: 'coupons/:slug/available',
  validateCoupon: 'coupons/:slug/validate',

  // Subscription Settings
  subscriptionSettings: 'stripe/community/subscription-settings/:slug',
  subscriptionSettingsPublic:
    'stripe/community/subscription-settings/:slug/public',

  // Member Auto Approve
  memberAutoApprove: 'communities/member-auto-approve/:slug',

  // Member Transactions
  memberTransactions: 'transactions/community/:slug',

  // One-Time Payment Settings
  oneTimePaymentSettings:
    'stripe/community/one-time-payment-settings/:slug/public',

  // Stripe Connect
  stripeAccountStatus: 'stripe/connect/get-account-status/:slug',
  stripePayouts: 'stripe/connect/payouts/:slug',
  createConnectAccount: 'stripe/connect/create-account/:slug',
  unlinkConnectAccount: 'stripe/connect/unlink-account/:slug',

  // Billing
  ownerDashboardBilling: 'billing/owner-dashboard/:slug',

  // Blogs
  blogs: 'blogs',
  blogDetails: 'blogs/:slug',
};
