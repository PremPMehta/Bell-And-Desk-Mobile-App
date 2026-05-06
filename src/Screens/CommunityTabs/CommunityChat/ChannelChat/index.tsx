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
import { useRoute, useNavigation } from '@react-navigation/native';
import styles from './style';
import Icon from '@/Components/Core/Icons';
import { COLORS } from '@/Assets/Theme/colors';
import { AppImages } from '@/Assets/Images';
import useUserApi from '@/Hooks/Apis/UserApis/use-user-api';
import ChannelDetailsModal from './ChannelDetailsModal';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

// 👇 keyboard controller imports
import {
  useKeyboardController,
  KeyboardStickyView,
} from 'react-native-keyboard-controller';

const ChannelChat = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const { channelData, communityId } = route.params ?? {};

  const [inputText, setInputText] = useState('');
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);

  const {
    getChatMessages,
    apiGetChatMessagesLoading,
    apiGetChatMessages,
    getChatCommunityMembers,
    apiGetChatCommunityMembers,
    markChannelRead,
    user,
  } = useUserApi();

  const messages = apiGetChatMessages?.data || [];
  const members = apiGetChatCommunityMembers?.data || [];
  const flatListRef = useRef<FlatList>(null);

  // 👇 initialize keyboard controller (important)
  useKeyboardController();

  const fetchMessages = useCallback(async () => {
    if (channelData?._id || channelData?.id) {
      await getChatMessages(channelData?._id || channelData?.id);
    }
  }, [channelData]);

  useEffect(() => {
    fetchMessages();
    if (channelData?._id || channelData?.id) {
      markChannelRead(channelData?._id || channelData?.id);
    }
  }, [fetchMessages, channelData]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    setInputText('');
  };

  const handleHeaderPress = async () => {
    if (communityId) {
      await getChatCommunityMembers(communityId);
      setIsDetailsVisible(true);
    }
  };

  const renderMessage = ({ item }: { item: any }) => {
    const isMe = item.sender?._id === user?._id || item.senderId === user?._id;
    const sender = item.sender || {};
    const initials = sender.firstName ? sender.firstName[0] : 'U';

    return (
      <View style={[styles.messageRow, isMe && styles.messageRowMe]}>
        {!isMe && (
          <View style={styles.avatar}>
            {sender.profilePicture?.url ? (
              <Image
                source={{ uri: sender.profilePicture.url }}
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

  if (apiGetChatMessagesLoading && !messages.length) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#000',
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

      {/* MESSAGE LIST */}
      <ImageBackground
        source={AppImages.chatBg}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item._id || item.id}
          contentContainerStyle={{
            flexGrow: 1,
            padding: 10,
            paddingBottom: 80,
          }}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={{ color: COLORS.subText }}>
                No messages yet. Start the conversation!
              </Text>
            </View>
          }
        />
      </ImageBackground>

      {/* 👇 THIS IS THE MAGIC */}
      <KeyboardStickyView
        offset={{
          closed:
            Platform.OS === 'ios' ? insets.bottom - 50 : insets.bottom - 36,
          opened: 0,
        }}
      >
        <View
          style={[
            styles.composer,
            {
              paddingBottom: 10,
              backgroundColor: COLORS.black,
            },
          ]}
        >
          <TouchableOpacity style={{ padding: 8 }}>
            <Icon name="Plus" size={24} color={COLORS.primary} />
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor="rgba(255,255,255,0.3)"
            value={inputText}
            onChangeText={setInputText}
            multiline
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
      </KeyboardStickyView>

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
