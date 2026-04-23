import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useAtom } from 'jotai';
import { userAtom } from '@/Jotai/Atoms';
import { api } from '@/ApiService';
import { ApiEndPoints } from '@/ApiService/api-end-points';
import Icon from '@/Components/Core/Icons';
import { COLORS } from '@/Assets/Theme/colors';
import { getFullImageUrl } from '@/Utils/ImageUtils';
import ToastModule from '@/Components/Core/Toast';
import styles from './style';

interface CommentSectionProps {
  videoId: string;
  courseId: string;
  communityId?: string;
}

// Helper function for relative time
const getRelativeTime = (date: string) => {
  if (!date) return '';
  const now = new Date();
  const created = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - created.getTime()) / 1000);

  if (diffInSeconds < 60) return 'now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000)
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return created.toLocaleDateString();
};

const CommentSection = ({
  videoId,
  courseId,
  communityId,
}: CommentSectionProps) => {
  const [user]: [any, any] = useAtom(userAtom);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<any[]>([]);
  const [apiGetCommentsLoading, setApiGetCommentsLoading] = useState(false);
  const [isPostingComment, setIsPostingComment] = useState(false);

  const fetchComments = useCallback(async (vId: string) => {
    try {
      setApiGetCommentsLoading(true);
      const url =
        ApiEndPoints.getComments.replace(':videoId', vId) + '?sortBy=newest';
      const response: any = await api.get(url);
      if (response?.success) {
        setComments(response?.data?.comments || []);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setApiGetCommentsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (videoId) {
      fetchComments(videoId);
    }
  }, [videoId, fetchComments]);

  const handleSendComment = async () => {
    if (!comment.trim() || !videoId || isPostingComment) return;

    const tempCommentId = `temp-${Date.now()}`;
    const commentText = comment.trim();

    // Create optimistic comment object
    const optimisticComment = {
      _id: tempCommentId,
      content: commentText,
      createdAt: new Date().toISOString(),
      user: {
        firstName: user?.firstName || 'Me',
        lastName: user?.lastName || '',
        role: user?.role || 'Member',
      },
      userId: {
        profilePicture: user?.profilePicture || null,
        role: user?.role || 'Member',
      },
      likes: [],
      likeCount: 0,
      isOptimistic: true,
    };

    // Instantly reflect in the comment section
    setComments(prev => [optimisticComment, ...prev]);
    setComment('');

    try {
      setIsPostingComment(true);
      const url = ApiEndPoints.comments;
      const body = {
        videoId: videoId,
        content: commentText,
      };

      const response: any = await api.post(url, body);

      if (response?.success) {
        fetchComments(videoId);
      } else {
        setComments(prev => prev.filter(c => c._id !== tempCommentId));
        setComment(commentText);
        ToastModule.errorBottom({ msg: 'Failed to post comment' });
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      setComments(prev => prev.filter(c => c._id !== tempCommentId));
      setComment(commentText);
      ToastModule.errorBottom({ msg: 'Failed to post comment' });
    } finally {
      setIsPostingComment(false);
    }
  };

  const handleToggleLike = async (commentId: string) => {
    const currentUserId = user?._id || user?.id;
    if (!currentUserId) return;

    // Optimistic UI update
    setComments(prev =>
      prev.map(c => {
        if (c._id === commentId) {
          const likes = c.likes || [];
          const isLiked = likes.some((id: any) => {
            const idStr = typeof id === 'object' ? id?._id || id?.id : id;
            return idStr === currentUserId;
          });

          const newLikes = isLiked
            ? likes.filter(
                (id: any) =>
                  (typeof id === 'object' ? id?._id || id?.id : id) !==
                  currentUserId,
              )
            : [...likes, currentUserId];

          return {
            ...c,
            likes: newLikes,
            likeCount: newLikes.length,
          };
        }
        return c;
      }),
    );

    try {
      const url = ApiEndPoints.likeComment.replace(':commentId', commentId);
      await api.post(url, {});
    } catch (error) {
      console.error('Error toggling comment like:', error);
    }
  };

  return (
    <View style={styles.commentSection}>
      <View style={styles.commentInputContainer}>
        <TextInput
          style={styles.commentInput}
          placeholder="Add a comment..."
          placeholderTextColor={COLORS.subText}
          value={comment}
          onChangeText={setComment}
          multiline
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSendComment}
          disabled={!comment.trim() || isPostingComment}
        >
          {isPostingComment ? (
            <ActivityIndicator size="small" color={COLORS.primary} />
          ) : (
            <Icon
              name="SendHorizontal"
              size={24}
              color={comment.trim() ? COLORS.primary : COLORS.subText}
            />
          )}
        </TouchableOpacity>
      </View>

      {apiGetCommentsLoading ? (
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
          style={{ marginTop: 20 }}
        />
      ) : comments.length > 0 ? (
        comments.map(item => {
          const userRole = (item.user?.role || item.userId?.role || '')
            .toString()
            .toLowerCase();
          const isInstructor = userRole === 'owner';
          const hasLiked = (item.likes || []).some((id: any) => {
            const idStr = typeof id === 'object' ? id?._id || id?.id : id;
            return idStr === (user?._id || user?.id);
          });

          return (
            <View key={item._id} style={styles.commentItem}>
              <View style={styles.commentHeader}>
                <View style={styles.commentAvatar}>
                  {item.userId?.profilePicture?.url ? (
                    <Image
                      source={{
                        uri:
                          getFullImageUrl(item.userId?.profilePicture?.url) ??
                          undefined,
                      }}
                      style={styles.commentAvatarImage}
                    />
                  ) : (
                    <Icon name="User" size={20} color={COLORS.gray} />
                  )}
                </View>
                <View style={styles.commentUserDate}>
                  <View style={styles.commentUserRow}>
                    <Text style={styles.commentUser}>
                      {item.user?.firstName} {item.user?.lastName}
                    </Text>
                    {isInstructor && (
                      <View style={styles.instructorBadge}>
                        <Text style={styles.instructorText}>Instructor</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.commentDate}>
                    {getRelativeTime(item.createdAt)}
                  </Text>
                </View>
              </View>
              <Text style={styles.commentText}>{item.content}</Text>

              <View style={styles.commentFooter}>
                <TouchableOpacity
                  style={styles.likeButton}
                  onPress={() => handleToggleLike(item._id)}
                  activeOpacity={0.7}
                >
                  <Icon
                    name="Heart"
                    size={16}
                    color={hasLiked ? COLORS.red : COLORS.subText}
                    fill={hasLiked ? COLORS.red : 'transparent'}
                  />
                  <Text
                    style={[styles.likeCount, hasLiked && { color: COLORS.red }]}
                  >
                    {item.likeCount || 0}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })
      ) : (
        <View style={styles.commentItem}>
          <Text style={styles.emptyText}>
            No comments yet. Be the first to comment!
          </Text>
        </View>
      )}
    </View>
  );
};

export default CommentSection;
