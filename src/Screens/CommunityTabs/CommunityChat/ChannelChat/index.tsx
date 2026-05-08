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
import SocketService from '@/Services/SocketService';

import { useAtom } from 'jotai';
import { chatMessagesAtom, typingUsersAtom } from '@/Jotai/Atoms';
import { store } from '@/Jotai/Store';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSharedValue } from 'react-native-reanimated';

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

  const extraPadding = useSharedValue(0);

  const { channelData, communityId } = route.params ?? {};

  const [inputText, setInputText] = useState('');
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);

  const {
    getChatMessages,
    sendChatMessage,
    getChatCommunityMembers,
    apiGetChatCommunityMembers,
    markChannelRead,
    user,
  } = useUserApi();

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

  // const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isTypingRef = useRef(false);

  const [isInitialLoading, setIsInitialLoading] = useState(false);

  const hasFetchedInitialRef = useRef<string | null>(null);

  const [composerHeight, setComposerHeight] = useState(75);

  const computeSig = (arr: any[]) => {
    const last = arr?.[arr.length - 1];

    const lastId = last?._id ?? last?.id ?? '';

    const lastAt = last?.createdAt ?? '';

    return `${arr?.length ?? 0}:${String(lastId)}:${String(lastAt)}`;
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

  const typingUsers = liveTypingUsers || [];

  const members = apiGetChatCommunityMembers?.data || [];

  useEffect(() => {
    if (!channelId) return;

    markChannelRead(channelId);

    if (communityId) {
      SocketService.setCommunityId(communityId);
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
            return (
              new Date(b?.createdAt ?? 0).getTime() -
              new Date(a?.createdAt ?? 0).getTime()
            );
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
  }, [channelId]);

  useFocusEffect(
    useCallback(() => {
      fetchInitialMessagesOnce();
    }, [fetchInitialMessagesOnce]),
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

        const next = current.map((m: any) =>
          m?._id === tempId || m?.id === tempId ? serverMsg : m,
        );

        return {
          ...prev,
          [channelId]: next,
        };
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

  const handleHeaderPress = async () => {
    if (communityId) {
      await getChatCommunityMembers(communityId);

      setIsDetailsVisible(true);
    }
  };

  const renderMessage = ({ item }: { item: any }) => {
    const myId = user?._id || user?.id;

    const senderId = item.sender?._id || item.sender?.id || item.senderId;

    const isMe = !!myId && !!senderId && myId === senderId;

    const sender = item.sender || {};

    const initials = sender.firstName ? sender.firstName[0] : 'U';

    return (
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

        <View
          style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleThem]}
        >
          {!isMe && (
            <Text style={styles.senderName}>
              {sender.firstName} {sender.lastName}
            </Text>
          )}

          <Text style={styles.msgText}>{item.content || item.text}</Text>
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
              keyExtractor={(item, index) =>
                (item._id || item.id || index).toString()
              }
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                flexGrow: 1,
                padding: 10,
              }}
              renderScrollComponent={props => (
                <VirtualizedListScrollView
                  {...props}
                  extraContentPadding={extraPadding}
                  keyboardLiftBehavior="always"
                  inverted={true}
                />
              )}
              inverted={true}
            />
          </ImageBackground>

          {/* INPUT BAR */}
          <KeyboardStickyView>
            <View
              onLayout={e => {
                const height = e.nativeEvent.layout.height;
                // Subtracting bottom inset to get the actual composer height above safe area if needed,
                // but extraContentPadding usually works best with the full height of the sticky element.
                extraPadding.value = height;
              }}
              style={{
                backgroundColor: COLORS.black,
                borderTopWidth: 0.5,
                borderTopColor: 'rgba(255,255,255,0.1)',

                paddingHorizontal: 10,
                paddingTop: 10,

                paddingBottom:
                  Platform.OS === 'ios' ? Math.max(insets.bottom, 10) : 10,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-end',
                }}
              >
                <TouchableOpacity
                  style={{
                    padding: 8,
                  }}
                >
                  <Icon name="Plus" size={24} color={COLORS.primary} />
                </TouchableOpacity>

                <TextInput
                  style={[
                    styles.input,
                    {
                      flex: 1,
                      maxHeight: 120,
                    },
                  ]}
                  placeholder="Type a message..."
                  placeholderTextColor="rgba(255,255,255,0.3)"
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
                  <Icon name="Send" size={20} color={COLORS.white} />
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
    </View>
  );
};

export default ChannelChat;
