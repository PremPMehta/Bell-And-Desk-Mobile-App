import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
} from 'react-native';
import styles from './style';
import { AppImages } from '@/Assets/Images';
import { getFullImageUrl } from '@/Utils/ImageUtils';

interface CommunityCardProps {
  name: string;
  description: string;
  bannerImage: ImageSourcePropType;
  tags: string;
  onViewPress: () => void;
  onSettingsPress: () => void;
}

const MyCommunityCard: React.FC<CommunityCardProps> = ({
  name,
  description,
  bannerImage,
  tags,
  onViewPress,
  onSettingsPress,
}) => {
  const [imageError, setImageError] = useState(false);

  const getSource = () => {
    if (imageError || !bannerImage) {
      return AppImages.homeBanner;
    }
    return { uri: getFullImageUrl(bannerImage as string) };
  };
  return (
    <TouchableOpacity
      style={styles.cardContainer}
      activeOpacity={0.8}
      onPress={onViewPress}
    >
      {/* Banner */}
      <Image
        source={getSource()}
        style={styles.bannerImage}
        onError={() => setImageError(true)}
      />

      {/* Tags (positioned absolutely to match design) */}
      <View style={styles.tagsContainer}>
        {/* {tags.map((tag, index) => ( */}
        <View style={styles.tag}>
          <Text style={styles.tagText}>{tags}</Text>
        </View>
        {/* ))} */}
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.communityName}>{name}</Text>
        <Text style={styles.description} numberOfLines={3}>
          {description}
        </Text>

        {tags === 'owner' && (
          <>
            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.viewButton} onPress={onViewPress}>
                <Text style={styles.buttonText}>View</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.settingsButton}
                onPress={onSettingsPress}
              >
                <Text style={styles.buttonText}>Settings</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default MyCommunityCard;
