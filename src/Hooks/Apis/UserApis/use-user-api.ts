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
  const [userToken] = useAtom(userTokenAtom);
  const [user]: [any, any] = useAtom(userAtom);
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

  // Get Course Details Apis
  const [apiGetCourseDetailsLoading, setApiGetCourseDetailsLoading] = useAtom(
    booleanDefaultFalseAtomFamily(AtomKeys.apiGetCourseDetailsLoading),
  );
  const [apiGetCourseDetails, setApiGetCourseDetails] = useAtom(
    objectAtomFamily(AtomKeys.apiGetCourseDetails),
  );

  // Create Course Apis
  const [apiCreateCourseLoading, setApiCreateCourseLoading] = useAtom(
    booleanDefaultFalseAtomFamily(AtomKeys.apiCreateCourseLoading),
  );
  const [apiCreateCourse, setApiCreateCourse] = useAtom(
    objectAtomFamily(AtomKeys.apiCreateCourse),
  );

  // Delete Course Apis
  const [apiDeleteCourseLoading, setApiDeleteCourseLoading] = useAtom(
    booleanDefaultFalseAtomFamily(AtomKeys.apiDeleteCourseLoading),
  );
  const [apiDeleteCourse, setApiDeleteCourse] = useAtom(
    objectAtomFamily(AtomKeys.apiDeleteCourse),
  );

  // Update Course Apis
  const [apiUpdateCourseLoading, setApiUpdateCourseLoading] = useAtom(
    booleanDefaultFalseAtomFamily(AtomKeys.apiUpdateCourseLoading),
  );
  const [apiUpdateCourse, setApiUpdateCourse] = useAtom(
    objectAtomFamily(AtomKeys.apiUpdateCourse),
  );

  // Get Community Board Apis
  const [
    apiGetSocialFeedCategoriesLoading,
    setApiGetSocialFeedCategoriesLoading,
  ] = useAtom(
    booleanDefaultFalseAtomFamily(AtomKeys.apiGetSocialFeedCategoriesLoading),
  );
  const [apiGetSocialFeedCategories, setApiGetSocialFeedCategories] = useAtom(
    objectAtomFamily(AtomKeys.apiGetSocialFeedCategories),
  );

  // Create Social Feed Category Apis
  const [
    apiCreateSocialFeedCategoryLoading,
    setApiCreateSocialFeedCategoryLoading,
  ] = useAtom(
    booleanDefaultFalseAtomFamily(AtomKeys.apiCreateSocialFeedCategoryLoading),
  );
  const [apiCreateSocialFeedCategory, setApiCreateSocialFeedCategory] = useAtom(
    objectAtomFamily(AtomKeys.apiCreateSocialFeedCategory),
  );

  // Update Social Feed Category Apis
  const [
    apiUpdateSocialFeedCategoryLoading,
    setApiUpdateSocialFeedCategoryLoading,
  ] = useAtom(
    booleanDefaultFalseAtomFamily(AtomKeys.apiUpdateSocialFeedCategoryLoading),
  );
  const [apiUpdateSocialFeedCategory, setApiUpdateSocialFeedCategory] = useAtom(
    objectAtomFamily(AtomKeys.apiUpdateSocialFeedCategory),
  );

  // Delete Social Feed Category Apis
  const [
    apiDeleteSocialFeedCategoryLoading,
    setApiDeleteSocialFeedCategoryLoading,
  ] = useAtom(
    booleanDefaultFalseAtomFamily(AtomKeys.apiDeleteSocialFeedCategoryLoading),
  );
  const [apiDeleteSocialFeedCategory, setApiDeleteSocialFeedCategory] = useAtom(
    objectAtomFamily(AtomKeys.apiDeleteSocialFeedCategory),
  );

  // Get Social Feeds Apis
  const [apiGetSocialFeedsLoading, setApiGetSocialFeedsLoading] = useAtom(
    booleanDefaultFalseAtomFamily(AtomKeys.apiGetSocialFeedsLoading),
  );
  const [apiGetSocialFeeds, setApiGetSocialFeeds] = useAtom(
    objectAtomFamily(AtomKeys.apiGetSocialFeeds),
  );

  // Create Community Board Posts
  const [apiCreateSocialFeedLoading, setApiCreateSocialFeedLoading] = useAtom(
    booleanDefaultFalseAtomFamily(AtomKeys.apiCreateSocialFeedLoading),
  );
  const [apiCreateSocialFeed, setApiCreateSocialFeed] = useAtom(
    objectAtomFamily(AtomKeys.apiCreateSocialFeed),
  );

  // Update Community Board Post Apis
  const [apiUpdateSocialFeedLoading, setApiUpdateSocialFeedLoading] = useAtom(
    booleanDefaultFalseAtomFamily(AtomKeys.apiUpdateSocialFeedLoading),
  );
  const [apiUpdateSocialFeed, setApiUpdateSocialFeed] = useAtom(
    objectAtomFamily(AtomKeys.apiUpdateSocialFeed),
  );

  // Delete Community Board Post Apis
  const [apiDeleteSocialFeedLoading, setApiDeleteSocialFeedLoading] = useAtom(
    booleanDefaultFalseAtomFamily(AtomKeys.apiDeleteSocialFeedLoading),
  );
  const [apiDeleteSocialFeed, setApiDeleteSocialFeed] = useAtom(
    objectAtomFamily(AtomKeys.apiDeleteSocialFeed),
  );

  // Vote on Poll Post Apis
  const [apiVoteOnPollLoading, setApiVoteOnPollLoading] = useAtom(
    booleanDefaultFalseAtomFamily(AtomKeys.apiVoteOnPollLoading),
  );
  const [apiVoteOnPoll, setApiVoteOnPoll] = useAtom(
    objectAtomFamily(AtomKeys.apiVoteOnPoll),
  );

  // Export Community Members Apis
  const [
    apiExportCommunityMembersLoading,
    setApiExportCommunityMembersLoading,
  ] = useAtom(
    booleanDefaultFalseAtomFamily(AtomKeys.apiExportCommunityMembersLoading),
  );

  // Like Post Apis
  const [apiLikePostLoading, setApiLikePostLoading] = useAtom(
    booleanDefaultFalseAtomFamily(AtomKeys.apiLikePostLoading),
  );
  const [apiLikePost, setApiLikePost] = useAtom(
    objectAtomFamily(AtomKeys.apiLikePost),
  );

  // Get Community Members Apis
  const [apiGetCommunityMembersLoading, setApiGetCommunityMembersLoading] =
    useAtom(
      booleanDefaultFalseAtomFamily(AtomKeys.apiGetCommunityMembersLoading),
    );
  const [apiGetCommunityMembers, setApiGetCommunityMembers] = useAtom(
    objectAtomFamily(AtomKeys.apiGetCommunityMembers),
  );

  // Get Community Access Requests Apis
  const [
    apiGetCommunityAccessRequestsLoading,
    setApiGetCommunityAccessRequestsLoading,
  ] = useAtom(
    booleanDefaultFalseAtomFamily(
      AtomKeys.apiGetCommunityAccessRequestsLoading,
    ),
  );
  const [apiGetCommunityAccessRequests, setApiGetCommunityAccessRequests] =
    useAtom(objectAtomFamily(AtomKeys.apiGetCommunityAccessRequests));

  // Community Access Requests Actions Apis
  const [apiApproveAccessRequestLoading, setApiApproveAccessRequestLoading] =
    useAtom(
      booleanDefaultFalseAtomFamily(AtomKeys.apiApproveAccessRequestLoading),
    );
  const [apiRejectAccessRequestLoading, setApiRejectAccessRequestLoading] =
    useAtom(
      booleanDefaultFalseAtomFamily(AtomKeys.apiRejectAccessRequestLoading),
    );
  const [apiUpdateMemberStatusLoading, setApiUpdateMemberStatusLoading] =
    useAtom(
      booleanDefaultFalseAtomFamily(AtomKeys.apiUpdateMemberStatusLoading),
    );

  // Get Community Moderators Apis
  const [
    apiGetCommunityModeratorsLoading,
    setApiGetCommunityModeratorsLoading,
  ] = useAtom(
    booleanDefaultFalseAtomFamily(AtomKeys.apiGetCommunityModeratorsLoading),
  );
  const [apiGetCommunityModerators, setApiGetCommunityModerators] = useAtom(
    objectAtomFamily(AtomKeys.apiGetCommunityModerators),
  );

  // Get Community Available Members Apis
  const [apiGetAvailableMembersLoading, setApiGetAvailableMembersLoading] =
    useAtom(
      booleanDefaultFalseAtomFamily(AtomKeys.apiGetAvailableMembersLoading),
    );
  const [apiGetAvailableMembers, setApiGetAvailableMembers] = useAtom(
    objectAtomFamily(AtomKeys.apiGetAvailableMembers),
  );

  // Add Moderator Apis
  const [apiAddModeratorLoading, setApiAddModeratorLoading] = useAtom(
    booleanDefaultFalseAtomFamily(AtomKeys.apiAddModeratorLoading),
  );
  const [apiAddModerator, setApiAddModerator] = useAtom(
    objectAtomFamily(AtomKeys.apiAddModerator),
  );

  // Delete Moderator Apis
  const [apiDeleteModeratorLoading, setApiDeleteModeratorLoading] = useAtom(
    booleanDefaultFalseAtomFamily(AtomKeys.apiDeleteModeratorLoading),
  );
  const [apiDeleteModerator, setApiDeleteModerator] = useAtom(
    objectAtomFamily(AtomKeys.apiDeleteModerator),
  );

  // Update Moderator Apis
  const [apiUpdateModeratorLoading, setApiUpdateModeratorLoading] = useAtom(
    booleanDefaultFalseAtomFamily(AtomKeys.apiUpdateModeratorLoading),
  );
  const [apiUpdateModerator, setApiUpdateModerator] = useAtom(
    objectAtomFamily(AtomKeys.apiUpdateModerator),
  );

  // Referral Settings Apis
  const [apiGetReferralSettingsLoading, setApiGetReferralSettingsLoading] =
    useAtom(
      booleanDefaultFalseAtomFamily(AtomKeys.apiGetReferralSettingsLoading),
    );
  const [apiGetReferralSettings, setApiGetReferralSettings] = useAtom(
    objectAtomFamily(AtomKeys.apiGetReferralSettings),
  );
  const [
    apiUpdateReferralSettingsLoading,
    setApiUpdateReferralSettingsLoading,
  ] = useAtom(
    booleanDefaultFalseAtomFamily(AtomKeys.apiUpdateReferralSettingsLoading),
  );

  // Referral Code Apis
  const [apiGetReferralCodeLoading, setApiGetReferralCodeLoading] = useAtom(
    booleanDefaultFalseAtomFamily(AtomKeys.apiGetReferralCodeLoading),
  );
  const [apiGetReferralCode, setApiGetReferralCode] = useAtom(
    objectAtomFamily(AtomKeys.apiGetReferralCode),
  );

  // Leave Community Api
  const [apiLeaveCommunityLoading, setApiLeaveCommunityLoading] = useAtom(
    booleanDefaultFalseAtomFamily(AtomKeys.apiLeaveCommunityLoading),
  );

  // Join Community Api
  const [apiJoinCommunityLoading, setApiJoinCommunityLoading] = useAtom(
    booleanDefaultFalseAtomFamily(AtomKeys.apiJoinCommunityLoading),
  );
  const [apiJoinCommunity, setApiJoinCommunity] = useAtom(
    objectAtomFamily(AtomKeys.apiJoinCommunity),
  );

  // User Access Requests Api
  const [apiGetUserAccessRequestsLoading, setApiGetUserAccessRequestsLoading] =
    useAtom(
      booleanDefaultFalseAtomFamily(AtomKeys.apiGetUserAccessRequestsLoading),
    );
  const [apiGetUserAccessRequests, setApiGetUserAccessRequests] = useAtom(
    objectAtomFamily(AtomKeys.apiGetUserAccessRequests),
  );

  // Coupons Apis
  const [apiGetCouponsLoading, setApiGetCouponsLoading] = useAtom(
    booleanDefaultFalseAtomFamily(AtomKeys.apiGetCouponsLoading),
  );
  const [apiGetCoupons, setApiGetCoupons] = useAtom(
    objectAtomFamily(AtomKeys.apiGetCoupons),
  );

  // Create Coupon Apis
  const [apiCreateCouponLoading, setApiCreateCouponLoading] = useAtom(
    booleanDefaultFalseAtomFamily(AtomKeys.apiCreateCouponLoading),
  );
  const [apiCreateCoupon, setApiCreateCoupon] = useAtom(
    objectAtomFamily(AtomKeys.apiCreateCoupon),
  );

  // Update Coupon Apis
  const [apiUpdateCouponLoading, setApiUpdateCouponLoading] = useAtom(
    booleanDefaultFalseAtomFamily(AtomKeys.apiUpdateCouponLoading),
  );
  const [apiUpdateCoupon, setApiUpdateCoupon] = useAtom(
    objectAtomFamily(AtomKeys.apiUpdateCoupon),
  );

  // Delete Coupon Apis
  const [apiDeleteCouponLoading, setApiDeleteCouponLoading] = useAtom(
    booleanDefaultFalseAtomFamily(AtomKeys.apiDeleteCouponLoading),
  );
  const [apiDeleteCoupon, setApiDeleteCoupon] = useAtom(
    objectAtomFamily(AtomKeys.apiDeleteCoupon),
  );

  // Get Coupon History Apis
  const [apiGetCouponHistoryLoading, setApiGetCouponHistoryLoading] = useAtom(
    booleanDefaultFalseAtomFamily(AtomKeys.apiGetCouponHistoryLoading),
  );
  const [apiGetCouponHistory, setApiGetCouponHistory] = useAtom(
    objectAtomFamily(AtomKeys.apiGetCouponHistory),
  );

  // Get Available Coupons (public – member side)
  const [apiGetAvailableCouponsLoading, setApiGetAvailableCouponsLoading] =
    useAtom(
      booleanDefaultFalseAtomFamily(AtomKeys.apiGetAvailableCouponsLoading),
    );
  const [apiGetAvailableCoupons, setApiGetAvailableCoupons] = useAtom(
    objectAtomFamily(AtomKeys.apiGetAvailableCoupons),
  );

  // Validate Coupon Apis
  const [apiValidateCouponLoading, setApiValidateCouponLoading] = useAtom(
    booleanDefaultFalseAtomFamily(AtomKeys.apiValidateCouponLoading),
  );
  const [apiValidateCoupon, setApiValidateCoupon] = useAtom(
    objectAtomFamily(AtomKeys.apiValidateCoupon),
  );

  // Get Subscription Settings Apis
  const [
    apiGetSubscriptionSettingsLoading,
    setApiGetSubscriptionSettingsLoading,
  ] = useAtom(
    booleanDefaultFalseAtomFamily(AtomKeys.apiGetSubscriptionSettingsLoading),
  );
  const [apiGetSubscriptionSettings, setApiGetSubscriptionSettings] = useAtom(
    objectAtomFamily(AtomKeys.apiGetSubscriptionSettings),
  );
  const [
    apiUpdateSubscriptionSettingsLoading,
    setApiUpdateSubscriptionSettingsLoading,
  ] = useAtom(
    booleanDefaultFalseAtomFamily(
      AtomKeys.apiUpdateSubscriptionSettingsLoading,
    ),
  );
  const [
    apiCreateStripeConnectAccountLoading,
    setApiCreateStripeConnectAccountLoading,
  ] = useAtom(
    booleanDefaultFalseAtomFamily(
      AtomKeys.apiCreateStripeConnectAccountLoading,
    ),
  );

  // Get One-Time Payment Settings
  const [
    apiGetOneTimePaymentSettingsLoading,
    setApiGetOneTimePaymentSettingsLoading,
  ] = useAtom(
    booleanDefaultFalseAtomFamily(AtomKeys.apiGetOneTimePaymentSettingsLoading),
  );
  const [apiGetOneTimePaymentSettings, setApiGetOneTimePaymentSettings] =
    useAtom(objectAtomFamily(AtomKeys.apiGetOneTimePaymentSettings));

  // Unlink Stripe Account Apis
  const [apiUnlinkStripeAccountLoading, setApiUnlinkStripeAccountLoading] =
    useAtom(
      booleanDefaultFalseAtomFamily(AtomKeys.apiUnlinkStripeAccountLoading),
    );

  // Get Member Auto Approve
  const [apiGetMemberAutoApproveLoading, setApiGetMemberAutoApproveLoading] =
    useAtom(
      booleanDefaultFalseAtomFamily(AtomKeys.apiGetMemberAutoApproveLoading),
    );
  const [apiGetMemberAutoApprove, setApiGetMemberAutoApprove] = useAtom(
    objectAtomFamily(AtomKeys.apiGetMemberAutoApprove),
  );

  // Member Auto Approve Apis
  const [
    apiUpdateMemberAutoApproveLoading,
    setApiUpdateMemberAutoApproveLoading,
  ] = useAtom(
    booleanDefaultFalseAtomFamily(AtomKeys.apiUpdateMemberAutoApproveLoading),
  );
  const [apiUpdateMemberAutoApprove, setApiUpdateMemberAutoApprove] = useAtom(
    objectAtomFamily(AtomKeys.apiUpdateMemberAutoApprove),
  );

  // Member Transactions Apis
  const [apiGetMemberTransactionsLoading, setApiGetMemberTransactionsLoading] =
    useAtom(
      booleanDefaultFalseAtomFamily(AtomKeys.apiGetMemberTransactionsLoading),
    );
  const [apiGetMemberTransactions, setApiGetMemberTransactions] = useAtom(
    objectAtomFamily(AtomKeys.apiGetMemberTransactions),
  );

  // Stripe Account Status Apis
  const [
    apiGetStripeAccountStatusLoading,
    setApiGetStripeAccountStatusLoading,
  ] = useAtom(
    booleanDefaultFalseAtomFamily(AtomKeys.apiGetStripeAccountStatusLoading),
  );
  const [apiGetStripeAccountStatus, setApiGetStripeAccountStatus] = useAtom(
    objectAtomFamily(AtomKeys.apiGetStripeAccountStatus),
  );

  // Stripe Payouts Apis
  const [apiGetStripePayoutsLoading, setApiGetStripePayoutsLoading] = useAtom(
    booleanDefaultFalseAtomFamily(AtomKeys.apiGetStripePayoutsLoading),
  );
  const [apiGetStripePayouts, setApiGetStripePayouts] = useAtom(
    objectAtomFamily(AtomKeys.apiGetStripePayouts),
  );

  // Billing
  const [
    apiGetOwnerDashboardBillingLoading,
    setApiGetOwnerDashboardBillingLoading,
  ] = useAtom(
    booleanDefaultFalseAtomFamily(AtomKeys.apiGetOwnerDashboardBillingLoading),
  );
  const [apiGetOwnerDashboardBilling, setApiGetOwnerDashboardBilling] = useAtom(
    objectAtomFamily(AtomKeys.apiGetOwnerDashboardBilling),
  );

  // Blogs
  const [apiGetBlogsLoading, setApiGetBlogsLoading] = useAtom(
    booleanDefaultFalseAtomFamily(AtomKeys.apiGetBlogsLoading),
  );
  const [apiGetBlogs, setApiGetBlogs] = useAtom(
    objectAtomFamily(AtomKeys.apiGetBlogs),
  );
  const [apiGetBlogDetailsLoading, setApiGetBlogDetailsLoading] = useAtom(
    booleanDefaultFalseAtomFamily(AtomKeys.apiGetBlogDetailsLoading),
  );
  const [apiGetBlogDetails, setApiGetBlogDetails] = useAtom(
    objectAtomFamily(AtomKeys.apiGetBlogDetails),
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
      console.log('🚀 ~ getSiteSettings ~ siteSettingsInfo:', siteSettingsInfo);
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

  // Get Course Details
  async function getCourseDetails(courseId: string) {
    try {
      setApiGetCourseDetailsLoading(true);
      const url = ApiEndPoints.courseDetails.replace(':courseId', courseId);
      const courseDetails: any = await api.get(url);
      setApiGetCourseDetails(courseDetails);
      setApiGetCourseDetailsLoading(false);
      return courseDetails;
    } catch (error) {
      console.error('Error fetching course details info:', error);
      setApiGetCourseDetailsLoading(false);
    }
  }

  // Clear Course Details State
  function clearCourseDetails() {
    setApiGetCourseDetails(null);
    setApiGetCourseDetailsLoading(false);
  }

  // Create Course
  async function createCourse(body: any) {
    try {
      setApiCreateCourseLoading(true);
      const res: any = await api.post(ApiEndPoints.communityCourses, body);
      setApiCreateCourse(res);
      setApiCreateCourseLoading(false);
      ToastModule.successTop({
        msg: res?.message || 'Course created successfully!',
      });
      return res;
    } catch (error: any) {
      console.error('Error creating course:', error);
      ToastModule.errorBottom({
        msg: error?.resError?.message || error?.message,
      });
      setApiCreateCourseLoading(false);
    }
  }

  // Delete Course
  async function deleteCourse(courseId: string) {
    try {
      setApiDeleteCourseLoading(true);
      const url = ApiEndPoints.courseDetails.replace(':courseId', courseId);
      const res: any = await api.delete(url);
      setApiDeleteCourse(res);
      setApiDeleteCourseLoading(false);
      ToastModule.successTop({
        msg: res?.message || 'Course deleted successfully!',
      });
      return res;
    } catch (error: any) {
      console.error('Error deleting course:', error);
      ToastModule.errorBottom({
        msg: error?.resError?.message || error?.message,
      });
      setApiDeleteCourseLoading(false);
    }
  }

  // Update Course
  async function updateCourse(id: string, body: any) {
    try {
      setApiUpdateCourseLoading(true);
      const url = ApiEndPoints.courseDetails.replace(':courseId', id);
      const res: any = await api.put(url, body);
      setApiUpdateCourse(res);
      setApiUpdateCourseLoading(false);
      ToastModule.successTop({
        msg: res?.message || 'Course updated successfully!',
      });
      return res;
    } catch (error: any) {
      console.error('Error updating course:', error);
      ToastModule.errorBottom({
        msg: error?.resError?.message || error?.message,
      });
      setApiUpdateCourseLoading(false);
    }
  }

  // Get Social Feed Categories for Community Board Screen
  async function getSocialFeedCategories(query: any) {
    try {
      setApiGetSocialFeedCategoriesLoading(true);
      const socialFeedCategories: any = await api.get(
        ApiEndPoints.socialFeedCategories + query,
      );
      setApiGetSocialFeedCategories(socialFeedCategories);
      setApiGetSocialFeedCategoriesLoading(false);
      return socialFeedCategories;
    } catch (error) {
      console.error('Error fetching social feed categories info:', error);
      setApiGetSocialFeedCategoriesLoading(false);
    }
  }

  // Create Social Feed Category
  async function createSocialFeedCategory(query: any, body: any) {
    console.log('🚀 ~ createSocialFeedCategory ~ query:', query);
    console.log('🚀 ~ createSocialFeedCategory ~ body:', body);

    try {
      setApiCreateSocialFeedCategoryLoading(true);
      const res: any = await api.post(
        ApiEndPoints.socialFeedCategories + query,
        body,
      );
      setApiCreateSocialFeedCategory(res);
      setApiCreateSocialFeedCategoryLoading(false);
      return res;
    } catch (error: any) {
      console.error('Error creating social feed category:', error);
      ToastModule.errorTop({
        msg: error?.resError?.message || error?.message,
      });
      setApiCreateSocialFeedCategoryLoading(false);
    }
  }

  // Update Social Feed Category
  async function updateSocialFeedCategory(id: string, body: any) {
    try {
      setApiUpdateSocialFeedCategoryLoading(true);
      const res: any = await api.put(
        `${ApiEndPoints.socialFeedCategories}/${id}`,
        body,
      );
      setApiUpdateSocialFeedCategory(res);
      setApiUpdateSocialFeedCategoryLoading(false);
      return res;
    } catch (error: any) {
      console.error('Error updating social feed category:', error);
      ToastModule.errorBottom({
        msg: error?.resError?.message || error?.message,
      });
      setApiUpdateSocialFeedCategoryLoading(false);
    }
  }

  // Delete Social Feed Category
  async function deleteSocialFeedCategory(id: string) {
    try {
      setApiDeleteSocialFeedCategoryLoading(true);
      const res: any = await api.delete(
        `${ApiEndPoints.socialFeedCategories}/${id}`,
      );
      setApiDeleteSocialFeedCategory(res);
      setApiDeleteSocialFeedCategoryLoading(false);
      return res;
    } catch (error: any) {
      console.error('Error deleting social feed category:', error);
      ToastModule.errorBottom({
        msg: error?.resError?.message || error?.message,
      });
      setApiDeleteSocialFeedCategoryLoading(false);
    }
  }

  // Get Social Feeds for Community Board Screen
  async function getSocialFeeds(query: any) {
    try {
      setApiGetSocialFeedsLoading(true);
      const socialFeeds: any = await api.get(ApiEndPoints.socialFeeds + query);
      setApiGetSocialFeeds(socialFeeds);
      setApiGetSocialFeedsLoading(false);
      return socialFeeds;
    } catch (error) {
      console.error('Error fetching social feeds info:', error);
      setApiGetSocialFeedsLoading(false);
    }
  }

  // Create Social Feed Post
  async function createSocialFeedPost(query: any, body: any) {
    const header = { 'Content-Type': 'multipart/form-data' };
    try {
      setApiCreateSocialFeedLoading(true);
      const res: any = await api.post(
        ApiEndPoints.socialFeeds + query,
        body,
        header,
      );
      setApiCreateSocialFeed(res);
      setApiCreateSocialFeedLoading(false);
      return res;
    } catch (error: any) {
      console.error('Error creating social feed posts:', error);
      ToastModule.errorTop({
        msg: error?.resError?.message || error?.message,
      });
      setApiCreateSocialFeedLoading(false);
    }
  }

  // Update Social Feed Post
  async function updateSocialFeedPost(id: string, body: any) {
    console.log('🚀 ~ updateSocialFeedPost ~ id:', id);
    console.log('🚀 ~ updateSocialFeedPost ~ body:', body);
    try {
      setApiUpdateSocialFeedLoading(true);
      const res: any = await api.put(`${ApiEndPoints.socialFeeds}/${id}`, body);
      setApiUpdateSocialFeed(res);
      setApiUpdateSocialFeedLoading(false);
      return res;
    } catch (error: any) {
      console.error('Error updating social feed posts:', error);
      ToastModule.errorTop({
        msg: error?.resError?.message || error?.message,
      });
      setApiUpdateSocialFeedLoading(false);
    }
  }

  // Delete Social Feed Post
  async function deleteSocialFeedPost(query: any) {
    try {
      setApiDeleteSocialFeedLoading(true);
      const res: any = await api.delete(ApiEndPoints.socialFeeds + query);
      setApiDeleteSocialFeed(res);
      setApiDeleteSocialFeedLoading(false);
      return res;
    } catch (error: any) {
      console.error('Error deleting social feed posts:', error);
      ToastModule.errorTop({
        msg: error?.resError?.message || error?.message,
      });
      setApiDeleteSocialFeedLoading(false);
    }
  }

  // Vote on Poll
  async function voteOnPoll(postId: string, body: { optionIds: string[] }) {
    try {
      setApiVoteOnPollLoading(true);
      const res: any = await api.post(
        `${ApiEndPoints.socialFeeds}/posts/${postId}/poll/vote`,
        body,
      );
      setApiVoteOnPoll(res);
      setApiVoteOnPollLoading(false);
      return res;
    } catch (error: any) {
      console.error('Error voting on poll:', error);
      ToastModule.errorTop({
        msg: error?.resError?.message || error?.message,
      });
      setApiVoteOnPollLoading(false);
    }
  }

  // Like Post
  async function likePost(postId: string) {
    try {
      setApiLikePostLoading(true);
      const res: any = await api.post(
        `${ApiEndPoints.socialFeeds}/posts/${postId}/like`,
        undefined,
      );
      console.log('🚀 ~ likePost ~ res:', res);
      setApiLikePost(res);
      setApiLikePostLoading(false);
      return res;
    } catch (error: any) {
      console.error('Error liking post:', error);
      ToastModule.errorTop({
        msg: error?.resError?.message || error?.message,
      });
      setApiLikePostLoading(false);
    }
  }

  // Get Community Members
  async function getCommunityMembers(communityId: string, query: string) {
    try {
      setApiGetCommunityMembersLoading(true);
      const url = ApiEndPoints.communityMembers.replace(
        ':communityId',
        communityId,
      );
      const members: any = await api.get(url + query);
      setApiGetCommunityMembers(members);
      setApiGetCommunityMembersLoading(false);
      return members;
    } catch (error: any) {
      console.error('Error fetching community members info:', error);
      ToastModule.errorBottom({
        msg: error?.resError?.message || error?.message,
      });
      setApiGetCommunityMembersLoading(false);
    }
  }

  // Get Community Access Requests
  async function getCommunityAccessRequests(
    communityId: string,
    query: string,
  ) {
    try {
      setApiGetCommunityAccessRequestsLoading(true);
      const url = ApiEndPoints.communityAccessRequests.replace(
        ':communityId',
        communityId,
      );
      const requests: any = await api.get(url + query);
      setApiGetCommunityAccessRequests(requests);
      setApiGetCommunityAccessRequestsLoading(false);
      return requests;
    } catch (error: any) {
      console.error('Error fetching community access requests info:', error);
      ToastModule.errorBottom({
        msg: error?.resError?.message || error?.message,
      });
      setApiGetCommunityAccessRequestsLoading(false);
    }
  }

  // Approve Community Access Request
  async function approveAccessRequest(communityId: string, requestId: string) {
    try {
      setApiApproveAccessRequestLoading(true);
      const url = `${ApiEndPoints.communityAccessRequests.replace(
        ':communityId',
        communityId,
      )}/${requestId}/approve`;
      const res: any = await api.post(url, {});
      console.log('🚀 ~ approveAccessRequest ~ res:', res);
      ToastModule.successTop({
        msg: res?.message || 'Access request approved successfully',
      });
      setApiApproveAccessRequestLoading(false);
      return res;
    } catch (error: any) {
      console.error('Error approving access request:', error);
      ToastModule.errorBottom({
        msg: error?.resError?.message || error?.message,
      });
      setApiApproveAccessRequestLoading(false);
    }
  }

  // Reject Community Access Request
  async function rejectAccessRequest(communityId: string, requestId: string) {
    try {
      setApiRejectAccessRequestLoading(true);
      const url = `${ApiEndPoints.communityAccessRequests.replace(
        ':communityId',
        communityId,
      )}/${requestId}/reject`;
      const res: any = await api.post(url, {});
      console.log('🚀 ~ rejectAccessRequest ~ res:', res);
      ToastModule.successTop({
        msg: res?.message || 'Access request rejected successfully',
      });
      setApiRejectAccessRequestLoading(false);
      return res;
    } catch (error: any) {
      console.error('Error rejecting access request:', error);
      ToastModule.errorBottom({
        msg: error?.resError?.message || error?.message,
      });
      setApiRejectAccessRequestLoading(false);
    }
  }

  // Update Member Status (Ban/Deactivate)
  async function updateMemberStatus(
    communityId: string,
    memberId: string,
    body: any,
  ) {
    try {
      setApiUpdateMemberStatusLoading(true);
      const url = ApiEndPoints.updateMemberStatus
        .replace(':communityId', communityId)
        .replace(':memberId', memberId);
      const res: any = await api.put(url, body);
      ToastModule.successTop({
        msg: res?.message || 'Member status updated successfully!',
      });
      setApiUpdateMemberStatusLoading(false);
      return res;
    } catch (error: any) {
      console.error('Error updating member status:', error);
      ToastModule.errorBottom({
        msg: error?.resError?.message || error?.message,
      });
      setApiUpdateMemberStatusLoading(false);
    }
  }

  // Export Community Members
  async function exportCommunityMembers(communityId: string, query: string) {
    try {
      setApiExportCommunityMembersLoading(true);
      const url = ApiEndPoints.communityMembersExport.replace(
        ':communityId',
        communityId,
      );
      const res: any = await api.get(url + query);
      console.log('🚀 ~ exportCommunityMembers ~ res:', res);
      setApiExportCommunityMembersLoading(false);
      return res;
    } catch (error: any) {
      console.error('Error exporting community members:', error);
      setApiExportCommunityMembersLoading(false);
      ToastModule.errorTop({
        msg: error.resError?.message || error.message,
      });
      return error;
    }
  }

  // Get Community Moderators
  async function getCommunityModerators(communityId: string) {
    try {
      setApiGetCommunityModeratorsLoading(true);
      const url = ApiEndPoints.communityModerators.replace(
        ':communityId',
        communityId,
      );
      const res: any = await api.get(url);
      setApiGetCommunityModerators(res);
      setApiGetCommunityModeratorsLoading(false);
      return res;
    } catch (error: any) {
      console.error('Error fetching community moderators info:', error);
      ToastModule.errorBottom({
        msg: error?.resError?.message || error?.message,
      });
      setApiGetCommunityModeratorsLoading(false);
    }
  }

  // Update Moderator
  async function updateModerator(moderatorId: string, body: any) {
    try {
      setApiUpdateModeratorLoading(true);
      const url = ApiEndPoints.updateModerator.replace(
        ':moderatorId',
        moderatorId,
      );
      const res: any = await api.put(url, body);
      console.log('🚀 ~ updateModerator ~ res:', res);
      ToastModule.successTop({
        msg: res?.message || 'Moderator permissions updated successfully',
      });
      setApiUpdateModerator(res);
      setApiUpdateModeratorLoading(false);
      return res;
    } catch (error: any) {
      console.error('Error updating moderator:', error);
      ToastModule.errorBottom({
        msg: error?.resError?.message || error?.message,
      });
      setApiUpdateModeratorLoading(false);
    }
  }

  // Clear Community Moderators Data
  function clearCommunityModerators() {
    setApiGetCommunityModerators(null);
    setApiGetCommunityModeratorsLoading(false);
  }

  // Get Community Available Members
  async function getAvailableMembers(communityId: string) {
    try {
      setApiGetAvailableMembersLoading(true);
      const url = ApiEndPoints.availableMembers.replace(
        ':communityId',
        communityId,
      );
      const res: any = await api.get(url);
      setApiGetAvailableMembers(res);
      setApiGetAvailableMembersLoading(false);
      return res;
    } catch (error: any) {
      console.error('Error fetching available members info:', error);
      ToastModule.errorBottom({
        msg: error?.resError?.message || error?.message,
      });
      setApiGetAvailableMembersLoading(false);
    }
  }

  // Clear Community Available Members Data
  function clearAvailableMembers() {
    setApiGetAvailableMembers(null);
    setApiGetAvailableMembersLoading(false);
  }

  // Add Moderator
  async function addModerator(body: any) {
    try {
      setApiAddModeratorLoading(true);
      const res: any = await api.post(ApiEndPoints.addModerator, body);
      setApiAddModerator(res);
      setApiAddModeratorLoading(false);
      ToastModule.successTop({
        msg: res?.message || 'Moderator added successfully!',
      });
      return res;
    } catch (error: any) {
      console.error('Error adding moderator:', error);
      ToastModule.errorBottom({
        msg: error?.resError?.message || error?.message,
      });
      setApiAddModeratorLoading(false);
    }
  }

  // Delete Moderator
  async function deleteModerator(moderatorId: string) {
    try {
      setApiDeleteModeratorLoading(true);
      const res: any = await api.delete(
        ApiEndPoints.deleteModerator.replace(':moderatorId', moderatorId),
      );
      setApiDeleteModerator(res);
      setApiDeleteModeratorLoading(false);
      ToastModule.successTop({
        msg: res?.message || 'Moderator removed successfully!',
      });
      return res;
    } catch (error: any) {
      console.error('Error deleting moderator:', error);
      ToastModule.errorBottom({
        msg: error?.resError?.message || error?.message,
      });
      setApiDeleteModeratorLoading(false);
    }
  }

  // Get Referral Settings
  async function getReferralSettings(communityId: string) {
    try {
      setApiGetReferralSettingsLoading(true);
      const url = ApiEndPoints.referralSettings.replace(
        ':communityId',
        communityId,
      );
      const res: any = await api.get(url);
      setApiGetReferralSettings(res);
      setApiGetReferralSettingsLoading(false);
      return res;
    } catch (error: any) {
      console.error('Error fetching referral settings:', error);
      ToastModule.errorBottom({
        msg: error?.resError?.message || error?.message,
      });
      setApiGetReferralSettingsLoading(false);
    }
  }

  // Update Referral Settings
  async function updateReferralSettings(communityId: string, body: any) {
    try {
      setApiUpdateReferralSettingsLoading(true);
      const url = ApiEndPoints.referralSettings.replace(
        ':communityId',
        communityId,
      );
      const res: any = await api.post(url, body);

      // Refetch the settings so that the UI gets the populated member objects (names, emails)
      await getReferralSettings(communityId);

      setApiUpdateReferralSettingsLoading(false);
      ToastModule.successTop({
        msg: res?.message || 'Referral settings updated successfully!',
      });
      return res;
    } catch (error: any) {
      console.error('Error updating referral settings:', error);
      ToastModule.errorBottom({
        msg: error?.resError?.message || error?.message,
      });
      setApiUpdateReferralSettingsLoading(false);
    }
  }

  // Get Coupons
  async function getCoupons(slug: string) {
    try {
      setApiGetCouponsLoading(true);
      const url = ApiEndPoints.coupons.replace(':slug', slug);
      const res: any = await api.get(url);
      setApiGetCoupons(res);
      setApiGetCouponsLoading(false);
      return res;
    } catch (error: any) {
      console.error('Error fetching coupons:', error);
      ToastModule.errorBottom({
        msg: error?.resError?.message || error?.message,
      });
      setApiGetCouponsLoading(false);
    }
  }

  // Create Coupon
  async function createCoupon(slug: string, body: any) {
    try {
      setApiCreateCouponLoading(true);
      const url = ApiEndPoints.coupons.replace(':slug', slug);
      const res: any = await api.post(url, body);
      setApiCreateCoupon(res);
      setApiCreateCouponLoading(false);
      ToastModule.successTop({
        msg: res?.message || 'Coupon created successfully',
      });
      return res;
    } catch (error: any) {
      console.error('Error creating coupon:', error);
      ToastModule.errorBottom({
        msg: error?.resError?.message || error?.message,
      });
      setApiCreateCouponLoading(false);
    }
  }

  // Update Coupon
  async function updateCoupon(slug: string, couponId: string, body: any) {
    try {
      setApiUpdateCouponLoading(true);
      const url = `${ApiEndPoints.coupons.replace(':slug', slug)}/${couponId}`;
      const res: any = await api.put(url, body);
      setApiUpdateCoupon(res);
      setApiUpdateCouponLoading(false);
      ToastModule.successTop({
        msg: res?.message || 'Coupon updated successfully',
      });
      return res;
    } catch (error: any) {
      console.error('Error updating coupon:', error);
      ToastModule.errorBottom({
        msg: error?.resError?.message || error?.message,
      });
      setApiUpdateCouponLoading(false);
    }
  }

  // Delete Coupon
  async function deleteCoupon(slug: string, couponId: string) {
    try {
      setApiDeleteCouponLoading(true);
      const url = `${ApiEndPoints.coupons.replace(':slug', slug)}/${couponId}`;
      const res: any = await api.delete(url);
      setApiDeleteCoupon(res);
      setApiDeleteCouponLoading(false);
      ToastModule.successTop({
        msg: res?.message || 'Coupon deleted successfully',
      });
      return res;
    } catch (error: any) {
      console.error('Error deleting coupon:', error);
      ToastModule.errorBottom({
        msg: error?.resError?.message || error?.message,
      });
      setApiDeleteCouponLoading(false);
    }
  }

  // Get Coupon History
  async function getCouponHistory(slug: string, couponId: string) {
    try {
      setApiGetCouponHistoryLoading(true);
      const url = ApiEndPoints.couponHistory
        .replace(':slug', slug)
        .replace(':couponId', couponId);
      const res: any = await api.get(url);
      setApiGetCouponHistory(res);
      setApiGetCouponHistoryLoading(false);
      return res;
    } catch (error: any) {
      console.error('Error fetching coupon history:', error);
      ToastModule.errorBottom({
        msg: error?.resError?.message || error?.message,
      });
      setApiGetCouponHistoryLoading(false);
    }
  }

  // Get Subscription Settings (public)
  async function getSubscriptionSettings(slug: string) {
    try {
      setApiGetSubscriptionSettingsLoading(true);
      const url = ApiEndPoints.subscriptionSettings.replace(':slug', slug);
      const res: any = await api.get(url);
      setApiGetSubscriptionSettings(res);
      setApiGetSubscriptionSettingsLoading(false);
      return res;
    } catch (error: any) {
      console.error('Error fetching subscription settings:', error);
      setApiGetSubscriptionSettingsLoading(false);
    }
  }

  // Get One-Time Payment Settings (public)
  async function getOneTimePaymentSettings(slug: string) {
    try {
      setApiGetOneTimePaymentSettingsLoading(true);
      const url = ApiEndPoints.oneTimePaymentSettings.replace(':slug', slug);
      const res: any = await api.get(url);
      setApiGetOneTimePaymentSettings(res);
      setApiGetOneTimePaymentSettingsLoading(false);
      return res;
    } catch (error: any) {
      console.error('Error fetching one-time payment settings:', error);
      setApiGetOneTimePaymentSettingsLoading(false);
    }
  }

  // Get Available Coupons (public – member side)
  async function getAvailableCoupons(slug: string) {
    try {
      setApiGetAvailableCouponsLoading(true);
      const url = ApiEndPoints.availableCoupons.replace(':slug', slug);
      const res: any = await api.get(url);
      setApiGetAvailableCoupons(res);
      setApiGetAvailableCouponsLoading(false);
      return res;
    } catch (error: any) {
      console.error('Error fetching available coupons:', error);
      setApiGetAvailableCouponsLoading(false);
    }
  }

  // Validate Coupon (member side)
  async function validateCoupon(slug: string, couponCode: string) {
    try {
      setApiValidateCouponLoading(true);
      const url = ApiEndPoints.validateCoupon.replace(':slug', slug);
      const res: any = await api.post(url, { couponCode });
      setApiValidateCoupon(res);
      setApiValidateCouponLoading(false);
      return res;
    } catch (error: any) {
      console.error('Error validating coupon:', error);
      ToastModule.errorBottom({
        msg: error?.resError?.message || error?.message || 'Invalid coupon',
      });
      setApiValidateCouponLoading(false);
    }
  }

  // Get Member Auto Approve
  async function getMemberAutoApprove(slug: string) {
    try {
      setApiGetMemberAutoApproveLoading(true);
      const url = ApiEndPoints.memberAutoApprove.replace(':slug', slug);
      const res: any = await api.get(url);
      setApiGetMemberAutoApprove(res);
      setApiGetMemberAutoApproveLoading(false);
      return res;
    } catch (error: any) {
      console.error('Error fetching member auto approve setting:', error);
      setApiGetMemberAutoApproveLoading(false);
    }
  }

  // Clear Member Auto Approve State
  function clearMemberAutoApproveState() {
    setApiGetMemberAutoApprove({});
    setApiGetMemberAutoApproveLoading(true);
  }

  // Member Auto Approve
  async function updateMemberAutoApprove(
    slug: string,
    body: { autoApproveMembers: boolean },
  ) {
    try {
      setApiUpdateMemberAutoApproveLoading(true);
      const url = ApiEndPoints.memberAutoApprove.replace(':slug', slug);
      const res: any = await api.post(url, body);
      setApiUpdateMemberAutoApprove(res);
      setApiUpdateMemberAutoApproveLoading(false);
      ToastModule.successTop({
        msg: res?.message,
      });
      return res;
    } catch (error: any) {
      console.error('Error updating member auto approve setting:', error);
      ToastModule.errorBottom({
        msg: error?.resError?.message || error?.message,
      });
      setApiUpdateMemberAutoApproveLoading(false);
    }
  }

  // Get Member Transactions
  async function getMemberTransactions(slug: string, query: string) {
    try {
      setApiGetMemberTransactionsLoading(true);
      const url = ApiEndPoints.memberTransactions.replace(':slug', slug);
      const res: any = await api.get(url + query);
      setApiGetMemberTransactions(res);
      setApiGetMemberTransactionsLoading(false);
      return res;
    } catch (error: any) {
      console.error('Error fetching member transactions:', error);
      ToastModule.errorBottom({
        msg: error?.resError?.message || error?.message,
      });
      setApiGetMemberTransactionsLoading(false);
    }
  }

  // Get Stripe Account Status
  async function getStripeAccountStatus(slug: string) {
    try {
      setApiGetStripeAccountStatusLoading(true);
      const url = ApiEndPoints.stripeAccountStatus.replace(':slug', slug);
      const res: any = await api.get(url);
      setApiGetStripeAccountStatus(res);
      setApiGetStripeAccountStatusLoading(false);
      return res;
    } catch (error: any) {
      console.error('Error fetching stripe account status:', error);
      setApiGetStripeAccountStatusLoading(false);
    }
  }

  // Get Stripe Payouts
  async function getStripePayouts(slug: string) {
    try {
      setApiGetStripePayoutsLoading(true);
      const url = ApiEndPoints.stripePayouts.replace(':slug', slug);
      const res: any = await api.get(url);
      setApiGetStripePayouts(res);
      setApiGetStripePayoutsLoading(false);
      return res;
    } catch (error: any) {
      console.error('Error fetching stripe payouts:', error);
      setApiGetStripePayoutsLoading(false);
    }
  }

  // Create Stripe Connect Account
  async function createStripeConnectAccount(slug: string, country: string) {
    try {
      setApiCreateStripeConnectAccountLoading(true);
      const url = ApiEndPoints.createConnectAccount.replace(':slug', slug);
      const res: any = await api.post(url, { country });
      console.log('🚀 ~ createStripeConnectAccount ~ res:', res);
      setApiCreateStripeConnectAccountLoading(false);
      return res;
    } catch (error: any) {
      console.error('Error creating stripe connect account:', error);
      setApiCreateStripeConnectAccountLoading(false);
      ToastModule.errorBottom({
        msg: error?.resError?.message || error?.message,
      });
    }
  }

  // Unlink Stripe Account
  async function unlinkStripeAccount(slug: string) {
    try {
      setApiUnlinkStripeAccountLoading(true);
      const url = ApiEndPoints.unlinkConnectAccount.replace(':slug', slug);
      const res: any = await api.delete(url);
      setApiUnlinkStripeAccountLoading(false);
      ToastModule.successTop({
        msg: res?.message || 'Stripe account unlinked successfully',
      });
      return res;
    } catch (error: any) {
      console.error('Error unlinking stripe account:', error);
      setApiUnlinkStripeAccountLoading(false);
      ToastModule.errorBottom({
        msg: error?.resError?.message || error?.message,
      });
    }
  }

  // Get Owner Dashboard Billing
  async function getOwnerDashboardBilling(slug: string) {
    try {
      setApiGetOwnerDashboardBillingLoading(true);
      const url = ApiEndPoints.ownerDashboardBilling.replace(':slug', slug);
      const res: any = await api.get(url);
      setApiGetOwnerDashboardBilling(res);
      setApiGetOwnerDashboardBillingLoading(false);
      return res;
    } catch (error: any) {
      console.error('Error fetching owner dashboard billing info:', error);
      ToastModule.errorBottom({
        msg: error?.resError?.message || error?.message,
      });
      setApiGetOwnerDashboardBillingLoading(false);
    }
  }

  // Clear Stripe Settings Data
  function clearStripeSettings() {
    setApiGetStripeAccountStatus(null);
    setApiGetStripeAccountStatusLoading(true);
    setApiGetStripePayouts(null);
    setApiGetStripePayoutsLoading(true);
    setApiGetSubscriptionSettings(null);
    setApiGetSubscriptionSettingsLoading(true);
  }

  // Update Subscription Settings
  async function updateSubscriptionSettings(slug: string, body: any) {
    try {
      setApiUpdateSubscriptionSettingsLoading(true);
      const url = ApiEndPoints.subscriptionSettings.replace(':slug', slug);
      const res: any = await api.put(url, body);
      setApiUpdateSubscriptionSettingsLoading(false);
      ToastModule.successBottom({
        msg: res?.message || 'Subscription settings updated successfully',
      });
      return res;
    } catch (error: any) {
      console.error('Error updating subscription settings:', error);
      setApiUpdateSubscriptionSettingsLoading(false);
      ToastModule.errorBottom({
        msg: error?.resError?.message || error?.message,
      });
    }
  }

  // Get Blogs
  async function getBlogs() {
    try {
      setApiGetBlogsLoading(true);
      const blogsRes: any = await api.get(ApiEndPoints.blogs);
      setApiGetBlogs(blogsRes);
      setApiGetBlogsLoading(false);
      return blogsRes;
    } catch (error: any) {
      console.error('Error fetching blogs info:', error);
      ToastModule.errorBottom({
        msg: error?.resError?.message || error?.message,
      });
      setApiGetBlogsLoading(false);
    }
  }

  // Get Blog Details
  async function getBlogDetails(slug: string) {
    try {
      setApiGetBlogDetailsLoading(true);
      const url = ApiEndPoints.blogDetails.replace(':slug', slug);
      const blogDetailsRes: any = await api.get(url);
      setApiGetBlogDetails(blogDetailsRes);
      setApiGetBlogDetailsLoading(false);
      return blogDetailsRes;
    } catch (error: any) {
      console.error('Error fetching blog details info:', error);
      ToastModule.errorBottom({
        msg: error?.resError?.message || error?.message,
      });
      setApiGetBlogDetailsLoading(false);
    }
  }

  // Get Referral Code
  async function getReferralCode(communityId: string) {
    try {
      setApiGetReferralCodeLoading(true);
      const url =
        ApiEndPoints.referralCode.replace(':communityId', communityId) +
        '?type=community_join';
      const res: any = await api.get(url);
      console.log('🚀 ~ getReferralCode ~ res:', res);
      setApiGetReferralCode(res);
      setApiGetReferralCodeLoading(false);
      return res;
    } catch (error) {
      console.error('Error fetching referral code:', error);
      setApiGetReferralCodeLoading(false);
    }
  }

  // Leave Community
  async function leaveCommunity(communityId: string) {
    console.log('🚀 ~ leaveCommunity ~ communityId:', communityId);
    try {
      setApiLeaveCommunityLoading(true);
      const url = ApiEndPoints.leaveCommunity.replace(
        ':communityId',
        communityId,
      );
      const res: any = await api.post(url, {});
      console.log('🚀 ~ leaveCommunity ~ res:', res);
      if (res) {
        await getUserData();
      }
      setApiLeaveCommunityLoading(false);
      return res;
    } catch (error) {
      console.error('Error leaving community:', error);
      setApiLeaveCommunityLoading(false);
    }
  }

  // Join Community
  async function joinCommunity(communityId: string, body: { message: string }) {
    console.log('🚀 ~ joinCommunity ~ communityId:', communityId);
    try {
      setApiJoinCommunityLoading(true);
      const url = ApiEndPoints.joinCommunity.replace(
        ':communityId',
        communityId,
      );
      const res: any = await api.post(url, body);
      console.log('🚀 ~ joinCommunity ~ res:', res);
      setApiJoinCommunity(res);
      setApiJoinCommunityLoading(false);
      ToastModule.successTop({
        msg: res?.message || 'Join request sent successfully!',
      });
      return res;
    } catch (error: any) {
      console.error('Error joining community:', error);
      ToastModule.errorBottom({
        msg: error?.resError?.message || error?.message,
      });
      setApiJoinCommunityLoading(false);
    }
  }

  // Get User Access Requests
  async function getUserAccessRequests() {
    try {
      setApiGetUserAccessRequestsLoading(true);
      const res: any = await api.get(ApiEndPoints.userAccessRequests);
      console.log('🚀 ~ getUserAccessRequests ~ res:', res);
      setApiGetUserAccessRequests(res);
      setApiGetUserAccessRequestsLoading(false);
      return res;
    } catch (error: any) {
      console.error('Error fetching user access requests:', error);
      setApiGetUserAccessRequestsLoading(false);
    }
  }

  function clearReferralCode() {
    setApiGetReferralCode(null);
    setApiGetReferralCodeLoading(false);
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

    // Get Courses
    getCommunityCourses,
    apiGetCommunityCoursesLoading,
    apiGetCommunityCourses,

    // Create Course
    createCourse,
    apiCreateCourseLoading,
    apiCreateCourse,

    // Update Course
    updateCourse,
    apiUpdateCourseLoading,
    apiUpdateCourse,

    // Delete Course
    deleteCourse,
    apiDeleteCourseLoading,
    apiDeleteCourse,

    // Get Course Details
    getCourseDetails,
    apiGetCourseDetailsLoading,
    apiGetCourseDetails,
    clearCourseDetails,

    /* Community Board Screen Apis */

    // Get Social Feed Categories
    getSocialFeedCategories,
    apiGetSocialFeedCategoriesLoading,
    apiGetSocialFeedCategories,

    // Create Social Feed Category
    createSocialFeedCategory,
    apiCreateSocialFeedCategoryLoading,
    apiCreateSocialFeedCategory,

    // Update Social Feed Category
    updateSocialFeedCategory,
    apiUpdateSocialFeedCategoryLoading,
    apiUpdateSocialFeedCategory,

    // Delete Social Feed Category
    deleteSocialFeedCategory,
    apiDeleteSocialFeedCategoryLoading,
    apiDeleteSocialFeedCategory,

    // Get Social Feeds
    getSocialFeeds,
    apiGetSocialFeedsLoading,
    apiGetSocialFeeds,

    // Create Social Feed Posts
    createSocialFeedPost,
    apiCreateSocialFeedLoading,
    apiCreateSocialFeed,

    // Update Social Feed Post
    updateSocialFeedPost,
    apiUpdateSocialFeedLoading,
    apiUpdateSocialFeed,

    // Delete Social Feed Post
    deleteSocialFeedPost,
    apiDeleteSocialFeedLoading,
    apiDeleteSocialFeed,

    // Vote on Poll Post
    voteOnPoll,
    apiVoteOnPollLoading,
    apiVoteOnPoll,

    // Like Post
    likePost,
    apiLikePostLoading,
    apiLikePost,

    /* Community Members Screen Apis */
    // Get Community Members
    getCommunityMembers,
    apiGetCommunityMembersLoading,
    apiGetCommunityMembers,

    // Export Community Members
    exportCommunityMembers,
    apiExportCommunityMembersLoading,

    // Get Community Access Requests
    getCommunityAccessRequests,
    apiGetCommunityAccessRequestsLoading,
    apiGetCommunityAccessRequests,

    // Community Access Requests Actions
    approveAccessRequest,
    apiApproveAccessRequestLoading,
    rejectAccessRequest,
    apiRejectAccessRequestLoading,

    // Member Status Update
    updateMemberStatus,
    apiUpdateMemberStatusLoading,

    /* Community Settings Screen Apis */
    // Moderators Tab
    // Get Community Moderators
    getCommunityModerators,
    apiGetCommunityModeratorsLoading,
    apiGetCommunityModerators,
    clearCommunityModerators,

    // Available Members
    getAvailableMembers,
    apiGetAvailableMembersLoading,
    apiGetAvailableMembers,
    clearAvailableMembers,

    // Add Moderator
    addModerator,
    apiAddModeratorLoading,
    apiAddModerator,

    // Delete Moderator
    deleteModerator,
    apiDeleteModeratorLoading,
    apiDeleteModerator,

    // Update Moderator
    updateModerator,
    apiUpdateModeratorLoading,
    apiUpdateModerator,

    // Referrals Tab
    // Get Referral Settings
    getReferralSettings,
    apiGetReferralSettingsLoading,
    apiGetReferralSettings,

    // Update Referral Settings
    updateReferralSettings,
    apiUpdateReferralSettingsLoading,

    // Referral Code
    getReferralCode,
    apiGetReferralCodeLoading,
    apiGetReferralCode,
    clearReferralCode,

    // Leave Community
    leaveCommunity,
    apiLeaveCommunityLoading,

    // Join Community
    joinCommunity,
    apiJoinCommunityLoading,
    apiJoinCommunity,

    // User Access Requests
    getUserAccessRequests,
    apiGetUserAccessRequestsLoading,
    apiGetUserAccessRequests,

    // Coupons
    getCoupons,
    apiGetCouponsLoading,
    apiGetCoupons,

    // Create Coupon
    createCoupon,
    apiCreateCouponLoading,
    apiCreateCoupon,

    // Update Coupon
    updateCoupon,
    apiUpdateCouponLoading,
    apiUpdateCoupon,

    // Delete Coupon
    deleteCoupon,
    apiDeleteCouponLoading,
    apiDeleteCoupon,

    // Coupon History
    getCouponHistory,
    apiGetCouponHistoryLoading,
    apiGetCouponHistory,

    // Available Coupons (member side)
    getAvailableCoupons,
    apiGetAvailableCouponsLoading,
    apiGetAvailableCoupons,

    // Validate Coupon (member side)
    validateCoupon,
    apiValidateCouponLoading,
    apiValidateCoupon,

    // Subscription Settings (public)
    getSubscriptionSettings,
    apiGetSubscriptionSettingsLoading,
    apiGetSubscriptionSettings,

    // One-Time Payment Settings (public)
    getOneTimePaymentSettings,
    apiGetOneTimePaymentSettingsLoading,
    apiGetOneTimePaymentSettings,

    // Access Requests Tab
    // Member Auto Approve
    getMemberAutoApprove,
    apiGetMemberAutoApproveLoading,
    apiGetMemberAutoApprove,
    clearMemberAutoApproveState,

    // Update Member Auto Approve
    updateMemberAutoApprove,
    apiUpdateMemberAutoApproveLoading,
    apiUpdateMemberAutoApprove,

    // Member Transactions
    getMemberTransactions,
    apiGetMemberTransactionsLoading,
    apiGetMemberTransactions,

    // Stripe Connect
    getStripeAccountStatus,
    apiGetStripeAccountStatusLoading,
    apiGetStripeAccountStatus,

    // Get Stripe Payouts
    getStripePayouts,
    apiGetStripePayoutsLoading,
    apiGetStripePayouts,

    // Subscription Settings Update
    updateSubscriptionSettings,
    apiUpdateSubscriptionSettingsLoading,

    // Create Stripe Connect Account
    createStripeConnectAccount,
    apiCreateStripeConnectAccountLoading,

    // Unlink Stripe Account
    unlinkStripeAccount,
    apiUnlinkStripeAccountLoading,

    // Loading Setters
    setApiGetStripeAccountStatusLoading,
    setApiGetStripePayoutsLoading,
    setApiGetSubscriptionSettingsLoading,

    // Clear Stripe Settings
    clearStripeSettings,

    // Auth Token for external downloads
    userToken,

    // Get Owner Dashboard Billing
    getOwnerDashboardBilling,
    apiGetOwnerDashboardBillingLoading,
    apiGetOwnerDashboardBilling,
    setApiGetOwnerDashboardBillingLoading,
    setApiGetOwnerDashboardBilling,

    // Blogs
    getBlogs,
    apiGetBlogsLoading,
    apiGetBlogs,

    // Blog Details
    getBlogDetails,
    apiGetBlogDetailsLoading,
    apiGetBlogDetails,

    // User
    user,
  };
};

export default useUserApi;
