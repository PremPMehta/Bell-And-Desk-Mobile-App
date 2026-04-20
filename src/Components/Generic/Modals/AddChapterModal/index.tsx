import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Modal from 'react-native-modal';
import { COLORS } from '@/Assets/Theme/colors';
import styles from './style';
import Icon from '@/Components/Core/Icons';
import TextInputField from '@/Components/Core/TextInputField';

interface Props {
  isModalVisible: boolean;
  headerLabel: string;
  onHandleCancel: () => void;

  chapterTitle: string;
  onChapterTitleChange: (text: string) => void;
  chapterError: string;
  chapterDescription: string;
  onChapterDescriptionChange: (text: string) => void;
  chapterDescriptionError: string;
  onAddChapter: () => void;
  buttonLabel?: string;
}

const AddChapterModal: React.FC<Props> = ({
  isModalVisible,
  headerLabel,
  onHandleCancel,
  chapterTitle,
  onChapterTitleChange,
  chapterError,

  chapterDescription,
  onChapterDescriptionChange,
  chapterDescriptionError,

  onAddChapter = () => { },
  buttonLabel = 'Add Chapter',
}) => {
  const [isDismissEnabled, setIsDismissEnabled] = useState(false);
  const enableDismissTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  useEffect(() => {
    return () => {
      if (enableDismissTimeoutRef.current) {
        clearTimeout(enableDismissTimeoutRef.current);
      }
    };
  }, []);

  return (
    // <View>
    //   <Text>AddChapterModal</Text>
    // </View>
    <Modal
      isVisible={isModalVisible} // isLogoutModalVisible
      onSwipeComplete={() => {
        if (isDismissEnabled) onHandleCancel();
      }}
      onBackdropPress={() => {
        if (isDismissEnabled) onHandleCancel();
      }}
      swipeDirection="down"
      animationIn="slideInUp"
      animationOut="slideOutDown"
      // backdropColor={THEME.COLORS.modalBackdropColor}
      animationInTiming={500}
      animationOutTiming={500}
      useNativeDriver
      useNativeDriverForBackdrop
      backdropTransitionOutTiming={0}
      onModalWillShow={() => {
        setIsDismissEnabled(false);
        if (enableDismissTimeoutRef.current) {
          clearTimeout(enableDismissTimeoutRef.current);
        }
      }}
      onModalShow={() => {
        enableDismissTimeoutRef.current = setTimeout(() => {
          setIsDismissEnabled(true);
        }, 250);
      }}
      onModalHide={() => {
        setIsDismissEnabled(false);
        if (enableDismissTimeoutRef.current) {
          clearTimeout(enableDismissTimeoutRef.current);
          enableDismissTimeoutRef.current = null;
        }
      }}
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

        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          <TextInputField
            label="Chapter title"
            placeholder="Enter chapter title"
            value={chapterTitle}
            onChangeText={onChapterTitleChange}
            error={chapterError}
            touched={!!chapterError}
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
            label="Chapter Description"
            placeholder="Enter chapter description"
            value={chapterDescription}
            onChangeText={onChapterDescriptionChange}
            multiline
            numberOfLines={4}
            error={chapterDescriptionError}
            touched={!!chapterDescriptionError}
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
            onPress={onAddChapter}
          >
            <Text style={styles.addChapterButtonText}>{buttonLabel}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default AddChapterModal;
