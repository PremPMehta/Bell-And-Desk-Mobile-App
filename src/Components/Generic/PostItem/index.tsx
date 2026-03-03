import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  Dimensions,
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import {
  Post,
  postsAtom,
  userAtom,
  mediaPreviewAtom,
  createPostVisibleAtom,
  editingPostAtom,
  communityCategoriesAtom,
  refreshSocialFeedsAtom,
} from '@/Jotai/Atoms';
import ImageViewing from 'react-native-image-viewing';
import LinkPreview from '../LinkPreview';

import { useAtom } from 'jotai';
import { ms } from '@/Assets/Theme/fontStyle';
import styles from './style';

import Icon from '@/Components/Core/Icons';
import { COLORS } from '@/Assets/Theme/colors';
import useUserApi from '@/Hooks/Apis/UserApis/use-user-api';
import ToastModule from '@/Components/Core/Toast';

interface Props {
  post: Post;
}

const PostItem = ({ post }: Props) => {
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    right: number;
  } | null>(null);
  const moreButtonRef = useRef<View>(null);

  const [posts, setPosts] = useAtom(postsAtom);
  const [user] = useAtom(userAtom); // Use this if you need current user ID for checking votes
  const [, setMediaPreview] = useAtom(mediaPreviewAtom);
  const [, setCreatePostVisible] = useAtom(createPostVisibleAtom);
  const [, setEditingPost] = useAtom(editingPostAtom);
  const [categories] = useAtom(communityCategoriesAtom);
  const [isExpanded, setIsExpanded] = useState(false);
  const contentLimit = 150;

  const categoryName = categories.find(c => c.id === post.categoryId)?.name;

  const getTimeAgo = (timestamp: string) => {
    if (!timestamp) return '';
    // Handle "Just now" if it comes from legacy or local state
    if (timestamp === 'Just now') return 'Just now';

    const now = new Date();
    const postDate = new Date(timestamp);

    // Check if valid date
    if (isNaN(postDate.getTime())) return timestamp;

    const diffInSeconds = Math.floor(
      (now.getTime() - postDate.getTime()) / 1000,
    );

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;

    // Handle any number of days (e.g., 50d ago)
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  // const profilePicture = post?.authorId?.

  // Mock checking if current user voted (simplified for now without real user ID)
  // For now, relies on post.pollData?.userVotedOptionIds

  const [localPollData, setLocalPollData] = useState(post.pollData);

  // Sync local data if post update comes from parent (e.g. general refresh)
  useEffect(() => {
    setLocalPollData(post.pollData);
  }, [post.pollData]);

  const { deleteSocialFeedPost, voteOnPoll, apiVoteOnPollLoading } =
    useUserApi();
  const [refreshSocialFeeds, setRefreshSocialFeeds] = useAtom(
    refreshSocialFeedsAtom,
  );

  const handleVote = async (optionId: string) => {
    if (!post.isPoll || !localPollData) return;

    const currentVotedIds = localPollData.userVotedOptionIds || [];
    const isSelected = currentVotedIds.includes(optionId);
    let newOptionIds: string[] = [];

    // --- Optimistic State Calculation ---
    const previousPollData = { ...localPollData };
    let newOptions = [...localPollData.options];
    let newTotalVotes = localPollData.totalVotes;

    if (localPollData.allowMultipleAnswers) {
      if (isSelected) {
        newOptionIds = currentVotedIds.filter(id => id !== optionId);
        newOptions = newOptions.map(opt =>
          opt.id === optionId
            ? { ...opt, votes: Math.max(0, opt.votes - 1) }
            : opt,
        );
        newTotalVotes = Math.max(0, newTotalVotes - 1);
      } else {
        newOptionIds = [...currentVotedIds, optionId];
        newOptions = newOptions.map(opt =>
          opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt,
        );
        newTotalVotes++;
      }
    } else {
      if (isSelected) {
        newOptionIds = []; // Deselect
        newOptions = newOptions.map(opt =>
          opt.id === optionId
            ? { ...opt, votes: Math.max(0, opt.votes - 1) }
            : opt,
        );
        newTotalVotes = Math.max(0, newTotalVotes - 1);
      } else {
        // Switch choice: subtract from old (if any), add to new
        if (currentVotedIds.length > 0) {
          const oldId = currentVotedIds[0];
          newOptions = newOptions.map(opt =>
            opt.id === oldId
              ? { ...opt, votes: Math.max(0, opt.votes - 1) }
              : opt,
          );
          newTotalVotes = Math.max(0, newTotalVotes - 1);
        }
        newOptionIds = [optionId];
        newOptions = newOptions.map(opt =>
          opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt,
        );
        newTotalVotes++;
      }
    }

    // Apply Optimistic Update
    setLocalPollData({
      ...localPollData,
      options: newOptions,
      totalVotes: newTotalVotes,
      userVotedOptionIds: newOptionIds,
    });

    // API Call in background
    const res = await voteOnPoll(post.id, { optionIds: newOptionIds });
    if (!res?.success) {
      // Revert if failed
      setLocalPollData(previousPollData);
      ToastModule.errorTop({
        msg: res?.message || 'Failed to register vote. Please try again.',
      });
    }
  };

  const handleDelete = async () => {
    const res = await deleteSocialFeedPost(`/posts/${post.id}`);
    if (res?.success) {
      ToastModule.successTop({
        msg: res?.message || 'Post deleted successfully!',
      });
      setRefreshSocialFeeds(!refreshSocialFeeds);
    }
    setShowMenu(false);
  };

  const getPercentage = (votes: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((votes / total) * 100);
  };

  const renderPoll = () => {
    if (!localPollData) return null;

    return (
      <View style={styles.pollContainer}>
        <Text style={styles.pollQuestion}>{localPollData.question}</Text>
        <Text style={styles.pollSubText}>
          {localPollData.allowMultipleAnswers
            ? 'Select multiple options'
            : 'Select one option'}
        </Text>

        {localPollData.options.map(option => {
          const isSelected = localPollData?.userVotedOptionIds?.includes(
            option.id,
          );
          const percentage = getPercentage(
            option.votes,
            localPollData!.totalVotes,
          );

          return (
            <TouchableOpacity
              key={option.id}
              style={styles.pollOptionRow}
              onPress={() => handleVote(option.id)}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.progressBar,
                  isSelected && styles.progressBarWinner,
                  { width: `${percentage}%` },
                ]}
              />

              <View style={styles.pollOptionContent}>
                <View
                  style={[
                    styles.radioCircle,
                    isSelected && styles.radioCircleSelected,
                  ]}
                >
                  {isSelected && (
                    <Icon name="Check" size={12} color={COLORS.white} />
                  )}
                </View>
                <Text style={styles.optionText}>{option.text}</Text>

                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.percentageText}>{percentage}%</Text>
                  <Text style={styles.voteCountText}>
                    {option.votes} Vote{option.votes !== 1 ? 's' : ''}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}

        <Text style={styles.totalVotes}>
          Total Votes : {localPollData.totalVotes}
        </Text>
      </View>
    );
  };

  const handleLike = () => {
    const updatedPosts = posts.map(p => {
      if (p.id === post.id) {
        const isLiked = !p.isLiked;
        return {
          ...p,
          isLiked,
          likes: isLiked ? p.likes + 1 : Math.max(0, p.likes - 1),
        };
      }
      return p;
    });
    setPosts(updatedPosts);
  };

  const [isImageViewVisible, setIsImageViewVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = post.media
    ? post.media
      .filter(m => !m.type?.includes('video'))
      .map(m => ({ uri: m.uri }))
    : [];

  const handleMediaPress = (media: any, index: number) => {
    if (media.type?.includes('video')) {
      setMediaPreview({
        visible: true,
        uri: media.uri || '',
        type: 'video',
      });
    } else {
      // Find index in images array
      const imgIndex = images.findIndex(img => img.uri === media.uri);
      setCurrentImageIndex(imgIndex !== -1 ? imgIndex : 0);
      setIsImageViewVisible(true);
    }
  };

  const renderMediaGrid = () => {
    if (!post.media || post.media.length === 0) return null;

    const mediaCount = post.media.length;
    // We will show up to 4 items in a 2x2 grid, or 1 item full width, or 2 items side-by-side, or 3 items (1 top, 2 bottom)
    // Actually simpler: Just a flex wrap container with 50% width items, max 4.
    // Or simply:
    // 1 item: 100% width, height 200
    // 2 items: 50% width each, height 150
    // 3 items: 1st 100%, 2nd/3rd 50%
    // 4 items: each 50%
    // 5+ items: 4 items shown, last one has overlay.

    // Let's implement dynamic sizing based on count

    const displayMedia = post.media.slice(0, 4);

    return (
      <View style={styles.mediaGrid}>
        {displayMedia.map((media, index) => {
          // Layout logic
          let width: any = '48%'; // Default for grid
          let height = ms(150);
          let marginBottom = ms(4);

          if (mediaCount === 1) {
            width = '100%';
            height = ms(200);
          } else if (mediaCount === 3 && index === 0) {
            width = '100%';
          }

          const isLastMsg = index === 3;
          const remaining = mediaCount - 4;

          return (
            <TouchableOpacity
              key={index}
              activeOpacity={0.9}
              onPress={() => handleMediaPress(media, index)}
              style={{
                width,
                height,
                marginBottom,
                borderRadius: ms(8),
                overflow: 'hidden',
                marginRight:
                  mediaCount > 1 && maxColumns(index, mediaCount) ? '2%' : 0,
              }}
            >
              <Image
                source={{ uri: media.uri || media.thumbnail || media.thumbnailUrl }}
                style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
              />
              {media.type?.includes('video') && (
                <View style={styles.playIconOverlay}>
                  <View style={styles.playButtonCircle}>
                    <Icon
                      name="Play"
                      size={30}
                      color={COLORS.white}
                      fill={COLORS.white}
                    />
                  </View>
                </View>
              )}
              {isLastMsg && remaining > 0 && (
                <View style={styles.moreOverlay}>
                  <Text style={styles.moreText}>+{remaining}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  // Helper to determine if item needs specific margin?
  // Easier to use styles.mediaGrid { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }
  const maxColumns = (index: number, total: number) => {
    // Return true if not last in row
    if (total === 1) return false;
    if (total === 3 && index === 0) return false;
    return index % 2 === 0; // Left column items need margin if using basic flow
    // But with space-between, we just need widths to sum to < 100%
  };

  return (
    <View style={styles.container}>
      {/* ... Header ... */}
      <View style={styles.header}>
        {/* Same header code, not modifying this part explicitly but showing where context is */}
        <View style={styles.avatar}>
          {post.author.avatar.startsWith('http') ? (
            <Image source={{ uri: post.author.avatar }} style={styles.avatar} />
          ) : (
            <Text style={styles.avatarText}>{post.author.avatar || 'U'}</Text>
          )}
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{post.author.name}</Text>
          <View style={styles.timestampRow}>
            <Text style={styles.time}>{getTimeAgo(post.timestamp)}</Text>
            {categoryName && (
              <>
                <View style={styles.dotSeparator} />
                <Text style={styles.categoryNameText}>{categoryName}</Text>
              </>
            )}
          </View>
        </View>
        <TouchableOpacity
          ref={moreButtonRef}
          style={styles.moreButton}
          onPress={() => {
            moreButtonRef.current?.measureInWindow((x, y, width, height) => {
              setMenuPosition({
                top: y + height,
                right: Dimensions.get('window').width - (x + width),
              });
              setShowMenu(true);
            });
          }}
        >
          <Icon name="EllipsisVertical" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* Menu Modal - unchanged */}
      <Modal
        transparent
        visible={showMenu}
        onRequestClose={() => setShowMenu(false)}
        animationType="fade"
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowMenu(false)}
        >
          <View
            style={[
              styles.editMenu,
              menuPosition && {
                top: menuPosition.top,
                right: menuPosition.right,
                left: undefined, // ensure right is used
              },
            ]}
          >
            {post.content && !post.isPoll && (
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setEditingPost(post);
                  setCreatePostVisible(true);
                  setShowMenu(false);
                }}
              >
                <Icon name="Pencil" size={16} color={COLORS.white} />
                <Text style={styles.menuText}>Edit</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.menuItem} onPress={handleDelete}>
              <Icon name="Trash2" size={16} color={COLORS.red} />
              <Text style={[styles.menuText, styles.deleteText]}>Delete</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Content */}
      {post.isPoll ? (
        <View>{renderPoll()}</View>
      ) : (
        <View>
          {!!post.title && <Text style={styles.title}>{post.title}</Text>}
          {!!post.content && (
            <Text style={styles.content}>
              {isExpanded || post.content.length <= contentLimit
                ? post.content
                : `${post.content.substring(0, contentLimit)}...`}
              {post.content.length > contentLimit && (
                <Text
                  style={styles.readMoreText}
                  onPress={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? ' Read Less' : ' Read More'}
                </Text>
              )}
            </Text>
          )}

          {/* Media Grid */}
          {renderMediaGrid()}

          {/* Native Videos Support */}
          {post.videos && post.videos.length > 0 && (
            <View style={styles.nativeVideosContainer}>
              {post.videos.map((video, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.nativeVideoCard}
                  activeOpacity={0.9}
                  onPress={() => {
                    setMediaPreview({
                      visible: true,
                      uri: video.url,
                      type: 'video',
                    });
                  }}
                >
                  {video.thumbnail || video.thumbnailUrl ? (
                    <Image
                      source={{ uri: video.thumbnail || video.thumbnailUrl }}
                      style={styles.nativeVideoThumbnail}
                    />
                  ) : (
                    <View style={styles.nativeVideoFallback}>
                      <Icon name="Film" size={40} color={COLORS.subText} />
                    </View>
                  )}
                  <View style={styles.playIconOverlay}>
                    <View style={styles.playButtonCircle}>
                      <Icon
                        name="Play"
                        size={30}
                        color={COLORS.white}
                        fill={COLORS.white}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Video Link Previews */}
          {post.videoLinks && post.videoLinks.length > 0 && (
            <View style={styles.videoLinkPreviews}>
              {post.videoLinks.map((linkObj, index) => (
                <LinkPreview
                  key={index}
                  url={typeof linkObj === 'string' ? linkObj : linkObj.url}
                  platform={
                    typeof linkObj === 'object' ? linkObj.platform : undefined
                  }
                />
              ))}
            </View>
          )}

          {/* Image Viewer Modal */}
          <ImageViewing
            images={images}
            imageIndex={currentImageIndex}
            visible={isImageViewVisible}
            onRequestClose={() => setIsImageViewVisible(false)}
          />
        </View>
      )}

      {/* Footer - unchanged */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.likeButton} onPress={handleLike}>
          <Icon
            name="ThumbsUp"
            size={18}
            color={post.isLiked ? COLORS.primary : COLORS.white}
            fill={post.isLiked ? COLORS.primary : 'transparent'}
          />
          <Text
            style={[
              styles.footerText,
              post.isLiked && { color: COLORS.primary },
            ]}
          >
            {post.likes}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PostItem;
