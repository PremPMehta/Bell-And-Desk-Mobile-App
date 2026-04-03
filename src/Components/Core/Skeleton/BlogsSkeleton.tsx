import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Skeleton from './index';
import { ms } from '@/Assets/Theme/fontStyle';

const BlogsSkeleton = () => {
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {[1, 2, 3, 4].map(i => (
        <View key={i} style={styles.card}>
          {/* Featured Image Skeleton */}
          <Skeleton
            width="100%"
            height={ms(180)}
            borderRadius={ms(12)}
            style={styles.image}
          />

          <View style={styles.cardContent}>
            {/* Title Skeleton */}
            <Skeleton
              width="90%"
              height={ms(22)}
              borderRadius={ms(4)}
              style={styles.title}
            />
            <Skeleton
              width="60%"
              height={ms(22)}
              borderRadius={ms(4)}
              style={styles.title}
            />

            {/* Excerpt Skeleton */}
            <Skeleton
              width="100%"
              height={ms(14)}
              borderRadius={ms(4)}
              style={styles.line}
            />
            <Skeleton
              width="85%"
              height={ms(14)}
              borderRadius={ms(4)}
              style={styles.line}
            />

            {/* Footer Skeleton (Author & Date) */}
            <View style={styles.footer}>
              <View style={styles.authorRow}>
                <Skeleton
                  width={ms(24)}
                  height={ms(24)}
                  borderRadius={ms(12)}
                  style={styles.avatar}
                />
                <Skeleton
                  width={ms(80)}
                  height={ms(14)}
                  borderRadius={ms(4)}
                />
              </View>
              <Skeleton
                width={ms(60)}
                height={ms(14)}
                borderRadius={ms(4)}
              />
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: ms(16),
    paddingTop: ms(16),
    paddingBottom: ms(20),
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: ms(16),
    marginBottom: ms(20),
    overflow: 'hidden',
    opacity: 0.6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  image: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  cardContent: {
    padding: ms(16),
  },
  title: {
    marginBottom: ms(8),
  },
  line: {
    marginBottom: ms(6),
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: ms(16),
    paddingTop: ms(12),
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: ms(8),
  },
});

export default BlogsSkeleton;
