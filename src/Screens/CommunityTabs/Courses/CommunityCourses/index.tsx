import {
  View,
  Text,
  Animated,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import CoursesCard from '@/Components/Core/CoursesCard';
import styles from './style';
import SearchBar from '@/Components/Core/SearchBar';
import Icon from '@/Components/Core/Icons';
import { COLORS } from '@/Assets/Theme/colors';
import { useNavigation } from '@/Hooks/Utils/use-navigation';
import useUserApi from '@/Hooks/Apis/UserApis/use-user-api';
import CommunityCoursesSkeleton from '@/Components/Core/Skeleton/CommunityCoursesSkeleton';

interface Props {
  communityId?: string;
  onScroll?: (...args: any[]) => void;
  scrollEventThrottle?: number;
}

const CommunityCourses = ({
  communityId,
  onScroll,
  scrollEventThrottle,
}: Props) => {
  const navigation = useNavigation();
  const {
    getCommunityCourses,
    apiGetCommunityCoursesLoading,
    apiGetCommunityCourses,
  } = useUserApi();
  const [searchQuery, setSearchQuery] = useState('');

  const courses = apiGetCommunityCourses?.courses || [];
  console.log('🚀 ~ CommunityCourses ~ courses:', courses);

  useEffect(() => {
    if (communityId) {
      const query = `?community=${communityId}`;
      getCommunityCourses(query);
    }
  }, [communityId]);

  const onChangeSearch = query => setSearchQuery(query);

  const filteredCourses = searchQuery
    ? courses.filter(
      (c: any) =>
        c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    : courses;

  const renderItem = ({ item }: { item: any }) => (
    <CoursesCard
      name={item.title}
      description={item.description}
      bannerImage={item.thumbnail}
      category={item.category}
      contentType={item.contentType}
      targetAudience={item.targetAudience}
      community={item.community}
      onEyePress={() => { }}
      onEditPress={() => { }}
      onDeletePress={() => { }}
    />
  );

  const handleCreateCourse = () => {
    navigation.navigate('CreateCourses');
  };

  return (
    <View style={styles.container}>
      {/* <Text style={{ color: 'white' }}>CommunityCourses</Text> */}

      {/* SEARCH */}
      {courses.length > 0 && (
        <View style={styles.searchContainer}>
          <SearchBar
            value={searchQuery}
            onChangeText={onChangeSearch}
            placeholder="Search through your courses..."
            searchInputStyle={styles.searchInputStyle}
          />
          <TouchableOpacity style={styles.create} onPress={handleCreateCourse}>
            <Icon name="CirclePlus" size={12} color={COLORS.white} />
            <Text style={styles.createTxt}>Create</Text>
          </TouchableOpacity>
        </View>
      )}

      {apiGetCommunityCoursesLoading && courses.length === 0 ? (
        <CommunityCoursesSkeleton />
      ) : courses.length === 0 ? (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.noCoursesTitle}>No courses found</Text>
          <Text style={styles.noCoursesSubtitle}>Create First Course</Text>
          <TouchableOpacity
            style={styles.createFirstCourseButton}
            onPress={handleCreateCourse}>
            <Icon name="Plus" size={20} color={COLORS.white} />
            <Text style={styles.createFirstCourseButtonText}>
              Create First Course
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Animated.FlatList
          data={filteredCourses}
          renderItem={renderItem}
          keyExtractor={item => item._id || item.id}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={scrollEventThrottle}
        />
      )}
    </View>
  );
};

export default CommunityCourses;
