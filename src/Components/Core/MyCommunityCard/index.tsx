import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
} from 'react-native';
import styles from './style';

interface CommunityCardProps {
  name: string;
  description: string;
  bannerImage: ImageSourcePropType;
  tags: string[];
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
  return (
    <View style={styles.cardContainer}>
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
      </View>
    </View>
  );
};

export default MyCommunityCard;
