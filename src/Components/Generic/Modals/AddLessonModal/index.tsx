import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import Modal from 'react-native-modal';
import { COLORS } from '@/Assets/Theme/colors';
import styles from './style';
import Icon from '@/Components/Core/Icons';
import TextInputField from '@/Components/Core/TextInputField';
import RichTextEditorComponent from '@/Components/Core/RichTextEditor';
import { pick, types, isCancel, type DocumentPickerResponse } from '@react-native-documents/picker';

export type VideoSource = 'none' | 'youtube' | 'loom' | 'vimeo';
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

  onAddLesson: () => void;
  isLoading?: boolean;
  buttonLabel?: string;
}

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

  onAddLesson,
  isLoading = false,
  buttonLabel = 'Add Lesson',
}) => {
  const renderVideoSourceCard = (
    source: VideoSource,
    label: string,
    subtext: string,
    iconName: string,
    iconColor: string = COLORS.white,
  ) => {
    const isSelected = videoSource === source;
    return (
      <TouchableOpacity
        style={[styles.videoSourceCard, isSelected && styles.selectedCard]}
        onPress={() => onVideoSourceChange(source)}
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

  const handlePickDocument = async () => {
    try {
      // types.pdf restricts the native OS file browser to PDF files only
      const [file] = await pick({
        type: [types.pdf],
        allowMultiSelection: false,
      });
      onPrimaryDocumentChange(file);
    } catch (err) {
      if (isCancel(err)) {
        // User dismissed the picker — nothing to do
        return;
      }
      Alert.alert('Error', 'Failed to pick document. Please try again.');
    }
  };

  return (
    <Modal
      isVisible={isModalVisible}
      onSwipeComplete={onHandleCancel}
      onBackdropPress={onHandleCancel}
      swipeDirection="down"
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationInTiming={500}
      animationOutTiming={500}
      backdropTransitionInTiming={1000}
      backdropTransitionOutTiming={1000}
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
                color={lessonType === 'video' ? COLORS.white : COLORS.outlineGrey}
              />
              <Text
                style={[
                  styles.lessonTypeTabText,
                  lessonType === 'video' && styles.lessonTypeTabTextActive,
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
                color={lessonType === 'pdf' ? COLORS.white : COLORS.outlineGrey}
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
            <RichTextEditorComponent
              label="Lesson Content"
              placeholder="Enter lesson content"
              value={lessonContentValue}
              onChangeText={onLessonContentChange}
            />
          </View>

          {/* ── VIDEO LESSON ── */}
          {lessonType === 'video' && (
            <>
              {/* Video Source Selection */}
              <View style={styles.videoSourceContainer}>
                <Text style={styles.videoSourceLabel}>Video Source (Optional)</Text>
                <View style={styles.gridContainer}>
                  {renderVideoSourceCard(
                    'none',
                    'No Video',
                    'Skip video for this lesson',
                    'X',
                    COLORS.outlineGrey,
                  )}
                  {renderVideoSourceCard(
                    'youtube',
                    'YouTube Link',
                    'Paste YouTube video URL',
                    'Youtube',
                    COLORS.red,
                  )}
                  {renderVideoSourceCard(
                    'loom',
                    'Loom Link',
                    'Paste Loom video URL',
                    'Play',
                    COLORS.loom,
                  )}
                  {renderVideoSourceCard(
                    'vimeo',
                    'Vimeo Link',
                    'Paste Vimeo video URL',
                    'Video',
                    COLORS.vimeo,
                  )}
                </View>
              </View>

              {/* Video URL Input */}
              {videoSource !== 'none' && (
                <View style={{ marginTop: 16 }}>
                  <TextInputField
                    label={`${
                      videoSource.charAt(0).toUpperCase() + videoSource.slice(1)
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
                <Text style={styles.documentPickerLabel}>Primary Document</Text>
                <TouchableOpacity
                  style={styles.documentPickerButton}
                  onPress={handlePickDocument}
                  activeOpacity={0.75}
                >
                  <Icon name="Paperclip" size={18} color={COLORS.outlineGrey} />
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
                      <Icon name="X" size={16} color={COLORS.outlineGrey} />
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>
                {primaryDocument ? (
                  <Text style={styles.documentPickerHint} numberOfLines={1}>
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
            style={[styles.addChapterButton, isLoading && { opacity: 0.7 }]}
            onPress={onAddLesson}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={COLORS.white} size="small" />
            ) : (
              <Text style={styles.addChapterButtonText}>{buttonLabel}</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default AddLessonModal;
