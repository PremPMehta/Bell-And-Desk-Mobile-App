import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Modal from 'react-native-modal';
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
  LessonType,
} from '@/Components/Generic/Modals/AddLessonModal';
import ToastModule from '@/Components/Core/Toast';
import useUserApi from '@/Hooks/Apis/UserApis/use-user-api';
import { type DocumentPickerResponse } from '@react-native-documents/picker';

const EditCourse = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();
  const { courseData, communityName, communityId } = route.params || {};

  const [isAddChapterModalVisible, setIsAddChapterModalVisible] =
    useState(false);
  const [isAddLessonModalVisible, setIsAddLessonModalVisible] = useState(false);

  const {
    updateCourse,
    apiUpdateCourseLoading,
    getCourseDetails,
    apiGetCourseDetailsLoading,
    uploadPdf,
    apiUploadPdfLoading,
  } = useUserApi();

  useEffect(() => {
    const fetchLatestDetails = async () => {
      const courseId =
        courseData?._id || courseData?.id || '69bcd3924b6278040b9f61b4';
      if (courseId) {
        const res = await getCourseDetails(courseId);
        if (res?.data?.chapters) {
          setChapters(res.data.chapters);
        }
      }
    };
    fetchLatestDetails();
  }, []);

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

  // Lesson Type (video | pdf)
  const [modalLessonType, setModalLessonType] = useState<LessonType>('video');

  // PDF/Text lesson specific
  const [modalLessonContentUrl, setModalLessonContentUrl] = useState('');
  const [modalLessonPrimaryDocument, setModalLessonPrimaryDocument] =
    useState<DocumentPickerResponse | null>(null);

  // Delete State
  const [isDeleteChapterModalVisible, setIsDeleteChapterModalVisible] =
    useState(false);
  const [isDeleteLessonModalVisible, setIsDeleteLessonModalVisible] =
    useState(false);
  const [chapterToDelete, setChapterToDelete] = useState<any>(null);
  const [lessonToDelete, setLessonToDelete] = useState<any>(null);

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
      let updatedChapters = [...chapters];
      if (editingChapterId) {
        updatedChapters = chapters.map(chapter =>
          (chapter.id || chapter._id) === editingChapterId
            ? {
                ...chapter,
                title: modalChapterTitle,
                description: modalChapterDescription,
              }
            : chapter,
        );
      } else {
        const newChapter = {
          id: Date.now().toString(),
          title: modalChapterTitle,
          description: modalChapterDescription,
          videos: [],
        };
        updatedChapters = [...chapters, newChapter];
      }
      setChapters(updatedChapters);
      handleUpdateCourseApi(updatedChapters);
      handleAddChapterCancel();
    }
  };

  const handleUpdateCourseApi = async (updatedChapters: any[]) => {
    const courseId =
      courseData?._id || courseData?.id || '69bcd3924b6278040b9f61b4';

    // Transform chapters for API format
    const chaptersForApi = updatedChapters.map((chapter, cIndex) => ({
      title: chapter.title,
      description: chapter.description,
      order: cIndex,
      videos: (chapter.videos || []).map((video: any, vIndex: number) => {
        const isPdf =
          video.lessonType === 'pdf' ||
          video.contentType === 'pdf' ||
          video.type === 'PDF';

        if (isPdf) {
          // PDF / Text Lesson payload matching user screenshot requirements
          const pdfPath =
            video.documentUrl ||
            video.contentUrl ||
            video.url ||
            ((video.content || '').endsWith('.pdf') ? video.content : '');
          return {
            ...video,
            title: video.title,
            description: video.description,
            summary: '',
            content: (video.content || '').endsWith('.pdf')
              ? ''
              : video.content || '',
            url: pdfPath,
            videoUrl: pdfPath,
            videoType: 'upload',
            type: 'PDF',
            contentType: 'pdf',
            duration: '0:00',
            order: vIndex,
            attachments: [],
            bankvideo: null,
            videoBankId: null,
            muxPlaybackId: '',
          };
        }

        // Video Lesson payload
        return {
          ...video,
          title: video.title,
          description: video.description,
          summary: video.description || video.title || 'Lesson',
          content: video.content || '',
          url: video.videoLink || video.url || '',
          videoUrl: video.videoLink || video.videoUrl || '',
          videoType: video.videoSource || video.videoType || 'upload',
          type: 'VIDEO',
          contentType: 'video',
          duration: video.duration || '0:00',
          order: vIndex,
          attachments: video.attachments || [],
          bankvideo: video.bankvideo || null,
          videoBankId: video.videoBankId || null,
          muxPlaybackId: video.muxPlaybackId || '',
        };
      }),
    }));

    const payload = {
      ...courseData,
      chapters: chaptersForApi,
    };

    try {
      await updateCourse(courseId, payload);
    } catch (error) {
      console.error('Failed to update course:', error);
    }
  };

  const handleEditChapter = (chapter: any) => {
    setModalChapterTitle(chapter.title);
    setModalChapterDescription(chapter.description);
    setEditingChapterId(chapter.id || chapter._id);
    setIsAddChapterModalVisible(true);
  };

  const handleDeleteChapter = (chapter: any) => {
    setChapterToDelete(chapter);
    setIsDeleteChapterModalVisible(true);
  };

  const onConfirmDeleteChapter = () => {
    if (!chapterToDelete) return;
    const id = chapterToDelete.id || chapterToDelete._id;
    const updatedChapters = chapters.filter(
      chapter => (chapter.id || chapter._id) !== id,
    );
    setChapters(updatedChapters);
    handleUpdateCourseApi(updatedChapters);
    setIsDeleteChapterModalVisible(false);
    setChapterToDelete(null);
  };

  const handleAddLesson = (chapterId: string) => {
    setSelectedChapterId(chapterId);
    setIsAddLessonModalVisible(true);
  };

  const resetLessonModal = () => {
    setIsAddLessonModalVisible(false);
    setModalLessonTitle('');
    setModalLessonDescription('');
    setModalLessonError('');
    setModalLessonDescriptionError('');
    setModalLessonVideoSource('none');
    setModalLessonVideoLink('');
    setModalLessonContent('');
    setModalLessonType('video');
    setModalLessonContentUrl('');
    setModalLessonPrimaryDocument(null);
    setSelectedChapterId(null);
    setEditingLessonId(null);
  };

  const handleAddLessonCancel = () => {
    resetLessonModal();
  };

  const handleAddLessonSubmit = async () => {
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
      let uploadedPdfUrl = '';
      const isPdfModel = modalLessonType === 'pdf';

      // 1. Handle PDF Upload if needed
      if (isPdfModel && modalLessonPrimaryDocument) {
        // If it's a local file (has URI and it's not a server path)
        if (
          modalLessonPrimaryDocument.uri &&
          (modalLessonPrimaryDocument.uri.startsWith('file://') ||
            modalLessonPrimaryDocument.uri.startsWith('content://'))
        ) {
          try {
            const formData = new FormData();
            // Using specific key 'pdf' as per attachment
            formData.append('pdf', {
              uri: modalLessonPrimaryDocument.uri,
              type: modalLessonPrimaryDocument.type || 'application/pdf',
              name:
                modalLessonPrimaryDocument.name || `lesson_${Date.now()}.pdf`,
            } as any);

            const res = await uploadPdf(formData);
            if (res?.success) {
              uploadedPdfUrl = res?.url || '';
            } else {
              return;
            }
          } catch (error) {
            console.error('PDF Upload Error:', error);
            ToastModule.errorBottom({ msg: 'Failed to upload PDF document' });
            return;
          }
        } else {
          // Already have a server URL (editing or link)
          uploadedPdfUrl = modalLessonPrimaryDocument.uri || '';
        }
      }

      let updatedChapters = [...chapters];
      if (editingLessonId) {
        updatedChapters = chapters.map(chapter => {
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
                      lessonType: modalLessonType,
                      // Video fields
                      videoSource:
                        modalLessonType === 'video'
                          ? modalLessonVideoSource
                          : 'none',
                      videoLink:
                        modalLessonType === 'video' ? modalLessonVideoLink : '',
                      // PDF fields
                      contentUrl:
                        modalLessonType === 'pdf' ? modalLessonContentUrl : '',
                      documentUri:
                        modalLessonType === 'pdf'
                          ? modalLessonPrimaryDocument?.uri || ''
                          : '',
                      documentFileName:
                        modalLessonType === 'pdf'
                          ? modalLessonPrimaryDocument?.name || ''
                          : '',
                      documentUrl: uploadedPdfUrl,
                    }
                  : video,
              ),
            };
          }
          return chapter;
        });
      } else {
        const newLesson = {
          id: Date.now().toString(),
          title: modalLessonTitle,
          description: modalLessonDescription,
          content: modalLessonContent,
          lessonType: modalLessonType,
          // Video fields
          videoSource:
            modalLessonType === 'video' ? modalLessonVideoSource : 'none',
          videoLink: modalLessonType === 'video' ? modalLessonVideoLink : '',
          // PDF fields
          contentUrl: modalLessonType === 'pdf' ? modalLessonContentUrl : '',
          documentUri:
            modalLessonType === 'pdf'
              ? modalLessonPrimaryDocument?.uri || ''
              : '',
          documentFileName:
            modalLessonType === 'pdf'
              ? modalLessonPrimaryDocument?.name || ''
              : '',
          documentUrl: uploadedPdfUrl,
        };

        updatedChapters = chapters.map(chapter => {
          if ((chapter.id || chapter._id) === selectedChapterId) {
            return {
              ...chapter,
              videos: [...chapter.videos, newLesson],
            };
          }
          return chapter;
        });
      }
      setChapters(updatedChapters);
      handleUpdateCourseApi(updatedChapters);
      handleAddLessonCancel();
    }
  };

  const handleEditLesson = (chapterId: string, lesson: any) => {
    setSelectedChapterId(chapterId);
    setEditingLessonId(lesson.id || lesson._id);
    setModalLessonTitle(lesson.title);
    setModalLessonDescription(lesson.description);

    // Determine lesson type from stored data
    const isPdf =
      lesson.lessonType === 'pdf' ||
      lesson.contentType === 'pdf' ||
      lesson.type === 'PDF' ||
      (lesson.content || '').endsWith('.pdf');

    setModalLessonType(isPdf ? 'pdf' : 'video');

    // Populate Lesson Content properly
    const contentVal = lesson.summary || lesson.content || '';
    setModalLessonContent(
      isPdf && contentVal.endsWith('.pdf') ? '' : contentVal,
    );

    // Video fields
    setModalLessonVideoSource(
      isPdf
        ? 'none'
        : lesson.videoSource || lesson.videoType || lesson.type || 'none',
    );
    setModalLessonVideoLink(
      isPdf ? '' : lesson.videoLink || lesson.videoUrl || lesson.url || '',
    );

    // PDF fields
    const pdfPath =
      lesson.contentUrl ||
      lesson.url ||
      (isPdf && contentVal.endsWith('.pdf') ? contentVal : '');
    setModalLessonContentUrl(pdfPath);

    // We can't restore a file object from URI alone, but show any stored fileName hint
    if (lesson.documentUri || (isPdf && pdfPath)) {
      setModalLessonPrimaryDocument({
        uri: lesson.documentUri || pdfPath,
        name:
          lesson.documentFileName ||
          (lesson.documentUri || pdfPath).split('/').pop() ||
          null,
        type: 'application/pdf',
        size: null,
      } as DocumentPickerResponse);
    } else {
      setModalLessonPrimaryDocument(null);
    }

    setIsAddLessonModalVisible(true);
  };

  const handleDeleteLesson = (chapterId: string, lesson: any) => {
    setLessonToDelete({ chapterId, lesson });
    setIsDeleteLessonModalVisible(true);
  };

  const onConfirmDeleteLesson = () => {
    if (!lessonToDelete) return;
    const { chapterId, lesson } = lessonToDelete;
    const lessonId = lesson.id || lesson._id;

    const updatedChapters = chapters.map(chapter => {
      if ((chapter.id || chapter._id) === chapterId) {
        return {
          ...chapter,
          videos: chapter.videos.filter(
            (video: any) => (video.id || video._id) !== lessonId,
          ),
        };
      }
      return chapter;
    });
    setChapters(updatedChapters);
    handleUpdateCourseApi(updatedChapters);
    setIsDeleteLessonModalVisible(false);
    setLessonToDelete(null);
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
            onPress={() => handleDeleteChapter(chapter)}
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
            const isPdf =
              video.lessonType === 'pdf' ||
              video.contentType === 'pdf' ||
              video.type === 'PDF';
            const vSource =
              video.videoSource || video.videoType || video.type || 'none';
            const isNoVideo = !isPdf && (vSource === 'none' || vSource === '');

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
                    {isPdf
                      ? 'PDF/Text Lesson'
                      : !isNoVideo
                      ? `${vSource} video`
                      : 'No video'}
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
                      handleDeleteLesson(chapter.id || chapter._id, video)
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
        contentContainerStyle={styles.contentContainerStyle}
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
          isLoading={apiUploadPdfLoading}
          onHandleCancel={handleAddLessonCancel}
          // Title & Description
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
          // Content
          lessonContentValue={modalLessonContent}
          onLessonContentChange={setModalLessonContent}
          // Lesson Type
          lessonType={modalLessonType}
          onLessonTypeChange={type => {
            setModalLessonType(type);
            // Reset video/pdf fields when switching tabs
            setModalLessonVideoSource('none');
            setModalLessonVideoLink('');
            setModalLessonContentUrl('');
            setModalLessonPrimaryDocument(null);
          }}
          // Video fields
          videoSource={modalLessonVideoSource}
          onVideoSourceChange={setModalLessonVideoSource}
          videoLink={modalLessonVideoLink}
          onVideoLinkChange={setModalLessonVideoLink}
          // PDF fields
          contentUrl={modalLessonContentUrl}
          onContentUrlChange={setModalLessonContentUrl}
          primaryDocument={modalLessonPrimaryDocument}
          onPrimaryDocumentChange={setModalLessonPrimaryDocument}
          onAddLesson={handleAddLessonSubmit}
        />

        {/* Delete Chapter Modal */}
        <Modal
          isVisible={isDeleteChapterModalVisible}
          onBackdropPress={() => setIsDeleteChapterModalVisible(false)}
          onSwipeComplete={() => setIsDeleteChapterModalVisible(false)}
          swipeDirection="down"
          style={styles.modalContainer}
          avoidKeyboard
        >
          <View style={styles.mainModalView}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Delete Chapter</Text>
              <TouchableOpacity
                onPress={() => setIsDeleteChapterModalVisible(false)}
              >
                <Icon name="X" size={24} color={COLORS.white} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.modalMessage}>
                Are you sure you want to delete chapter{' '}
                <Text style={styles.boldName}>"{chapterToDelete?.title}"</Text>?
                This action cannot be undone.
              </Text>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                onPress={() => setIsDeleteChapterModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalDeleteButton}
                onPress={onConfirmDeleteChapter}
                disabled={apiUpdateCourseLoading}
              >
                {apiUpdateCourseLoading ? (
                  <ActivityIndicator color={COLORS.white} size="small" />
                ) : (
                  <Text style={styles.modalDeleteText}>Delete</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Delete Lesson Modal */}
        <Modal
          isVisible={isDeleteLessonModalVisible}
          onBackdropPress={() => setIsDeleteLessonModalVisible(false)}
          onSwipeComplete={() => setIsDeleteLessonModalVisible(false)}
          swipeDirection="down"
          style={styles.modalContainer}
          avoidKeyboard
        >
          <View style={styles.mainModalView}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Delete Lesson</Text>
              <TouchableOpacity
                onPress={() => setIsDeleteLessonModalVisible(false)}
              >
                <Icon name="X" size={24} color={COLORS.white} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.modalMessage}>
                Are you sure you want to delete lesson{' '}
                <Text style={styles.boldName}>
                  "{lessonToDelete?.lesson?.title}"
                </Text>
                ? This action cannot be undone.
              </Text>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                onPress={() => setIsDeleteLessonModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalDeleteButton}
                onPress={onConfirmDeleteLesson}
                disabled={apiUpdateCourseLoading}
              >
                {apiUpdateCourseLoading ? (
                  <ActivityIndicator color={COLORS.white} size="small" />
                ) : (
                  <Text style={styles.modalDeleteText}>Delete</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditCourse;
