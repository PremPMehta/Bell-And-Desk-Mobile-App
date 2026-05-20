import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
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
  Keyboard,
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
import EmojiPickerModal from '../ChannelChat/EmojiPickerModal';
import AttachmentOptionsModal, {
  type ChatAttachmentPickPayload,
} from '../ChannelChat/AttachmentOptionsModal';
import ToastModule from '@/Components/Core/Toast';
import ReactionDetailsModal from '../ChannelChat/ReactionDetailsModal';
import SocketService from '@/Services/SocketService';

import { useAtom, useAtomValue } from 'jotai';
import { chatMessagesAtom, typingUsersAtom } from '@/Jotai/Atoms';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getFullImageUrl } from '@/Utils/ImageUtils';
import ImageViewing from 'react-native-image-viewing';
import ChatVideoAttachment from '../ChannelChat/ChatVideoAttachment';
import ChatFileAttachment from '../ChannelChat/ChatFileAttachment';
import {
  getMessageAttachments,
  getAttachmentKind,
  resolveAttachmentUrl,
  buildOptimisticAttachments,
  createPendingAttachmentFromPick,
  uploadPendingChatAttachment,
  formatAttachmentsForChatMessage,
  type PendingChatAttachment,
} from '../ChannelChat/chatAttachmentUtils';

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

