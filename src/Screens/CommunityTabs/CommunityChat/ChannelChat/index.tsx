import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ImageBackground,
  Platform,
  Pressable,
} from 'react-native';

import {
  KeyboardChatScrollView,
  KeyboardStickyView,
} from 'react-native-keyboard-controller';

import {
  useRoute,
  useNavigation,
  useFocusEffect,
} from '@react-navigation/native';

import styles from './style';
import Icon from '@/Components/Core/Icons';
import { COLORS } from '@/Assets/Theme/colors';
import { AppImages } from '@/Assets/Images';
import useUserApi from '@/Hooks/Apis/UserApis/use-user-api';
import ChannelDetailsModal from './ChannelDetailsModal';
import ReactionDetailsModal from './ReactionDetailsModal';
import EmojiPickerModal from './EmojiPickerModal';
import SocketService from '@/Services/SocketService';

import { useAtom } from 'jotai';
import { chatMessagesAtom, typingUsersAtom } from '@/Jotai/Atoms';
import { store } from '@/Jotai/Store';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

const VirtualizedListScrollView = React.memo(
  React.forwardRef<any, any>((props, ref) => {
    return (
      <KeyboardChatScrollView
        ref={ref}
        automaticallyAdjustContentInsets={false}
        contentInsetAdjustmentBehavior="never"
        {...props}
      />
    );
  }),
);

