import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';
import Modal from 'react-native-modal';
import { COLORS } from '@/Assets/Theme/colors';
import { ms } from '@/Assets/Theme/fontStyle';
import Icon from '@/Components/Core/Icons';
import TextInputField from '@/Components/Core/TextInputField';
import styles from './style';
import {
  ADD_MODERATOR_USERS,
  MODERATOR_PERMISSIONS,
} from '@/Constants/customData';

interface AddModeratorModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (selectedUsers: any[], selectedPermissions: string[]) => void;
}

const AddModeratorModal: React.FC<AddModeratorModalProps> = ({
  isVisible,
  onClose,
  onSave,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (isVisible) {
      setSearchQuery('');
      setSelectedUserIds([]);
      setSelectedPermissions([]);
      setIsDropdownOpen(false);
    }
  }, [isVisible]);

  const filteredUsers = ADD_MODERATOR_USERS.filter(
    user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const toggleUserSelection = (id: string) => {
    setSelectedUserIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSave = () => {
    const selectedUsers = ADD_MODERATOR_USERS.filter(user =>
      selectedUserIds.includes(user.id),
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

  const renderUserItem = ({
    item,
  }: {
    item: (typeof ADD_MODERATOR_USERS)[0];
  }) => {
    const isSelected = selectedUserIds.includes(item.id);
    return (
      <TouchableOpacity
        style={styles.userItem}
        onPress={() => toggleUserSelection(item.id)}
        activeOpacity={0.7}
      >
        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
          {isSelected && <Icon name="Check" size={12} color={COLORS.white} />}
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.initial}</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userEmail}>{item.email}</Text>
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
          <Text style={styles.title}>Add Moderators</Text>
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
                  ? `${selectedUserIds.length} Users Selected`
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

                <View style={styles.listContainer}>
                  <FlatList
                    data={filteredUsers}
                    renderItem={renderUserItem}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    nestedScrollEnabled={true}
                  />
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
            <Text style={styles.saveText}>Save Moderators</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default AddModeratorModal;
