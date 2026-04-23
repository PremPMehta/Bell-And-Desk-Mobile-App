import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { useAtom } from 'jotai';
import { userAtom } from '@/Jotai/Atoms';
import { api } from '@/ApiService';
import { ApiEndPoints } from '@/ApiService/api-end-points';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from '@/Components/Core/Icons';
import { COLORS } from '@/Assets/Theme/colors';
import { useNavigation } from '@/Hooks/Utils/use-navigation';
import { getFullImageUrl } from '@/Utils/ImageUtils';
import CommunityMenuTabs from '@/Components/Core/CommunityMenuTabs';
import WebView from 'react-native-webview';
import styles from './style';
import { vs } from '@/Assets/Theme/fontStyle';
import useUserApi from '@/Hooks/Apis/UserApis/use-user-api';
import { useRoute } from '@react-navigation/native';
import CourseViewSkeleton from '@/Components/Core/Skeleton/CourseViewSkeleton';
import CommentSection from './Components/CommentSection';
import LessonList from './Components/LessonList';

// Build a WebView-compatible video source from a URL based on its type
const buildVideoSource = (url: string, videoType?: string) => {
  if (!url) return null;
  const type = (videoType || '').toLowerCase();

  // If it's a PDF, we don't want to build a video source
  if (type === 'pdf') {
    return null;
  }

  // --- Vimeo ---

  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
  if (vimeoMatch || type === 'vimeo') {
    const vimeoId = vimeoMatch ? vimeoMatch[1] : url.split('/').pop();
    return {
      uri: `https://player.vimeo.com/video/${vimeoId}?autoplay=0&muted=0&controls=1`,
    };
  }

  // --- YouTube ---
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  if (ytMatch || type === 'youtube') {
    const videoId = ytMatch ? ytMatch[1] : url.split('/').pop();
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body, html { margin: 0; padding: 0; background-color: black; width: 100%; height: 100%; overflow: hidden; }
            .video-container { position: relative; width: 100%; height: 100%; }
            iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0; }
          </style>
        </head>
        <body>
          <div class="video-container">
            <iframe
              src="https://www.youtube.com/embed/${videoId}?rel=0&autoplay=0&controls=1&playsinline=1"
              frameborder="0"
              allow="autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
              referrerpolicy="strict-origin-when-cross-origin">
            </iframe>
          </div>
        </body>
      </html>
    `;
    return {
      html,
      baseUrl: 'https://www.youtube.com',
      headers: { Referer: 'https://www.youtube.com' },
    };
  }

  // --- Other direct video URL (mp4, etc.) — wrap in a simple HTML video tag ---
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body, html { margin: 0; padding: 0; background: black; width: 100%; height: 100%; }
          video { width: 100%; height: 100%; object-fit: contain; }
        </style>
      </head>
      <body>
        <video controls playsinline src="${getFullImageUrl(url)}"></video>
      </body>
    </html>
  `;
  return { html };
};

// Build WebView HTML for the summary rich-text content
const buildSummaryHtml = (htmlContent: string) => ({
  html: `<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
    <style>
      html, body {
        margin: 0 !important; padding: 0 !important;
        background-color: transparent !important;
        color: #c8c8c8;
        font-family: -apple-system, system-ui, Roboto, "Helvetica Neue", Arial, sans-serif;
        overflow-x: hidden; width: 100%;
      }
      * { min-height: 0 !important; box-sizing: border-box; }
      img { max-width: 100% !important; height: auto !important; display: block; }
      section, div { max-width: 100% !important; }
      h1 { font-size: 1.8rem !important; color: #fff; }
      h2 { font-size: 1.4rem !important; color: #fff; }
      h3 { font-size: 1.1rem !important; color: #fff; }
      p { line-height: 1.6; margin: 8px 0; }
    </style>
  </head>
  <body>
    <div id="cw">${htmlContent}</div>
    <script>
      var lastReported = 0;
      var reportCount = 0;
      var MAX_REPORTS = 6;
      function reportHeight() {
        if (reportCount >= MAX_REPORTS) return;
        var height = Math.max(
          document.body.scrollHeight,
          document.documentElement.scrollHeight,
          document.getElementById('cw') ? document.getElementById('cw').scrollHeight : 0
        );
        if (height > 0 && Math.abs(height - lastReported) > 10) {
          lastReported = height;
          reportCount++;
          window.ReactNativeWebView.postMessage(String(height));
        }
      }
      reportHeight();
      setTimeout(reportHeight, 100);
      setTimeout(reportHeight, 400);
      setTimeout(reportHeight, 800);
      window.addEventListener('load', reportHeight);
      document.querySelectorAll('img').forEach(function(img) {
        img.addEventListener('load', function() { setTimeout(reportHeight, 100); });
      });
    </script>
  </body>
</html>`,
});

