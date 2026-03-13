import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Image,
} from 'react-native';
import Modal from 'react-native-modal';
import { COLORS } from '@/Assets/Theme/colors';
import { ms } from '@/Assets/Theme/fontStyle';
import Icon from '@/Components/Core/Icons';
import TextInputField from '@/Components/Core/TextInputField';
import styles from './style';
import { MODERATOR_PERMISSIONS } from '@/Constants/customData';
import useUserApi from '@/Hooks/Apis/UserApis/use-user-api';
import { ActivityIndicator } from 'react-native';
import ToastModule from '@/Components/Core/Toast';
import Toast from 'react-native-toast-message';

interface AddModeratorModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (selectedUsers: any[], selectedPermissions: string[]) => void;
  communityId?: string;
  initialData?: any;
  mode?: 'add' | 'edit';
}

const AddModeratorModal: React.FC<AddModeratorModalProps> = ({
  isVisible,
  onClose,
  onSave,
  communityId,
  initialData,
  mode = 'add',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const {
    getAvailableMembers,
    apiGetAvailableMembersLoading,
    apiGetAvailableMembers,
    clearAvailableMembers,
  } = useUserApi();

  const availableMembers: any[] = apiGetAvailableMembers?.data || [];

  // Combine available members with the current moderator for display in edit mode
  const displayMembers = React.useMemo(() => {
    if (mode === 'edit' && initialData) {
      const userData =
        initialData.userId && typeof initialData.userId === 'object'
          ? initialData.userId
          : initialData;
      const currentUserId = userData._id || userData.userId;

      const isAlreadyInList = availableMembers.find(
        m => m.userId === currentUserId,
      );
      if (!isAlreadyInList && userData) {
        // Map userData to the format expected by renderUserItem
        const formattedUser = {
          userId: currentUserId,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          profilePicture: userData.profilePicture || userData.profileImage,
        };
        return [formattedUser, ...availableMembers];
      }
    }
    return availableMembers;
  }, [availableMembers, mode, initialData]);

  // Reset state when modal opens
  useEffect(() => {
    if (isVisible) {
      if (mode === 'edit' && initialData) {
        setSearchQuery('');
        // In edit mode, we pre-fill permissions
        const permissions = initialData.permissions || {};
        const prefilled: string[] = [];

        // Helper to map flat permissions to UI IDs
        if (permissions.courses?.enabled) prefilled.push('courses');
        if (permissions.courses?.actions?.addCourse)
          prefilled.push('course_add');
        if (permissions.courses?.actions?.editCourse)
          prefilled.push('course_edit');
        if (permissions.courses?.actions?.deleteCourse)
          prefilled.push('course_delete');
        if (permissions.courses?.actions?.viewCourseSettings)
          prefilled.push('course_view_settings');

        if (permissions.liveStream?.enabled) prefilled.push('live_stream');
        if (permissions.liveStream?.actions?.createStream)
          prefilled.push('stream_create');
        if (permissions.liveStream?.actions?.editStream)
          prefilled.push('stream_edit');
        if (permissions.liveStream?.actions?.deleteStream)
          prefilled.push('stream_delete');
        if (permissions.liveStream?.actions?.scheduleStream)
          prefilled.push('stream_schedule');
        if (permissions.liveStream?.actions?.viewStreamSettings)
          prefilled.push('stream_view_settings');

        if (permissions.videos?.enabled) prefilled.push('videos');
        if (permissions.videos?.actions?.addVideo) prefilled.push('video_add');
        if (permissions.videos?.actions?.updateVideo)
          prefilled.push('video_update');
        if (permissions.videos?.actions?.deleteVideo)
          prefilled.push('video_delete');

        if (permissions.blog?.enabled) prefilled.push('blog');
        if (permissions.blog?.actions?.createBlog)
          prefilled.push('blog_create');
        if (permissions.blog?.actions?.editBlog) prefilled.push('blog_edit');
        if (permissions.blog?.actions?.deleteBlog)
          prefilled.push('blog_delete');
        if (permissions.blog?.actions?.viewBlogOnly)
          prefilled.push('blog_view_only');

        if (permissions.board?.enabled) prefilled.push('board');
        if (permissions.board?.actions?.createPost)
          prefilled.push('post_create');
        if (permissions.board?.actions?.comment) prefilled.push('post_comment');
        if (permissions.board?.actions?.editPost) prefilled.push('post_edit');
        if (permissions.board?.actions?.deletePost)
          prefilled.push('post_delete');

        if (permissions.chat?.enabled) prefilled.push('chat');
        if (permissions.chat?.actions?.addChannel)
          prefilled.push('channel_add');
        if (permissions.chat?.actions?.addMemberToChannel)
          prefilled.push('channel_member_add');
        if (permissions.chat?.actions?.removeMemberFromChannel)
          prefilled.push('channel_member_remove');
        if (permissions.chat?.actions?.editChannel)
          prefilled.push('channel_edit');
        if (permissions.chat?.actions?.deleteChannel)
          prefilled.push('channel_delete');

        if (permissions.settings?.enabled) {
          prefilled.push('settings');
          if (permissions.settings?.actions?.viewSettingsOnly)
            prefilled.push('settings_view');
        }

        setSelectedPermissions(prefilled);

        // Ensure we fetch other members even in edit mode
        if (communityId) {
          getAvailableMembers(communityId);
        }

        const userData =
          initialData.userId && typeof initialData.userId === 'object'
            ? initialData.userId
            : initialData;
        setSelectedUserIds([userData._id || userData.userId]);
      } else {
        setSearchQuery('');
        setSelectedUserIds([]);
        setSelectedPermissions([]);
        setIsDropdownOpen(false);
        if (communityId) {
          getAvailableMembers(communityId);
        }
      }
    } else {
      clearAvailableMembers();
    }
  }, [isVisible, communityId, mode, initialData]);

  const filteredUsers = displayMembers.filter(user => {
    const fullName = `${user?.firstName || ''} ${
      user?.lastName || ''
    }`.toLowerCase();
    const email = (user?.email || '').toLowerCase();
    const search = searchQuery.toLowerCase();
    return fullName.includes(search) || email.includes(search);
  });

  const toggleUserSelection = (userId: string) => {
    setSelectedUserIds(prev => {
      if (prev.includes(userId)) {
        return prev.filter(item => item !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const handleSave = () => {
    if (selectedUserIds.length === 0) {
      ToastModule.errorTop({ msg: 'Please select at least one user' });
      return;
    }

    if (selectedPermissions.length === 0) {
      ToastModule.errorTop({
        msg: 'Please select at least one permission module',
      });
      return;
    }

    const selectedUsers = displayMembers.filter(user =>
      selectedUserIds.includes(user.userId),
    );
    onSave(selectedUsers, selectedPermissions);
    onClose();
  };

  const togglePermission = (id: string, children: { id: string }[] = []) => {
    setSelectedPermissions(prev => {
      const isSelected = prev.includes(id);
      let newPermissions = [...prev];

      if (children.length > 0) {
        // Parent toggle
        const childrenIds = children.map(c => c.id);
        if (isSelected) {
          // Deselect parent and all children
          newPermissions = newPermissions.filter(
            p => p !== id && !childrenIds.includes(p),
          );
        } else {
          // Select parent and all children
          newPermissions = [...newPermissions, id, ...childrenIds];
        }
      } else {
        // Child toggle
        if (isSelected) {
          newPermissions = newPermissions.filter(p => p !== id);
        } else {
          newPermissions.push(id);
        }

        // Check if we need to update parent state?
        // For simplicity, we just track individual IDs.
        // If we want parent to auto-select/deselect, we can add logic here.
        // Let's implement auto-selection logic for better UX
        MODERATOR_PERMISSIONS.forEach(group => {
          const groupChildrenIds = group.children.map(c => c.id);
          if (groupChildrenIds.includes(id)) {
            // If toggled item is a child
            const allChildrenSelected = groupChildrenIds.every(childId =>
              childId === id ? !isSelected : newPermissions.includes(childId),
            );

            if (allChildrenSelected) {
              if (!newPermissions.includes(group.id))
                newPermissions.push(group.id);
            } else {
              newPermissions = newPermissions.filter(p => p !== group.id);
            }
          }
        });
      }
      return [...new Set(newPermissions)]; // Ensure uniqueness
    });
  };

  // Helper to handle parent click specifically to include its logic
  const handleParentToggle = (group: (typeof MODERATOR_PERMISSIONS)[0]) => {
    const childrenIds = group.children.map(c => c.id);
    const isParentSelected = selectedPermissions.includes(group.id);

    setSelectedPermissions(prev => {
      let newPermissions = [...prev];
      if (isParentSelected) {
        // Deselect parent and all children
        newPermissions = newPermissions.filter(
          p => p !== group.id && !childrenIds.includes(p),
        );
      } else {
        // Select parent and all children
        newPermissions = [...newPermissions, group.id, ...childrenIds];
      }
      return [...new Set(newPermissions)];
    });
  };

  const renderUserItem = ({ item }: { item: any }) => {
    const userId = item.userId;
    const isSelected = selectedUserIds.includes(userId);
    const fullName = `${item.firstName || ''} ${item.lastName || ''}`.trim();
    const initial = item.firstName
      ? item.firstName.charAt(0).toUpperCase()
      : '?';
    const profileUrl = item?.profilePicture?.url;
    return (
      <TouchableOpacity
        style={styles.userItem}
        onPress={() => toggleUserSelection(userId)}
        activeOpacity={0.7}
      >
        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
          {isSelected && <Icon name="Check" size={12} color={COLORS.white} />}
        </View>
        <View style={styles.avatar}>
          {profileUrl ? (
            <Image source={{ uri: profileUrl }} style={styles.avatarImage} />
          ) : (
            <Text style={styles.avatarText}>{initial}</Text>
          )}
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{fullName || 'Unknown'}</Text>
          <Text style={styles.userEmail}>{item.email || 'No email'}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderPermissionGroup = (group: (typeof MODERATOR_PERMISSIONS)[0]) => {
    const isParentSelected = selectedPermissions.includes(group.id);

    return (
      <View key={group.id} style={styles.permissionGroup}>
        <TouchableOpacity
          style={styles.permissionParentRow}
          onPress={() => handleParentToggle(group)}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.checkbox,
              isParentSelected && styles.checkboxSelected,
            ]}
          >
            {isParentSelected && (
              <Icon name="Check" size={12} color={COLORS.white} />
            )}
          </View>
          <Text style={styles.permissionParentText}>{group.title}</Text>
        </TouchableOpacity>

        {group.children.map(child => {
          const isChildSelected = selectedPermissions.includes(child.id);
          return (
            <TouchableOpacity
              key={child.id}
              style={styles.permissionChildRow}
              onPress={() => togglePermission(child.id)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.checkbox,
                  isChildSelected && styles.checkboxSelected,
                ]}
              >
                {isChildSelected && (
                  <Icon name="Check" size={12} color={COLORS.white} />
                )}
              </View>
              <Text style={styles.permissionChildText}>{child.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <Modal
      isVisible={isVisible}
      onSwipeComplete={onClose}
      onBackdropPress={onClose}
      swipeDirection="down"
      style={styles.modalContainer}
      avoidKeyboard
      propagateSwipe={true}
    >
      <View style={styles.mainModalView}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {mode === 'edit' ? 'Edit Moderator' : 'Add Moderators'}
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Icon name="X" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: ms(20) }}
        >
          <Text style={styles.sectionTitle}>Select Users</Text>

          <View style={styles.dropdownContainer}>
            <TouchableOpacity
              style={styles.dropdownTrigger}
              onPress={() => setIsDropdownOpen(!isDropdownOpen)}
              activeOpacity={0.8}
            >
              <Text style={styles.dropdownPlaceholder}>
                {selectedUserIds.length > 0
                  ? `${selectedUserIds.length} User${
                      selectedUserIds.length > 1 ? 's' : ''
                    } Selected`
                  : 'Select Users...'}
              </Text>
              <Icon
                name={isDropdownOpen ? 'ChevronUp' : 'ChevronDown'}
                size={20}
                color={COLORS.subText}
              />
            </TouchableOpacity>

            {isDropdownOpen && (
              <View style={styles.dropdownContent}>
                <View style={styles.searchContainer}>
                  <TextInputField
                    placeholder="Search user..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    leftIcon="magnify"
                    theme={{
                      colors: {
                        background: COLORS.innerCardBG,
                        text: COLORS.white,
                        placeholder: COLORS.outlineGrey,
                      },
                    }}
                    style={{ backgroundColor: COLORS.innerCardBG }}
                    textColor={COLORS.white}
                  />
                </View>

                <View style={[styles.listContainer, { minHeight: ms(100) }]}>
                  {apiGetAvailableMembersLoading ? (
                    <View style={{ padding: ms(20) }}>
                      <ActivityIndicator size="small" color={COLORS.primary} />
                    </View>
                  ) : (
                    <FlatList
                      data={filteredUsers}
                      renderItem={renderUserItem}
                      keyExtractor={item => item.userId}
                      showsVerticalScrollIndicator={false}
                      contentContainerStyle={{ paddingBottom: 20 }}
                      nestedScrollEnabled={true}
                      ListEmptyComponent={
                        <View style={{ padding: ms(20) }}>
                          <Text
                            style={{
                              color: COLORS.subText,
                              textAlign: 'center',
                            }}
                          >
                            No members found
                          </Text>
                        </View>
                      }
                    />
                  )}
                </View>
              </View>
            )}
          </View>

          <Text style={styles.sectionTitle}>Assign Permissions</Text>
          <View style={styles.permissionsContainer}>
            {MODERATOR_PERMISSIONS.map(renderPermissionGroup)}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveText}>
              {mode === 'edit' ? 'Update Moderator' : 'Save Moderators'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <Toast />
    </Modal>
  );
};

export default AddModeratorModal;
