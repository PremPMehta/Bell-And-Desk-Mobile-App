import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Skeleton from './index';
import { ms, vs, width } from '@/Assets/Theme/fontStyle';
import { COLORS } from '@/Assets/Theme/colors';

const CourseViewSkeleton = () => {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Video Section */}
      <Skeleton width="100%" height={vs(220)} borderRadius={0} />

      <View style={{ padding: ms(16) }}>
        {/* Title & Description Section */}
        <Skeleton width="80%" height={ms(28)} style={{ marginBottom: vs(8) }} />
        <Skeleton width="100%" height={ms(16)} style={{ marginBottom: vs(4) }} />
        <Skeleton width="60%" height={ms(16)} style={{ marginBottom: vs(12) }} />

        {/* Mark as Complete & Session Type row */}
        <View style={styles.completeSection}>
           <Skeleton width={ms(140)} height={ms(36)} borderRadius={ms(20)} style={{ marginRight: ms(12) }} />
           <Skeleton width={ms(100)} height={ms(24)} borderRadius={ms(12)} />
        </View>

        {/* Tabs Section */}
        <View style={styles.tabSection}>
           <Skeleton width={ms(100)} height={ms(30)} style={{ marginRight: ms(20) }} />
           <Skeleton width={ms(100)} height={ms(30)} />
        </View>

        {/* Lessons List - Chapters */}
        {[1, 2].map((chapter) => (
          <View key={chapter} style={styles.chapterContainer}>
            <Skeleton width="100%" height={vs(45)} borderRadius={ms(8)} style={{ marginBottom: vs(8) }} />
            
            {/* Lessons within chapter */}
            {[1, 2, 3].map((lesson) => (
              <View key={lesson} style={styles.lessonItem}>
                <Skeleton width={ms(80)} height={vs(40)} borderRadius={ms(8)} style={{ marginRight: ms(12) }} />
                <View style={{ flex: 1 }}>
                  <Skeleton width="90%" height={ms(14)} style={{ marginBottom: vs(6) }} />
                  <Skeleton width="40%" height={ms(10)} />
                </View>
              </View>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  contentContainer: {
    paddingBottom: vs(50),
  },
  completeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(12),
    marginBottom: vs(16),
  },
  tabSection: {
    flexDirection: 'row',
    marginTop: vs(16),
    marginBottom: vs(24),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: vs(10),
  },
  chapterContainer: {
    marginBottom: vs(16),
  },
  lessonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(12),
    paddingLeft: ms(8),
  },
});

export default CourseViewSkeleton;
