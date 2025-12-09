import { View, Text, Animated, Pressable } from 'react-native';
import React from 'react';
import Icon from '@/Components/Core/Icons';
import { COLORS } from '@/Assets/Theme/colors';
import PrimaryButton from '@/Components/Core/PrimaryButton';
import styles from './style';
import { useAtom } from 'jotai';
import { createPostVisibleAtom, postsAtom } from '@/Jotai/Atoms';
import PostItem from '@/Components/Generic/PostItem';
import MediaPreviewModal from '@/Components/Generic/Modals/MediaPreviewModal';

interface Props {
  onScroll?: (...args: any[]) => void;
  scrollEventThrottle?: number;
}

const CommunityBoard = ({ onScroll, scrollEventThrottle }: Props) => {
  const [postText, setPostText] = React.useState('');
  const [posts] = useAtom(postsAtom);
  const [, setCreatePostVisible] = useAtom(createPostVisibleAtom);

  const renderActionBtn = (iconName: string, label: string) => (
    <View
      style={styles.actionBtn}
    // onPress={() => setCreatePostVisible(true)}
    >
      <Icon name={iconName} size={18} color={COLORS.white} />
      <Text style={styles.actionBtnText}>{label}</Text>
    </View>
  );

  return (
    <Animated.ScrollView
      style={styles.animatedScrollView}
      onScroll={onScroll}
      scrollEventThrottle={scrollEventThrottle}
      contentContainerStyle={styles.animatedContent}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Board</Text>
        <Text style={styles.subTitle}>
          Share updates, announcements, and connect with your community
        </Text>

        {/* Create Post Section */}
        <Pressable
          style={styles.createPostCard}
          onPress={() => setCreatePostVisible(true)}
        >
          <View style={styles.inputRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>S</Text>
            </View>
            <View style={styles.input}>
              <Text style={styles.inputPlaceholder}>Start a post</Text>
            </View>
          </View>
          <View style={styles.actionsRow}>
            {renderActionBtn('Video', 'Video')}
            {renderActionBtn('Image', 'Photo')}
            {renderActionBtn('FileText', 'Write article')}
            {renderActionBtn('ChartNoAxesColumn', 'Poll')}
          </View>
        </Pressable>

        {/* Posts List */}
        {posts.map(post => (
          <PostItem key={post.id} post={post} />
        ))}

        {/* Empty State */}
        {posts.length === 0 && (
          <View style={styles.emptyStateCard}>
            <Icon name="MessageSquareText" size={48} color={COLORS.white} />
            <Text style={styles.emptyStateTitle}>Start the Conversation</Text>
            <Text style={styles.emptyStateSubtitle}>
              Be the first to share something amazing with your community!{'\n'}
              Your voice matters and we can’t wait to hear from you.
            </Text>
            <PrimaryButton
              title="+ Create Your First Post"
              onPress={() => setCreatePostVisible(true)}
              buttonStyle={styles.createPostButton}
              textStyle={styles.createPostButtonText}
            />
          </View>
        )}
        {/* Media Preview Modal */}
        <MediaPreviewModal />
      </View>
    </Animated.ScrollView>
  );
};

export default CommunityBoard;
