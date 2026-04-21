import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
  FlatList,
} from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Modal from 'react-native-modal';
import { COLORS } from '@/Assets/Theme/colors';
import styles from './style';
import Icon from '@/Components/Core/Icons';
import TextInputField from '@/Components/Core/TextInputField';
import RichTextEditorComponent from '@/Components/Core/RichTextEditor';
import {
  pick,
  types,
  isCancel,
  type DocumentPickerResponse,
} from '@react-native-documents/picker';
import { launchImageLibrary } from 'react-native-image-picker';
import useUserApi from '@/Hooks/Apis/UserApis/use-user-api';
import { ms } from '@/Assets/Theme/fontStyle';
import { StyleSheet } from 'react-native';
import LessonModalSkeleton from './LessonModalSkeleton';

export type VideoSource =
  | 'none'
  | 'youtube'
  | 'loom'
  | 'vimeo'
  | 'upload'
  | 'videobank';
export type LessonType = 'video' | 'pdf';

interface Props {
  isModalVisible: boolean;
  headerLabel: string;
  onHandleCancel: () => void;

  lessonTitle: string;
  onLessonTitleChange: (text: string) => void;
  lessonError: string;
  lessonDescription: string;
  onLessonDescriptionChange: (text: string) => void;
  lessonDescriptionError: string;

  lessonContentValue: string;
  onLessonContentChange: (text: string) => void;

  // Lesson Type (video | pdf)
  lessonType: LessonType;
  onLessonTypeChange: (type: LessonType) => void;

  // Video-specific
  videoSource: VideoSource;
  onVideoSourceChange: (source: VideoSource) => void;
  videoLink: string;
  onVideoLinkChange: (text: string) => void;

  // PDF/Text-specific
  contentUrl: string;
  onContentUrlChange: (text: string) => void;
  primaryDocument: DocumentPickerResponse | null;
  onPrimaryDocumentChange: (asset: DocumentPickerResponse | null) => void;

  // Upload Video from device
  uploadedVideoAsset?: any;
  onUploadedVideoAssetChange?: (asset: any) => void;

  // Video Bank selection
  selectedVideoBankItem?: any;
  onSelectedVideoBankItemChange?: (item: any) => void;

  // Community ID – needed to fetch video bank list
  communityId?: string;

  onAddLesson: () => void;
  isLoading?: boolean;
  buttonLabel?: string;
}

