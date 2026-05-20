import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import type { NavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/Components/Core/Icons';
import { COLORS } from '@/Assets/Theme/colors';
import styles from './style';
import {
  formatFileSize,
  getAttachmentDisplayName,
  getAttachmentKind,
  getFileTypeMeta,
  openChatAttachment,
  resolveAttachmentUrl,
} from './chatAttachmentUtils';

type ChatFileAttachmentProps = {
  attachment: any;
  navigation?: NavigationProp<Record<string, object | undefined>>;
};

const ChatFileAttachment: React.FC<ChatFileAttachmentProps> = ({
  attachment,
  navigation: navigationProp,
}) => {
  const defaultNavigation = useNavigation<
    NavigationProp<Record<string, object | undefined>>
  >();
  const navigation = navigationProp ?? defaultNavigation;

  const kind = useMemo(() => getAttachmentKind(attachment), [attachment]);
  const uri = useMemo(() => resolveAttachmentUrl(attachment), [attachment]);
  const displayName = useMemo(
    () => getAttachmentDisplayName(attachment),
    [attachment],
  );
  const fileMeta = useMemo(
    () => getFileTypeMeta(attachment, kind),
    [attachment, kind],
  );
  const sizeLabel = attachment?.size
    ? formatFileSize(Number(attachment.size))
    : '';

  const handlePress = () => {
    openChatAttachment(navigation, attachment);
  };

  return (
    <View style={styles.attachmentFileWrap}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handlePress}
        style={styles.attachmentFileCard}
        disabled={!uri}
      >
        <View
          style={[
            styles.attachmentFileIconBox,
            { backgroundColor: fileMeta.accent },
          ]}
        >
          <Icon name={fileMeta.icon} size={20} color={COLORS.white} />
        </View>

        <View style={styles.attachmentFileContent}>
          <Text style={styles.attachmentFileType}>{fileMeta.label}</Text>
          <Text style={styles.attachmentFileName} numberOfLines={2}>
            {displayName}
          </Text>
          {sizeLabel ? (
            <Text style={styles.attachmentFileSize}>{sizeLabel}</Text>
          ) : null}
        </View>

        <View style={styles.attachmentFileOpen}>
          <Icon name="ChevronRight" size={16} color="rgba(255,255,255,0.7)" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default React.memo(ChatFileAttachment);
