import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  Dimensions,
} from 'react-native';
import React, { useState, useRef } from 'react';
import { Post, postsAtom, userAtom, mediaPreviewAtom, createPostVisibleAtom, editingPostAtom } from '@/Jotai/Atoms';
import ImageViewing from 'react-native-image-viewing';


import { useAtom } from 'jotai';
import { ms } from '@/Assets/Theme/fontStyle';
import styles from './style';

import Icon from '@/Components/Core/Icons';
import { COLORS } from '@/Assets/Theme/colors';

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


  // Mock checking if current user voted (simplified for now without real user ID)
  // For now, relies on post.pollData?.userVotedOptionIds

  const handleVote = (optionId: string) => {
    if (!post.isPoll || !post.pollData) return;

    if (
      post.pollData.userVotedOptionIds?.includes(optionId) &&
      !post.pollData.allowMultipleAnswers
    ) {
      // Allow deselection even if multiple answers not allowed
    }

    // Clone posts to mutate
    const updatedPosts = posts.map(p => {
      if (p.id === post.id && p.pollData) {
        let newUserVotedIds = p.pollData.userVotedOptionIds || [];
        let newOptions = [...p.pollData.options];
        let newTotalVotes = p.pollData.totalVotes;

        const isSelected = newUserVotedIds.includes(optionId);

        if (isSelected) {
          // Deselect: Remove vote
          newOptions = newOptions.map(opt =>
            opt.id === optionId
              ? { ...opt, votes: Math.max(0, opt.votes - 1) }
              : opt,
          );
          newUserVotedIds = newUserVotedIds.filter(id => id !== optionId);
          newTotalVotes = Math.max(0, newTotalVotes - 1);
        } else {
          // Select logic
          // If not multiple answers, clear others
          if (!p.pollData.allowMultipleAnswers && newUserVotedIds.length > 0) {
            // Remove vote from previous
            const prevId = newUserVotedIds[0];
            newOptions = newOptions.map(opt =>
              opt.id === prevId
                ? { ...opt, votes: Math.max(0, opt.votes - 1) }
                : opt,
            );
            newUserVotedIds = [];
            newTotalVotes = Math.max(0, newTotalVotes - 1);
          }

          // Add vote
          newOptions = newOptions.map(opt =>
            opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt,
          );
          newUserVotedIds.push(optionId);
          newTotalVotes++;
        }

        return {
          ...p,
          pollData: {
            ...p.pollData,
            options: newOptions,
            totalVotes: newTotalVotes,
            userVotedOptionIds: newUserVotedIds,
          },
        };
      }
      return p;
    });

    setPosts(updatedPosts);
  };

  const handleDelete = () => {
    const updatedPosts = posts.filter(p => p.id !== post.id);
    setPosts(updatedPosts);
    setShowMenu(false);
  };

  const getPercentage = (votes: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((votes / total) * 100);
  };

  const renderPoll = () => {
    if (!post.pollData) return null;

    return (
      <View style={styles.pollContainer}>
        <Text style={styles.pollQuestion}>{post.pollData.question}</Text>
        <Text style={styles.pollSubText}>Select one option</Text>

        {post.pollData.options.map(option => {
          const isSelected = post.pollData?.userVotedOptionIds?.includes(
            option.id,
          );
          const percentage = getPercentage(
            option.votes,
            post.pollData!.totalVotes,
          );

          return (
            <TouchableOpacity
              key={option.id}
              style={styles.pollOptionRow}
              onPress={() => handleVote(option.id)}
              activeOpacity={0.8}
            >
              {post.pollData!.totalVotes > 0 && (
                <View
                  style={[
                    styles.progressBar,
                    isSelected && styles.progressBarWinner,
                    { width: `${percentage}%` },
                  ]}
                />
              )}

              <View style={styles.pollOptionContent}>
                <View
                  style={[
                    styles.radioCircle,
                    isSelected && styles.radioCircleSelected,
                  ]}
                >
                  {/* Tick icon or filled circle could go here if selected */}
                </View>
                <Text style={styles.optionText}>{option.text}</Text>

                {post.pollData!.totalVotes > 0 && (
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.percentageText}>{percentage}%</Text>
                    <Text style={styles.voteCountText}>
                      {option.votes} Vote
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}

        <Text style={styles.totalVotes}>
          Total Votes : {post.pollData.totalVotes}
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
    ? post.media.filter(m => !m.type?.includes('video')).map(m => ({ uri: m.uri }))
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
                marginRight: (mediaCount > 1 && maxColumns(index, mediaCount)) ? '2%' : 0
                // Simple 2 col logic gap:
                // Just use flexWrap: 'wrap', justifyContent: 'space-between' on container
              }}
            >
              <Image
                source={{ uri: media.uri }}
                style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
              />
              {media.type?.includes('video') && (
                <View style={styles.playIconContainer}>
                  <Icon name="PlayCircle" size={48} color={COLORS.white} />
                </View>
              )}
              {isLastMsg && remaining > 0 && (
                <View style={styles.moreOverlay}>
                  <Text style={styles.moreText}>+{remaining}</Text>
                </View>
              )}
            </TouchableOpacity>
          )
        })}
      </View>
    )
  }

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
          <Text style={styles.time}>{post.timestamp}</Text>
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
        <View>
          {renderPoll()}
        </View>
      ) : (
        <View>
          {!!post.content && <Text style={styles.content}>{post.content}</Text>}

          {/* Media Grid */}
          {renderMediaGrid()}

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
