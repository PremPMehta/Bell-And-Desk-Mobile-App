import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  ActivityIndicator,
  InteractionManager,
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
import { Config } from '@/Config';

const EditCourse = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();
  const { courseData, communityName, communityId } = route.params || {};

  const [isAddChapterModalVisible, setIsAddChapterModalVisible] =
    useState(false);
  const [isAddLessonModalVisible, setIsAddLessonModalVisible] = useState(false);

  const openModalTaskRef = useRef<any>(null);
  const openLessonModalAfterInteractions = () => {
    openModalTaskRef.current?.cancel?.();
    openModalTaskRef.current = InteractionManager.runAfterInteractions(() => {
      setIsAddLessonModalVisible(true);
    });
  };
  const openChapterModalAfterInteractions = () => {
    openModalTaskRef.current?.cancel?.();
    openModalTaskRef.current = InteractionManager.runAfterInteractions(() => {
      setIsAddChapterModalVisible(true);
    });
  };
  const openDeleteChapterModalAfterInteractions = () => {
    openModalTaskRef.current?.cancel?.();
    openModalTaskRef.current = InteractionManager.runAfterInteractions(() => {
      setIsDeleteChapterModalVisible(true);
    });
  };
  const openDeleteLessonModalAfterInteractions = () => {
    openModalTaskRef.current?.cancel?.();
    openModalTaskRef.current = InteractionManager.runAfterInteractions(() => {
      setIsDeleteLessonModalVisible(true);
    });
  };

  const {
    updateCourse,
    apiUpdateCourseLoading,
    getCourseDetails,
    apiGetCourseDetailsLoading,
    uploadPdf,
    apiUploadPdfLoading,
    uploadVideo,
    apiUploadVideoLoading,
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

  useEffect(() => {
    return () => {
      openModalTaskRef.current?.cancel?.();
    };
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

  // Upload Video from device
  const [modalUploadedVideoAsset, setModalUploadedVideoAsset] =
    useState<any>(null);

  // Video Bank selection
  const [modalSelectedVideoBankItem, setModalSelectedVideoBankItem] =
    useState<any>(null);

  // Delete State
  const [isDeleteChapterModalVisible, setIsDeleteChapterModalVisible] =
    useState(false);
  const [isDeleteLessonModalVisible, setIsDeleteLessonModalVisible] =
    useState(false);
  const [chapterToDelete, setChapterToDelete] = useState<any>(null);
  const [lessonToDelete, setLessonToDelete] = useState<any>(null);

  const handleAddChapter = () => {
    openChapterModalAfterInteractions();
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

        // ── Video Bank Lesson payload ──────────────────────────────────────
        // Detect video bank: either from videoSource field or videoBankId presence
        const isVideoBankLesson =
          video.videoSource === 'videobank' ||
          video.videoType === 'videoBank' ||
          !!video.videoBankId;

        if (isVideoBankLesson) {
          // Resolve the bank video object (may be nested or flat)
          const bankVideo = video.bankvideo || {};
          // Stream URL: prefer mux streaming URL from the bank video object
          const streamUrl =
            bankVideo.videoUrl ||
            bankVideo.url ||
            bankVideo.streamUrl ||
            video.videoLink ||
            video.videoUrl ||
            video.url ||
            '';
          // muxPlaybackId from bank video object
          const muxId = bankVideo.muxPlaybackId || video.muxPlaybackId || '';
          // Duration: bank video stores seconds as number; convert if needed
          const rawDuration = bankVideo.duration ?? video.duration;
          let formattedDuration = '0:00';
          if (typeof rawDuration === 'number') {
            const m = Math.floor(rawDuration / 60);
            const s = Math.floor(rawDuration % 60);
            formattedDuration = `${m}:${s.toString().padStart(2, '0')}`;
          } else if (typeof rawDuration === 'string' && rawDuration) {
            formattedDuration = rawDuration;
          }

          return {
            ...video,
            title: video.title,
            description: video.description,
            // ── exact fields from API payload screenshot ──
            summary: '', // always empty for video bank
            content: streamUrl, // mux stream URL
            url: streamUrl,
            videoUrl: streamUrl,
            videoType: 'videoBank', // MUST be "videoBank" (capital B)
            type: 'VIDEO',
            contentType: 'video',
            duration: formattedDuration,
            muxPlaybackId: muxId,
            videoBankId: bankVideo._id || video.videoBankId || null,
            bankvideo: bankVideo._id ? bankVideo : null,
            order: vIndex,
            attachments: video.attachments || [],
          };
        }

        // ── Regular Video Lesson payload (youtube / loom / vimeo / upload / none) ──
        return {
          ...video,
          title: video.title,
          description: video.description,
          summary: video.description || video.title || 'Lesson',
          content: video.content || '',
          url: video.videoLink || video.url || '',
          videoUrl: video.videoLink || video.videoUrl || '',
          // Keep the original videoSource value ('youtube', 'loom', 'vimeo', 'upload', 'none')
          videoType: video.videoSource || video.videoType || 'upload',
          type: 'VIDEO',
          contentType: 'video',
          duration: video.duration || '0:00',
          order: vIndex,
          attachments: video.attachments || [],
          bankvideo: null,
          videoBankId: null,
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
    openChapterModalAfterInteractions();
  };

  const handleDeleteChapter = (chapter: any) => {
    setChapterToDelete(chapter);
    openDeleteChapterModalAfterInteractions();
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
    openLessonModalAfterInteractions();
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
    setModalUploadedVideoAsset(null);
    setModalSelectedVideoBankItem(null);
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

      // 2. Build video-related fields for the lesson
      const isVideoBank = modalLessonVideoSource === 'videobank';
      const isUpload = modalLessonVideoSource === 'upload';

      let finalVideoUrl = modalLessonVideoLink;

      // 3. Handle Video Upload if needed (Upload from Device)
      if (modalLessonType === 'video' && isUpload && modalUploadedVideoAsset) {
        // If it's a local file update
        if (
          modalUploadedVideoAsset.uri &&
          (modalUploadedVideoAsset.uri.startsWith('file://') ||
            modalUploadedVideoAsset.uri.startsWith('content://'))
        ) {
          try {
            const formData = new FormData();
            formData.append('video', {
              uri: modalUploadedVideoAsset.uri,
              type: modalUploadedVideoAsset.type || 'video/mp4',
              name:
                modalUploadedVideoAsset.fileName ||
                `video_${Date.now()}.${
                  modalUploadedVideoAsset.type?.split('/')[1] || 'mp4'
                }`,
            } as any);

            const res = await uploadVideo(formData);
            if (res?.success) {
              const relativeUrl = res?.url || '';
              // Robustly derive base domain (origin) from Config.API_URL
              const baseDomain = Config.API_URL.split('/')
                .slice(0, 3)
                .join('/');
              finalVideoUrl = `${baseDomain}${relativeUrl}`;
            } else {
              return;
            }
          } catch (error) {
            console.error('Video Upload Error:', error);
            ToastModule.errorBottom({ msg: 'Failed to upload video file' });
            return;
          }
        } else {
          finalVideoUrl = modalUploadedVideoAsset.uri || '';
        }
      }

      // For video bank: resolve the URL from the selected item
      const videoBankUrl = isVideoBank
        ? modalSelectedVideoBankItem?.videoUrl ||
          modalSelectedVideoBankItem?.url ||
          modalSelectedVideoBankItem?.streamUrl ||
          modalLessonVideoLink
        : '';

      // The final video URL to store
      const resolvedVideoLink =
        modalLessonType === 'video'
          ? isVideoBank
            ? videoBankUrl
            : finalVideoUrl
          : '';

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
                        modalLessonType === 'video' ? resolvedVideoLink : '',
                      // Upload video asset
                      uploadedVideoAsset:
                        modalLessonType === 'video' && isUpload
                          ? modalUploadedVideoAsset
                          : null,
                      // Video Bank reference
                      videoBankId:
                        modalLessonType === 'video' && isVideoBank
                          ? modalSelectedVideoBankItem?._id || null
                          : video.videoBankId || null,
                      bankvideo:
                        modalLessonType === 'video' && isVideoBank
                          ? modalSelectedVideoBankItem || null
                          : null,
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
          videoLink: modalLessonType === 'video' ? resolvedVideoLink : '',
          // Upload video asset
          uploadedVideoAsset:
            modalLessonType === 'video' && isUpload
              ? modalUploadedVideoAsset
              : null,
          // Video Bank reference
          videoBankId:
            modalLessonType === 'video' && isVideoBank
              ? modalSelectedVideoBankItem?._id || null
              : null,
          bankvideo:
            modalLessonType === 'video' && isVideoBank
              ? modalSelectedVideoBankItem || null
              : null,
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

    // ── Normalise the stored video source ──────────────────────────────────
    // API returns videoType:"videoBank" (capital B); internally we use 'videobank'
    const rawSource =
      lesson.videoSource || lesson.videoType || lesson.type || 'none';
    // Map API value "videoBank" → internal 'videobank'
    const normaliseSource = (s: string): VideoSource => {
      if (s === 'videoBank' || s === 'videobank') return 'videobank';
      if (
        s === 'youtube' ||
        s === 'loom' ||
        s === 'vimeo' ||
        s === 'upload' ||
        s === 'none'
      ) {
        return s as VideoSource;
      }
      return 'none';
    };
    const storedSource: VideoSource = isPdf
      ? 'none'
      : normaliseSource(rawSource);

    setModalLessonVideoSource(storedSource);
    setModalLessonVideoLink(
      isPdf ? '' : lesson.videoLink || lesson.videoUrl || lesson.url || '',
    );

    // ── Restore Video Bank selection ────────────────────────────────────────
    // API stores videoBankId and bankvideo; detect by either field
    const isVideoBankLesson =
      storedSource === 'videobank' || !!lesson.videoBankId;

    if (!isPdf && isVideoBankLesson) {
      // Prefer the full bankvideo object; fall back to a minimal stub so the
      // handleUpdateCourseApi can at least read the _id
      setModalSelectedVideoBankItem(
        lesson.bankvideo && lesson.bankvideo._id
          ? lesson.bankvideo
          : lesson.videoBankId
          ? { _id: lesson.videoBankId }
          : null,
      );
    } else {
      setModalSelectedVideoBankItem(null);
    }

    // ── Restore uploaded video asset hint ───────────────────────────────────
    if (!isPdf && storedSource === 'upload' && lesson.videoLink) {
      setModalUploadedVideoAsset({
        uri: lesson.videoLink,
        fileName: lesson.videoLink.split('/').pop(),
      });
    } else {
      setModalUploadedVideoAsset(null);
    }

    // ── Lesson Content (rich-text body) ─────────────────────────────────────
    // For video-bank lessons summary is always ""; use lesson.content instead.
    // For PDF lessons skip the URL-looking summary value.
    const contentVal = isVideoBankLesson
      ? lesson.content || ''
      : lesson.summary || lesson.content || '';
    setModalLessonContent(
      isPdf && contentVal.endsWith('.pdf') ? '' : contentVal,
    );

    // ── PDF fields ──────────────────────────────────────────────────────────
    const pdfPath =
      lesson.contentUrl ||
      lesson.url ||
      (isPdf && contentVal.endsWith('.pdf') ? contentVal : '');
    setModalLessonContentUrl(pdfPath);

    // We can't restore a file object from URI alone, but show stored fileName hint
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

    openLessonModalAfterInteractions();
  };

  const handleDeleteLesson = (chapterId: string, lesson: any) => {
    setLessonToDelete({ chapterId, lesson });
    openDeleteLessonModalAfterInteractions();
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

            // Normalise source for display – API stores 'videoBank', state stores 'videobank'
            const rawVSource =
              video.videoSource || video.videoType || video.type || 'none';
            const isVideoBankVideo =
              rawVSource === 'videoBank' ||
              rawVSource === 'videobank' ||
              !!video.videoBankId;
            const isUploadVideo = rawVSource === 'upload';
            const isNoVideo =
              !isPdf &&
              !isVideoBankVideo &&
              !isUploadVideo &&
              (rawVSource === 'none' || rawVSource === '');

            // Human-readable subtitle
            const lessonSubtitle = isPdf
              ? 'PDF/Text Lesson'
              : isVideoBankVideo
              ? 'Video Bank'
              : isUploadVideo
              ? 'Uploaded Video'
              : isNoVideo
              ? 'No video'
              : `${
                  rawVSource.charAt(0).toUpperCase() + rawVSource.slice(1)
                } video`;

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
                  <Text style={styles.videoSubtitle}>{lessonSubtitle}</Text>
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
      </ScrollView>

      {/* Modals moved outside ScrollView to prevent flickering during animation */}
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
          if (modalChapterDescriptionError) setModalChapterDescriptionError('');
        }}
        chapterDescriptionError={modalChapterDescriptionError}
        onAddChapter={handleAddChapterSubmit}
      />

      <AddLessonModal
        isModalVisible={isAddLessonModalVisible}
        headerLabel={editingLessonId ? 'Edit Lesson' : 'Add Lesson'}
        buttonLabel={editingLessonId ? 'Update Lesson' : 'Add Lesson'}
        isLoading={apiUploadPdfLoading || apiUploadVideoLoading}
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
          setModalUploadedVideoAsset(null);
          setModalSelectedVideoBankItem(null);
        }}
        // Video fields
        videoSource={modalLessonVideoSource}
        onVideoSourceChange={source => {
          setModalLessonVideoSource(source);
          // Clear opposite sources when switching
          if (source !== 'upload') setModalUploadedVideoAsset(null);
          if (source !== 'videobank') setModalSelectedVideoBankItem(null);
          if (source !== 'youtube' && source !== 'loom' && source !== 'vimeo') {
            setModalLessonVideoLink('');
          }
        }}
        videoLink={modalLessonVideoLink}
        onVideoLinkChange={setModalLessonVideoLink}
        // PDF fields
        contentUrl={modalLessonContentUrl}
        onContentUrlChange={setModalLessonContentUrl}
        primaryDocument={modalLessonPrimaryDocument}
        onPrimaryDocumentChange={setModalLessonPrimaryDocument}
        // Upload Video
        uploadedVideoAsset={modalUploadedVideoAsset}
        onUploadedVideoAssetChange={setModalUploadedVideoAsset}
        // Video Bank
        selectedVideoBankItem={modalSelectedVideoBankItem}
        onSelectedVideoBankItemChange={setModalSelectedVideoBankItem}
        // Community
        communityId={communityId}
        onAddLesson={handleAddLessonSubmit}
      />

      {/* Delete Chapter Modal */}
      <Modal
        isVisible={isDeleteChapterModalVisible}
        onBackdropPress={() => setIsDeleteChapterModalVisible(false)}
        onSwipeComplete={() => setIsDeleteChapterModalVisible(false)}
        swipeDirection="down"
        useNativeDriver
        useNativeDriverForBackdrop
        backdropTransitionOutTiming={0}
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
        useNativeDriver
        useNativeDriverForBackdrop
        backdropTransitionOutTiming={0}
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
    </SafeAreaView>
  );
};

export default EditCourse;
