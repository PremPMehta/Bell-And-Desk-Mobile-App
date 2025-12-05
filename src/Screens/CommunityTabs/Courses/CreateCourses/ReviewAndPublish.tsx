import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import styles from './style';

interface ReviewAndPublishProps {
  title: string;
  description: string;
  category: string;
  targetAudience: string;
  courseType: string;
  chapters: any[];
}

const ReviewAndPublish: React.FC<ReviewAndPublishProps> = ({
  title,
  description,
  category,
  targetAudience,
  courseType,
  chapters,
}) => {
  const totalVideos = chapters.reduce(
    (acc, chapter) => acc + (chapter.videos ? chapter.videos.length : 0),
    0,
  );

  return (
    <View style={styles.reviewContainer}>
      {/* Course Details Section */}
      <View style={styles.reviewCard}>
        <Text style={styles.reviewCardTitle}>Course Details</Text>
        <View style={styles.divider} />

        <View style={styles.reviewSection}>
          <Text style={styles.reviewLabel}>Title</Text>
          <Text style={styles.reviewValueTitle}>{title}</Text>
        </View>

        <View style={styles.reviewSection}>
          <Text style={styles.reviewLabel}>Description</Text>
          <Text style={styles.reviewValueDescription}>{description}</Text>
        </View>

        <View style={styles.reviewRow}>
          <View style={styles.reviewColumn}>
            <Text style={styles.reviewLabel}>Category</Text>
            <View style={styles.reviewChip}>
              <Text style={styles.reviewChipText}>{category}</Text>
            </View>
          </View>

          <View style={styles.reviewColumn}>
            <Text style={styles.reviewLabel}>Target Audience</Text>
            <View style={styles.reviewChip}>
              <Text style={styles.reviewChipText}>{targetAudience}</Text>
            </View>
          </View>

          <View style={styles.reviewColumn}>
            <Text style={styles.reviewLabel}>Content Type</Text>
            <View style={styles.reviewChip}>
              <Text style={styles.reviewChipText}>Video Based</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Course Structure Section */}
      <View style={styles.reviewCard}>
        <Text style={styles.reviewCardTitle}>Course Structure</Text>
        <View style={styles.divider} />

        <View style={styles.structureRow}>
          <Text style={styles.structureLabel}>Total Chapters</Text>
          <Text style={styles.structureValue}>{chapters.length}</Text>
        </View>
        <View style={styles.divider} />

        <View style={styles.structureRow}>
          <Text style={styles.structureLabel}>Total Videos</Text>
          <Text style={styles.structureValue}>{totalVideos}</Text>
        </View>
        <View style={styles.divider} />

        <View style={styles.structureRow}>
          <Text style={styles.structureLabel}>Course Type</Text>
          <View style={styles.reviewChip}>
            <Text style={styles.reviewChipText}>
              {courseType === 'Free' ? 'Free Course' : 'Paid Course'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ReviewAndPublish;