const DirectMessageChat = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const { conversationData, communityId } = route.params ?? {};

  const [inputText, setInputText] = useState('');
  const [isReactionDetailsVisible, setIsReactionDetailsVisible] =
    useState(false);
  const [reactionDetailMessage, setReactionDetailMessage] = useState<any>(null);

  const {
    getConversationMessages,
    sendConversationMessage,
    getConversationDetails,
    markConversationRead,
    reactToMessage,
    user,
  } = useUserApi();

  const [longPressedMessage, setLongPressedMessage] = useState<any>(null);
  const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);
  const [isAttachmentOptionsVisible, setIsAttachmentOptionsVisible] =
    useState(false);
  const [isImageViewerVisible, setIsImageViewerVisible] = useState(false);
  const [imageViewerImages, setImageViewerImages] = useState<{ uri: string }[]>(
    [],
  );
  const [imageViewerIndex, setImageViewerIndex] = useState(0);
  const [pendingAttachment, setPendingAttachment] =
    useState<PendingChatAttachment | null>(null);
  const [isUploadingAttachment, setIsUploadingAttachment] = useState(false);
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
  const allChatMessages = useAtomValue(chatMessagesAtom);
  const allTypingUsers = useAtomValue(typingUsersAtom);

  const conversationIdRaw = conversationData?._id ?? conversationData?.id;
  const conversationId =
    conversationIdRaw !== undefined && conversationIdRaw !== null
      ? String(conversationIdRaw).trim()
      : '';

  const participant =
    conversationData?.participant || conversationData?.participants?.[0] || {};
  const participantName =
    [participant.firstName, participant.lastName].filter(Boolean).join(' ') ||
    conversationData?.name ||
    'User';
  const participantAvatar = participant.profilePicture?.url
    ? getFullImageUrl(participant.profilePicture.url) ||
      participant.profilePicture.url
    : null;
  const participantInitials = participant.firstName
    ? participant.firstName[0].toUpperCase()
    : 'U';

  const flatListRef = useRef<FlatList>(null);
  const messageBubbleRefs = useRef<Map<string, any>>(new Map());
  const scrollOffsetRef = useRef(0);
  const freezeScrollOffsetRef = useRef<number | null>(null);

  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef(false);

  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const hasFetchedInitialRef = useRef<string | null>(null);

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

  const messages = useMemo(
    () => allChatMessages?.[conversationId] ?? [],
    [allChatMessages, conversationId],
  );

  const messagesExtraData = useMemo(() => {
    const newest = messages[0];
    const newestId = newest?._id || newest?.id || 'none';
    const newestTime = newest?.updatedAt || newest?.createdAt || 'none';
    let reactionSig = 0;
    messages.forEach(m => {
      if (m.reactions && Array.isArray(m.reactions)) {
        reactionSig += m.reactions.length;
      }
    });
    return `${messages.length}:${newestId}:${newestTime}:${reactionSig}`;
  }, [messages]);

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

  const typingUsers = useMemo(
    () => allTypingUsers?.[conversationId] ?? [],
    [allTypingUsers, conversationId],
  );

  const othersTyping = typingUsers.filter(u => {
    const uId = normalizeId(u.userId || u._id || u.id);
    const myId = normalizeId(user?._id || user?.id);
    return !!uId && uId !== myId;
  });

  const renderTypingIndicator = () => {
    if (othersTyping.length === 0) return null;

    const getDisplayName = (u: any) => {
      const first = u.firstName || u.sender?.firstName;
      const full = [first].filter(Boolean).join(' ').trim();
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

  useEffect(() => {
    if (!conversationId) return;

    markConversationRead(conversationId);

    if (communityId) {
      SocketService.setCommunityId(communityId);
    }

    SocketService.joinConversation(conversationId);

    if (conversationId) {
      getConversationDetails(conversationId);
    }

    return () => {
      SocketService.leaveConversation(conversationId);
    };
  }, [conversationId, communityId]);

  const fetchInitialMessagesOnce = useCallback(async () => {
    if (!conversationId) return;

    if (hasFetchedInitialRef.current === conversationId) return;

    hasFetchedInitialRef.current = conversationId;

    setIsInitialLoading(true);

    try {
      const res = await getConversationMessages(conversationId);

      const apiMessages = res?.data || [];

      if (Array.isArray(apiMessages) && apiMessages.length > 0) {
        setAllMessages(prev => {
          const current = prev[conversationId] || [];

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
            [conversationId]: merged,
          };
        });
      }
    } catch (e) {
      console.log('DirectMessageChat fetch error', e);
    } finally {
      setIsInitialLoading(false);
    }
  }, [conversationId, setAllMessages, getConversationMessages]);

  useFocusEffect(
    useCallback(() => {
      fetchInitialMessagesOnce();
    }, [fetchInitialMessagesOnce]),
  );

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

  const openImageViewer = useCallback(
    (messageAttachments: any[], tappedUri: string) => {
      const imageUris = messageAttachments
        .filter(att => getAttachmentKind(att) === 'image')
        .map(att => resolveAttachmentUrl(att))
        .filter((uri): uri is string => !!uri);

      if (!imageUris.length) return;

      const index = imageUris.findIndex(uri => uri === tappedUri);

      setImageViewerImages(imageUris.map(uri => ({ uri })));
      setImageViewerIndex(index >= 0 ? index : 0);
      setIsImageViewerVisible(true);
    },
    [],
  );

  const clearPendingAttachment = useCallback(() => {
    setPendingAttachment(null);
  }, []);

  const handleAttachmentPick = useCallback(
    (payload: ChatAttachmentPickPayload) => {
      const pending = createPendingAttachmentFromPick(payload);
      if (pending) {
        setPendingAttachment(pending);
      }
    },
    [],
  );

  if (isInitialLoading && !messages.length) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const removeOptimisticMessage = (tempId: string) => {
    setAllMessages(prev => {
      const current = prev[conversationId] || [];
      return {
        ...prev,
        [conversationId]: current.filter(
          m => m?._id !== tempId && m?.id !== tempId,
        ),
      };
    });
  };

  const handleSendMessage = async () => {
    const content = inputText.trim();
    const pending = pendingAttachment;

    if ((!content && !pending) || !conversationId || isUploadingAttachment) {
      return;
    }

    const tempId = `temp-${Date.now()}`;
    const optimisticAttachments = pending
      ? buildOptimisticAttachments(pending)
      : [];

    const newMessage = {
      _id: tempId,
      id: tempId,
      content,
      sender: user,
      senderId: user?._id ?? user?.id,
      channelId: conversationId,
      conversationId,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
      isUploading: !!pending,
      attachments: optimisticAttachments,
    };

    setAllMessages(prev => ({
      ...prev,
      [conversationId]: [newMessage, ...(prev[conversationId] || [])],
    }));

    setInputText('');
    const pendingToUpload = pending;
    setPendingAttachment(null);
    handleTypingStop();

    if (pendingToUpload) {
      setIsUploadingAttachment(true);
    }

    try {
      let serverAttachments: any[] = [];

      if (pendingToUpload) {
        serverAttachments = await uploadPendingChatAttachment(pendingToUpload);

        if (!serverAttachments.length) {
          removeOptimisticMessage(tempId);
          ToastModule.errorBottom({ msg: 'Could not upload attachment' });
          return;
        }
      }

      const res = await sendConversationMessage(
        conversationId,
        content,
        formatAttachmentsForChatMessage(serverAttachments),
      );
      const serverMsg = res?.data?.message ?? res?.data ?? res?.message;

      if (serverMsg && (serverMsg._id || serverMsg.id)) {
        setAllMessages(prev => {
          const current = prev[conversationId] || [];
          const serverId = normalizeId(serverMsg._id || serverMsg.id);

          const next = [...current];
          const tempIdx = next.findIndex(
            m => m?._id === tempId || m?.id === tempId,
          );

          if (tempIdx !== -1) {
            next[tempIdx] = { ...serverMsg, isOptimistic: false };
          } else {
            const exists = next.some(
              m => normalizeId(m?._id || m?.id) === serverId,
            );
            if (!exists) {
              next.unshift(serverMsg);
            }
          }

          return { ...prev, [conversationId]: next };
        });
      } else {
        removeOptimisticMessage(tempId);
      }
    } catch (err: any) {
      removeOptimisticMessage(tempId);
      const msg =
        err?.message ||
        (typeof err?.resError === 'object' && err?.resError?.message) ||
        'Could not send message';
      ToastModule.errorBottom({ msg: String(msg) });
    } finally {
      if (pendingToUpload) {
        setIsUploadingAttachment(false);
      }
    }
  };

  const renderPendingAttachmentPreview = () => {
    if (!pendingAttachment) return null;

    return (
      <View style={styles.pendingAttachmentRow}>
        <View style={styles.pendingAttachmentWrap}>
          <View style={styles.pendingAttachmentPreview}>
            {pendingAttachment.isImage ? (
              <Image
                source={{ uri: pendingAttachment.uri }}
                style={styles.pendingAttachmentImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.pendingAttachmentFilePreview}>
                <Icon
                  name={
                    pendingAttachment.isAudio ? 'Headphones' : 'FileText'
                  }
                  size={28}
                  color={COLORS.white}
                />
                <Text
                  style={styles.pendingAttachmentFileName}
                  numberOfLines={2}
                >
                  {pendingAttachment.fileName}
                </Text>
              </View>
            )}
          </View>
          <TouchableOpacity
            style={styles.pendingAttachmentRemove}
            onPress={clearPendingAttachment}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            disabled={isUploadingAttachment}
          >
            <Icon name="X" size={14} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const canSendMessage =
    !!conversationId &&
    (!!inputText.trim() || !!pendingAttachment) &&
    !isUploadingAttachment;

  const handleTypingStart = () => {
    if (!isTypingRef.current && conversationId) {
      isTypingRef.current = true;
      SocketService.sendTypingStart(conversationId);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      handleTypingStop();
    }, 2000);
  };

  const handleTypingStop = () => {
    if (isTypingRef.current && conversationId) {
      isTypingRef.current = false;
      SocketService.sendTypingStop(conversationId);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
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

      if (Array.isArray(r.users) && r.users.length > 0) {
        const isInGroup = r.users.some((u: any) => {
          if (typeof u === 'string') return normalizeId(u) === myUserId;
          return normalizeId(u?._id || u?.id || u?.userId) === myUserId;
        });
        if (isInGroup) return r.emoji;
      }

      if (Array.isArray(r.reactedBy) && r.reactedBy.length > 0) {
        const isInGroup = r.reactedBy.some((u: any) => {
          if (typeof u === 'string') return normalizeId(u) === myUserId;
          return normalizeId(u?._id || u?.id || u?.userId) === myUserId;
        });
        if (isInGroup) return r.emoji;
      }

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
    if (!targetMsg || !conversationId) return;

    const messageId = normalizeId(targetMsg._id || targetMsg.id);
    if (!messageId) return;

    if (freezeScrollOffsetRef.current == null) {
      freezeScrollOffsetRef.current = scrollOffsetRef.current;
    }
    closeEmojiPicker({ clearFreeze: false });

    const myUserId = user?._id || user?.id;

    setAllMessages(prev => {
      const current = prev[conversationId] || [];
      const next = [...current];
      const index = next.findIndex(
        m => normalizeId(m?._id || m?.id) === messageId,
      );

      if (index !== -1) {
        const m = next[index];
        const reactions = Array.isArray(m.reactions) ? [...m.reactions] : [];
        const myUId = normalizeId(myUserId);

        const groupIdx = reactions.findIndex(r => r.emoji === emoji);

        if (groupIdx !== -1) {
          const group = { ...reactions[groupIdx] };
          const users = Array.isArray(group.users) ? [...group.users] : [];
          const userIdx = users.findIndex(
            u => normalizeId(u?._id || u?.id) === myUId,
          );

          if (userIdx !== -1) {
            users.splice(userIdx, 1);
            group.users = users;
            group.count = users.length;
            if (users.length === 0) {
              reactions.splice(groupIdx, 1);
            } else {
              reactions[groupIdx] = group;
            }
          } else {
            users.push(user);
            group.users = users;
            group.count = users.length;
            reactions[groupIdx] = group;
          }
        } else {
          reactions.push({
            emoji,
            users: [user],
            count: 1,
            _id: Math.random().toString(36).substr(2, 9),
          });
        }
        next[index] = { ...m, reactions };
      }
      return { ...prev, [conversationId]: next };
    });
    restoreFrozenScroll();

    try {
      const res = await reactToMessage(messageId, emoji);

      const updatedMsg = res?.data?.message || res?.data || res?.message;
      if (
        updatedMsg &&
        typeof updatedMsg === 'object' &&
        !Array.isArray(updatedMsg)
      ) {
        const serverReactions = updatedMsg.reactions;
        if (Array.isArray(serverReactions)) {
          setAllMessages(prev => {
            const current = prev[conversationId] || [];
            const next = [...current];
            const index = next.findIndex(
              m => normalizeId(m?._id || m?.id) === messageId,
            );
            if (index !== -1) {
              next[index] = { ...next[index], reactions: serverReactions };
            }
            return { ...prev, [conversationId]: next };
          });
          restoreFrozenScroll();
        }
      }
    } catch (error) {
      console.log('Error reacting to message:', error);
    } finally {
      freezeScrollOffsetRef.current = null;
    }
  };

  const handleRemoveReaction = async (emoji: string) => {
    if (!reactionDetailMessage || !conversationId) return;
    const messageId = normalizeId(
      reactionDetailMessage._id || reactionDetailMessage.id,
    );
    if (!messageId) return;

    await handleEmojiSelect(emoji, reactionDetailMessage);
  };

  const renderMessageAttachments = (attachments: any[]) => {
    if (!attachments.length) return null;

    return (
      <View style={styles.attachmentsContainer}>
        {attachments.map((att, idx) => {
          const key =
            att?._id || att?.id || `${att?.url || att?.filename || 'att'}-${idx}`;
          const kind = getAttachmentKind(att);
          const uri = resolveAttachmentUrl(att);

          if (kind === 'image' && uri) {
            return (
              <TouchableOpacity
                key={String(key)}
                activeOpacity={0.9}
                onPress={() => openImageViewer(attachments, uri)}
                style={styles.attachmentImageWrap}
              >
                <Image
                  source={{ uri }}
                  style={styles.attachmentImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            );
          }

          if (kind === 'video' && uri) {
            return (
              <ChatVideoAttachment
                key={String(key)}
                uri={uri}
                attachment={att}
              />
            );
          }

          return (
            <ChatFileAttachment
              key={String(key)}
              attachment={att}
              navigation={navigation}
            />
          );
        })}
      </View>
    );
  };

  const renderReactions = (item: any, isMe: boolean) => {
    const reactions = item?.reactions || [];
    if (!reactions || reactions.length === 0) return null;

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

    const attachments = getMessageAttachments(item);
    const hasAttachments = attachments.length > 0;
    const messageText = String(item.content || item.text || '').trim();
    const hasText = messageText.length > 0;

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
                    uri:
                      getFullImageUrl(sender.profilePicture.url) ||
                      sender.profilePicture.url,
                  }}
                  style={styles.avatarImage}
                />
              ) : (
                <Text style={styles.avatarText}>{initials}</Text>
              )}
            </View>
          )}

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
                hasAttachments && styles.bubbleWithMedia,
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

              {hasAttachments && renderMessageAttachments(attachments)}

              {hasText ? (
                <Text
                  style={styles.msgText}
                  selectable={false}
                  suppressHighlighting
                >
                  {messageText}
                  <Text style={styles.timeSpacer} selectable={false}>
                    {'   '}
                  </Text>
                  <Text style={styles.timeTextInline} selectable={false}>
                    {formatTime(item.createdAt)}
                  </Text>
                </Text>
              ) : hasAttachments ? (
                <Text
                  style={[styles.msgText, styles.timeTextBlock]}
                  selectable={false}
                  suppressHighlighting
                >
                  <Text style={styles.timeTextInline} selectable={false}>
                    {formatTime(item.createdAt)}
                  </Text>
                </Text>
              ) : (
                <Text
                  style={styles.msgText}
                  selectable={false}
                  suppressHighlighting
                >
                  <Text style={styles.timeTextInline} selectable={false}>
                    {formatTime(item.createdAt)}
                  </Text>
                </Text>
              )}
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

        <View style={styles.headerAvatar}>
          {participantAvatar ? (
            <Image
              source={{ uri: participantAvatar }}
              style={styles.headerAvatarImage}
            />
          ) : (
            <Text style={styles.headerAvatarText}>{participantInitials}</Text>
          )}
        </View>

        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{participantName}</Text>
          {/* <Text style={styles.headerSubTitle}>Direct Message</Text> */}
        </View>
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
              extraData={messagesExtraData}
              renderItem={renderMessage}
              keyExtractor={(item, index) => {
                const id = normalizeId(item?._id || item?.id);
                return id || `index-${index}`;
              }}
              keyboardShouldPersistTaps="handled"
              removeClippedSubviews={false}
              scrollEnabled={
                !isEmojiPickerVisible &&
                !isAttachmentOptionsVisible &&
                !isImageViewerVisible
              }
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
              {renderPendingAttachmentPreview()}

              <View style={styles.inputInnerContainer}>
                <TouchableOpacity
                  style={styles.fileContainer}
                  onPress={() => {
                    Keyboard.dismiss();
                    setIsAttachmentOptionsVisible(true);
                  }}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  disabled={isUploadingAttachment}
                >
                  <Icon name="Paperclip" size={22} color={COLORS.primary} />
                </TouchableOpacity>

                <TextInput
                  style={styles.input}
                  placeholder={
                    pendingAttachment ? 'Add a caption...' : 'Type a message...'
                  }
                  placeholderTextColor={COLORS.pageDots}
                  value={inputText}
                  multiline
                  editable={!isUploadingAttachment}
                  onChangeText={text => {
                    setInputText(text);
                    handleTypingStart();
                  }}
                />

                <TouchableOpacity
                  style={[
                    styles.sendBtn,
                    !canSendMessage && styles.sendBtnDisabled,
                  ]}
                  onPress={handleSendMessage}
                  disabled={!canSendMessage}
                >
                  {isUploadingAttachment ? (
                    <ActivityIndicator size="small" color={COLORS.white} />
                  ) : (
                    <Icon
                      name="SendHorizontal"
                      size={20}
                      color={COLORS.white}
                    />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardStickyView>
        </View>
      </View>

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

      <AttachmentOptionsModal
        visible={isAttachmentOptionsVisible}
        onClose={() => setIsAttachmentOptionsVisible(false)}
        bottomInset={
          (Platform.OS === 'ios' ? Math.max(insets.bottom, 10) : 10) + 76
        }
        onPickResult={handleAttachmentPick}
      />

      <ImageViewing
        images={imageViewerImages}
        imageIndex={imageViewerIndex}
        visible={isImageViewerVisible}
        onRequestClose={() => setIsImageViewerVisible(false)}
        swipeToCloseEnabled
        doubleTapToZoomEnabled
      />
    </View>
  );
};

export default DirectMessageChat;
