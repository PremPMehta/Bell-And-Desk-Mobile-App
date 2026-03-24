import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import styles from './style';
import Icon from '@/Components/Core/Icons';
import { COLORS } from '@/Assets/Theme/colors';
import { useNavigation } from '@/Hooks/Utils/use-navigation';
import { useRoute } from '@react-navigation/native';
import AddChapterModal from '@/Components/Generic/Modals/AddChapterModal';
import AddLessonModal, {
  VideoSource,
} from '@/Components/Generic/Modals/AddLessonModal';
import ToastModule from '@/Components/Core/Toast';

const EditCourse = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();
  const { courseData, communityName, communityId } = route.params || {};

  const [isAddChapterModalVisible, setIsAddChapterModalVisible] =
    useState(false);
  const [isAddLessonModalVisible, setIsAddLessonModalVisible] = useState(false);

  // Chapter State
  const [chapters, setChapters] = useState<any[]>(courseData?.chapters || []);
  const [modalChapterTitle, setModalChapterTitle] = useState('');
  const [modalChapterDescription, setModalChapterDescription] = useState('');
  const [modalChapterError, setModalChapterError] = useState('');
  const [modalChapterDescriptionError, setModalChapterDescriptionError] =
    useState('');
  const [editingChapterId, setEditingChapterId] = useState<string | null>(null);

  // Lesson State
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(
    null,
  );
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [modalLessonTitle, setModalLessonTitle] = useState('');
  const [modalLessonDescription, setModalLessonDescription] = useState('');
  const [modalLessonError, setModalLessonError] = useState('');
  const [modalLessonDescriptionError, setModalLessonDescriptionError] =
    useState('');
  const [modalLessonVideoSource, setModalLessonVideoSource] =
    useState<VideoSource>('none');
  const [modalLessonVideoLink, setModalLessonVideoLink] = useState('');
  const [modalLessonContent, setModalLessonContent] = useState('');

  const handleAddChapter = () => {
    setIsAddChapterModalVisible(true);
  };

  const handleAddChapterCancel = () => {
    setIsAddChapterModalVisible(false);
    setModalChapterTitle('');
    setModalChapterDescription('');
    setModalChapterError('');
    setModalChapterDescriptionError('');
    setEditingChapterId(null);
  };

  const handleAddChapterSubmit = () => {
    let isValid = true;
    if (!modalChapterTitle.trim()) {
      setModalChapterError('Chapter title is required');
      isValid = false;
    }
    if (!modalChapterDescription.trim()) {
      setModalChapterDescriptionError('Chapter description is required');
      isValid = false;
    }

    if (isValid) {
      if (editingChapterId) {
        setChapters(prevChapters =>
          prevChapters.map(chapter =>
            chapter.id === editingChapterId
              ? {
                  ...chapter,
                  title: modalChapterTitle,
                  description: modalChapterDescription,
                }
              : chapter,
          ),
        );
      } else {
        const newChapter = {
          id: Date.now().toString(),
          title: modalChapterTitle,
          description: modalChapterDescription,
          videos: [],
        };
        setChapters([...chapters, newChapter]);
      }
      handleAddChapterCancel();
    }
  };

  const handleEditChapter = (chapter: any) => {
    setModalChapterTitle(chapter.title);
    setModalChapterDescription(chapter.description);
    setEditingChapterId(chapter.id || chapter._id);
    setIsAddChapterModalVisible(true);
  };

  const handleDeleteChapter = (id: string) => {
    setChapters(chapters.filter(chapter => (chapter.id || chapter._id) !== id));
  };

  const handleAddLesson = (chapterId: string) => {
    setSelectedChapterId(chapterId);
    setIsAddLessonModalVisible(true);
  };

  const handleAddLessonCancel = () => {
    setIsAddLessonModalVisible(false);
    setModalLessonTitle('');
    setModalLessonDescription('');
    setModalLessonError('');
    setModalLessonDescriptionError('');
    setModalLessonVideoSource('none');
    setModalLessonVideoLink('');
    setModalLessonContent('');
    setSelectedChapterId(null);
    setEditingLessonId(null);
  };

  const handleAddLessonSubmit = () => {
    let isValid = true;
    if (!modalLessonTitle.trim()) {
      setModalLessonError('Lesson title is required');
      isValid = false;
    }
    if (!modalLessonDescription.trim()) {
      setModalLessonDescriptionError('Lesson description is required');
      isValid = false;
    }

    if (isValid && selectedChapterId) {
      if (editingLessonId) {
        setChapters(prevChapters =>
          prevChapters.map(chapter => {
            if ((chapter.id || chapter._id) === selectedChapterId) {
              return {
                ...chapter,
                videos: chapter.videos.map((video: any) =>
                  (video.id || video._id) === editingLessonId
                    ? {
                        ...video,
                        title: modalLessonTitle,
                        description: modalLessonDescription,
                        content: modalLessonContent,
                        videoSource: modalLessonVideoSource,
                        videoLink: modalLessonVideoLink,
                      }
                    : video,
                ),
              };
            }
            return chapter;
          }),
        );
      } else {
        const newLesson = {
          id: Date.now().toString(),
          title: modalLessonTitle,
          description: modalLessonDescription,
          content: modalLessonContent,
          videoSource: modalLessonVideoSource,
          videoLink: modalLessonVideoLink,
        };

        setChapters(prevChapters =>
          prevChapters.map(chapter => {
            if ((chapter.id || chapter._id) === selectedChapterId) {
              return {
                ...chapter,
                videos: [...chapter.videos, newLesson],
              };
            }
            return chapter;
          }),
        );
      }
      handleAddLessonCancel();
    }
  };

  const handleEditLesson = (chapterId: string, lesson: any) => {
    setSelectedChapterId(chapterId);
    setEditingLessonId(lesson.id || lesson._id);
    setModalLessonTitle(lesson.title);
    setModalLessonDescription(lesson.description);
    setModalLessonContent(lesson.summary || lesson.content || '');
    setModalLessonVideoSource(
      lesson.videoSource || lesson.videoType || lesson.type || 'none',
    );
    setModalLessonVideoLink(
      lesson.videoLink || lesson.videoUrl || lesson.url || '',
    );
    setIsAddLessonModalVisible(true);
  };

  const handleDeleteLesson = (chapterId: string, lessonId: string) => {
    setChapters(prevChapters =>
      prevChapters.map(chapter => {
        if ((chapter.id || chapter._id) === chapterId) {
          return {
            ...chapter,
            videos: chapter.videos.filter(
              (video: any) => (video.id || video._id) !== lessonId,
            ),
          };
        }
        return chapter;
      }),
    );
  };

  const renderChapterItem = (chapter: any, index: number) => (
    <View
      key={chapter.id || chapter._id || `chapter-${index}`}
      style={styles.chapterContainer}
    >
      <View style={styles.chapterHeader}>
        <Text style={styles.chapterTitleText}>Chapter {index + 1}</Text>
        <View style={styles.chapterActionButtons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => handleEditChapter(chapter)}
          >
            <Icon name="Pencil" size={16} color={COLORS.white} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => handleDeleteChapter(chapter.id || chapter._id)}
          >
            <Icon name="Trash2" size={16} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.chapterSubtitle}>{chapter.title}</Text>
      <Text style={styles.chapterDescriptionText}>{chapter.description}</Text>

      <View style={styles.videoSection}>
        <View style={styles.videoListHeader}>
          <Text style={styles.videoSectionTitle}>Video List</Text>
          <TouchableOpacity
            style={styles.addVideoButton}
            onPress={() => handleAddLesson(chapter.id || chapter._id)}
          >
            <Icon name="CirclePlus" size={14} color={COLORS.white} />
            <Text style={styles.addVideoText}>Add Lesson</Text>
          </TouchableOpacity>
        </View>

        {chapter.videos.length === 0 ? (
          <View style={{ paddingVertical: 10 }}>
            <Text style={{ color: COLORS.outlineGrey, fontSize: 12 }}>
              0 videos
            </Text>
          </View>
        ) : (
          chapter.videos.map((video: any, vIndex: number) => {
            const vSource =
              video.videoSource || video.videoType || video.type || 'none';
            const isNoVideo = vSource === 'none' || vSource === '';

            return (
              <View
                key={video.id || video._id || `lesson-${vIndex}`}
                style={[
                  styles.videoItem,
                  vIndex === chapter.videos.length - 1 && {
                    borderBottomWidth: 0,
                  },
                ]}
              >
                <View style={styles.videoInfo}>
                  <Text style={styles.videoTitle}>
                    {vIndex + 1}. {video.title}
                  </Text>
                  <Text style={styles.videoSubtitle}>
                    {!isNoVideo ? `${vSource} video` : 'No video'}
                  </Text>
                </View>
                <View style={styles.chapterActionButtons}>
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() =>
                      handleEditLesson(chapter.id || chapter._id, video)
                    }
                  >
                    <Icon name="Pencil" size={16} color={COLORS.white} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() =>
                      handleDeleteLesson(chapter.id, video.id || video._id)
                    }
                  >
                    <Icon name="Trash2" size={16} color={COLORS.white} />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View
        style={[
          styles.header,
          { paddingTop: Platform.OS === 'ios' ? 0 : insets.top },
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="ChevronLeft" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {communityName || 'Community'}
          </Text>
          <Text style={styles.headerSubTitle}>
            {courseData?.title || 'Edit Course'}
          </Text>
        </View>
        {/* <TouchableOpacity style={styles.userIconButton}>
          <Icon name="CircleUserRound" size={24} color={COLORS.white} />
        </TouchableOpacity> */}
      </View>

      <ScrollView
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.courseTitleContainer}>
          <Text style={styles.courseTitle}>Course Structure</Text>
          <TouchableOpacity
            style={styles.addChapter}
            onPress={handleAddChapter}
          >
            <Icon name="CirclePlus" size={16} color={COLORS.white} />
            <Text style={styles.addChapterText}>Add Chapter</Text>
          </TouchableOpacity>
        </View>

        {chapters.length === 0 ? (
          <TouchableOpacity
            style={styles.emptyContainer}
            onPress={handleAddChapter}
            activeOpacity={0.8}
          >
            <View style={styles.emptyIconContainer}>
              <Icon name="Layers" size={40} color={COLORS.outlineGrey} />
            </View>
            <Text style={styles.emptyText}>Create your first chapter</Text>
            <Text style={styles.emptyDescription}>
              Click above to add your first chapter and start building your
              course content.
            </Text>
          </TouchableOpacity>
        ) : (
          <View>
            {chapters.map((chapter, index) =>
              renderChapterItem(chapter, index),
            )}
          </View>
        )}

        <AddChapterModal
          isModalVisible={isAddChapterModalVisible}
          headerLabel={editingChapterId ? 'Edit Chapter' : 'Add New Chapter'}
          buttonLabel={editingChapterId ? 'Update Chapter' : 'Add Chapter'}
          onHandleCancel={handleAddChapterCancel}
          chapterTitle={modalChapterTitle}
          onChapterTitleChange={text => {
            setModalChapterTitle(text);
            if (modalChapterError) setModalChapterError('');
          }}
          chapterError={modalChapterError}
          chapterDescription={modalChapterDescription}
          onChapterDescriptionChange={text => {
            setModalChapterDescription(text);
            if (modalChapterDescriptionError)
              setModalChapterDescriptionError('');
          }}
          chapterDescriptionError={modalChapterDescriptionError}
          onAddChapter={handleAddChapterSubmit}
        />

        <AddLessonModal
          isModalVisible={isAddLessonModalVisible}
          headerLabel={editingLessonId ? 'Edit Lesson' : 'Add Lesson'}
          buttonLabel={editingLessonId ? 'Update Lesson' : 'Add Lesson'}
          onHandleCancel={handleAddLessonCancel}
          lessonTitle={modalLessonTitle}
          onLessonTitleChange={text => {
            setModalLessonTitle(text);
            if (modalLessonError) setModalLessonError('');
          }}
          lessonError={modalLessonError}
          lessonDescription={modalLessonDescription}
          onLessonDescriptionChange={text => {
            setModalLessonDescription(text);
            if (modalLessonDescriptionError) setModalLessonDescriptionError('');
          }}
          lessonDescriptionError={modalLessonDescriptionError}
          lessonContentValue={modalLessonContent}
          onLessonContentChange={setModalLessonContent}
          videoSource={modalLessonVideoSource}
          onVideoSourceChange={setModalLessonVideoSource}
          videoLink={modalLessonVideoLink}
          onVideoLinkChange={setModalLessonVideoLink}
          onAddLesson={handleAddLessonSubmit}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditCourse;
