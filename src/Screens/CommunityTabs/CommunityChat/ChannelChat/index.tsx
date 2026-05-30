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
import ChannelDetailsModal from './ChannelDetailsModal';
import ReactionDetailsModal from './ReactionDetailsModal';
import EmojiPickerModal from './EmojiPickerModal';
import AttachmentOptionsModal, {
  type ChatAttachmentPickPayload,
} from './AttachmentOptionsModal';
import ToastModule from '@/Components/Core/Toast';
import SocketService from '@/Services/SocketService';
import DeleteMessageModal from './DeleteMessageModal';

import { useAtom } from 'jotai';
import { chatMessagesAtom, typingUsersAtom } from '@/Jotai/Atoms';
import { store } from '@/Jotai/Store';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ImageViewing from 'react-native-image-viewing';
import ChannelChatHeader from './ChannelChatHeader';
import ChannelChatMessageItem from './ChannelChatMessageItem';
import ChannelChatMessagesArea from './ChannelChatMessagesArea';
import ChannelChatInputBar from './ChannelChatInputBar';
import {
  getAttachmentKind,
  resolveAttachmentUrl,
  buildOptimisticAttachments,
  createPendingAttachmentFromPick,
  uploadPendingChatAttachment,
  formatAttachmentsForChatMessage,
  type PendingChatAttachment,
} from './chatAttachmentUtils';

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

