import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Skeleton from './index';
import Icon from '@/Components/Core/Icons';
import { COLORS } from '@/Assets/Theme/colors';
import { THEME } from '@/Assets/Theme';
import { ms, mvs } from '@/Assets/Theme/fontStyle';
import { AppImages } from '@/Assets/Images';

type BubbleLayout = {
  isMe: boolean;
  width: number;
  height: number;
  showAvatar?: boolean;
};

const MESSAGE_BUBBLES: BubbleLayout[] = [
  { isMe: false, width: 220, height: 44, showAvatar: true },
  { isMe: true, width: 160, height: 36 },
  { isMe: false, width: 180, height: 52, showAvatar: true },
  { isMe: true, width: 200, height: 40 },
  { isMe: false, width: 140, height: 36, showAvatar: true },
  { isMe: true, width: 120, height: 32 },
];

/** Skeleton bubbles only — use inside the chat ImageBackground while messages load. */
export const ChatMessagesAreaSkeleton = () => {
  const renderBubble = (bubble: BubbleLayout, index: number) => {
    const rowStyle = bubble.isMe ? styles.messageRowMe : styles.messageRow;

    return (
      <View key={`bubble-${index}`} style={rowStyle}>
        {!bubble.isMe && bubble.showAvatar ? (
          <Skeleton width={ms(32)} height={ms(32)} borderRadius={ms(16)} />
        ) : !bubble.isMe ? (
          <View style={styles.avatarSpacer} />
        ) : null}

        <View
          style={
            bubble.isMe ? styles.bubbleWrapperMe : styles.bubbleWrapperThem
          }
        >
          <Skeleton
            width={ms(bubble.width)}
            height={ms(bubble.height)}
            borderRadius={ms(18)}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.messagesContainer}>
      {MESSAGE_BUBBLES.map(renderBubble)}
    </View>
  );
};

type Props = {
  variant?: 'channel' | 'dm';
  paddingTop?: number;
  paddingBottom?: number;
  onBackPress?: () => void;
  headerTitle?: string;
  headerSubtitle?: string;
  headerAvatarUrl?: string | null;
  headerAvatarInitials?: string;
};

const ChatConversationSkeleton = ({
  variant = 'channel',
  paddingTop = 0,
  paddingBottom = 10,
  onBackPress,
  headerTitle,
  headerSubtitle,
  headerAvatarUrl,
  headerAvatarInitials = 'U',
}: Props) => {
  return (
    <View style={[styles.container, { paddingTop }]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onBackPress}
          style={styles.backBtn}
          disabled={!onBackPress}
        >
          <Icon
            name={Platform.OS === 'ios' ? 'ChevronLeft' : 'ArrowLeft'}
            size={24}
            color={COLORS.white}
          />
        </TouchableOpacity>

        {variant === 'dm' ? (
          <View style={styles.headerAvatar}>
            {headerAvatarUrl ? (
              <Image
                source={{ uri: headerAvatarUrl }}
                style={styles.headerAvatarImage}
              />
            ) : (
              <Text style={styles.headerAvatarText}>{headerAvatarInitials}</Text>
            )}
          </View>
        ) : null}

        <View style={styles.headerContent}>
          {headerTitle ? (
            <Text style={styles.headerTitle} numberOfLines={1}>
              {headerTitle}
            </Text>
          ) : (
            <Skeleton
              width={ms(variant === 'dm' ? 140 : 120)}
              height={ms(18)}
              style={{ marginBottom: mvs(6) }}
            />
          )}

          {variant === 'channel' ? (
            headerSubtitle ? (
              <Text style={styles.headerSubTitle} numberOfLines={1}>
                {headerSubtitle}
              </Text>
            ) : (
              <Skeleton width={ms(180)} height={ms(12)} />
            )
          ) : null}
        </View>
      </View>

      <View style={styles.body}>
        <ImageBackground
          source={AppImages.chatBg}
          resizeMode="cover"
          style={styles.chatArea}
        >
          <ChatMessagesAreaSkeleton />
        </ImageBackground>

        <View style={[styles.inputMainContainer, { paddingBottom }]}>
          <View style={styles.inputInnerContainer}>
            <Skeleton width={ms(22)} height={ms(22)} borderRadius={ms(4)} />
            <Skeleton height={ms(40)} style={styles.inputSkeleton} />
            <Skeleton
              width={ms(40)}
              height={ms(40)}
              borderRadius={ms(20)}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: ms(16),
    paddingVertical: mvs(12),
    backgroundColor: COLORS.header,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  backBtn: {
    padding: ms(8),
    marginRight: ms(8),
  },
  headerAvatar: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(18),
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: ms(10),
    overflow: 'hidden',
  },
  headerAvatarImage: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(18),
  },
  headerAvatarText: {
    ...THEME.fontStyle.h5Bold,
    color: COLORS.white,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    ...THEME.fontStyle.h4Bold,
    color: COLORS.white,
  },
  headerSubTitle: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.subText,
    marginTop: mvs(2),
  },
  body: {
    flex: 1,
  },
  chatArea: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: ms(10),
    paddingVertical: mvs(10),
    gap: mvs(12),
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: ms(8),
  },
  messageRowMe: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-end',
    gap: ms(8),
  },
  avatarSpacer: {
    width: ms(32),
  },
  bubbleWrapperMe: {
    flex: 1,
    alignItems: 'flex-end',
  },
  bubbleWrapperThem: {
    flex: 1,
    alignItems: 'flex-start',
  },
  inputMainContainer: {
    backgroundColor: COLORS.black,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: ms(10),
    paddingTop: mvs(10),
  },
  inputInnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(8),
  },
  inputSkeleton: {
    flex: 1,
    borderRadius: ms(20),
  },
});

export default ChatConversationSkeleton;
