import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';

import {
  KeyboardChatScrollView,
} from 'react-native-keyboard-controller';

import {
  useRoute,
  useNavigation,
  useFocusEffect,
} from '@react-navigation/native';

import styles from './style';
import Icon from '@/Components/Core/Icons';
import { COLORS } from '@/Assets/Theme/colors';
import useUserApi from '@/Hooks/Apis/UserApis/use-user-api';
import EmojiPickerModal from '../ChannelChat/EmojiPickerModal';
import AttachmentOptionsModal, {
  type ChatAttachmentPickPayload,
} from '../ChannelChat/AttachmentOptionsModal';
import ToastModule from '@/Components/Core/Toast';
import ReactionDetailsModal from '../ChannelChat/ReactionDetailsModal';
import DeleteMessageModal from '../ChannelChat/DeleteMessageModal';
import SocketService from '@/Services/SocketService';

import { useAtom, useAtomValue } from 'jotai';
import { chatMessagesAtom, typingUsersAtom } from '@/Jotai/Atoms';
import { store } from '@/Jotai/Store';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getFullImageUrl } from '@/Utils/ImageUtils';
import ImageViewing from 'react-native-image-viewing';
import DirectMessageChatHeader from './DirectMessageChatHeader';
import DirectMessageChatMessageItem from './DirectMessageChatMessageItem';
import DirectMessageChatMessagesArea from './DirectMessageChatMessagesArea';
import DirectMessageChatInputBar from './DirectMessageChatInputBar';
import {
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
    deleteChatMessage,
    apiDeleteChatMessageLoading,
    user,
  } = useUserApi();

  const [longPressedMessage, setLongPressedMessage] = useState<any>(null);
  const [messageToDelete, setMessageToDelete] = useState<any>(null);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    null,
  );
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
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

  const [isMessagesLoading, setIsMessagesLoading] = useState(true);
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
    if (!conversationId) {
      setIsMessagesLoading(false);
      return;
    }

    const cached = store.get(chatMessagesAtom)?.[conversationId] ?? [];
    if (cached.length > 0) {
      setIsMessagesLoading(false);
      hasFetchedInitialRef.current = conversationId;
      return;
    }

    setIsMessagesLoading(true);
    hasFetchedInitialRef.current = null;
  }, [conversationId]);

  const lastReadMarkRef = useRef<string>('');
  const markConversationReadRef = useRef(markConversationRead);
  const getConversationDetailsRef = useRef(getConversationDetails);
  markConversationReadRef.current = markConversationRead;
  getConversationDetailsRef.current = getConversationDetails;

  useFocusEffect(
    useCallback(() => {
      if (!conversationId) return;

      markConversationReadRef.current(conversationId);

      if (communityId) {
        SocketService.setCommunityId(communityId);
      }

      SocketService.joinConversation(conversationId);
      getConversationDetailsRef.current(conversationId);

      return () => {
        markConversationReadRef.current(conversationId);
        SocketService.leaveConversation(conversationId);
      };
      // API fns from useUserApi are recreated each render — keep deps stable.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [conversationId, communityId]),
  );

  const newestIncomingMessageId = useMemo(() => {
    const myId = normalizeId(user?._id || user?.id);
    const newest = messages.find((m: any) => !m?.isOptimistic);
    if (!newest) return '';
    const senderId = normalizeId(
      newest?.sender?._id || newest?.sender?.id || newest?.senderId,
    );
    if (!senderId || senderId === myId) return '';
    return normalizeId(newest._id || newest.id);
  }, [messages, user?._id, user?.id]);

  // Mark read when a new message arrives while this screen is open (not only on enter).
  useEffect(() => {
    if (!conversationId || isMessagesLoading || !newestIncomingMessageId) {
      return;
    }
    if (lastReadMarkRef.current === newestIncomingMessageId) return;

    lastReadMarkRef.current = newestIncomingMessageId;
    markConversationReadRef.current(conversationId);
  }, [conversationId, isMessagesLoading, newestIncomingMessageId]);

  const fetchInitialMessagesOnce = useCallback(async () => {
    if (!conversationId) {
      setIsMessagesLoading(false);
      return;
    }

    if (hasFetchedInitialRef.current === conversationId) {
      setIsMessagesLoading(false);
      return;
    }

    hasFetchedInitialRef.current = conversationId;
    setIsMessagesLoading(true);

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
      setIsMessagesLoading(false);
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

  const getMessageId = useCallback(
    (msg: any) => normalizeId(msg?._id ?? msg?.id ?? msg?.messageId),
    [],
  );

  const clearMessageDeleteSelection = useCallback(() => {
    setMessageToDelete(null);
    setSelectedMessageId(null);
  }, []);

  const selectMessageForDelete = useCallback(
    (item: any) => {
      const id = getMessageId(item);
      if (!id || item?.isOptimistic) return;
      setMessageToDelete(item);
      setSelectedMessageId(id);
    },
    [getMessageId],
  );

  const toggleMessageDeleteSelection = useCallback(
    (item: any) => {
      const id = getMessageId(item);
      if (!id || item?.isOptimistic) return;
      if (selectedMessageId === id) {
        clearMessageDeleteSelection();
      } else {
        selectMessageForDelete(item);
      }
    },
    [
      selectedMessageId,
      getMessageId,
      clearMessageDeleteSelection,
      selectMessageForDelete,
    ],
  );

  const removeMessageFromChat = useCallback(
    (messageId: string) => {
      if (!conversationId || !messageId) return;
      setAllMessages(prev => {
        const current = prev[conversationId] || [];
        return {
          ...prev,
          [conversationId]: current.filter(
            m => normalizeId(m?._id || m?.id) !== messageId,
          ),
        };
      });
    },
    [conversationId, setAllMessages],
  );

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
  const inputBottomInset =
    Platform.OS === 'ios' ? Math.max(insets.bottom, 10) : 10;

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
    const messageId = getMessageId(item);
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

  const handleBackPress = () => {
    if (selectedMessageId) {
      clearMessageDeleteSelection();
      return;
    }
    navigation.goBack();
  };

  const handleDeleteIconPress = () => {
    if (!selectedMessageId || !messageToDelete) return;
    setIsDeleteModalVisible(true);
  };

  const handleConfirmDeleteMessage = async () => {
    const messageId = normalizeId(
      messageToDelete?._id || messageToDelete?.id,
    );
    if (!messageId || messageToDelete?.isOptimistic) return;

    const deletedSnapshot = messageToDelete;
    setIsDeleteModalVisible(false);
    clearMessageDeleteSelection();
    removeMessageFromChat(messageId);

    try {
      await deleteChatMessage(messageId);
    } catch (err: any) {
      const msg =
        err?.message ||
        (typeof err?.resError === 'object' && err?.resError?.message) ||
        'Could not delete message';
      ToastModule.errorBottom({ msg: String(msg) });

      if (deletedSnapshot && conversationId) {
        setAllMessages(prev => {
          const current = prev[conversationId] || [];
          const exists = current.some(
            m => normalizeId(m?._id || m?.id) === messageId,
          );
          if (exists) return prev;
          const next = [...current, deletedSnapshot].sort((a: any, b: any) => {
            const ta = new Date(b?.createdAt ?? 0).getTime();
            const tb = new Date(a?.createdAt ?? 0).getTime();
            return ta - tb;
          });
          return { ...prev, [conversationId]: next };
        });
      }
    }
  };

  const handleReactionPress = useCallback((item: any) => {
    setReactionDetailMessage(item);
    setIsReactionDetailsVisible(true);
  }, []);

  const renderMessage = ({ item, index }: { item: any; index: number }) => (
    <DirectMessageChatMessageItem
      item={item}
      nextMessage={messages[index + 1]}
      currentUser={user}
      selectedMessageId={selectedMessageId}
      navigation={navigation}
      messageBubbleRefs={messageBubbleRefs}
      getMessageId={getMessageId}
      normalizeId={normalizeId}
      formatDateLabel={formatDateLabel}
      formatTime={formatTime}
      toggleMessageDeleteSelection={toggleMessageDeleteSelection}
      openEmojiPickerForMessage={openEmojiPickerForMessage}
      onPressReactions={handleReactionPress}
      openImageViewer={openImageViewer}
    />
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.black,
        paddingTop: insets.top,
      }}
    >
      <DirectMessageChatHeader
        participantName={participantName}
        participantAvatar={participantAvatar}
        participantInitials={participantInitials}
        selectedMessageId={selectedMessageId}
        onBackPress={handleBackPress}
        onDeletePress={handleDeleteIconPress}
      />

      <View style={{ flex: 1 }}>
        <DirectMessageChatMessagesArea
          flatListRef={flatListRef}
          messages={messages}
          extraData={`${messagesExtraData}:${selectedMessageId ?? ''}`}
          isMessagesLoading={isMessagesLoading}
          isEmojiPickerVisible={isEmojiPickerVisible}
          isAttachmentOptionsVisible={isAttachmentOptionsVisible}
          isImageViewerVisible={isImageViewerVisible}
          isDeleteModalVisible={isDeleteModalVisible}
          normalizeId={normalizeId}
          renderMessage={renderMessage}
          renderChatScrollComponent={renderChatScrollComponent}
          onScrollOffsetChange={offset => {
            scrollOffsetRef.current = offset;
          }}
        />

        <DirectMessageChatInputBar
          bottomInset={inputBottomInset}
          pendingAttachment={pendingAttachment}
          inputText={inputText}
          canSendMessage={canSendMessage}
          isUploadingAttachment={isUploadingAttachment}
          typingIndicator={renderTypingIndicator()}
          pendingAttachmentPreview={renderPendingAttachmentPreview()}
          onChangeText={text => {
            setInputText(text);
            handleTypingStart();
          }}
          onOpenAttachmentOptions={() => setIsAttachmentOptionsVisible(true)}
          onSendMessage={handleSendMessage}
        />
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
        bottomInset={inputBottomInset + 76}
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

      <DeleteMessageModal
        isVisible={isDeleteModalVisible}
        onClose={() => setIsDeleteModalVisible(false)}
        onConfirmDelete={handleConfirmDeleteMessage}
        isDeleting={apiDeleteChatMessageLoading}
      />
    </View>
  );
};

export default DirectMessageChat;
