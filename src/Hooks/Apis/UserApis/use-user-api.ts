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
    booleanDefaultFalseAtomFamily(AtomKeys.apiGetCommunityAccessRequestsLoading),
  );
  const [apiGetCommunityAccessRequests, setApiGetCommunityAccessRequests] =
    useAtom(objectAtomFamily(AtomKeys.apiGetCommunityAccessRequests));

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
    getCommunityMembers,
    apiGetCommunityMembersLoading,
    apiGetCommunityMembers,
    exportCommunityMembers,
    apiExportCommunityMembersLoading,
    getCommunityAccessRequests,
    apiGetCommunityAccessRequestsLoading,
    apiGetCommunityAccessRequests,

    // Auth Token for external downloads
    userToken,
  };
};

export default useUserApi;
