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
};
