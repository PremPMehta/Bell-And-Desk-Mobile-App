import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Animated,
  TouchableOpacity,
  Image,
  FlatList,
  RefreshControl,
} from 'react-native';
import styles from './style';
import { COLORS } from '@/Assets/Theme/colors';
import useUserApi from '@/Hooks/Apis/UserApis/use-user-api';
import CommunityChatSkeleton from '@/Components/Core/Skeleton/CommunityChatSkeleton';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import SocketService from '@/Services/SocketService';
import { useAtomValue, useSetAtom } from 'jotai';
import { activeChannelIdAtom, objectAtomFamily, userAtom } from '@/Jotai/Atoms';
import { AtomKeys } from '@/Jotai/AtomKeys';

interface Props {
  communityId?: string;
  onScroll?: (...args: any[]) => void;
  scrollEventThrottle?: number;
}

const CommunityChat = ({
  communityId,
  onScroll,
  scrollEventThrottle,
}: Props) => {
  const navigation = useNavigation<any>();

  const {
    getChatChannels,
    apiGetChatChannelsLoading,
    apiGetChatChannels,
    getChatConversations,
    apiGetChatConversationsLoading,
    apiGetChatConversations,
  } = useUserApi();

  const currentUser: any = useAtomValue(userAtom);
  const currentUserId = currentUser?._id || currentUser?.id;

  const setActiveChannelId = useSetAtom(activeChannelIdAtom);

  // --- REALTIME FIX (1/3) ---
  // Subscribe directly to the same atoms that SocketService writes to via
  // store.set(). This gives CommunityChat its own subscription so it
  // re-renders immediately when a socket message arrives, independently of
  // whatever useUserApi does.
  const liveChannelsData = useAtomValue(
    objectAtomFamily(AtomKeys.apiGetChatChannels),
  );
  const liveConversationsData = useAtomValue(
    objectAtomFamily(AtomKeys.apiGetChatConversations),
  );

  // Always prefer the live atom values over the hook-returned values so the
  // UI reflects the most recent socket write without waiting for an API call.
  const channels: any[] =
    liveChannelsData?.data ||
    liveChannelsData?.channels ||
    apiGetChatChannels?.data ||
    apiGetChatChannels?.channels ||
    [];
  const conversations: any[] =
    liveConversationsData?.data ||
    liveConversationsData?.channels ||
    apiGetChatConversations?.data ||
    apiGetChatConversations?.channels ||
    [];

  // lastSocketUpdate is bumped by SocketService on every incoming message.
  // Using it in dependency arrays ensures memos and extraData re-compute
  // even when individual item object-references haven't changed.
  const channelsSocketUpdate: number = liveChannelsData?.lastSocketUpdate ?? 0;
  const conversationsSocketUpdate: number =
    liveConversationsData?.lastSocketUpdate ?? 0;

  const totalChannelsUnread = React.useMemo(
    () =>
      channels.reduce(
        (acc: number, c: any) => acc + Number(c.unreadCount || 0),
        0,
      ),
    [channels, channelsSocketUpdate],
  );

  const totalDMsUnread = React.useMemo(
    () =>
      conversations.reduce(
        (acc: number, c: any) => acc + Number(c.unreadCount || 0),
        0,
      ),
    [conversations, conversationsSocketUpdate],
  );

  // --- REALTIME FIX (2/3) ---
  // Pass enriched extraData objects (not just the data arrays) to both
  // FlatLists. The socket-update timestamp changes on every incoming message,
  // so FlatList cells are forced to re-render even when item references are
  // the same (which happens when the channel-ID matching in SocketService
  // returns the unchanged `c` reference for non-matching channels).
  const channelsExtraData = React.useMemo(
    () => ({ channels, channelsSocketUpdate }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [channels, channelsSocketUpdate],
  );
  const conversationsExtraData = React.useMemo(
    () => ({ conversations, conversationsSocketUpdate }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [conversations, conversationsSocketUpdate],
  );

  const [isFirstLoad, setIsFirstLoad] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  // Reset isFirstLoad when communityId changes to show loader for new community
  useEffect(() => {
    setIsFirstLoad(true);
    if (communityId) {
      SocketService.setCommunityId(communityId);
    }
  }, [communityId]);

  const fetchData = useCallback(async () => {
    if (communityId) {
      try {
        await Promise.all([
          getChatChannels(communityId),
          getChatConversations(communityId),
        ]);
      } catch (error) {
        console.error('Error fetching community chat data:', error);
      } finally {
        setIsFirstLoad(false);
      }
    } else {
      setIsFirstLoad(false);
    }
  }, [communityId]);

  useFocusEffect(
    useCallback(() => {
      // VERY IMPORTANT
      // User is NOT inside any specific channel now
      setActiveChannelId(null);

      fetchData();

      return () => {};
    }, [fetchData, setActiveChannelId]),
  );

  const onRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchData();
    } finally {
      setIsRefreshing(false);
    }
  };

  // Initial full screen loading logic
  if (isFirstLoad) {
    return <CommunityChatSkeleton />;
  }

  const renderChannelItem = ({ item }: { item: any }) => {
    console.log('🚀 ~ renderChannelItem ~ item:', item);
    return (
      <TouchableOpacity
        style={styles.itemCard}
        onPress={() =>
          navigation.navigate('ChannelChat', {
            channelData: item,
            communityId: communityId,
          })
        }
      >
        <View style={styles.iconContainer}>
          <Text style={styles.channelHash}>#</Text>
        </View>
        <View style={styles.itemInfo}>
          <Text style={styles.itemName} numberOfLines={1}>
            {item.name ||
              item.title ||
              item.channel?.name ||
              item.channel?.title ||
              'General Channel'}
          </Text>
          <Text style={styles.itemLastMessage} numberOfLines={1}>
            {item.lastMessage ? (
              <Text>
                {item.lastMessage.sender?._id === currentUserId ||
                item.lastMessage.sender?.id === currentUserId ||
                item.lastMessage.senderId === currentUserId
                  ? 'You'
                  : item.lastMessage.sender?.firstName || 'User'}
                : {item.lastMessage.content || item.lastMessage.text}
              </Text>
            ) : (
              item.description || 'No messages yet'
            )}
          </Text>
        </View>
        <View style={styles.itemMeta}>
          {item.lastMessage?.createdAt && (
            <Text
              style={[
                styles.itemTime,
                Number(item.unreadCount) > 0 && {
                  fontWeight: 'bold',
                  color: COLORS.white,
                },
              ]}
            >
              {new Date(item.lastMessage.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          )}
          {Number(item.unreadCount) > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderDMItem = ({ item }: { item: any }) => {
    const participant = item.participants?.[0] || {};
    const initials = participant.firstName ? participant.firstName[0] : 'U';
    const avatar = participant.profilePicture?.url;

    return (
      <TouchableOpacity
        style={styles.itemCard}
        onPress={() =>
          navigation.navigate('ChannelChat', {
            channelData: {
              ...item,
              name: `${participant.firstName} ${participant.lastName}`,
            },
            communityId: communityId,
          })
        }
      >
        <View style={styles.avatarContainer}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatarImage} />
          ) : (
            <Text style={styles.avatarText}>{initials}</Text>
          )}
          {participant.isOnline && <View style={styles.onlineIndicator} />}
        </View>
        <View style={styles.itemInfo}>
          <Text style={styles.itemName} numberOfLines={1}>
            {participant.firstName} {participant.lastName}
          </Text>
          <Text style={styles.itemLastMessage} numberOfLines={1}>
            {item.lastMessage ? (
              <Text>
                {item.lastMessage.sender?._id === currentUserId ||
                item.lastMessage.sender?.id === currentUserId ||
                item.lastMessage.senderId === currentUserId
                  ? 'You'
                  : item.lastMessage.sender?.firstName || 'User'}
                : {item.lastMessage.content || item.lastMessage.text}
              </Text>
            ) : (
              'Tap to start chatting'
            )}
          </Text>
        </View>
        <View style={styles.itemMeta}>
          {item.lastMessage?.createdAt && (
            <Text style={styles.itemTime}>
              {new Date(item.lastMessage.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          )}
          {Number(item.unreadCount) > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderContent = () => {
    return (
      <View style={{ flex: 1 }}>
        {/* Channels Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>CHANNELS</Text>
            <View
              style={[
                styles.countBadge,
                totalChannelsUnread > 0 && { backgroundColor: COLORS.primary },
              ]}
            >
              <Text
                style={[
                  styles.countText,
                  totalChannelsUnread > 0 && { color: COLORS.white },
                ]}
              >
                {totalChannelsUnread}
              </Text>
            </View>
          </View>
          <FlatList
            data={channels}
            renderItem={renderChannelItem}
            // REALTIME FIX (2/3): enriched extraData includes lastSocketUpdate
            // so FlatList cells re-render on every socket event even when
            // individual item references haven't changed.
            extraData={channelsExtraData}
            keyExtractor={(item, index) =>
              // REALTIME FIX (3/3): also check nested channel._id so the key
              // is stable and matches what SocketService uses for ID matching.
              (
                item._id ||
                item.id ||
                item.channelId ||
                item.channel?._id ||
                index
              ).toString()
            }
            scrollEnabled={false}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No channels yet</Text>
              </View>
            }
          />
        </View>

        {/* Direct Messages Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>DIRECT MESSAGES</Text>
            <View
              style={[
                styles.countBadge,
                totalDMsUnread > 0 && { backgroundColor: COLORS.primary },
              ]}
            >
              <Text
                style={[
                  styles.countText,
                  totalDMsUnread > 0 && { color: COLORS.white },
                ]}
              >
                {totalDMsUnread}
              </Text>
            </View>
          </View>
          <FlatList
            data={conversations}
            renderItem={renderDMItem}
            extraData={conversationsExtraData}
            keyExtractor={(item, index) =>
              (
                item._id ||
                item.id ||
                item.channelId ||
                item.channel?._id ||
                index
              ).toString()
            }
            scrollEnabled={false}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No direct messages yet</Text>
              </View>
            }
          />
        </View>
      </View>
    );
  };

  return (
    <Animated.ScrollView
      style={styles.container}
      onScroll={onScroll}
      scrollEventThrottle={scrollEventThrottle}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          tintColor={COLORS.primary}
        />
      }
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Community Chat</Text>
        <Text style={styles.headerSubTitle}>
          Connect with other members in real-time
        </Text>
      </View>

      {renderContent()}

      {/* Extra space at bottom */}
      <View style={{ height: 100 }} />
    </Animated.ScrollView>
  );
};

export default CommunityChat;
