import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Animated,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import Modal from 'react-native-modal';
import { useAtom } from 'jotai';
import { userAtom } from '@/Jotai/Atoms';
import CoursesCard from '@/Components/Core/CoursesCard';
import styles from './style';
import SearchBar from '@/Components/Core/SearchBar';
import Icon from '@/Components/Core/Icons';
import { COLORS } from '@/Assets/Theme/colors';
import { useNavigation } from '@/Hooks/Utils/use-navigation';
import useUserApi from '@/Hooks/Apis/UserApis/use-user-api';
import CommunityCoursesSkeleton from '@/Components/Core/Skeleton/CommunityCoursesSkeleton';
import CreateCourseModal from '@/Components/Generic/Modals/CreateCourseModal';
import CourseSubscriptionModal from '@/Components/Generic/Modals/CourseSubscriptionModal';

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
  const [user] = useAtom(userAtom);
  const {
    getCommunityCourses,
    apiGetCommunityCoursesLoading,
    apiGetCommunityCourses,
    deleteCourse,
    apiDeleteCourseLoading,
  } = useUserApi();
  const [searchQuery, setSearchQuery] = useState('');
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isSubscriptionModalVisible, setIsSubscriptionModalVisible] =
    useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [editCourseData, setEditCourseData] = useState<any>(null);

  const courses = apiGetCommunityCourses?.courses || [];
  console.log('🚀 ~ CommunityCourses ~ courses:', courses);

  const communityDetails = React.useMemo(() => {
    return (user as any)?.allCommunities?.find(
      (c: any) => c._id === communityId || c.id === communityId,
    );
  }, [user, communityId]);

  const communityRole = communityDetails?.role || 'member';
  const communityName = communityDetails?.name || '';
  const communitySlug = communityDetails?.subdomain || '';

  useEffect(() => {
    if (communityId) {
      setIsInitialLoading(true);
      const query = `?community=${communityId}`;
      getCommunityCourses(query).finally(() => {
        setIsInitialLoading(false);
      });
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

  const handleViewCourse = (courseId: string) => {
    navigation.navigate('CourseView', { courseId });
  };

  const handleEditCourse = (course: any) => {
    navigation.navigate('EditCourse', {
      courseData: course,
      communityName,
      communityId,
    });
  };

  const renderItem = ({ item }: { item: any }) => {
    const isLocked =
      communityRole === 'member' &&
      item.courseType === 'paid' &&
      item.isFree === false;

    const isSubscriptionCourse =
      item.courseType === 'paid' && item.paymentType === 'subscription';

    const handleCardPress = () => {
      if (isLocked) {
        setSelectedCourse(item);
        setIsSubscriptionModalVisible(true);
      } else {
        handleViewCourse(item._id || item.id);
      }
    };

    return (
      <Pressable onPress={handleCardPress}>
        <CoursesCard
          name={item.title}
          description={item.description}
          bannerImage={item.thumbnail}
          category={item.category}
          contentType={item.contentType}
          targetAudience={item.targetAudience}
          community={communityDetails}
          role={communityRole}
          isLocked={isLocked}
          onEyePress={() => handleEditCourse(item)}
          onEditPress={() => {
            setEditCourseData(item);
            setIsCreateModalVisible(true);
          }}
          onDeletePress={() => {
            setSelectedCourse(item);
            setIsDeleteModalVisible(true);
          }}
        />
      </Pressable>
    );
  };

  const handleCreateCourse = () => {
    setEditCourseData(null);
    setIsCreateModalVisible(true);
  };

  const handleSaveCourse = (courseData: any) => {
    console.log('Course Data:', courseData);
    const wasEditing = !!editCourseData;
    setIsCreateModalVisible(false);
    setEditCourseData(null);

    // Silently update the list
    if (communityId) {
      const query = `?community=${communityId}`;
      getCommunityCourses(query);
    }

    if (!wasEditing) {
      navigation.navigate('EditCourse', {
        courseData,
        communityName,
        communityId,
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* SEARCH */}
      {/* {courses.length > 0 && (
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
      )} */}

      {isInitialLoading ? (
        <CommunityCoursesSkeleton />
      ) : courses.length === 0 ? (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.noCoursesTitle}>No courses found</Text>
          <Text style={styles.noCoursesSubtitle}>Create First Course</Text>
          <TouchableOpacity
            style={styles.createFirstCourseButton}
            onPress={handleCreateCourse}
          >
            <Icon name="Plus" size={20} color={COLORS.white} />
            <Text style={styles.createFirstCourseButtonText}>
              Create First Course
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* SEARCH */}
          {courses.length > 0 && (
            <View style={styles.searchContainer}>
              <SearchBar
                value={searchQuery}
                onChangeText={onChangeSearch}
                placeholder="Search through your courses..."
                searchInputStyle={styles.searchInputStyle}
              />
              <TouchableOpacity
                style={styles.create}
                onPress={handleCreateCourse}
              >
                <Icon name="CirclePlus" size={12} color={COLORS.white} />
                <Text style={styles.createTxt}>Create</Text>
              </TouchableOpacity>
            </View>
          )}
          <Animated.FlatList
            data={filteredCourses}
            renderItem={renderItem}
            keyExtractor={item => item._id || item.id}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
            onScroll={onScroll}
            scrollEventThrottle={scrollEventThrottle}
          />
        </>
      )}

      <CreateCourseModal
        visible={isCreateModalVisible}
        communityId={communityId || ''}
        editCourseData={editCourseData}
        onClose={() => {
          setIsCreateModalVisible(false);
          setEditCourseData(null);
        }}
        onSave={handleSaveCourse}
      />

      {/* ── Subscription Modal ─────────────────────── */}
      <CourseSubscriptionModal
        visible={isSubscriptionModalVisible}
        onClose={() => setIsSubscriptionModalVisible(false)}
        communitySlug={communitySlug}
        communityName={communityName}
        courses={courses}
        course={selectedCourse}
      />

      {/* ── Delete Course Modal ────────────────────── */}
      <Modal
        isVisible={isDeleteModalVisible}
        onBackdropPress={() => setIsDeleteModalVisible(false)}
        onSwipeComplete={() => setIsDeleteModalVisible(false)}
        swipeDirection="down"
        style={styles.modalContainer}
        avoidKeyboard
      >
        <View style={styles.mainModalView}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Delete Course</Text>
            <TouchableOpacity onPress={() => setIsDeleteModalVisible(false)}>
              <Icon name="X" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
            <Text style={styles.modalMessage}>
              Are you sure you want to delete{' '}
              <Text style={styles.boldName}>"{selectedCourse?.title}"</Text>?
              This action cannot be undone.
            </Text>
          </View>

          <View style={styles.modalFooter}>
            <TouchableOpacity onPress={() => setIsDeleteModalVisible(false)}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalDeleteButton}
              onPress={async () => {
                if (selectedCourse?._id) {
                  const res = await deleteCourse(selectedCourse._id);
                  if (res) {
                    setIsDeleteModalVisible(false);
                    if (communityId) {
                      const query = `?community=${communityId}`;
                      getCommunityCourses(query);
                    }
                  }
                }
              }}
              disabled={apiDeleteCourseLoading}
            >
              {apiDeleteCourseLoading ? (
                <ActivityIndicator color={COLORS.white} size="small" />
              ) : (
                <Text style={styles.modalDeleteText}>Delete</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CommunityCourses;
