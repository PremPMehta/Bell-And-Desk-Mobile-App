import { View, Text, Animated, TouchableOpacity } from 'react-native';
import React from 'react';
import Icon from '@/Components/Core/Icons';
import { COLORS } from '@/Assets/Theme/colors';
import { ms } from '@/Assets/Theme/fontStyle';
import PrimaryButton from '@/Components/Core/PrimaryButton';
import styles from './style';

interface Props {
  onScroll?: (...args: any[]) => void;
  scrollEventThrottle?: number;
}

const CommunityBoard = ({ onScroll, scrollEventThrottle }: Props) => {
  const [postText, setPostText] = React.useState('');

  const renderActionBtn = (iconName: string, label: string) => (
    <TouchableOpacity style={styles.actionBtn}>
      <Icon name={iconName} size={18} color={COLORS.white} />
      <Text style={styles.actionBtnText}>{label}</Text>
    </TouchableOpacity>
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
        <View style={styles.createPostCard}>
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
        </View>

        {/* Empty State */}
        <View style={styles.emptyStateCard}>
          <Icon name="MessageSquareText" size={48} color={COLORS.white} />
          <Text style={styles.emptyStateTitle}>Start the Conversation</Text>
          <Text style={styles.emptyStateSubtitle}>
            Be the first to share something amazing with your community!{'\n'}
            Your voice matters and we can’t wait to hear from you.
          </Text>
          <PrimaryButton
            title="+ Create Your First Post"
            onPress={() => {}}
            buttonStyle={styles.createPostButton}
            textStyle={styles.createPostButtonText}
          />
        </View>
      </View>
    </Animated.ScrollView>
  );
};

export default CommunityBoard;
