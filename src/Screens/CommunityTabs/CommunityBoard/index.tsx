import {
  View,
  Text,
  Animated,
  Pressable,
  ActivityIndicator,
  Image,
} from 'react-native';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Icon from '@/Components/Core/Icons';
import { COLORS } from '@/Assets/Theme/colors';
import PrimaryButton from '@/Components/Core/PrimaryButton';
import styles from './style';
import { useAtom } from 'jotai';
import {
  createPostVisibleAtom,
  communityCategoriesAtom,
  userAtom,
  refreshSocialFeedsAtom,
} from '@/Jotai/Atoms';
import PostItem from '@/Components/Generic/PostItem';
import MediaPreviewModal from '@/Components/Generic/Modals/MediaPreviewModal';
import ManageCategoriesModal, {
  Category,
} from '@/Components/Generic/Modals/ManageCategoriesModal';
import CategoryBar from './Components/CategoryBar';
import CommunityBoardSkeleton from '@/Components/Core/Skeleton/CommunityBoardSkeleton';
import useUserApi from '@/Hooks/Apis/UserApis/use-user-api';
import { useFocusEffect } from '@react-navigation/native';

interface Props {
  communityId?: string;
  onScroll?: (...args: any[]) => void;
  scrollEventThrottle?: number;
}

const toIdString = (value: any): string => {
  if (value == null || value === '') return '';
  if (typeof value === 'object' && value !== null) {
    const inner = (value as any)._id ?? (value as any).id;
    if (inner != null) return String(inner);
  }
  return String(value);
};

const moderatorRecordUserId = (m: any): string => {
  if (!m) return '';
  if (typeof m.userId === 'string') return toIdString(m.userId);
  if (m.userId != null && typeof m.userId === 'object') {
    return toIdString(
      (m.userId as any)._id ?? (m.userId as any).id ?? m.userId,
    );
  }
  return toIdString((m as any).user?._id ?? (m as any).user?.id);
};

