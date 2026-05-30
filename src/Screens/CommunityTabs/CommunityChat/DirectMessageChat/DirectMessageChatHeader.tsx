import React from 'react';
import { View, Text, TouchableOpacity, Image, Platform } from 'react-native';

import styles from './style';
import Icon from '@/Components/Core/Icons';
import { COLORS } from '@/Assets/Theme/colors';

type DirectMessageChatHeaderProps = {
  participantName: string;
  participantAvatar: string | null;
  participantInitials: string;
  selectedMessageId: string | null;
  onBackPress: () => void;
  onDeletePress: () => void;
};

const DirectMessageChatHeader = ({
  participantName,
  participantAvatar,
  participantInitials,
  selectedMessageId,
  onBackPress,
  onDeletePress,
}: DirectMessageChatHeaderProps) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBackPress} style={styles.backBtn}>
        <Icon
          name={Platform.OS === 'ios' ? 'ChevronLeft' : 'ArrowLeft'}
          size={24}
          color={COLORS.white}
        />
      </TouchableOpacity>

      <View style={styles.headerAvatar}>
        {participantAvatar ? (
          <Image source={{ uri: participantAvatar }} style={styles.headerAvatarImage} />
        ) : (
          <Text style={styles.headerAvatarText}>{participantInitials}</Text>
        )}
      </View>

      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>{participantName}</Text>
      </View>

      {selectedMessageId ? (
        <TouchableOpacity
          onPress={onDeletePress}
          style={styles.headerDeleteBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Icon name="Trash2" size={22} color={COLORS.red} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default React.memo(DirectMessageChatHeader);
