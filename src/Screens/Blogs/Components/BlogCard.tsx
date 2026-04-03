import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { ms } from '@/Assets/Theme/fontStyle';
import { COLORS } from '@/Assets/Theme/colors';
import { THEME } from '@/Assets/Theme';
import { getFullImageUrl } from '@/Utils/ImageUtils';
import { AppImages } from '@/Assets/Images';
import Icon from '@/Components/Core/Icons';

interface BlogCardProps {
  item: any;
  onPress?: () => void;
}

const BlogCard: React.FC<BlogCardProps> = ({ item, onPress }) => {
  const imageUrl = item?.image
    ? { uri: getFullImageUrl(item.image) }
    : AppImages.homeBanner;

  const authorName = item?.author ? item?.author : 'Admin';

  const authorAvatar = item?.user?.avatar
    ? { uri: getFullImageUrl(item.user.avatar) }
    : item?.author?.avatar
    ? { uri: getFullImageUrl(item.author.avatar) }
    : null;

  const dateStr = item?.createdAt
    ? new Date(item.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Recently';

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={onPress}>
      <Image source={imageUrl} style={styles.image} resizeMode="cover" />

      <View style={styles.cardContent}>
        <Text style={styles.title} numberOfLines={2}>
          {item?.title || 'Untitled Blog Post'}
        </Text>

        <Text style={styles.description} numberOfLines={3}>
          {item?.description ||
            item?.content?.replace(/<[^>]*>?/gm, '').substring(0, 150) ||
            'No description provided for this blog post.'}
        </Text>

        <View style={styles.footer}>
          <View style={styles.authorRow}>
            {authorAvatar && authorAvatar.uri ? (
              <Image source={{ uri: authorAvatar.uri }} style={styles.avatar} />
            ) : (
              <Icon name="UserRoundPen" size={16} color={COLORS.lightGray} />
            )}
            <Text style={styles.authorName}>{authorName}</Text>
          </View>
          <View style={styles.dateRow}>
            <Icon name="Calendar" size={14} color={COLORS.lightGray} />
            <Text style={styles.dateText}>{dateStr}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E293B',
    borderRadius: ms(16),
    marginBottom: ms(20),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#334155',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  image: {
    width: '100%',
    height: ms(180),
  },
  cardContent: {
    padding: ms(16),
  },
  title: {
    ...THEME.fontStyle.h4SemiBold,
    color: COLORS.white,
    marginBottom: ms(8),
    lineHeight: ms(24),
  },
  description: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.lightGray,
    marginBottom: ms(16),
    lineHeight: ms(20),
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: ms(12),
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: ms(24),
    height: ms(24),
    borderRadius: ms(12),
    marginRight: ms(8),
  },
  authorName: {
    ...THEME.fontStyle.h5Medium,
    color: COLORS.lightGray,
    left: ms(4),
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(4),
  },
  dateText: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.lightGray,
  },
});

export default BlogCard;
