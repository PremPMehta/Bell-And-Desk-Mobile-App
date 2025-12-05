import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import Modal from 'react-native-modal';
import { COLORS } from '@/Assets/Theme/colors';
import styles from './style';
import Icon from '@/Components/Core/Icons';
import TextInputField from '@/Components/Core/TextInputField';
import RichTextEditorComponent from '@/Components/Core/RichTextEditor';

export type VideoSource = 'none' | 'youtube' | 'loom' | 'vimeo';

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

  videoSource: VideoSource;
  onVideoSourceChange: (source: VideoSource) => void;
  videoLink: string;
  onVideoLinkChange: (text: string) => void;

  onAddLesson: () => void;
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

  videoSource,
  onVideoSourceChange,
  videoLink,
  onVideoLinkChange,

  onAddLesson = () => {},
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

  return (
    <Modal
      isVisible={isModalVisible} // isLogoutModalVisible
      onSwipeComplete={onHandleCancel}
      onBackdropPress={onHandleCancel}
      swipeDirection="down"
      animationIn="slideInUp"
      animationOut="slideOutDown"
      // backdropColor={THEME.COLORS.modalBackdropColor}
      animationInTiming={500}
      animationOutTiming={500}
      backdropTransitionInTiming={1000}
      backdropTransitionOutTiming={1000}
      style={styles.modalContainer}
      avoidKeyboard={true}
    >
      <View style={styles.mainModalView}>
        {/* <View style={styles.modalPanDownToClose} /> */}
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
                'Youtube', // Assuming Icon component has Youtube icon
                COLORS.red,
              )}
              {renderVideoSourceCard(
                'loom',
                'Loom Link',
                'Paste Loom video URL',
                'Play', // Placeholder if Loom icon missing, or check Icon library
                COLORS.loom,
              )}
              {renderVideoSourceCard(
                'vimeo',
                'Vimeo Link',
                'Paste Vimeo video URL',
                'Video', // Placeholder if Vimeo icon missing
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
                // Add footer text if needed like "Examples: https://..."
              />
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
            style={styles.addChapterButton}
            onPress={onAddLesson}
          >
            <Text style={styles.addChapterButtonText}>{buttonLabel}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default AddLessonModal;
