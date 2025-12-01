import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { COLORS } from '@/Assets/Theme/colors';
import { ms } from '@/Assets/Theme/fontStyle';
import { THEME } from '@/Assets/Theme';
import {
  RichEditor,
  RichToolbar,
  actions,
} from 'react-native-pell-rich-editor';
import Modal from 'react-native-modal';
import { launchImageLibrary } from 'react-native-image-picker';

interface RichTextEditorProps {
  label?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  error?: string;
  touched?: boolean;
}

const RichTextEditorComponent: React.FC<RichTextEditorProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  touched,
}) => {
  const richText = useRef<RichEditor>(null);

  // Modal State for Link
  const [isLinkModalVisible, setLinkModalVisible] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkTitle, setLinkTitle] = useState('');

  const handleInsertLink = () => {
    setLinkUrl('');
    setLinkTitle('');
    setLinkModalVisible(true);
  };

  const handleInsertImage = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        includeBase64: true, // Useful for WebViews
      });

      if (result.didCancel) {
        return;
      }

      if (result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        // Use base64 if available for better WebView compatibility, otherwise URI
        const imageSrc = asset.base64
          ? `data:${asset.type};base64,${asset.base64}`
          : asset.uri;

        if (imageSrc && richText.current) {
          richText.current.insertImage(imageSrc);
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const submitLink = () => {
    if (linkUrl) {
      richText.current?.insertLink(linkTitle || linkUrl, linkUrl);
    }
    setLinkModalVisible(false);
  };

  return (
    <View style={styles.mainContainer}>
      {label && <Text style={styles.labelStyle}>{label}</Text>}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.editorContainer}
      >
        {/* Toolbar */}
        <RichToolbar
          editor={richText}
          actions={[
            actions.heading1,
            actions.heading2,
            actions.heading3,
            actions.heading4,
            actions.heading5,
            actions.heading6,
            actions.setBold,
            actions.setItalic,
            actions.setUnderline,
            actions.insertBulletsList,
            actions.insertOrderedList,
            actions.insertLink,
            actions.insertImage,
            actions.alignLeft,
            actions.alignCenter,
            actions.alignRight,
            actions.undo,
            actions.redo,
          ]}
          iconMap={{
            [actions.heading1]: ({ tintColor }) => (
              <Text style={[styles.tib, { color: tintColor }]}>H1</Text>
            ),
            [actions.heading2]: ({ tintColor }) => (
              <Text style={[styles.tib, { color: tintColor }]}>H2</Text>
            ),
            [actions.heading3]: ({ tintColor }) => (
              <Text style={[styles.tib, { color: tintColor }]}>H3</Text>
            ),
            [actions.heading4]: ({ tintColor }) => (
              <Text style={[styles.tib, { color: tintColor }]}>H4</Text>
            ),
            [actions.heading5]: ({ tintColor }) => (
              <Text style={[styles.tib, { color: tintColor }]}>H5</Text>
            ),
            [actions.heading6]: ({ tintColor }) => (
              <Text style={[styles.tib, { color: tintColor }]}>H6</Text>
            ),
          }}
          onPressAddImage={handleInsertImage}
          onInsertLink={handleInsertLink}
          style={styles.toolbar}
          selectedIconTint={COLORS.primary}
          disabledIconTint={COLORS.outlineGrey}
          iconTint={COLORS.white}
        />

        {/* Rich Text Editor */}
        <RichEditor
          ref={richText}
          onChange={onChangeText}
          placeholder={placeholder || 'Start typing...'}
          initialContentHTML={value}
          style={styles.richEditor}
          editorStyle={{
            backgroundColor: COLORS.cardBG,
            color: COLORS.white,
            placeholderColor: COLORS.outlineGrey,
            contentCSSText: `
              font-size: 16px;
              color: ${COLORS.white};
              padding: 12px;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            `,
          }}
          useContainer={true}
          initialHeight={150}
        />
      </KeyboardAvoidingView>

      {touched && error ? (
        <Text style={styles.errorTxtStyle}>{error}</Text>
      ) : null}

      {/* Link Input Modal */}
      <Modal
        isVisible={isLinkModalVisible}
        onBackdropPress={() => setLinkModalVisible(false)}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Insert Link</Text>

          <TextInput
            style={styles.modalInput}
            placeholder="Link Title (Optional)"
            placeholderTextColor={COLORS.outlineGrey}
            value={linkTitle}
            onChangeText={setLinkTitle}
          />

          <TextInput
            style={styles.modalInput}
            placeholder="URL (https://...)"
            placeholderTextColor={COLORS.outlineGrey}
            value={linkUrl}
            onChangeText={setLinkUrl}
            autoCapitalize="none"
          />

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalBtn, styles.cancelBtn]}
              onPress={() => setLinkModalVisible(false)}
            >
              <Text style={styles.btnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalBtn, styles.insertBtn]}
              onPress={submitLink}
            >
              <Text style={styles.btnText}>Insert</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default RichTextEditorComponent;

const styles = StyleSheet.create({
  mainContainer: {
    marginBottom: ms(18),
  },
  labelStyle: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.white,
    marginBottom: ms(8),
  },
  editorContainer: {
    backgroundColor: COLORS.cardBG,
    borderRadius: ms(8),
    borderWidth: 1,
    borderColor: COLORS.outlineGrey,
    overflow: 'hidden',
  },
  tib: {
    ...THEME.fontStyle.h5Regular,
    // color: COLORS.white,
  },
  toolbar: {
    backgroundColor: '#2A2A2A',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.outlineGrey,
    height: 50,
  },
  richEditor: {
    backgroundColor: COLORS.cardBG,
    minHeight: 150,
  },
  errorTxtStyle: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.red,
    marginTop: ms(5),
  },
  // Modal Styles
  modal: {
    justifyContent: 'center',
    margin: ms(20),
  },
  modalContent: {
    backgroundColor: COLORS.cardBG,
    padding: ms(20),
    borderRadius: ms(12),
    borderWidth: 1,
    borderColor: COLORS.outlineGrey,
  },
  modalTitle: {
    ...THEME.fontStyle.h4Bold,
    color: COLORS.white,
    marginBottom: ms(16),
    textAlign: 'center',
  },
  modalInput: {
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: COLORS.outlineGrey,
    borderRadius: ms(8),
    padding: ms(12),
    color: COLORS.white,
    marginBottom: ms(12),
    ...THEME.fontStyle.h5Regular,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: ms(8),
  },
  modalBtn: {
    flex: 1,
    padding: ms(12),
    borderRadius: ms(8),
    alignItems: 'center',
    marginHorizontal: ms(6),
  },
  cancelBtn: {
    backgroundColor: COLORS.gray,
  },
  insertBtn: {
    backgroundColor: COLORS.primary,
  },
  btnText: {
    ...THEME.fontStyle.h5Bold,
    color: COLORS.white,
  },
});