const ChannelChat = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const { channelData, communityId } = route.params ?? {};

  const [inputText, setInputText] = useState('');
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const [isReactionDetailsVisible, setIsReactionDetailsVisible] =
    useState(false);
  const [reactionDetailMessage, setReactionDetailMessage] = useState<any>(null);

  const {
    getChatMessages,
    sendChatMessage,
    getChatCommunityMembers,
    apiGetChatCommunityMembers,
    markChannelRead,
    reactToMessage,
    user,
  } = useUserApi();

  const [longPressedMessage, setLongPressedMessage] = useState<any>(null);
  const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);
  const [emojiAnchor, setEmojiAnchor] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
    isMe: boolean;
    touchX?: number | null;
    touchY?: number | null;
  } | null>(null);

  const [, setAllMessages] = useAtom(chatMessagesAtom);
  useAtom(typingUsersAtom);

  const channelIdRaw = channelData?._id ?? channelData?.id;

  const channelId =
    channelIdRaw !== undefined && channelIdRaw !== null
      ? String(channelIdRaw).trim()
      : '';

  const [liveMessages, setLiveMessages] = useState<any[]>([]);
  const [liveTypingUsers, setLiveTypingUsers] = useState<any[]>([]);

  const lastSigRef = useRef<string>('');

  const flatListRef = useRef<FlatList>(null);
  const messageBubbleRefs = useRef<Map<string, any>>(new Map());
  const scrollOffsetRef = useRef(0);
  const freezeScrollOffsetRef = useRef<number | null>(null);

  // const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isTypingRef = useRef(false);

  const [isInitialLoading, setIsInitialLoading] = useState(false);

  const hasFetchedInitialRef = useRef<string | null>(null);

  const [composerHeight, setComposerHeight] = useState(75);

  const normalizeId = (value: any): string => {
    if (value == null) return '';
    if (typeof value === 'string') return value.trim();
    if (typeof value === 'object') {
      if (typeof value?.toHexString === 'function') return value.toHexString();
      if (value?._id != null) return String(value._id).trim();
      if (value?.id != null) return String(value.id).trim();
      if (typeof value?.$oid === 'string') return value.$oid.trim();
    }
    return String(value).trim();
  };

  const computeSig = (arr: any[]) => {
    if (!arr || arr.length === 0) return 'empty';
    // Newest message info (arr[0] because it's inverted)
    const newest = arr[0];
    const newestId = newest?._id || newest?.id || 'none';
    const newestTime = newest?.updatedAt || newest?.createdAt || 'none';

    // Total reaction count to detect reaction updates in any message
    let reactionSig = 0;
    arr.forEach(m => {
      if (m.reactions && Array.isArray(m.reactions)) {
        reactionSig += m.reactions.length;
      }
    });

    return `${arr.length}:${newestId}:${newestTime}:${reactionSig}`;
  };

  const pullFromStore = useCallback(() => {
    if (!channelId) return;

    const msgState = store.get(chatMessagesAtom);
    const typingState = store.get(typingUsersAtom);

    const nextMsgs = msgState?.[channelId] ?? [];
    const nextTyping = typingState?.[channelId] ?? [];

    const sig = computeSig(nextMsgs);

    if (sig !== lastSigRef.current) {
      lastSigRef.current = sig;
      setLiveMessages(nextMsgs);
    }

    setLiveTypingUsers(nextTyping);
  }, [channelId]);

  useEffect(() => {
    pullFromStore();

    const unsubMsgs = store.sub(chatMessagesAtom, pullFromStore);

    const unsubTyping = store.sub(typingUsersAtom, pullFromStore);

    return () => {
      unsubMsgs();
      unsubTyping();
    };
  }, [pullFromStore]);

  const messages = liveMessages || [];

  const formatDateLabel = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();

    const isSameDay = (d1: Date, d2: Date) =>
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();

    if (isSameDay(date, now)) return 'Today';

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    if (isSameDay(date, yesterday)) return 'Yesterday';

    return date.toLocaleDateString([], {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const typingUsers = liveTypingUsers || [];

  const othersTyping = typingUsers.filter(u => {
    const uId = normalizeId(u.userId || u._id || u.id);
    const myId = normalizeId(user?._id || user?.id);
    return !!uId && uId !== myId;
  });

  const renderTypingIndicator = () => {
    if (othersTyping.length === 0) return null;

    const getDisplayName = (u: any) => {
      console.log('🚀 ~ getDisplayName ~ u:', u);
      const first = u.firstName || u.sender?.firstName;
      const last = u.lastName || u.sender?.lastName;
      const full = [first].filter(Boolean).join(' ').trim(); //  [first, last].filter(Boolean).join(' ').trim();
      return (
        full ||
        u.name ||
        u.userName ||
        u.username ||
        u.sender?.name ||
        'Someone'
      );
    };

    let content;
    if (othersTyping.length === 1) {
      content = (
        <Text style={styles.typingText}>
          <Text style={{ color: COLORS.primary, fontWeight: '600' }}>
            {getDisplayName(othersTyping[0])}
          </Text>{' '}
          is typing...
        </Text>
      );
    } else if (othersTyping.length === 2) {
      content = (
        <Text style={styles.typingText}>
          <Text style={{ color: COLORS.primary, fontWeight: '600' }}>
            {getDisplayName(othersTyping[0])}
          </Text>{' '}
          and{' '}
          <Text style={{ color: COLORS.primary, fontWeight: '600' }}>
            {getDisplayName(othersTyping[1])}
          </Text>{' '}
          are typing...
        </Text>
      );
    } else {
      content = (
        <Text style={styles.typingText}>
          <Text style={{ color: COLORS.primary, fontWeight: '600' }}>
            {getDisplayName(othersTyping[0])}
          </Text>{' '}
          and {othersTyping.length - 1} others are typing...
        </Text>
      );
    }

    return <View style={styles.typingIndicator}>{content}</View>;
  };

  const members = apiGetChatCommunityMembers?.data || [];

  useEffect(() => {
    if (!channelId) return;

    markChannelRead(channelId);

    if (communityId) {
      SocketService.setCommunityId(communityId);
      getChatCommunityMembers(communityId);
    }

    SocketService.joinChannel(channelId);

    return () => {
      SocketService.leaveChannel(channelId);
    };
  }, [channelId, communityId]);

  const fetchInitialMessagesOnce = useCallback(async () => {
    if (!channelId) return;

    if (hasFetchedInitialRef.current === channelId) return;

    hasFetchedInitialRef.current = channelId;

    setIsInitialLoading(true);

    try {
      const res = await getChatMessages(channelId);

      const apiMessages = res?.data || [];

      if (Array.isArray(apiMessages) && apiMessages.length > 0) {
        setAllMessages(prev => {
          const current = prev[channelId] || [];

          const map = new Map<string, any>();

          apiMessages.forEach((m: any) => {
            const id = m?._id || m?.id;

            if (id) map.set(String(id), m);
          });

          current.forEach((m: any) => {
            const id = m?._id || m?.id;

            if (id && !map.has(String(id))) {
              map.set(String(id), m);
            }
          });

          const merged = Array.from(map.values()).sort((a: any, b: any) => {
            const ta = new Date(b?.createdAt ?? 0).getTime();
            const tb = new Date(a?.createdAt ?? 0).getTime();
            return ta - tb;
          });

          return {
            ...prev,
            [channelId]: merged,
          };
        });
      }
    } catch (e) {
      console.log('ChannelChat fetch error', e);
    } finally {
      setIsInitialLoading(false);
    }
  }, [channelId, setAllMessages, getChatMessages]);

  useFocusEffect(
    useCallback(() => {
      fetchInitialMessagesOnce();
    }, [fetchInitialMessagesOnce]),
  );

  // Must run on every render — do not place after an early return (Rules of Hooks).
  const renderChatScrollComponent = useCallback(
    (props: any) => (
      <VirtualizedListScrollView
        {...props}
        keyboardLiftBehavior="always"
        inverted={true}
      />
    ),
    [],
  );

  if (isInitialLoading && !messages.length) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const handleSendMessage = async () => {
    const content = inputText.trim();

    if (!content || !channelId) return;

    const tempId = `temp-${Date.now()}`;

    const newMessage = {
      _id: tempId,
      id: tempId,
      content,
      sender: user,
      senderId: user?._id,
      channelId,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
      attachments: [],
    };

    setAllMessages(prev => ({
      ...prev,
      [channelId]: [newMessage, ...(prev[channelId] || [])],
    }));

    setInputText('');

    handleTypingStop();

    const res = await sendChatMessage(channelId, content, []);

    const serverMsg = res?.data?.message ?? res?.data ?? res?.message;

    if (serverMsg && (serverMsg._id || serverMsg.id)) {
      setAllMessages(prev => {
        const current = prev[channelId] || [];
        const serverId = normalizeId(serverMsg._id || serverMsg.id);

        const next = [...current];
        const tempIdx = next.findIndex(
          m => m?._id === tempId || m?.id === tempId,
        );

        if (tempIdx !== -1) {
          next[tempIdx] = { ...serverMsg, isOptimistic: false };
        } else {
          // Check if it already exists by server ID before prepending
          const exists = next.some(
            m => normalizeId(m?._id || m?.id) === serverId,
          );
          if (!exists) {
            next.unshift(serverMsg);
          }
        }

        return { ...prev, [channelId]: next };
      });
    }
  };

  const handleTypingStart = () => {
    if (!isTypingRef.current && channelId) {
      isTypingRef.current = true;

      SocketService.sendTypingStart(channelId);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      handleTypingStop();
    }, 2000);
  };

  const handleTypingStop = () => {
    if (isTypingRef.current && channelId) {
      isTypingRef.current = false;

      SocketService.sendTypingStop(channelId);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);

      typingTimeoutRef.current = null;
    }
  };

  const handleHeaderPress = () => {
    if (communityId) {
      setIsDetailsVisible(true);
    }
  };

  const getMyReactionEmoji = (message: any): string | null => {
    const myUserId = normalizeId(user?._id || user?.id);
    if (!myUserId || !message) return null;
    const reactions = Array.isArray(message?.reactions)
      ? message.reactions
      : [];

    for (const r of reactions) {
      if (!r?.emoji) continue;

      // Grouped format: { emoji, users: [...], count }
      if (Array.isArray(r.users) && r.users.length > 0) {
        const isInGroup = r.users.some((u: any) => {
          if (typeof u === 'string') return normalizeId(u) === myUserId;
          return normalizeId(u?._id || u?.id || u?.userId) === myUserId;
        });
        if (isInGroup) return r.emoji;
      }

      // Grouped format with reactedBy: { emoji, reactedBy: [...] }
      if (Array.isArray(r.reactedBy) && r.reactedBy.length > 0) {
        const isInGroup = r.reactedBy.some((u: any) => {
          if (typeof u === 'string') return normalizeId(u) === myUserId;
          return normalizeId(u?._id || u?.id || u?.userId) === myUserId;
        });
        if (isInGroup) return r.emoji;
      }

      // Flat format: { emoji, senderId / userId / sender }
      const sid = normalizeId(
        r?.senderId || r?.userId || r?.sender?._id || r?.sender?.id || r?.user,
      );
      if (sid && sid === myUserId) return r.emoji;
    }
    return null;
  };

  const openEmojiPickerForMessage = (item: any, nativeEvent?: any) => {
    const messageId = normalizeId(item?._id || item?.id);
    if (!messageId || isEmojiPickerVisible) return;

    setLongPressedMessage(item);
    freezeScrollOffsetRef.current = scrollOffsetRef.current;

    const bubbleRef = messageBubbleRefs.current.get(messageId);

    const myId = normalizeId(user?._id || user?.id);
    const senderId = normalizeId(
      item?.sender?._id || item?.sender?.id || item?.senderId,
    );
    const isMe = !!myId && !!senderId && myId === senderId;

    // pageX/pageY from the long-press event are screen-absolute on both
    // iOS and Android — far more reliable than measureInWindow on Android.
    const touchX: number | null = nativeEvent?.pageX ?? null;
    const touchY: number | null = nativeEvent?.pageY ?? null;

    const showPicker = (
      x: number,
      y: number,
      width: number,
      height: number,
    ) => {
      setEmojiAnchor({ x, y, width, height, isMe, touchX, touchY });
      setIsEmojiPickerVisible(true);
      requestAnimationFrame(() => {
        const off = freezeScrollOffsetRef.current;
        if (off != null) {
          flatListRef.current?.scrollToOffset?.({
            offset: off,
            animated: false,
          });
        }
      });
    };

    if (bubbleRef?.measureInWindow) {
      bubbleRef.measureInWindow(
        (x: number, y: number, width: number, height: number) => {
          // On Android measureInWindow can return all zeros when the view
          // is inside a FlatList that hasn't fully committed its layout yet.
          // In that case, fall back to the touch coordinates.
          const validMeasure = !(
            x === 0 &&
            y === 0 &&
            width === 0 &&
            height === 0
          );
          if (validMeasure) {
            showPicker(x, y, width, height);
          } else {
            showPicker(touchX ?? 20, touchY ?? 200, 0, 0);
          }
        },
      );
    } else {
      showPicker(touchX ?? 20, touchY ?? 200, 0, 0);
    }
  };

  const restoreFrozenScroll = () => {
    const off = freezeScrollOffsetRef.current;
    if (off == null) return;
    // Restore twice to survive any layout/re-render after state updates.
    requestAnimationFrame(() => {
      flatListRef.current?.scrollToOffset?.({ offset: off, animated: false });
      setTimeout(() => {
        flatListRef.current?.scrollToOffset?.({ offset: off, animated: false });
      }, 0);
    });
  };

  const closeEmojiPicker = (opts?: { clearFreeze?: boolean }) => {
    const clearFreeze = opts?.clearFreeze ?? true;
    setIsEmojiPickerVisible(false);
    setEmojiAnchor(null);
    setLongPressedMessage(null);
    if (clearFreeze) {
      freezeScrollOffsetRef.current = null;
    }
  };

  const handleEmojiSelect = async (emoji: string, msg?: any) => {
    const targetMsg = msg || longPressedMessage;
    if (!targetMsg || !channelId) return;

    const messageId = normalizeId(targetMsg._id || targetMsg.id);
    if (!messageId) return;

    // Keep the frozen offset until reaction update settles.
    // This prevents the list from jumping when `messages` re-renders.
    if (freezeScrollOffsetRef.current == null) {
      freezeScrollOffsetRef.current = scrollOffsetRef.current;
    }
    closeEmojiPicker({ clearFreeze: false });

    const myUserId = user?._id || user?.id;

    // Optimistic UI Update - Use findIndex for precise single-item update
    setAllMessages(prev => {
      const current = prev[channelId] || [];
      const next = [...current];
      const index = next.findIndex(
        m => normalizeId(m?._id || m?.id) === messageId,
      );

      if (index !== -1) {
        const m = next[index];
        const reactions = Array.isArray(m.reactions) ? [...m.reactions] : [];
        const myUId = normalizeId(myUserId);

        // Find the group for this emoji
        const groupIdx = reactions.findIndex(r => r.emoji === emoji);

        if (groupIdx !== -1) {
          const group = { ...reactions[groupIdx] };
          const users = Array.isArray(group.users) ? [...group.users] : [];
          const userIdx = users.findIndex(
            u => normalizeId(u?._id || u?.id) === myUId,
          );

          if (userIdx !== -1) {
            // Toggle off: remove user from group
            users.splice(userIdx, 1);
            group.users = users;
            group.count = users.length;
            if (users.length === 0) {
              reactions.splice(groupIdx, 1);
            } else {
              reactions[groupIdx] = group;
            }
          } else {
            // Toggle on: add user to existing group
            users.push(user);
            group.users = users;
            group.count = users.length;
            reactions[groupIdx] = group;
          }
        } else {
          // Toggle on: create new group
          reactions.push({
            emoji,
            users: [user],
            count: 1,
            _id: Math.random().toString(36).substr(2, 9), // Temp ID
          });
        }
        next[index] = { ...m, reactions };
      }
      return { ...prev, [channelId]: next };
    });
    restoreFrozenScroll();

    try {
      const res = await reactToMessage(messageId, emoji);

      // Extract updated reactions if available
      const updatedMsg = res?.data?.message || res?.data || res?.message;
      if (
        updatedMsg &&
        typeof updatedMsg === 'object' &&
        !Array.isArray(updatedMsg)
      ) {
        const serverReactions = updatedMsg.reactions;
        if (Array.isArray(serverReactions)) {
          setAllMessages(prev => {
            const current = prev[channelId] || [];
            const next = [...current];
            const index = next.findIndex(
              m => normalizeId(m?._id || m?.id) === messageId,
            );
            if (index !== -1) {
              // Safely only update the reactions field
              next[index] = { ...next[index], reactions: serverReactions };
            }
            return { ...prev, [channelId]: next };
          });
          restoreFrozenScroll();
        }
      }
    } catch (error) {
      console.log('Error reacting to message:', error);
    } finally {
      // Reaction settled; allow normal scrolling again.
      freezeScrollOffsetRef.current = null;
    }
  };

  const handleRemoveReaction = async (emoji: string) => {
    if (!reactionDetailMessage || !channelId) return;
    const messageId = normalizeId(
      reactionDetailMessage._id || reactionDetailMessage.id,
    );
    if (!messageId) return;

    await handleEmojiSelect(emoji, reactionDetailMessage);
  };

  const renderReactions = (item: any, isMe: boolean) => {
    const reactions = item?.reactions || [];
    if (!reactions || reactions.length === 0) return null;

    // WhatsApp style: up to 3 unique emojis and total count
    const totalCount = reactions.reduce(
      (acc: number, r: any) => acc + (r.count || r.users?.length || 0),
      0,
    );
    const uniqueEmojis = reactions.map((r: any) => r.emoji).slice(0, 3);

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          setReactionDetailMessage(item);
          setIsReactionDetailsVisible(true);
        }}
        style={[
          styles.reactionContainer,
          isMe ? styles.reactionContainerMe : styles.reactionContainerThem,
        ]}
      >
        <View style={styles.reactionItem}>
          {uniqueEmojis.map((emoji: string, idx: number) => (
            <Text key={idx} style={styles.reactionEmoji}>
              {emoji}
            </Text>
          ))}
          {totalCount > 1 && (
            <Text style={styles.reactionCount}>{totalCount}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderMessage = ({ item, index }: { item: any; index: number }) => {
    const myId = user?._id || user?.id;

    const senderId = item.sender?._id || item.sender?.id || item.senderId;

    const isMe = !!myId && !!senderId && myId === senderId;

    const sender = item.sender || {};

    const initials = sender.firstName ? sender.firstName[0] : 'U';

    const currentMsgDate = new Date(item.createdAt).toDateString();
    const nextMsgDate = messages[index + 1]
      ? new Date(messages[index + 1].createdAt).toDateString()
      : null;

    const showDateSeparator = currentMsgDate !== nextMsgDate;

    const hasReactions =
      Array.isArray(item?.reactions) && item.reactions.length > 0;

    return (
      <View>
        {showDateSeparator && (
          <View style={styles.dateSeparator}>
            <Text style={styles.dateSeparatorText}>
              {formatDateLabel(item.createdAt)}
            </Text>
          </View>
        )}

        <View style={[styles.messageRow, isMe && styles.messageRowMe]}>
          {!isMe && (
            <View style={styles.avatar}>
              {sender.profilePicture?.url ? (
                <Image
                  source={{
                    uri: sender.profilePicture.url,
                  }}
                  style={styles.avatarImage}
                />
              ) : (
                <Text style={styles.avatarText}>{initials}</Text>
              )}
            </View>
          )}

          {/* <View
            style={isMe ? styles.bubbleWrapperMe : styles.bubbleWrapperThem}
          >
            <Pressable
              ref={(r: any) => {
                const mid = normalizeId(item?._id || item?.id);
                if (!mid) return;
                if (r) messageBubbleRefs.current.set(mid, r);
                else messageBubbleRefs.current.delete(mid);
              }}
              collapsable={false}
              onPress={() => {}} // Empty onPress to help gesture responder
              onLongPress={e => openEmojiPickerForMessage(item, e.nativeEvent)}
              delayLongPress={350}
              android_disableSound={true}
              unstable_pressDelay={0}
              pressRetentionOffset={{
                top: 20,
                left: 20,
                right: 20,
                bottom: 20,
              }}
              hitSlop={10}
              style={[
                styles.bubble,
                isMe ? styles.bubbleMe : styles.bubbleThem,
                hasReactions && styles.bubbleWithReaction,
              ]}
            >
              {!isMe && (
                <Text
                  style={styles.senderName}
                  selectable={false}
                  suppressHighlighting
                  onLongPress={e =>
                    openEmojiPickerForMessage(item, e.nativeEvent)
                  }
                >
                  {sender.firstName} {sender.lastName}
                </Text>
              )}

              <Text
                style={styles.msgText}
                selectable={false}
                suppressHighlighting
                onLongPress={e =>
                  openEmojiPickerForMessage(item, e.nativeEvent)
                }
              >
                {item.content || item.text}
                <Text style={styles.timeSpacer} selectable={false}>
                  {'   '}
                </Text>
                <Text style={styles.timeTextInline} selectable={false}>
                  {formatTime(item.createdAt)}
                </Text>
              </Text>
            </Pressable>

            {renderReactions(item, isMe)}
          </View> */}

          <View
            style={isMe ? styles.bubbleWrapperMe : styles.bubbleWrapperThem}
          >
            <Pressable
              ref={(r: any) => {
                const mid = normalizeId(item?._id || item?.id);

                if (!mid) return;

                if (r) {
                  messageBubbleRefs.current.set(mid, r);
                } else {
                  messageBubbleRefs.current.delete(mid);
                }
              }}
              collapsable={false}
              android_disableSound={true}
              delayLongPress={450}
              hitSlop={12}
              pressRetentionOffset={{
                top: 40,
                left: 40,
                right: 40,
                bottom: 40,
              }}
              onLongPress={e => {
                openEmojiPickerForMessage(item, e.nativeEvent);
              }}
              style={[
                styles.bubble,
                isMe ? styles.bubbleMe : styles.bubbleThem,
                hasReactions && styles.bubbleWithReaction,
              ]}
            >
              {!isMe && (
                <Text
                  style={styles.senderName}
                  selectable={false}
                  suppressHighlighting
                >
                  {sender.firstName} {sender.lastName}
                </Text>
              )}

              {/* <View style={styles.msgRow}> */}
              <Text
                style={styles.msgText}
                selectable={false}
                suppressHighlighting
              >
                {item.content || item.text}

                <Text style={styles.timeSpacer} selectable={false}>
                  {'   '}
                </Text>
                <Text style={styles.timeTextInline} selectable={false}>
                  {formatTime(item.createdAt)}
                </Text>
              </Text>
              {/* </View> */}
            </Pressable>

            {renderReactions(item, isMe)}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.black,
        paddingTop: insets.top,
      }}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Icon
            name={Platform.OS === 'ios' ? 'ChevronLeft' : 'ArrowLeft'}
            size={24}
            color={COLORS.white}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.headerContent}
          onPress={handleHeaderPress}
        >
          <Text style={styles.headerTitle}>
            #{channelData?.name || 'General'}
          </Text>

          <Text style={styles.headerSubTitle}>
            {channelData?.description || 'Community Channel'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          {/* CHAT AREA */}
          <ImageBackground
            source={AppImages.chatBg}
            resizeMode="cover"
            style={{ flex: 1 }}
          >
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item, index) => {
                const id = normalizeId(item?._id || item?.id);
                return id || `index-${index}`;
              }}
              keyboardShouldPersistTaps="handled"
              removeClippedSubviews={false}
              scrollEnabled={!isEmojiPickerVisible}
              onScroll={e => {
                scrollOffsetRef.current = e.nativeEvent.contentOffset.y;
              }}
              scrollEventThrottle={16}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                flexGrow: 1,
                padding: 10,
              }}
              renderScrollComponent={renderChatScrollComponent}
              inverted={true}
            />
          </ImageBackground>

          {/* INPUT BAR */}
          <KeyboardStickyView>
            <View
              style={[
                styles.inputMainContainer,
                {
                  paddingBottom:
                    Platform.OS === 'ios' ? Math.max(insets.bottom, 10) : 10,
                },
              ]}
            >
              {renderTypingIndicator()}

              <View style={styles.inputInnerContainer}>
                <TouchableOpacity style={styles.fileContainer}>
                  <Icon name="Paperclip" size={22} color={COLORS.primary} />
                </TouchableOpacity>

                <TextInput
                  style={styles.input}
                  placeholder="Type a message..."
                  placeholderTextColor={COLORS.pageDots}
                  value={inputText}
                  multiline
                  onChangeText={text => {
                    setInputText(text);
                    handleTypingStart();
                  }}
                />

                <TouchableOpacity
                  style={[
                    styles.sendBtn,
                    !inputText.trim() && styles.sendBtnDisabled,
                  ]}
                  onPress={handleSendMessage}
                >
                  <Icon name="SendHorizontal" size={20} color={COLORS.white} />
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardStickyView>
        </View>
      </View>

      <ChannelDetailsModal
        isVisible={isDetailsVisible}
        onClose={() => setIsDetailsVisible(false)}
        channelData={channelData}
        members={members}
      />

      <ReactionDetailsModal
        isVisible={isReactionDetailsVisible}
        onClose={() => setIsReactionDetailsVisible(false)}
        message={
          (reactionDetailMessage &&
            messages.find(
              m =>
                normalizeId(m?._id || m?.id) ===
                normalizeId(
                  reactionDetailMessage?._id || reactionDetailMessage?.id,
                ),
            )) ||
          reactionDetailMessage
        }
        currentUser={user}
        onRemoveReaction={handleRemoveReaction}
      />

      <EmojiPickerModal
        isVisible={isEmojiPickerVisible}
        onClose={() => closeEmojiPicker()}
        onSelectEmoji={handleEmojiSelect}
        anchor={emojiAnchor}
        selectedEmoji={getMyReactionEmoji(
          (longPressedMessage &&
            messages.find(
              m =>
                normalizeId(m?._id || m?.id) ===
                normalizeId(longPressedMessage?._id || longPressedMessage?.id),
            )) ||
            longPressedMessage,
        )}
      />
    </View>
  );
};

export default ChannelChat;
