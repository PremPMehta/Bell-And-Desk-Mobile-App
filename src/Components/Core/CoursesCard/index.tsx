import React, { useState } from 'react';
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
import { getFullImageUrl } from '@/Utils/ImageUtils';

interface CoursesCardProps {
  name: string;
  description: string;
  bannerImage: ImageSourcePropType;
  category: string;
  contentType: string;
  targetAudience: string;
  community: any;
  onEyePress: () => void;
  onEditPress: () => void;
  onDeletePress: () => void;
  role?: string;
  isLocked?: boolean;
  /** When set, overrides default role-based visibility for the eye (view) action */
  showEyeButton?: boolean;
  /** When set, overrides default role-based visibility for the edit (pencil) action */
  showEditButton?: boolean;
  /** When set, overrides default role-based visibility for delete */
  showDeleteButton?: boolean;
}

const CoursesCard: React.FC<CoursesCardProps> = ({
  name,
  description,
  bannerImage,
  category,
  contentType,
  targetAudience,
  community,
  onEyePress,
  onEditPress,
  onDeletePress,
  role = 'member',
  isLocked = false,
  showEyeButton,
  showEditButton,
  showDeleteButton,
}) => {
  const [imageError, setImageError] = useState(false);

  const getSource = () => {
    if (imageError || !bannerImage) {
      return AppImages.homeBanner;
    }
    const fullUrl = getFullImageUrl(bannerImage as string);
    return { uri: fullUrl };
  };

  const isOwner = role === 'owner';
  const eyeVisible =
    showEyeButton !== undefined ? showEyeButton : !isLocked;
  const editVisible =
    showEditButton !== undefined ? showEditButton : isOwner;
  const deleteVisible =
    showDeleteButton !== undefined ? showDeleteButton : isOwner;

  return (
    <View style={styles.cardContainer}>
      <View style={styles.actionContainer}>
        {eyeVisible && (
          <TouchableOpacity style={styles.eyeStyle} onPress={onEyePress}>
            <Icon name="Eye" size={16} color={COLORS.primary} />
          </TouchableOpacity>
        )}
        {editVisible && (
          <TouchableOpacity style={styles.editStyle} onPress={onEditPress}>
            <Icon name="Pencil" size={16} color={COLORS.primary} />
          </TouchableOpacity>
        )}
        {deleteVisible && (
          <TouchableOpacity style={styles.deleteStyle} onPress={onDeletePress}>
            <Icon name="Trash2" size={16} color={COLORS.primary} />
          </TouchableOpacity>
        )}
        {isLocked && (
          <View style={styles.lockStyle}>
            <Icon name="Lock" size={16} color={COLORS.primary} />
          </View>
        )}
      </View>

      {/* Banner */}
      <Image
        source={getSource()}
        style={styles.bannerImage}
        onError={() => setImageError(true)}
      />

      {/* Tags (positioned absolutely to match design) */}
      <View style={styles.tagsContainer}>
        {/* {tags.map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))} */}
        <View style={styles.targetAudience}>
          <Text style={styles.commonChipTxt}>{targetAudience}</Text>
        </View>
        <View style={styles.contentType}>
          <Text style={styles.commonChipTxt}>{contentType}</Text>
        </View>
        <View style={styles.category}>
          <Text style={styles.commonChipTxt}>{category}</Text>
        </View>
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
            source={
              community?.logo
                ? { uri: getFullImageUrl(community.logo) }
                : AppImages.homeBanner
            }
            style={styles.communityLogo}
          />
          <Text style={styles.communityText}>{`By ${
            community?.ownerName || community?.name || 'Community'
          }`}</Text>
        </View>
      </View>
    </View>
  );
};

export default CoursesCard;
