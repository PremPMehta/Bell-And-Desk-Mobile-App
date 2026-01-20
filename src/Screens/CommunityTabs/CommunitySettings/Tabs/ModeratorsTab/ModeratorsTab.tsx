import { View, Text, TouchableOpacity, Switch } from 'react-native';
import React, { useState } from 'react';
import styles from './style';
import Icon from '@/Components/Core/Icons';
import { COLORS } from '@/Assets/Theme/colors';
import AddModeratorModal from '@/Components/Generic/Modals/AddModeratorModal';
import { MOCK_MODERATORS_DATA } from '@/Constants/customData';

const ModeratorsTab = () => {
  const [isAddModeratorModalVisible, setIsAddModeratorModalVisible] =
    useState(false);

  const renderItem = ({
    item,
    index,
  }: {
    item: (typeof MOCK_MODERATORS_DATA)[0];
    index: number;
  }) => {
    return (
      <View key={item.id} style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{item.initial}</Text>
          </View>
          <View style={styles.headerInfo}>
            <View style={styles.nameRow}>
              <View style={styles.nameContainer}>
                <Text style={styles.name}>{item.name}</Text>
                <View style={styles.roleBadge}>
                  <Text style={styles.roleText}>{item.role}</Text>
                </View>
              </View>
            </View>
            <Text style={styles.email}>{item.email}</Text>
          </View>
        </View>

        <View style={styles.separator} />

        <View style={styles.detailsContainer}>
          <View style={styles.permissionsContainer}>
            <Text style={styles.label}>Permissions:</Text>
            <Text style={styles.permissionsText}>{item.permissions}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.statusContainer}>
            <Switch
              value={item.isActive}
              onValueChange={() => {}} // Handle toggle logic here later
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor={COLORS.white}
              ios_backgroundColor={COLORS.border}
              style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }} // Adjust size if needed
            />
            <View style={styles.activeBadge}>
              <Text style={styles.activeText}>{item.statusLabel}</Text>
            </View>
          </View>
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton}>
              <Icon name="Pencil" size={16} color={COLORS.lightGray} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Icon name="Trash2" size={16} color={COLORS.red} />
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
          onPress={() => setIsAddModeratorModalVisible(true)}
        >
          <Icon name="CirclePlus" size={14} color={COLORS.white} />
          <Text style={styles.addModerator}>Add Moderator</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.list}>
        {MOCK_MODERATORS_DATA?.map((item, index) =>
          renderItem({ item, index }),
        )}
      </View>

      <AddModeratorModal
        isVisible={isAddModeratorModalVisible}
        onClose={() => setIsAddModeratorModalVisible(false)}
        onSave={selectedUsers => {
          console.log('Selected Users:', selectedUsers);
          // TODO: Handle adding moderators logic here
        }}
      />
    </View>
  );
};

export default ModeratorsTab;