/* ─── Helper: format seconds ─────────────── */
const formatDuration = (seconds?: number) => {
  if (!seconds) return '';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

/* ─── Helper: format date ────────────────── */
const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const AddLessonModal: React.FC<Props> = ({
  isModalVisible,
  headerLabel,
  onHandleCancel,
  lessonTitle,
  onLessonTitleChange,
  lessonError,

  lessonDescription,
  onLessonDescriptionChange,
  lessonDescriptionError,

  lessonContentValue,
  onLessonContentChange,

  lessonType,
  onLessonTypeChange,

  videoSource,
  onVideoSourceChange,
  videoLink,
  onVideoLinkChange,

  contentUrl,
  onContentUrlChange,
  primaryDocument,
  onPrimaryDocumentChange,

  uploadedVideoAsset,
  onUploadedVideoAssetChange,

  selectedVideoBankItem,
  onSelectedVideoBankItemChange,

  communityId,

  onAddLesson,
  isLoading = false,
  buttonLabel = 'Add Lesson',
}) => {
  const [isMainModalShown, setIsMainModalShown] = useState(false);
  const [isDismissEnabled, setIsDismissEnabled] = useState(false);
  const [isContentReady, setIsContentReady] = useState(false);
  const enableDismissTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const contentReadyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  useEffect(() => {
    return () => {
      if (enableDismissTimeoutRef.current) {
        clearTimeout(enableDismissTimeoutRef.current);
      }
      if (contentReadyTimeoutRef.current) {
        clearTimeout(contentReadyTimeoutRef.current);
      }
    };
  }, []);

  // ── Video Bank Modal state ──────────────────────────────────────────────────
  const [isVideoBankModalVisible, setIsVideoBankModalVisible] = useState(false);
  const [videoBankList, setVideoBankList] = useState<any[]>([]);
  const [videoBankPage, setVideoBankPage] = useState(1);
  const [videoBankPagination, setVideoBankPagination] = useState<any>(null);
  const [videoBankLoading, setVideoBankLoading] = useState(false);
  const [videoBankInitialLoading, setVideoBankInitialLoading] = useState(true);

  const { getVideoBank } = useUserApi();

  const LIMIT = 9;

  // ── Fetch Video Bank ────────────────────────────────────────────────────────
  const fetchVideoBankList = useCallback(
    async (pageNum: number, isRefresh = false) => {
      if (!communityId) return;
      setVideoBankLoading(true);
      const query = `?query=&page=${pageNum}&limit=${LIMIT}&sortBy=createdAt&order=desc`;
      const res: any = await getVideoBank(communityId, query);
      const incoming: any[] = res?.videos || [];
      if (isRefresh || pageNum === 1) {
        setVideoBankList(incoming);
      } else {
        setVideoBankList(prev => [...prev, ...incoming]);
      }
      setVideoBankPagination(res?.pagination);
      setVideoBankLoading(false);
      setVideoBankInitialLoading(false);
    },
    [communityId, getVideoBank],
  );

  const openVideoBankModal = () => {
    setIsVideoBankModalVisible(true);
    setVideoBankInitialLoading(true);
    setVideoBankPage(1);
    setVideoBankList([]);
    fetchVideoBankList(1, true);
  };

  const handleLoadMoreVideoBank = () => {
    if (
      !videoBankLoading &&
      videoBankPagination &&
      videoBankPage < videoBankPagination.pages
    ) {
      const next = videoBankPage + 1;
      setVideoBankPage(next);
      fetchVideoBankList(next);
    }
  };

  const handleSelectVideoBankItem = (item: any) => {
    // Store the full bankvideo object so handleUpdateCourseApi can read
    // muxPlaybackId, duration, videoUrl, _id, title, etc.
    onSelectedVideoBankItemChange?.(item);
    onVideoSourceChange('videobank');
    // Resolve the mux / CDN stream URL from the bank item
    // The API payload uses this same URL for content / url / videoUrl fields
    const streamUrl = item.videoUrl || item.url || item.streamUrl || '';
    onVideoLinkChange(streamUrl);
    setIsVideoBankModalVisible(false);
  };

  // ── Upload Video from Device ────────────────────────────────────────────────
  const handlePickVideo = () => {
    launchImageLibrary({ mediaType: 'video', quality: 1 }, res => {
      if (res.assets && res.assets.length > 0) {
        onUploadedVideoAssetChange?.(res.assets[0]);
        onVideoSourceChange('upload');
      }
    });
  };

  // ── Document Picker (PDF) ───────────────────────────────────────────────────
  const handlePickDocument = async () => {
    try {
      const [file] = await pick({
        type: [types.pdf],
        allowMultiSelection: false,
      });
      onPrimaryDocumentChange(file);
    } catch (err) {
      if (isCancel(err)) {
        return;
      }
      Alert.alert('Error', 'Failed to pick document. Please try again.');
    }
  };

  // ── Render Video Source Card ────────────────────────────────────────────────
  const renderVideoSourceCard = (
    source: VideoSource,
    label: string,
    subtext: string,
    iconName: string,
    iconColor: string = COLORS.white,
    onPressOverride?: () => void,
  ) => {
    const isSelected = videoSource === source;
    return (
      <TouchableOpacity
        style={[styles.videoSourceCard, isSelected && styles.selectedCard]}
        onPress={() => {
          if (onPressOverride) {
            onPressOverride();
          } else {
            onVideoSourceChange(source);
          }
        }}
      >
        <View style={styles.cardContent}>
          {source === 'none' ? (
            <Icon name="X" size={24} color={COLORS.outlineGrey} />
          ) : (
            <Icon
              name={iconName}
              size={24}
              color={isSelected ? iconColor : COLORS.white}
            />
          )}
          <Text style={[styles.cardLabel, isSelected && { color: iconColor }]}>
            {label}
          </Text>
          <Text style={styles.cardSubtext}>{subtext}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  // ── Video Bank Item Card ────────────────────────────────────────────────────
  const renderVideoBankItem = ({ item }: { item: any }) => {
    const isSelected = selectedVideoBankItem?._id === item._id;
    return (
      <TouchableOpacity
        style={[vbStyles.itemCard, isSelected && vbStyles.itemCardSelected]}
        onPress={() => handleSelectVideoBankItem(item)}
        activeOpacity={0.8}
      >
        {/* Thumbnail */}
        <View style={vbStyles.thumbContainer}>
          {item.thumbnailUrl ? (
            <Image
              source={{ uri: item.thumbnailUrl }}
              style={vbStyles.thumbImage}
              resizeMode="cover"
            />
          ) : (
            <View style={vbStyles.thumbPlaceholder}>
              <Icon name="Video" size={24} color={COLORS.outlineGrey} />
            </View>
          )}
          {item.duration != null && (
            <View style={vbStyles.durationBadge}>
              <Text style={vbStyles.durationText}>
                {formatDuration(item.duration)}
              </Text>
            </View>
          )}
          {isSelected && (
            <View style={vbStyles.selectedOverlay}>
              <Icon name="Check" size={20} color={COLORS.white} />
            </View>
          )}
        </View>

        {/* Info */}
        <View style={vbStyles.itemInfo}>
          <Text style={vbStyles.itemTitle} numberOfLines={2}>
            {item.title || 'Untitled'}
          </Text>
          <Text style={vbStyles.itemDate}>{formatDate(item.createdAt)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      {/* ── Main Lesson Modal ──────────────────────────────────────────────── */}
      <Modal
        isVisible={isModalVisible}
        onSwipeComplete={() => {
          if (isDismissEnabled) onHandleCancel();
        }}
        onBackdropPress={() => {
          if (isDismissEnabled) onHandleCancel();
        }}
        swipeDirection="down"
        animationIn="slideInUp"
        animationOut="slideOutDown"
        animationInTiming={500}
        animationOutTiming={500}
        useNativeDriver
        useNativeDriverForBackdrop
        backdropTransitionOutTiming={0}
        onModalWillShow={() => {
          setIsDismissEnabled(false);
          setIsContentReady(false);
          setIsMainModalShown(false);
          if (enableDismissTimeoutRef.current) {
            clearTimeout(enableDismissTimeoutRef.current);
          }
          if (contentReadyTimeoutRef.current) {
            clearTimeout(contentReadyTimeoutRef.current);
            contentReadyTimeoutRef.current = null;
          }
        }}
        onModalShow={() => {
          // Show loader first, then mount the heavy content after animation settles.
          contentReadyTimeoutRef.current = setTimeout(() => {
            setIsContentReady(true);
            setIsMainModalShown(true);
          }, 300);
          // Prevent "touch-through" from the opening tap dismissing the modal.
          enableDismissTimeoutRef.current = setTimeout(() => {
            setIsDismissEnabled(true);
          }, 250);
        }}
        onModalHide={() => {
          setIsMainModalShown(false);
          setIsDismissEnabled(false);
          setIsContentReady(false);
          if (enableDismissTimeoutRef.current) {
            clearTimeout(enableDismissTimeoutRef.current);
            enableDismissTimeoutRef.current = null;
          }
          if (contentReadyTimeoutRef.current) {
            clearTimeout(contentReadyTimeoutRef.current);
            contentReadyTimeoutRef.current = null;
          }
        }}
        style={styles.modalContainer}
        avoidKeyboard={true}
      >
        <View style={styles.mainModalView}>
          <View style={styles.header}>
            <Text style={styles.title}>{headerLabel}</Text>
            <TouchableOpacity onPress={onHandleCancel}>
              <Icon name="X" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          {!isContentReady ? (
            <LessonModalSkeleton backgroundColor={COLORS.newModalBG} />
          ) : (
            <>
              <ScrollView
                style={styles.scrollContent}
                contentContainerStyle={{ paddingBottom: 20 }}
              >
                {/* Lesson Type Tabs */}
                <View style={styles.lessonTypeSwitcher}>
                  <TouchableOpacity
                    style={[
                      styles.lessonTypeTab,
                      lessonType === 'video' && styles.lessonTypeTabActive,
                    ]}
                    onPress={() => onLessonTypeChange('video')}
                    activeOpacity={0.8}
                  >
                    <Icon
                      name="Video"
                      size={14}
                      color={
                        lessonType === 'video'
                          ? COLORS.white
                          : COLORS.outlineGrey
                      }
                    />
                    <Text
                      style={[
                        styles.lessonTypeTabText,
                        lessonType === 'video' &&
                          styles.lessonTypeTabTextActive,
                      ]}
                    >
                      Video Lesson
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.lessonTypeTab,
                      lessonType === 'pdf' && styles.lessonTypeTabActive,
                    ]}
                    onPress={() => onLessonTypeChange('pdf')}
                    activeOpacity={0.8}
                  >
                    <Icon
                      name="FileText"
                      size={14}
                      color={
                        lessonType === 'pdf' ? COLORS.white : COLORS.outlineGrey
                      }
                    />
                    <Text
                      style={[
                        styles.lessonTypeTabText,
                        lessonType === 'pdf' && styles.lessonTypeTabTextActive,
                      ]}
                    >
                      PDF/Text Lesson
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Lesson Title */}
                <TextInputField
                  label="Lesson title"
                  placeholder="Enter Lesson title"
                  value={lessonTitle}
                  onChangeText={onLessonTitleChange}
                  error={lessonError}
                  touched={!!lessonError}
                  style={styles.inputStyle}
                  theme={{
                    colors: {
                      background: COLORS.cardBG,
                      text: COLORS.white,
                      placeholder: COLORS.outlineGrey,
                    },
                  }}
                  textColor={COLORS.white}
                  outlineColor={COLORS.outlineGrey}
                  activeOutlineColor={COLORS.white}
                />
                <TextInputField
                  label="Lesson Description"
                  placeholder="Enter Lesson description"
                  value={lessonDescription}
                  onChangeText={onLessonDescriptionChange}
                  multiline
                  numberOfLines={4}
                  error={lessonDescriptionError}
                  touched={!!lessonDescriptionError}
                  style={[styles.inputStyle, styles.descriptionStyle]}
                  theme={{
                    colors: {
                      background: COLORS.cardBG,
                      text: COLORS.white,
                      placeholder: COLORS.outlineGrey,
                    },
                  }}
                  textColor={COLORS.white}
                  outlineColor={COLORS.outlineGrey}
                  activeOutlineColor={COLORS.white}
                />

                {/* Lesson Content */}
                <View style={styles.lessonContentContainer}>
                  {isMainModalShown ? (
                    <RichTextEditorComponent
                      label="Lesson Content"
                      placeholder="Enter lesson content"
                      value={lessonContentValue}
                      onChangeText={onLessonContentChange}
                    />
                  ) : (
                    <View
                      style={{
                        height: ms(180),
                        borderRadius: ms(10),
                        backgroundColor: COLORS.cardBG,
                        borderWidth: 1,
                        borderColor: COLORS.outlineGrey,
                      }}
                    />
                  )}
                </View>

                {/* ── VIDEO LESSON ── */}
                {lessonType === 'video' && (
                  <>
                    {/* Video Source Selection */}
                    <View style={styles.videoSourceContainer}>
                      <Text style={styles.videoSourceLabel}>
                        Video Source (Optional)
                      </Text>
                      <View style={styles.gridContainer}>
                        {/* No Video */}
                        {renderVideoSourceCard(
                          'none',
                          'No Video',
                          'Skip video for this lesson',
                          'X',
                          COLORS.outlineGrey,
                        )}
                        {/* YouTube */}
                        {renderVideoSourceCard(
                          'youtube',
                          'YouTube Link',
                          'Paste YouTube video URL',
                          'Youtube',
                          COLORS.red,
                        )}
                        {/* Loom */}
                        {renderVideoSourceCard(
                          'loom',
                          'Loom Link',
                          'Paste Loom video URL',
                          'Play',
                          COLORS.loom,
                        )}
                        {/* Vimeo */}
                        {renderVideoSourceCard(
                          'vimeo',
                          'Vimeo Link',
                          'Paste Vimeo video URL',
                          'Video',
                          COLORS.vimeo,
                        )}
                        {/* Upload Video */}
                        {renderVideoSourceCard(
                          'upload',
                          'Upload Video',
                          'Upload from your device',
                          'Upload',
                          COLORS.primary,
                          handlePickVideo,
                        )}
                        {/* Video Bank */}
                        {renderVideoSourceCard(
                          'videobank',
                          'Video Bank',
                          'Pick from video bank',
                          'Library',
                          COLORS.primary,
                          openVideoBankModal,
                        )}
                      </View>
                    </View>

                    {/* Video URL Input – for link-based sources */}
                    {(videoSource === 'youtube' ||
                      videoSource === 'loom' ||
                      videoSource === 'vimeo') && (
                      <View style={{ marginTop: 16 }}>
                        <TextInputField
                          label={`${
                            videoSource.charAt(0).toUpperCase() +
                            videoSource.slice(1)
                          } Video URL`}
                          placeholder={`Paste your ${videoSource} video URL here`}
                          value={videoLink}
                          onChangeText={onVideoLinkChange}
                          leftIcon="play"
                          style={styles.inputStyle}
                          theme={{
                            colors: {
                              background: COLORS.cardBG,
                              text: COLORS.white,
                              placeholder: COLORS.outlineGrey,
                            },
                          }}
                          textColor={COLORS.white}
                          outlineColor={COLORS.outlineGrey}
                          activeOutlineColor={COLORS.white}
                        />
                      </View>
                    )}

                    {/* Upload Video – show selected file info */}
                    {videoSource === 'upload' && (
                      <TouchableOpacity
                        style={vbStyles.selectedFileRow}
                        onPress={handlePickVideo}
                        activeOpacity={0.8}
                      >
                        <Icon name="Video" size={18} color={COLORS.primary} />
                        <Text
                          style={vbStyles.selectedFileText}
                          numberOfLines={1}
                        >
                          {uploadedVideoAsset?.fileName ||
                            uploadedVideoAsset?.uri?.split('/').pop() ||
                            'Tap to change video file'}
                        </Text>
                        {uploadedVideoAsset && (
                          <TouchableOpacity
                            onPress={() => {
                              onUploadedVideoAssetChange?.(null);
                              onVideoSourceChange('none');
                            }}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                          >
                            <Icon
                              name="X"
                              size={16}
                              color={COLORS.outlineGrey}
                            />
                          </TouchableOpacity>
                        )}
                      </TouchableOpacity>
                    )}

                    {/* Video Bank – show selected video info */}
                    {videoSource === 'videobank' && selectedVideoBankItem && (
                      <TouchableOpacity
                        style={vbStyles.selectedFileRow}
                        onPress={openVideoBankModal}
                        activeOpacity={0.8}
                      >
                        {selectedVideoBankItem.thumbnailUrl ? (
                          <Image
                            source={{ uri: selectedVideoBankItem.thumbnailUrl }}
                            style={vbStyles.selectedThumb}
                          />
                        ) : (
                          <Icon name="Video" size={18} color={COLORS.primary} />
                        )}
                        <Text
                          style={vbStyles.selectedFileText}
                          numberOfLines={1}
                        >
                          {selectedVideoBankItem.title || 'Selected video'}
                        </Text>
                        <TouchableOpacity
                          onPress={() => {
                            onSelectedVideoBankItemChange?.(null);
                            onVideoSourceChange('none');
                            onVideoLinkChange('');
                          }}
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                          <Icon name="X" size={16} color={COLORS.outlineGrey} />
                        </TouchableOpacity>
                      </TouchableOpacity>
                    )}
                  </>
                )}

                {/* ── PDF / TEXT LESSON ── */}
                {lessonType === 'pdf' && (
                  <View style={styles.pdfSection}>
                    {/* Content URL */}
                    <TextInputField
                      label="Content URL"
                      placeholder="Enter PDF URL or text content link"
                      value={contentUrl}
                      onChangeText={onContentUrlChange}
                      leftIcon="link"
                      style={styles.inputStyle}
                      theme={{
                        colors: {
                          background: COLORS.cardBG,
                          text: COLORS.white,
                          placeholder: COLORS.outlineGrey,
                        },
                      }}
                      textColor={COLORS.white}
                      outlineColor={COLORS.outlineGrey}
                      activeOutlineColor={COLORS.white}
                    />

                    {/* Primary Document Picker */}
                    <View style={styles.documentPickerContainer}>
                      <Text style={styles.documentPickerLabel}>
                        Primary Document
                      </Text>
                      <TouchableOpacity
                        style={styles.documentPickerButton}
                        onPress={handlePickDocument}
                        activeOpacity={0.75}
                      >
                        <Icon
                          name="Paperclip"
                          size={18}
                          color={COLORS.outlineGrey}
                        />
                        <Text
                          style={styles.documentPickerButtonText}
                          numberOfLines={1}
                        >
                          {primaryDocument?.name ||
                            primaryDocument?.uri?.split('/').pop() ||
                            'Pick PDF document from device'}
                        </Text>
                        {primaryDocument && (
                          <TouchableOpacity
                            onPress={() => onPrimaryDocumentChange(null)}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                          >
                            <Icon
                              name="X"
                              size={16}
                              color={COLORS.outlineGrey}
                            />
                          </TouchableOpacity>
                        )}
                      </TouchableOpacity>
                      {primaryDocument ? (
                        <Text
                          style={styles.documentPickerHint}
                          numberOfLines={1}
                        >
                          {primaryDocument.name ||
                            primaryDocument.uri?.split('/').pop()}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                )}
              </ScrollView>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={onHandleCancel}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.addChapterButton,
                    isLoading && { opacity: 0.7 },
                  ]}
                  onPress={onAddLesson}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color={COLORS.white} size="small" />
                  ) : (
                    <Text style={styles.addChapterButtonText}>
                      {buttonLabel}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </Modal>

      {/* ── Video Bank Picker Modal ─────────────────────────────────────────── */}
      <Modal
        isVisible={isVideoBankModalVisible}
        onBackdropPress={() => setIsVideoBankModalVisible(false)}
        onSwipeComplete={() => setIsVideoBankModalVisible(false)}
        swipeDirection="down"
        animationIn="slideInUp"
        animationOut="slideOutDown"
        animationInTiming={400}
        animationOutTiming={400}
        useNativeDriver
        useNativeDriverForBackdrop
        backdropTransitionOutTiming={0}
        style={vbStyles.modalContainer}
      >
        <View style={vbStyles.mainModalView}>
          {/* Header */}
          <View style={vbStyles.header}>
            <Text style={vbStyles.headerTitle}>Video Bank</Text>
            <TouchableOpacity onPress={() => setIsVideoBankModalVisible(false)}>
              <Icon name="X" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>
          <Text style={vbStyles.headerSubtitle}>
            Select a video from your community video bank
          </Text>

          {/* List */}
          {videoBankInitialLoading ? (
            <View style={vbStyles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={vbStyles.loadingText}>Loading videos...</Text>
            </View>
          ) : videoBankList.length === 0 ? (
            <View style={vbStyles.emptyContainer}>
              <Icon name="Video" size={48} color={COLORS.outlineGrey} />
              <Text style={vbStyles.emptyTitle}>No Videos Found</Text>
              <Text style={vbStyles.emptySubtitle}>
                Upload videos to the community Video Bank first.
              </Text>
            </View>
          ) : (
            <FlatList
              data={videoBankList}
              keyExtractor={(item, idx) => item._id || idx.toString()}
              renderItem={renderVideoBankItem}
              numColumns={2}
              columnWrapperStyle={vbStyles.columnWrapper}
              contentContainerStyle={vbStyles.listContent}
              showsVerticalScrollIndicator={false}
              onEndReached={handleLoadMoreVideoBank}
              onEndReachedThreshold={0.5}
              ListFooterComponent={
                videoBankLoading && videoBankPage > 1 ? (
                  <ActivityIndicator
                    size="small"
                    color={COLORS.primary}
                    style={{ marginVertical: 12 }}
                  />
                ) : null
              }
            />
          )}
        </View>
      </Modal>
    </>
  );
};

/* ─── Video Bank Modal Styles ────────────── */
const vbStyles = StyleSheet.create({
  modalContainer: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  mainModalView: {
    backgroundColor: COLORS.newModalBG,
    borderTopLeftRadius: ms(16),
    borderTopRightRadius: ms(16),
    height: '85%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ms(16),
    paddingTop: ms(16),
    paddingBottom: ms(8),
  },
  headerTitle: {
    fontSize: ms(18),
    fontWeight: '700',
    color: COLORS.white,
  },
  headerSubtitle: {
    fontSize: ms(13),
    color: COLORS.outlineGrey,
    paddingHorizontal: ms(16),
    marginBottom: ms(12),
  },
  listContent: {
    paddingHorizontal: ms(12),
    paddingBottom: ms(24),
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: ms(12),
  },
  itemCard: {
    width: '48.5%',
    backgroundColor: COLORS.cardBG,
    borderRadius: ms(10),
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  itemCardSelected: {
    borderColor: COLORS.primary,
  },
  thumbContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: COLORS.modalBG,
    position: 'relative',
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  thumbPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationBadge: {
    position: 'absolute',
    bottom: ms(4),
    right: ms(4),
    backgroundColor: 'rgba(0,0,0,0.75)',
    borderRadius: ms(4),
    paddingHorizontal: ms(5),
    paddingVertical: ms(2),
  },
  durationText: {
    fontSize: ms(10),
    color: COLORS.white,
    fontWeight: '600',
  },
  selectedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(27,124,255,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemInfo: {
    padding: ms(8),
  },
  itemTitle: {
    fontSize: ms(12),
    fontWeight: '600',
    color: COLORS.white,
    marginBottom: ms(3),
  },
  itemDate: {
    fontSize: ms(10),
    color: COLORS.outlineGrey,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: ms(12),
  },
  loadingText: {
    fontSize: ms(14),
    color: COLORS.outlineGrey,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: ms(32),
    gap: ms(10),
  },
  emptyTitle: {
    fontSize: ms(16),
    fontWeight: '700',
    color: COLORS.white,
  },
  emptySubtitle: {
    fontSize: ms(13),
    color: COLORS.outlineGrey,
    textAlign: 'center',
  },
  // Selected file info row (shown below the grid)
  selectedFileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(10),
    marginHorizontal: ms(16),
    marginTop: ms(12),
    backgroundColor: COLORS.cardBG,
    borderRadius: ms(8),
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingHorizontal: ms(12),
    paddingVertical: ms(10),
  },
  selectedFileText: {
    flex: 1,
    fontSize: ms(13),
    color: COLORS.white,
  },
  selectedThumb: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(4),
  },
});

export default AddLessonModal;
