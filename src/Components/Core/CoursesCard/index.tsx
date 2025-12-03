import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
} from 'react-native';
import styles from './style';
import Icon from '../Icons';
import { COLORS } from '@/Assets/Theme/colors';
import { AppImages } from '@/Assets/Images';

interface CoursesCardProps {
  name: string;
  description: string;
  bannerImage: ImageSourcePropType;
  tags: string[];
  onEyePress: () => void;
  onEditPress: () => void;
  onDeletePress: () => void;
}

const CoursesCard: React.FC<CoursesCardProps> = ({
  name,
  description,
  bannerImage,
  tags,
  onEyePress,
  onEditPress,
  onDeletePress,
}) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.eyeStyle} onPress={onEyePress}>
          <Icon name="Eye" size={16} color={COLORS.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.editStyle} onPress={onEditPress}>
          <Icon name="Pencil" size={16} color={COLORS.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteStyle} onPress={onDeletePress}>
          <Icon name="Trash2" size={16} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Banner */}
      <Image source={bannerImage} style={styles.bannerImage} />

      {/* Tags (positioned absolutely to match design) */}
      <View style={styles.tagsContainer}>
        {tags.map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.communityName}>{name}</Text>
        <Text style={styles.description} numberOfLines={3}>
          {description}
        </Text>

        {/* Community */}
        <View style={styles.buttonContainer}>
          <Image
            source={AppImages.communityLogo}
            style={styles.communityLogo}
          />
          <Text style={styles.communityText}>Bell & Desk</Text>
        </View>
      </View>
    </View>
  );
};

export default CoursesCard;