const CourseView = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { courseId } = route.params || {};
  const [user]: [any, any] = useAtom(userAtom);
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<any>(null);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const lastScrollY = useRef(0);

  const {
    getCourseDetails,
    apiGetCourseDetailsLoading,
    apiGetCourseDetails,
    clearCourseDetails,
  } = useUserApi();

  const [selectedTab, setSelectedTab] = useState('lessons');
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [summaryWebHeight, setSummaryWebHeight] = useState(1);
  const isUpdatingHeightRef = useRef(false);

  // Track completed lessons locally (optimistic updates)
  const [completedLessonIds, setCompletedLessonIds] = useState<
    Record<string, boolean>
  >({});
  // Track which lesson is currently being toggled (for button loading state)
  const [togglingLessonId, setTogglingLessonId] = useState<string | null>(null);

  useEffect(() => {
    if (courseId) {
      clearCourseDetails();
      setSelectedLessonId(null);
      setCompletedLessonIds({});
      getCourseDetails(courseId);
    }
  }, [courseId]);

  const course = apiGetCourseDetails?.course;
  const chapters = course?.chapters || [];

  useEffect(() => {
    if (chapters.length > 0) {
      // Auto-select first video of first chapter if nothing is selected
      if (!selectedLessonId) {
        const firstChapter = chapters[0];
        const firstLessonId = firstChapter?.videos?.[0]?._id;
        if (firstLessonId) {
          setSelectedLessonId(firstLessonId);
        }
      }

      // Seed completed state from API data (isCompleted field on each video)
      const seeded: Record<string, boolean> = {};
      chapters.forEach((chapter: any) => {
        (chapter.videos || []).forEach((video: any) => {
          if (video._id && video.isCompleted) {
            seeded[video._id] = true;
          }
        });
      });
      if (Object.keys(seeded).length > 0) {
        setCompletedLessonIds(prev => ({ ...seeded, ...prev }));
      }
    }
  }, [chapters, selectedLessonId]);

  // Reset webview height when lesson changes
  useEffect(() => {
    setSummaryWebHeight(1);
    isUpdatingHeightRef.current = false;
  }, [selectedLessonId]);

  // Flatten all lessons for lookup
  const allLessons = useMemo(() => {
    const lessons: any[] = [];
    chapters.forEach((chapter: any) => {
      (chapter.videos || []).forEach((video: any) => {
        lessons.push(video);
      });
    });
    return lessons;
  }, [chapters]);

  const currentLesson = useMemo(() => {
    if (selectedLessonId) {
      return allLessons.find(l => l._id === selectedLessonId) || allLessons[0];
    }
    return allLessons[0];
  }, [allLessons, selectedLessonId]);

  // Course progress derived values
  const totalLessons = allLessons.length;
  const completedCount = useMemo(
    () => Object.values(completedLessonIds).filter(Boolean).length,
    [completedLessonIds],
  );
  const progressPercent =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  // Animate progress bar whenever completedCount changes
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progressPercent,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [completedCount]);

  // Build video source for the current lesson
  const videoSource = useMemo(() => {
    if (!currentLesson) return null;
    const url = currentLesson.videoUrl || currentLesson.url || '';
    const videoType = currentLesson.videoType || currentLesson.type || '';
    return buildVideoSource(url, videoType);
  }, [currentLesson]);

  const isCurrentLessonPdf = useMemo(() => {
    return (
      currentLesson?.type === 'PDF' ||
      currentLesson?.lessonType === 'pdf' ||
      currentLesson?.contentType === 'pdf'
    );
  }, [currentLesson]);

  const handleViewPdf = useCallback(() => {
    if (!currentLesson) return;
    const url = currentLesson.videoUrl || currentLesson.url || '';
    if (!url) return;

    navigation.navigate('PdfViewer', {
      pdfUrl: getFullImageUrl(url),
      title: currentLesson.title || 'Document',
    });
  }, [currentLesson, navigation]);

  // Build summary HTML only when lesson changes
  const summaryHtml = useMemo(() => {
    const summary = currentLesson?.summary || '';
    if (!summary) return null;
    const hasHtml = /<[a-z/][\s\S]*?>/i.test(summary);
    if (!hasHtml) return null;
    return buildSummaryHtml(summary);
  }, [currentLesson]);

  // Toggle lesson complete / incomplete — optimistic update + silent API call
  const handleToggleComplete = useCallback(
    async (lessonId: string, isCurrentlyCompleted: boolean) => {
      if (!lessonId || !courseId || togglingLessonId) return;

      const newValue = !isCurrentlyCompleted;

      // Optimistic update
      setCompletedLessonIds(prev => ({ ...prev, [lessonId]: newValue }));
      setTogglingLessonId(lessonId);

      try {
        const url = ApiEndPoints.toggleLessonComplete
          .replace(':courseId', courseId)
          .replace(':videoId', lessonId);
        await api.post(url, { isCompleted: newValue });
      } catch (error) {
        console.error('Error toggling lesson complete:', error);
        // Revert on failure
        setCompletedLessonIds(prev => ({
          ...prev,
          [lessonId]: isCurrentlyCompleted,
        }));
      } finally {
        setTogglingLessonId(null);
      }
    },
    [courseId, togglingLessonId],
  );

  const handleSummaryWebViewMessage = useCallback(
    (event: any) => {
      if (isUpdatingHeightRef.current) return;
      const height = Number(event.nativeEvent.data);
      if (height > 0 && Math.abs(height - summaryWebHeight) > 5) {
        isUpdatingHeightRef.current = true;
        setSummaryWebHeight(height + 16);
        setTimeout(() => {
          isUpdatingHeightRef.current = false;
        }, 500);
      }
    },
    [summaryWebHeight],
  );

  const tabs = [
    { id: 'lessons', title: 'Lessons' },
    { id: 'comments', title: 'Comments' },
  ];

  const headerBgColor = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: ['transparent', COLORS.header],
    extrapolate: 'clamp',
  });

  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [0, 80, 120],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp',
  });

  const backButtonBgColor = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: ['rgba(0,0,0,0.4)', 'transparent'],
    extrapolate: 'clamp',
  });

  // Stale data check or loading
  if (
    (apiGetCourseDetailsLoading && !course) ||
    (course && course._id !== courseId)
  ) {
    return <CourseViewSkeleton />;
  }

  const handleScroll = (event: any) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const direction = currentOffset > lastScrollY.current ? 'down' : 'up';

    // Show button if user is scrolling up AND is not at the very top
    if (direction === 'up' && currentOffset > 300) {
      setShowScrollToTop(true);
    } else {
      setShowScrollToTop(false);
    }
    lastScrollY.current = currentOffset;
  };

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
    setShowScrollToTop(false);
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <Animated.View
        style={[
          styles.header,
          {
            paddingTop: insets.top,
            backgroundColor: headerBgColor,
            height: insets.top + vs(50),
          },
        ]}
      >
        <Animated.View
          style={[styles.backButton, { backgroundColor: backButtonBgColor }]}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon
              name={Platform.OS === 'ios' ? 'ChevronLeft' : 'ArrowLeft'}
              color={COLORS.white}
              size={20}
            />
          </TouchableOpacity>
        </Animated.View>
        <Animated.View>
          <Animated.Text
            numberOfLines={1}
            style={[
              styles.headerTitle,
              { opacity: headerTitleOpacity, color: COLORS.white },
            ]}
          >
            {course?.community?.name ? `${course.community.name}` : ''}
          </Animated.Text>
          <Animated.Text
            numberOfLines={1}
            style={[
              styles.headerSubTitle,
              { opacity: headerTitleOpacity, color: COLORS.subText },
            ]}
          >
            {course?.title || 'Course Details'}
          </Animated.Text>
        </Animated.View>
      </Animated.View>

      <Animated.ScrollView
        ref={scrollRef}
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          {
            useNativeDriver: false,
            listener: handleScroll,
          },
        )}
        scrollEventThrottle={16}
      >
        {/* VIDEO / PDF SECTION */}
        <View style={styles.videoSection}>
          {isCurrentLessonPdf ? (
            <View style={styles.pdfPlaceholder}>
              <Icon name="FileText" size={64} color={COLORS.whiteLight} />
              <Text style={styles.pdfPlaceholderText}>
                This lesson contains a PDF document
              </Text>
              <TouchableOpacity
                style={styles.pdfButton}
                activeOpacity={0.8}
                onPress={handleViewPdf}
              >
                <Icon name="Eye" size={18} color={COLORS.white} />
                <Text style={styles.pdfButtonText}>View PDF Document</Text>
              </TouchableOpacity>
            </View>
          ) : videoSource ? (
            <WebView
              key={`video-${currentLesson?._id}`}
              source={videoSource}
              style={[styles.videoPlayer, { backgroundColor: '#000' }]}
              allowsFullscreenVideo
              allowsInlineMediaPlayback
              mediaPlaybackRequiresUserAction={false}
              javaScriptEnabled
              domStorageEnabled
              originWhitelist={['*']}
              mixedContentMode="always"
              scrollEnabled={false}
            />
          ) : (
            <View
              style={[
                styles.videoPlayer,
                {
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#111',
                },
              ]}
            >
              <Icon name="CirclePlay" size={48} color={COLORS.whiteLight} />
              <Text style={{ color: COLORS.subText, marginTop: 12 }}>
                Video not available
              </Text>
            </View>
          )}
        </View>

        {/* TITLE & DESCRIPTION */}
        <View style={styles.videoInfoSection}>
          <Text style={styles.videoTitle}>
            {currentLesson?.title || course?.title}
          </Text>
          {!!currentLesson?.description && (
            <Text style={styles.videoDescription}>
              {currentLesson.description}
            </Text>
          )}

          {/* Mark as Complete & Session Type */}
          <View style={styles.completeSection}>
            {!!currentLesson?.type && (
              <Text style={styles.sessionTypeText}>
                {currentLesson.type.toLowerCase()} {'Lesson'}
              </Text>
            )}
            {currentLesson?._id && (
              <TouchableOpacity
                style={[
                  styles.completeButton,
                  completedLessonIds[currentLesson._id] && {
                    backgroundColor: '#22c55e',
                  },
                  togglingLessonId === currentLesson._id && { opacity: 0.6 },
                ]}
                activeOpacity={0.8}
                disabled={togglingLessonId === currentLesson._id}
                onPress={() =>
                  handleToggleComplete(
                    currentLesson._id,
                    !!completedLessonIds[currentLesson._id],
                  )
                }
              >
                {togglingLessonId === currentLesson._id ? (
                  <ActivityIndicator size={16} color={COLORS.white} />
                ) : (
                  <Icon name="CircleCheck" size={18} color={COLORS.white} />
                )}
                <Text style={styles.completeText}>
                  {completedLessonIds[currentLesson._id]
                    ? 'Completed'
                    : 'Mark as Complete'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* COURSE PROGRESS BAR */}
        {totalLessons > 0 && (
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Course Progress</Text>
              <Text style={styles.progressPercent}>{progressPercent}%</Text>
            </View>
            <View style={styles.progressBarBg}>
              <Animated.View
                style={[
                  styles.progressBarFill,
                  {
                    width: progressAnim.interpolate({
                      inputRange: [0, 100],
                      outputRange: ['0%', '100%'],
                      extrapolate: 'clamp',
                    }),
                  },
                ]}
              />
            </View>
          </View>
        )}

        {/* TABS */}
        <View style={styles.tabSection}>
          <CommunityMenuTabs
            tabs={tabs}
            selectedTab={selectedTab}
            onTabPress={id => setSelectedTab(id)}
          />

          <View style={styles.tabContent}>
            {selectedTab === 'lessons' ? (
              <LessonList
                chapters={chapters}
                currentLessonId={selectedLessonId}
                completedLessonIds={completedLessonIds}
                onLessonPress={setSelectedLessonId}
              />
            ) : (
              selectedLessonId && (
                <CommentSection
                  videoId={selectedLessonId}
                  courseId={courseId}
                  communityId={
                    apiGetCourseDetails?.data?.communityId ||
                    apiGetCourseDetails?.data?.community?._id
                  }
                />
              )
            )}
          </View>
        </View>

        {/* LESSON SUMMARY - only shown when summary is available */}
        {!!currentLesson?.summary && (
          <View style={styles.summarySection}>
            <Text style={styles.summaryTitle}>Lesson Summary</Text>
            <Text style={styles.summarySubTitle}>
              Summary of this video lesson
            </Text>
            {summaryHtml ? (
              <WebView
                key={`summary-${currentLesson?._id}`}
                originWhitelist={['*']}
                scrollEnabled={false}
                nestedScrollEnabled={false}
                showsVerticalScrollIndicator={false}
                overScrollMode="never"
                javaScriptEnabled
                domStorageEnabled={false}
                style={{
                  width: '100%',
                  height: summaryWebHeight,
                  backgroundColor: 'transparent',
                  opacity: summaryWebHeight > 1 ? 1 : 0,
                }}
                source={summaryHtml}
                onMessage={handleSummaryWebViewMessage}
              />
            ) : (
              <Text style={styles.summaryText}>{currentLesson.summary}</Text>
            )}
          </View>
        )}
      </Animated.ScrollView>

      {showScrollToTop && (
        <TouchableOpacity
          style={styles.scrollToTopButton}
          onPress={scrollToTop}
          activeOpacity={0.8}
        >
          <Icon name="ChevronsUp" size={22} color={COLORS.white} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default CourseView;
