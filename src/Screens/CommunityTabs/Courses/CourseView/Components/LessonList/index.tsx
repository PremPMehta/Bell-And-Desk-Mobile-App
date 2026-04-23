import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import Icon from '@/Components/Core/Icons';
import { COLORS } from '@/Assets/Theme/colors';
import { getFullImageUrl } from '@/Utils/ImageUtils';
import styles from './style';

interface LessonListProps {
  chapters: any[];
  currentLessonId: string | null;
  completedLessonIds: Record<string, boolean>;
  onLessonPress: (lessonId: string) => void;
}

const getVideoThumbnail = (url: string, type?: string) => {
  if (!url) return null;

  // Don't show video thumbnails for PDFs
  if (
    type?.toLowerCase() === 'pdf' ||
    url.toLowerCase().endsWith('.pdf')
  ) {
    return null;
  }

  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  if (ytMatch) {
    return `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;
  }
  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
  if (vimeoMatch) {
    return `https://vumbnail.com/${vimeoMatch[1]}.jpg`;
  }
  return getFullImageUrl(url);
};

const LessonList = ({
  chapters,
  currentLessonId,
  completedLessonIds,
  onLessonPress,
}: LessonListProps) => {
  const [expandedChapterId, setExpandedChapterId] = useState<string | null>(
    null,
  );
  const [didInit, setDidInit] = useState(false);

  // Open the first chapter by default ONLY ONCE
  useEffect(() => {
    if (chapters?.length > 0 && !didInit) {
      const firstChapterId = chapters[0]._id || '0';
      setExpandedChapterId(firstChapterId);
      setDidInit(true);
    }
  }, [chapters, didInit]);

  const toggleChapter = (chapterId: string) => {
    // Only one accordion open at a time
    setExpandedChapterId(prev => (prev === chapterId ? null : chapterId));
  };

  if (!chapters || chapters.length === 0) {
    return null;
  }

  return (
    <View>
      {chapters.map((chapter: any, index: number) => {
        const chapterId = chapter._id || String(index);
        const isExpanded = expandedChapterId === chapterId;
        const videos = chapter.videos || [];

        return (
          <View key={chapterId} style={styles.chapterContainer}>
            <TouchableOpacity
              style={styles.chapterHeader}
              onPress={() => toggleChapter(chapterId)}
              activeOpacity={0.8}
            >
              <Text style={styles.chapterTitleText}>{chapter.title}</Text>
              <Icon
                name={isExpanded ? 'ChevronUp' : 'ChevronDown'}
                size={16}
                color={COLORS.white}
              />
            </TouchableOpacity>

            {isExpanded && (
              <View style={styles.lessonsContainer}>
                {videos.map((lesson: any) => {
                  const isSelected = currentLessonId === lesson._id;
                  const isCompleted = !!completedLessonIds[lesson._id];

                  // Resolve thumbnail: check direct field (string or object), then fallback to video extraction
                  const thumbPath =
                    typeof lesson.thumbnail === 'object'
                      ? lesson.thumbnail?.url || lesson.thumbnail?.path
                      : lesson.thumbnail;

                  const thumbnailUrl = thumbPath
                    ? getFullImageUrl(thumbPath)
                    : getVideoThumbnail(
                        lesson.videoUrl || lesson.url,
                        lesson.type || lesson.contentType || lesson.lessonType,
                      );

                  return (
                    <TouchableOpacity
                      key={lesson._id}
                      style={[
                        styles.lessonItem,
                        isSelected && styles.activeLesson,
                      ]}
                      onPress={() => onLessonPress(lesson._id)}
                    >
                      <View style={styles.lessonThumbnail}>
                        {thumbnailUrl ? (
                          <Image
                            source={{ uri: thumbnailUrl }}
                            style={styles.lessonThumbnailImage}
                            resizeMode="cover"
                          />
                        ) : (
                          <View style={styles.lessonThumbnail}>
                            <Icon name="Video" size={20} color={COLORS.gray} />
                          </View>
                        )}
                        <View style={styles.playIconOverlay}>
                          <Icon
                            name={
                              lesson.type === 'PDF' ||
                              lesson.lessonType === 'pdf' ||
                              lesson.contentType === 'pdf'
                                ? 'FileText'
                                : isSelected
                                ? 'CirclePause'
                                : 'CirclePlay'
                            }
                            size={24}
                            color={
                              isSelected ? COLORS.primary : COLORS.whiteLight
                            }
                          />
                        </View>
                      </View>
                      <View style={styles.lessonInfo}>
                        <Text
                          style={[
                            styles.lessonTitle,
                            isSelected && styles.activeLessonTitle,
                          ]}
                        >
                          {lesson.title}
                        </Text>
                        <Text style={styles.lessonDuration}>
                          {lesson.type === 'PDF' ||
                          lesson.lessonType === 'pdf' ||
                          lesson.contentType === 'pdf'
                            ? 'PDF Document'
                            : lesson.duration
                            ? `${lesson.duration} min`
                            : 'Video'}
                        </Text>
                      </View>

                      {isCompleted && (
                        <View style={styles.checkmarkContainer}>
                          <Icon
                            name="CircleCheck"
                            size={18}
                            color="#22c55e"
                          />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
};

export default LessonList;
