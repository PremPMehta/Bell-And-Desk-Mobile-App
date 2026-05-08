import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Animated,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import styles from './style';
import Icon from '@/Components/Core/Icons';
import { COLORS } from '@/Assets/Theme/colors';
import useUserApi from '@/Hooks/Apis/UserApis/use-user-api';
import CommunityChatSkeleton from '@/Components/Core/Skeleton/CommunityChatSkeleton';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import SocketService from '@/Services/SocketService';

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

  const channels = apiGetChatChannels?.data || [];
  const conversations = apiGetChatConversations?.data || [];

  const [isFirstLoad, setIsFirstLoad] = React.useState(true);

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
      fetchData();
    }, [fetchData]),
  );

  const onRefresh = async () => {
    await fetchData();
  };

  // Initial full screen loading logic
  if (isFirstLoad) {
    return <CommunityChatSkeleton />;
  }

  const renderChannelItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.itemCard}
      onPress={() =>
        navigation.navigate('ChannelChat', {
          channelData: item,
          communityId: communityId,
        })
      }>
      <View style={styles.iconContainer}>
        <Text style={styles.channelHash}>#</Text>
      </View>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName} numberOfLines={1}>
          {item.name || 'General Channel'}
        </Text>
        <Text style={styles.itemLastMessage} numberOfLines={1}>
          {item.description || 'No description available'}
        </Text>
      </View>
      <View style={styles.itemMeta}>
        {item.unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{item.unreadCount}</Text>
          </View>
        )}
        <Icon name="ChevronRight" size={18} color={COLORS.outlineGrey} />
      </View>
    </TouchableOpacity>
  );

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
        }>
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
            {item.lastMessage?.content || 'Tap to start chatting'}
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
          {item.unreadCount > 0 && (
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
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{channels.length}</Text>
            </View>
          </View>
          <FlatList
            data={channels}
            renderItem={renderChannelItem}
            keyExtractor={(item, index) => (item._id || item.id || index).toString()}
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
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{conversations.length}</Text>
            </View>
          </View>
          <FlatList
            data={conversations}
            renderItem={renderDMItem}
            keyExtractor={(item, index) => (item._id || item.id || index).toString()}
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
          refreshing={
            apiGetChatChannelsLoading || apiGetChatConversationsLoading
          }
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
