import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';

import styles from './style';
import Icon from '@/Components/Core/Icons';
import { COLORS } from '@/Assets/Theme/colors';

type ChannelChatHeaderProps = {
  channelName?: string;
  channelDescription?: string;
  selectedMessageId: string | null;
  onBackPress: () => void;
  onHeaderPress: () => void;
  onDeletePress: () => void;
};

const ChannelChatHeader = ({
  channelName,
  channelDescription,
  selectedMessageId,
  onBackPress,
  onHeaderPress,
  onDeletePress,
}: ChannelChatHeaderProps) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBackPress} style={styles.backBtn}>
        <Icon
          name={Platform.OS === 'ios' ? 'ChevronLeft' : 'ArrowLeft'}
          size={24}
          color={COLORS.white}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.headerContent}
        onPress={onHeaderPress}
        disabled={!!selectedMessageId}
      >
        <Text style={styles.headerTitle}>#{channelName || 'General'}</Text>

        <Text style={styles.headerSubTitle}>
          {channelDescription || 'Community Channel'}
        </Text>
      </TouchableOpacity>

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

export default React.memo(ChannelChatHeader);
