import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
  Image,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import styles from './style';
import Icon from '@/Components/Core/Icons';
import { COLORS } from '@/Assets/Theme/colors';
import { ms } from '@/Assets/Theme/fontStyle';
import AddModeratorModal from '@/Components/Generic/Modals/AddModeratorModal';
import useUserApi from '@/Hooks/Apis/UserApis/use-user-api';
import CommunityModeratorsSkeleton from '@/Components/Core/Skeleton/CommunityModeratorsSkeleton';
import Modal from 'react-native-modal';

interface Moderator {
  _id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  permissions: any;
  status: string;
  profileImage: { url: string | null };
  userId?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePicture?: {
      url: string;
    };
  };
}

interface Props {
  communityId?: string;
}

const ModeratorsTab = ({ communityId }: Props) => {
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [localLoading, setLocalLoading] = useState(true);
  const [localModerators, setLocalModerators] = useState<Moderator[]>([]);
  const [selectedModerator, setSelectedModerator] = useState<Moderator | null>(null);

  const {
    getCommunityModerators,
    apiGetCommunityModeratorsLoading,
    apiGetCommunityModerators,
    clearCommunityModerators,
    addModerator,
    deleteModerator,
    updateModerator,
  } = useUserApi();

  const moderators = apiGetCommunityModerators?.data || [];

  // Sync local moderators with API data
  useEffect(() => {
    if (moderators) {
      setLocalModerators(moderators);
    }
  }, [moderators]);

  const fetchModerators = (showFullLoader = true) => {
    if (showFullLoader) {
      setLocalLoading(true);
    }
    if (communityId) {
      getCommunityModerators(communityId).then(() => {
        if (showFullLoader) {
          setLocalLoading(false);
        }
      });
    }
  };

  useEffect(() => {
    fetchModerators();
    return () => {
      clearCommunityModerators();
    };
  }, [communityId]);

  const getPermissionsString = (permissions: any) => {
    const list: string[] = [];
    if (permissions?.courses?.enabled) list.push('Courses');
    if (permissions?.liveStream?.enabled) list.push('LiveStream');
    if (permissions?.videos?.enabled) list.push('Videos');
    if (permissions?.board?.enabled) list.push('Board');
    if (permissions?.blog?.enabled) list.push('Blog');
    if (permissions?.chat?.enabled) list.push('Chat');
    if (permissions?.settings?.enabled) list.push('Settings');
    return list.join(', ') || 'No special permissions';
  };

  const handleSaveModerators = async (selectedUsers: any[], selectedPermissions: string[]) => {
    if (!communityId) return;

    const isSel = (id: string) => selectedPermissions.includes(id);

    const permissionsPayload = {
      blog: {
        enabled: isSel('blog'),
        actions: {
          createBlog: isSel('blog_create'),
          editBlog: isSel('blog_edit'),
          deleteBlog: isSel('blog_delete'),
          viewBlogOnly: isSel('blog_view_only'),
        },
      },
      board: {
        enabled: isSel('board'),
        actions: {
          createPost: isSel('post_create'),
          comment: isSel('post_comment'),
          editPost: isSel('post_edit'),
          updatePost: isSel('post_edit'),
          deletePost: isSel('post_delete'),
        },
      },
      chat: {
        enabled: isSel('chat'),
        actions: {
          addChannel: isSel('channel_add'),
          addMemberToChannel: isSel('channel_member_add'),
          deleteChannel: isSel('channel_delete'),
          editChannel: isSel('channel_edit'),
          removeMemberFromChannel: isSel('channel_member_remove'),
        },
      },
      courses: {
        enabled: isSel('courses'),
        actions: {
          addCourse: isSel('course_add'),
          deleteCourse: isSel('course_delete'),
          editCourse: isSel('course_edit'),
          updateCourse: isSel('course_edit'),
          viewCourseSettings: isSel('course_view_settings'),
        },
      },
      liveStream: {
        enabled: isSel('live_stream'),
        actions: {
          createStream: isSel('stream_create'),
          editStream: isSel('stream_edit'),
          updateStream: isSel('stream_edit'),
          deleteStream: isSel('stream_delete'),
          scheduleStream: isSel('stream_schedule'),
          viewStreamSettings: isSel('stream_view_settings'),
        },
      },
      settings: {
        enabled: isSel('settings'),
        actions: {
          viewSettingsOnly: isSel('settings_view'),
        },
      },
      videos: {
        enabled: isSel('videos'),
        actions: {
          addVideo: isSel('video_add'),
          updateVideo: isSel('video_update'),
          deleteVideo: isSel('video_delete'),
        },
      },
    };

    for (const user of selectedUsers) {
      await addModerator({
        communityId,
        userId: user.userId,
        permissions: permissionsPayload,
      });
    }

    fetchModerators(false);
    setIsAddModalVisible(false);
  };

  const handleUpdateModerator = async (selectedUsers: any[], selectedPermissions: string[]) => {
    if (!selectedModerator || !communityId) return;
    
    const isSel = (id: string) => selectedPermissions.includes(id);

    const permissions = {
      courses: {
        enabled: isSel('courses'),
        actions: {
          addCourse: isSel('course_add'),
          editCourse: isSel('course_edit'),
          updateCourse: isSel('course_edit'),
          deleteCourse: isSel('course_delete'),
          viewCourseSettings: isSel('course_view_settings'),
        },
      },
      liveStream: {
        enabled: isSel('live_stream'),
        actions: {
          createStream: isSel('stream_create'),
          editStream: isSel('stream_edit'),
          updateStream: isSel('stream_edit'),
          deleteStream: isSel('stream_delete'),
          scheduleStream: isSel('stream_schedule'),
          viewStreamSettings: isSel('stream_view_settings'),
        },
      },
      videos: {
        enabled: isSel('videos'),
        actions: {
          addVideo: isSel('video_add'),
          updateVideo: isSel('video_update'),
          deleteVideo: isSel('video_delete'),
        },
      },
      blog: {
        enabled: isSel('blog'),
        actions: {
          createBlog: isSel('blog_create'),
          editBlog: isSel('blog_edit'),
          deleteBlog: isSel('blog_delete'),
          viewBlogOnly: isSel('blog_view_only'),
        },
      },
      board: {
        enabled: isSel('board'),
        actions: {
          createPost: isSel('post_create'),
          comment: isSel('post_comment'),
          editPost: isSel('post_edit'),
          updatePost: isSel('post_edit'),
          deletePost: isSel('post_delete'),
        },
      },
      chat: {
        enabled: isSel('chat'),
        actions: {
          addChannel: isSel('channel_add'),
          addMemberToChannel: isSel('channel_member_add'),
          removeMemberFromChannel: isSel('channel_member_remove'),
          editChannel: isSel('channel_edit'),
          deleteChannel: isSel('channel_delete'),
        },
      },
      settings: {
        enabled: isSel('settings'),
        actions: {
          viewSettingsOnly: isSel('settings_view'),
        },
      },
    };

    const payload = {
      permissions,
      status: selectedModerator.status || 'active',
    };
    const res = await updateModerator(selectedModerator._id, payload);
    if (res) {
      setIsEditModalVisible(false);
      fetchModerators(false);
    }
  };
  
  const handleToggleStatus = async (moderator: Moderator) => {
    const newStatus = moderator.status === 'active' ? 'inactive' : 'active';
    
    // Optimistic Update
    setLocalModerators(prev => 
      prev.map(m => m._id === moderator._id ? { ...m, status: newStatus } : m)
    );

    const payload = {
      permissions: moderator.permissions,
      status: newStatus,
    };
    const res = await updateModerator(moderator._id, payload);
    if (!res) {
      // Revert if failed
      setLocalModerators(prev => 
        prev.map(m => m._id === moderator._id ? { ...m, status: moderator.status } : m)
      );
    } else {
      fetchModerators(false); // Refetch in background
    }
  };

  const renderItem = (item: any) => {
    const userData = item?.userId && typeof item?.userId === 'object' ? item.userId : item;
    const firstName = userData?.firstName || '';
    const lastName = userData?.lastName || '';
    const fullName = `${firstName} ${lastName}`.trim();
    const email = userData?.email || item?.email || '';
    const profileUrl = userData?.profilePicture?.url || item?.profilePicture?.url;
    
    const initial = firstName ? firstName.charAt(0).toUpperCase() : (fullName ? fullName.charAt(0).toUpperCase() : '?');

    return (
      <View key={item._id} style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.avatar}>
            {profileUrl ? (
              <Image source={{ uri: profileUrl }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarText}>{initial}</Text>
            )}
          </View>
          <View style={styles.headerInfo}>
            <View style={styles.nameRow}>
              <View style={styles.nameContainer}>
                <Text style={styles.name}>{fullName}</Text>
                <View style={styles.roleBadge}>
                  <Text style={styles.roleText}>Moderator</Text>
                </View>
              </View>
            </View>
            <Text style={styles.email}>{email}</Text>
          </View>
        </View>

        <View style={styles.separator} />

        <View style={styles.detailsContainer}>
          <View style={styles.permissionsContainer}>
            <Text style={styles.label}>Permissions:</Text>
            <Text style={styles.permissionsText}>
              {getPermissionsString(item.permissions)}
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.statusContainer}>
            <Switch
              value={item.status === 'active'}
              onValueChange={() => handleToggleStatus(item)}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor={COLORS.white}
              ios_backgroundColor={COLORS.border}
              style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
            />
            <View style={[
              styles.activeBadge, 
              { backgroundColor: item.status === 'active' ? COLORS.primary + '20' : COLORS.border + '40' }
            ]}>
              <Text style={[
                styles.activeText,
                { color: item.status === 'active' ? COLORS.primary : COLORS.subText }
              ]}>
                {item.status === 'active' ? 'Active' : 'Inactive'}
              </Text>
            </View>
          </View>
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              onPress={() => {
                setSelectedModerator(item);
                setIsEditModalVisible(true);
              }}
              style={styles.actionButton}
            >
              <Icon name="Pencil" size={ms(18)} color={COLORS.subText} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                setSelectedModerator(item);
                setIsDeleteModalVisible(true);
              }}
            >
              <Icon name="Trash2" size={ms(18)} color={COLORS.red} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerInnerRow}>
          <Text style={styles.headerTitle}>Moderators</Text>
          <Text style={styles.sectionDescription}>
            Manage the moderators in your community and assign permissions.
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addModeratorContainer}
          onPress={() => setIsAddModalVisible(true)}
        >
          <Icon name="CirclePlus" size={14} color={COLORS.white} />
          <Text style={styles.addModerator}>Add Moderator</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.list}>
        {localLoading || apiGetCommunityModeratorsLoading ? (
          <CommunityModeratorsSkeleton />
        ) : (
          localModerators?.map((item: Moderator) => renderItem(item))
        )}
        {!(localLoading || apiGetCommunityModeratorsLoading) &&
          localModerators.length === 0 && (
            <Text style={styles.noData}>No moderators found.</Text>
          )}
      </View>

      <AddModeratorModal
        isVisible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        onSave={handleSaveModerators}
        communityId={communityId}
      />

      <AddModeratorModal
        isVisible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        onSave={handleUpdateModerator}
        communityId={communityId}
        initialData={selectedModerator}
        mode="edit"
      />

      <Modal
        isVisible={isDeleteModalVisible}
        onBackdropPress={() => setIsDeleteModalVisible(false)}
        onSwipeComplete={() => setIsDeleteModalVisible(false)}
        swipeDirection="down"
        style={styles.modalContainer}
        avoidKeyboard
      >
        <View style={styles.mainModalView}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Remove Moderator</Text>
            <TouchableOpacity onPress={() => setIsDeleteModalVisible(false)}>
              <Icon name="X" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
            <Text style={styles.modalMessage}>
              Are you sure you want to remove{' '}
              <Text style={styles.boldName}>
                {(selectedModerator?.userId as any)?.firstName || (selectedModerator as any)?.firstName}{' '}
                {(selectedModerator?.userId as any)?.lastName || (selectedModerator as any)?.lastName}
              </Text>{' '}
              as a moderator? They will become a normal community member.
            </Text>
          </View>

          <View style={styles.modalFooter}>
            <TouchableOpacity onPress={() => setIsDeleteModalVisible(false)}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalRemoveButton}
              onPress={async () => {
                if (selectedModerator?._id) {
                  await deleteModerator(selectedModerator._id);
                  setIsDeleteModalVisible(false);
                  fetchModerators();
                }
              }}
            >
              <Text style={styles.modalRemoveText}>Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ModeratorsTab;