/** Merge API transcript, Jotai cache, and list-row lastMessage preview (newest first). */
function mergeChannelMessageLists(
  apiMessages: any[],
  cachedMessages: any[],
  listPreviewMessage?: any,
): any[] {
  const map = new Map<string, any>();
  const add = (m: any) => {
    const id = m?._id ?? m?.id;
    if (id != null) map.set(String(id), m);
  };
  apiMessages.forEach(add);
  cachedMessages.forEach(m => {
    const id = m?._id ?? m?.id;
    if (id != null && !map.has(String(id))) map.set(String(id), m);
  });
  if (listPreviewMessage) {
    const pid = listPreviewMessage._id ?? listPreviewMessage.id;
    if (pid != null && !map.has(String(pid))) {
      map.set(String(pid), listPreviewMessage);
    }
  }
  return Array.from(map.values()).sort((a: any, b: any) => {
    const ta = new Date(a?.createdAt ?? 0).getTime();
    const tb = new Date(b?.createdAt ?? 0).getTime();
    return tb - ta;
  });
}

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

  const [isMessagesLoading, setIsMessagesLoading] = useState(true);

  const isRefreshingMessagesRef = useRef(false);

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

  const syncLiveMessagesFromStore = useCallback(() => {
    if (!channelId) return [];

    const nextMsgs = store.get(chatMessagesAtom)?.[channelId] ?? [];
    const sig = computeSig(nextMsgs);

    if (sig !== lastSigRef.current) {
      lastSigRef.current = sig;
      setLiveMessages(nextMsgs);
    }

    return nextMsgs;
  }, [channelId]);

  const pullFromStore = useCallback(() => {
    if (!channelId) return;

    syncLiveMessagesFromStore();

    const typingState = store.get(typingUsersAtom);
    const nextTyping = typingState?.[channelId] ?? [];
    setLiveTypingUsers(nextTyping);
  }, [channelId, syncLiveMessagesFromStore]);

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
    if (!channelId) {
      setIsMessagesLoading(false);
      return;
    }

    const cached = store.get(chatMessagesAtom)?.[channelId] ?? [];
    if (cached.length > 0) {
      syncLiveMessagesFromStore();
      setIsMessagesLoading(false);
      return;
    }

    setIsMessagesLoading(true);
    lastSigRef.current = 'empty';
    setLiveMessages([]);
  }, [channelId, syncLiveMessagesFromStore]);

  const lastReadMarkRef = useRef<string>('');
  const markChannelReadRef = useRef(markChannelRead);
  const getChatCommunityMembersRef = useRef(getChatCommunityMembers);
  const getChatMessagesRef = useRef(getChatMessages);
  markChannelReadRef.current = markChannelRead;
  getChatCommunityMembersRef.current = getChatCommunityMembers;
  getChatMessagesRef.current = getChatMessages;

  const listPreviewMessage = channelData?.lastMessage;
  const listPreviewMessageId = useMemo(
    () => normalizeId(listPreviewMessage?._id || listPreviewMessage?.id),
    [listPreviewMessage?._id, listPreviewMessage?.id],
  );

  useFocusEffect(
    useCallback(() => {
      if (!channelId) return;

      markChannelReadRef.current(channelId);

      if (communityId) {
        SocketService.setCommunityId(communityId);
        getChatCommunityMembersRef.current(communityId);
      }

      SocketService.joinChannel(channelId);

      return () => {
        markChannelReadRef.current(channelId);
        SocketService.leaveChannel(channelId);
      };
      // API fns from useUserApi are recreated each render — keep deps stable.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [channelId, communityId]),
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
    if (!channelId || isMessagesLoading || !newestIncomingMessageId) return;
    if (lastReadMarkRef.current === newestIncomingMessageId) return;

    lastReadMarkRef.current = newestIncomingMessageId;
    markChannelReadRef.current(channelId);
  }, [channelId, isMessagesLoading, newestIncomingMessageId]);

  const applyMergedMessages = useCallback(
    (apiMessages: any[]) => {
      if (!channelId) return;
      setAllMessages(prev => {
        const current = prev[channelId] || [];
        const merged = mergeChannelMessageLists(
          apiMessages,
          current,
          listPreviewMessage,
        );
        return { ...prev, [channelId]: merged };
      });
      lastSigRef.current = '';
      syncLiveMessagesFromStore();
    },
    [channelId, listPreviewMessage, setAllMessages, syncLiveMessagesFromStore],
  );

  const refreshChannelMessages = useCallback(async () => {
    if (!channelId || isRefreshingMessagesRef.current) return;

    const cached = store.get(chatMessagesAtom)?.[channelId] ?? [];
    if (cached.length === 0) {
      setIsMessagesLoading(true);
    }

    isRefreshingMessagesRef.current = true;
    try {
      const res = await getChatMessagesRef.current(channelId);
      const apiMessages = Array.isArray(res?.data) ? res.data : [];
      applyMergedMessages(apiMessages);
    } catch (e) {
      console.log('ChannelChat fetch error', e);
      if (listPreviewMessage) {
        applyMergedMessages([]);
      } else {
        syncLiveMessagesFromStore();
      }
    } finally {
      setIsMessagesLoading(false);
      isRefreshingMessagesRef.current = false;
    }
  }, [
    channelId,
    listPreviewMessage,
    applyMergedMessages,
    syncLiveMessagesFromStore,
  ]);

  // Show list-row preview immediately when cache is behind (e.g. after DM or list socket update).
  useEffect(() => {
    if (!channelId || !listPreviewMessage || !listPreviewMessageId) return;
    const cached = store.get(chatMessagesAtom)?.[channelId] ?? [];
    const cachedNewestId = normalizeId(cached[0]?._id || cached[0]?.id);
    if (listPreviewMessageId !== cachedNewestId) {
      applyMergedMessages([]);
    }
  }, [
    channelId,
    listPreviewMessage,
    listPreviewMessageId,
    applyMergedMessages,
  ]);

  useFocusEffect(
    useCallback(() => {
      lastReadMarkRef.current = '';
      refreshChannelMessages();
      return () => {};
    }, [refreshChannelMessages]),
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
      if (!channelId || !messageId) return;
      setAllMessages(prev => {
        const current = prev[channelId] || [];
        return {
          ...prev,
          [channelId]: current.filter(
            m => normalizeId(m?._id || m?.id) !== messageId,
          ),
        };
      });
    },
    [channelId, setAllMessages],
  );

  const removeOptimisticMessage = (tempId: string) => {
    setAllMessages(prev => {
      const current = prev[channelId] || [];
      return {
        ...prev,
        [channelId]: current.filter(m => m?._id !== tempId && m?.id !== tempId),
      };
    });
  };

  const handleSendMessage = async () => {
    const content = inputText.trim();
    const pending = pendingAttachment;
    console.log('🚀 ~ handleSendMessage ~ pending:', pending);

    if ((!content && !pending) || !channelId || isUploadingAttachment) {
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
      channelId,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
      isUploading: !!pending,
      attachments: optimisticAttachments,
    };
    console.log('🚀 ~ handleSendMessage ~ newMessage:', newMessage);

    setAllMessages(prev => ({
      ...prev,
      [channelId]: [newMessage, ...(prev[channelId] || [])],
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

      const res = await sendChatMessage(
        channelId,
        content,
        formatAttachmentsForChatMessage(serverAttachments),
      );
      console.log('🚀 ~ handleSendMessage ~ res:', res);
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
            const exists = next.some(
              m => normalizeId(m?._id || m?.id) === serverId,
            );
            if (!exists) {
              next.unshift(serverMsg);
            }
          }

          return { ...prev, [channelId]: next };
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
                  name={pendingAttachment.isAudio ? 'Headphones' : 'FileText'}
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
    !!channelId &&
    (!!inputText.trim() || !!pendingAttachment) &&
    !isUploadingAttachment;
  const inputBottomInset =
    Platform.OS === 'ios' ? Math.max(insets.bottom, 10) : 10;

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
    if (selectedMessageId) return;
    if (communityId) {
      setIsDetailsVisible(true);
    }
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
    const messageId = normalizeId(messageToDelete?._id || messageToDelete?.id);
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

      if (deletedSnapshot && channelId) {
        setAllMessages(prev => {
          const current = prev[channelId] || [];
          const exists = current.some(
            m => normalizeId(m?._id || m?.id) === messageId,
          );
          if (exists) return prev;
          const next = [...current, deletedSnapshot].sort((a: any, b: any) => {
            const ta = new Date(b?.createdAt ?? 0).getTime();
            const tb = new Date(a?.createdAt ?? 0).getTime();
            return ta - tb;
          });
          return { ...prev, [channelId]: next };
        });
      }
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

  const handleReactionPress = useCallback((item: any) => {
    setReactionDetailMessage(item);
    setIsReactionDetailsVisible(true);
  }, []);

  const renderMessage = ({ item, index }: { item: any; index: number }) => (
    <ChannelChatMessageItem
      item={item}
      nextMessage={messages[index + 1]}
      currentUser={user}
      members={members}
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
      <ChannelChatHeader
        channelName={channelData?.name}
        channelDescription={channelData?.description}
        selectedMessageId={selectedMessageId}
        onBackPress={handleBackPress}
        onHeaderPress={handleHeaderPress}
        onDeletePress={handleDeleteIconPress}
      />

      <View style={{ flex: 1 }}>
        <ChannelChatMessagesArea
          flatListRef={flatListRef}
          messages={messages}
          selectedMessageId={selectedMessageId}
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

        <ChannelChatInputBar
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

export default ChannelChat;
