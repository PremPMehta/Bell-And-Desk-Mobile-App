import React from 'react';
import { View, FlatList, ImageBackground } from 'react-native';
import type { ListRenderItem } from 'react-native';

import { AppImages } from '@/Assets/Images';
import { ChatMessagesAreaSkeleton } from '@/Components/Core/Skeleton/ChatConversationSkeleton';

type ChannelChatMessagesAreaProps = {
  flatListRef: any;
  messages: any[];
  selectedMessageId: string | null;
  isMessagesLoading: boolean;
  isEmojiPickerVisible: boolean;
  isAttachmentOptionsVisible: boolean;
  isImageViewerVisible: boolean;
  isDeleteModalVisible: boolean;
  normalizeId: (value: any) => string;
  renderMessage: ListRenderItem<any>;
  renderChatScrollComponent: (props: any) => React.ReactElement;
  onScrollOffsetChange: (offset: number) => void;
};

const ChannelChatMessagesArea = ({
  flatListRef,
  messages,
  selectedMessageId,
  isMessagesLoading,
  isEmojiPickerVisible,
  isAttachmentOptionsVisible,
  isImageViewerVisible,
  isDeleteModalVisible,
  normalizeId,
  renderMessage,
  renderChatScrollComponent,
  onScrollOffsetChange,
}: ChannelChatMessagesAreaProps) => {
  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={AppImages.chatBg}
        resizeMode="cover"
        style={{ flex: 1 }}
      >
        {isMessagesLoading ? (
          <ChatMessagesAreaSkeleton />
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            extraData={selectedMessageId}
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
              !isImageViewerVisible &&
              !isDeleteModalVisible
            }
            onScroll={event => {
              onScrollOffsetChange(event.nativeEvent.contentOffset.y);
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
        )}
      </ImageBackground>
    </View>
  );
};

export default React.memo(ChannelChatMessagesArea);