const CommunityBoard = ({
  communityId,
  onScroll,
  scrollEventThrottle,
}: Props) => {
  const {
    getSocialFeeds,
    apiGetSocialFeedsLoading,
    getSocialFeedCategories,
    apiGetSocialFeedCategoriesLoading,
    createSocialFeedCategory,
    apiCreateSocialFeedCategoryLoading,
    updateSocialFeedCategory,
    apiUpdateSocialFeedCategoryLoading,
    deleteSocialFeedCategory,
    apiDeleteSocialFeedCategoryLoading,
    getCommunityModerators,
  } = useUserApi();
  // const [posts] = useAtom(postsAtom);
  const [, setCreatePostVisible] = useAtom(createPostVisibleAtom);
  const [categories, setCategories] = useAtom(communityCategoriesAtom);

  // Social Feeds state
  const [feeds, setFeeds] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // local categories state removed in favor of global atom
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  ); // null = "All"
  const [manageCategoriesVisible, setManageCategoriesVisible] = useState(false);
  const [moderatorSelf, setModeratorSelf] = useState<any | null>(null);

  const [user] = useAtom(userAtom);

  const communityDetails = useMemo(() => {
    return (user as any)?.allCommunities?.find(
      (c: any) => c._id === communityId || c.id === communityId,
    );
  }, [user, communityId]);

  const communityRole = (communityDetails?.role || 'member')
    .toString()
    .toLowerCase();

  const currentUserIdStr = useMemo(() => {
    const u = user as any;
    if (!u || typeof u !== 'object') return '';
    return toIdString(u._id ?? u.id);
  }, [user]);

  const boardPermissionUi = useMemo(() => {
    const isOwner = communityRole === 'owner';
    const modStatus = (moderatorSelf?.status || '').toString().toLowerCase();
    const isListedModerator = !!moderatorSelf;
    const isActiveModerator = isListedModerator && modStatus === 'active';
    const boardActions = moderatorSelf?.permissions?.board?.actions || {};
    const canUseModBoardPerms = !isOwner && isActiveModerator;
    const actionOn = (v: any) => v === true || v === 'true';

    const showComment =
      isOwner || (canUseModBoardPerms && actionOn(boardActions.comment));
    const showCreatePost =
      isOwner || (canUseModBoardPerms && actionOn(boardActions.createPost));
    const showDeletePost =
      isOwner || (canUseModBoardPerms && actionOn(boardActions.deletePost));
    const showEditPost =
      isOwner ||
      (canUseModBoardPerms &&
        (actionOn(boardActions.editPost) || actionOn(boardActions.updatePost)));
    const showManagePosts =
      isOwner || (canUseModBoardPerms && actionOn(boardActions.managePosts));

    const hasAnyBoardAction =
      isOwner ||
      (canUseModBoardPerms &&
        (actionOn(boardActions.comment) ||
          actionOn(boardActions.createPost) ||
          actionOn(boardActions.deletePost) ||
          actionOn(boardActions.editPost) ||
          actionOn(boardActions.updatePost) ||
          actionOn(boardActions.managePosts)));

    return {
      showComment,
      showCreatePost,
      showDeletePost,
      showEditPost,
      showManagePosts,
      hasAnyBoardAction,
      postItemBoardUi: {
        showComment,
        showEditPost,
        showDeletePost,
      },
    };
  }, [communityRole, moderatorSelf]);

  useEffect(() => {
    if (!communityId) return;
    let cancelled = false;
    getCommunityModerators(communityId).then((modRes: any) => {
      if (cancelled) return;
      const raw = modRes?.data;
      const moderators: any[] = Array.isArray(raw) ? raw : [];
      if (!currentUserIdStr) {
        setModeratorSelf(null);
        return;
      }
      const me = moderators.find(
        (m: any) => moderatorRecordUserId(m) === currentUserIdStr,
      );
      setModeratorSelf(me || null);
    });
    return () => {
      cancelled = true;
    };
  }, [communityId, currentUserIdStr]);

  // ── API Fetch ────────────────────────────────────────────────────────────
  const fetchCategories = useCallback(async () => {
    if (!communityId) return;
    const res = await getSocialFeedCategories(`/${communityId}`);
    if (res?.success && res?.data) {
      const formattedCategories = res.data.map((item: any) => ({
        id: item._id,
        name: item.name,
        isDefault: item.isDefault || false,
      }));
      setCategories(formattedCategories);
    }
  }, [communityId]);

  useFocusEffect(
    useCallback(() => {
      fetchCategories();
    }, [fetchCategories]),
  );

  // ── Category handlers ────────────────────────────────────────────────────
  const handleAddCategory = async (name: string) => {
    if (!communityId) return;
    const query = `/${communityId}`;
    const body = {
      name,
      description: '',
      order: categories.length + 1,
    };
    const res = await createSocialFeedCategory(query, body);
    if (res?.success) {
      fetchCategories();
    }
  };

  const handleDeleteCategory = async (id: string) => {
    const res = await deleteSocialFeedCategory(id);
    if (res?.success) {
      if (selectedCategoryId === id) {
        setSelectedCategoryId(null);
      }
      fetchCategories();
    }
  };

  const handleEditCategory = async (id: string, newName: string) => {
    const body = { name: newName };
    const res = await updateSocialFeedCategory(id, body);
    if (res?.success) {
      fetchCategories();
    }
  };

  const fetchFeeds = useCallback(
    async (page: number, reset = false) => {
      if (!communityId) return;
      if (page > 1) setLoadingMore(true);
      if (reset) setFeeds([]); // Clear feeds to show localized loader

      const limit = 10;
      // Add categoryId filter if a category is selected (and if the backend supports it, e.g. &categoryId=${selectedCategoryId})
      const query = `/${communityId}/posts?page=${page}&limit=${limit}${selectedCategoryId ? `&categoryId=${selectedCategoryId}` : ''
        }`;

      const res = await getSocialFeeds(query);

      if (res?.success && res?.data) {
        const apiPosts = res.data.posts || [];
        const pagination = res.data.pagination;

        // Map API post to local Post interface expected by PostItem
        const formattedPosts = apiPosts.map((item: any) => ({
          id: item._id,
          author: {
            name:
              item.authorName ||
              (item.authorId
                ? `${item.authorId.firstName} ${item.authorId.lastName}`
                : 'Unknown'),
            avatar:
              item.authorId?.profilePicture?.url ||
              (item.authorName
                ? item.authorName[0]
                : item.authorId?.firstName
                  ? item.authorId.firstName[0]
                  : 'U'),
          },
          timestamp: item.createdAt, // Pass raw timestamp for PostItem to handle relative time
          content: item.content,
          media: item.images
            ? item.images.map((img: any) => ({ uri: img.url, type: 'image' }))
            : [],
          likes: item.likeCount || 0,
          comments: item.commentCount || 0,
          isLiked: item.hasUserLiked || false,
          categoryId: item.categoryId || null,
          visibility: item.visibility || 'Everyone',
          title: item.title || '',
          videoLinks: item.videoLinks || [],
          videos: item.videos || [],
          isPoll: !!item.poll?.isEnabled,
          pollData: item.poll?.isEnabled
            ? {
              question: item.poll.question,
              options: item.poll.options.map((opt: any) => ({
                id: opt._id,
                text: opt.text,
                votes: opt.voteCount || 0,
              })),
              totalVotes: item.poll.totalVotes || 0,
              allowMultipleAnswers: item.poll.allowMultipleAnswers || false,
              userVotedOptionIds: item.poll.userSelections || [],
            }
            : undefined,
        }));

        if (reset) {
          setFeeds(formattedPosts);
          setIsFirstLoad(false);
        } else {
          setFeeds(prev => [...prev, ...formattedPosts]);
        }

        setHasMore(pagination?.hasNext ?? false);
        setCurrentPage(page);
      }
      setLoadingMore(false);
    },
    [communityId, selectedCategoryId],
  );

  const [refreshSocialFeeds] = useAtom(refreshSocialFeedsAtom);

  useFocusEffect(
    useCallback(() => {
      fetchFeeds(1, true);
    }, [fetchFeeds]),
  );

  useEffect(() => {
    fetchFeeds(1, true);
  }, [selectedCategoryId, fetchFeeds, refreshSocialFeeds]);

  const handleScroll = (event: any) => {
    onScroll?.(event);
  };

  const handleMomentumScrollEnd = (event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isCloseToBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;

    if (
      isCloseToBottom &&
      hasMore &&
      !loadingMore &&
      !apiGetSocialFeedsLoading
    ) {
      fetchFeeds(currentPage + 1, false);
    }
  };

  // ── Action button renderer ────────────────────────────────────────────────
  const renderActionBtn = (iconName: string, label: string) => (
    <View style={styles.actionBtn}>
      <Icon name={iconName} size={18} color={COLORS.white} />
      <Text style={styles.actionBtnText}>{label}</Text>
    </View>
  );

  // ── Filtered posts ───────────────────────────────────────────────────────
  const filteredPosts = feeds;
  const userInitials = (user as any)?.firstName
    ? (user as any).firstName[0]
    : 'U';
  const userAvatar = (user as any)?.profilePicture?.url;

  // Initial full screen loading logic
  if (apiGetSocialFeedsLoading && isFirstLoad) {
    return <CommunityBoardSkeleton />;
  }

  return (
    <Animated.ScrollView
      style={styles.animatedScrollView}
      onScroll={handleScroll}
      scrollEventThrottle={scrollEventThrottle}
      contentContainerStyle={styles.animatedContent}
      onMomentumScrollEnd={handleMomentumScrollEnd}
    >
      {/* ── Board content ─────────────────────────────────────────────────── */}
      <View style={styles.container}>
        <Text style={styles.title}>Board</Text>
        <Text style={styles.subTitle}>
          Share updates, announcements, and connect with your community
        </Text>

        {/* ── Category Filter Bar Component ── */}
        <CategoryBar
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={setSelectedCategoryId}
          onPressSettings={() => setManageCategoriesVisible(true)}
          showSettingsButton={boardPermissionUi.showManagePosts}
        />

        {/* Create Post Section */}
        {boardPermissionUi.showCreatePost ? (
          <Pressable
            style={styles.createPostCard}
            onPress={() => setCreatePostVisible(true)}
          >
            <View style={styles.inputRow}>
              <View style={styles.avatar}>
                {userAvatar ? (
                  <Image source={{ uri: userAvatar }} style={styles.avatar} />
                ) : (
                  <Text style={styles.avatarText}>{userInitials}</Text>
                )}
              </View>
              <View style={styles.input}>
                <Text style={styles.inputPlaceholder}>Start a post</Text>
              </View>
            </View>
            <View style={styles.actionsRow}>
              {renderActionBtn('Video', 'Video')}
              {renderActionBtn('Image', 'Photo')}
              {renderActionBtn('FileText', 'Write article')}
              {renderActionBtn('ChartNoAxesColumn', 'Poll')}
            </View>
          </Pressable>
        ) : null}

        {/* Posts List */}
        {apiGetSocialFeedsLoading && feeds.length === 0 ? (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <ActivityIndicator size="small" color={COLORS.primary} />
          </View>
        ) : filteredPosts.length === 0 ? (
          !boardPermissionUi.hasAnyBoardAction ? (
            /* View-only: no board permissions — minimal empty (no create/manage CTAs) */
            <View
              style={[styles.emptyStateCard, styles.emptyStateCardViewOnly]}
            >
              <Icon name="MessageSquareText" size={48} color={COLORS.subText} />
              <Text style={styles.emptyStateTitleViewOnly}>
                {selectedCategoryId ? 'No posts in this category' : 'No posts yet'}
              </Text>
              <Text style={styles.emptyStateSubtitleViewOnly}>
                {selectedCategoryId
                  ? 'No posts have been shared in this category yet.'
                  : 'There are no posts in this community yet. Check back later for updates from the community admin.'}
              </Text>
            </View>
          ) : (
            /* At least one board action allowed — rich empty (first-post CTA when createPost) */
            <View style={styles.emptyStateCard}>
              {selectedCategoryId ? (
                <>
                  <Icon name="MessageSquare" size={48} color={COLORS.subText} />
                  <Text style={styles.emptyStateTitle}>
                    No posts in this category
                  </Text>
                  <Text style={styles.emptyStateSubtitle}>
                    No posts have been shared in this category yet.
                  </Text>
                </>
              ) : (
                <>
                  <Icon name="MessageSquareText" size={48} color={COLORS.white} />
                  <Text style={styles.emptyStateTitle}>
                    Start the Conversation
                  </Text>
                  <Text style={styles.emptyStateSubtitle}>
                    Be the first to share something amazing with your community!
                    {'\n'}
                    Your voice matters and we can't wait to hear from you.
                  </Text>
                  {boardPermissionUi.showCreatePost ? (
                    <PrimaryButton
                      title="+ Create Your First Post"
                      onPress={() => setCreatePostVisible(true)}
                      buttonStyle={styles.createPostButton}
                      textStyle={styles.createPostButtonText}
                    />
                  ) : null}
                </>
              )}
            </View>
          )
        ) : (
          filteredPosts.map(post => (
            <PostItem
              key={post.id}
              post={post}
              boardUi={boardPermissionUi.postItemBoardUi}
            />
          ))
        )}

        {/* Load More Indicator */}
        {loadingMore && (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <ActivityIndicator size="small" color={COLORS.primary} />
          </View>
        )}

        {/* Media Preview Modal */}
        <MediaPreviewModal />
      </View>

      {/* ── Manage Categories Modal Component ── */}
      <ManageCategoriesModal
        visible={manageCategoriesVisible}
        onClose={() => setManageCategoriesVisible(false)}
        categories={categories}
        onAdd={handleAddCategory}
        onDelete={handleDeleteCategory}
        onEdit={handleEditCategory}
        isCreating={apiCreateSocialFeedCategoryLoading}
        isUpdating={apiUpdateSocialFeedCategoryLoading}
        isDeleting={apiDeleteSocialFeedCategoryLoading}
      />
    </Animated.ScrollView>
  );
};

export default CommunityBoard;
