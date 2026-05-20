import React, { useCallback } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  Platform,
} from 'react-native';
import { ms, mvs } from '@/Assets/Theme/fontStyle';
import { COLORS } from '@/Assets/Theme/colors';
import Icon from '@/Components/Core/Icons';
import {
  launchImageLibrary,
  launchCamera,
  type Asset,
} from 'react-native-image-picker';
import {
  pick,
  types,
  keepLocalCopy,
  isErrorWithCode,
  errorCodes,
  type DocumentPickerResponse,
} from '@react-native-documents/picker';
import ToastModule from '@/Components/Core/Toast';

export type ChatAttachmentKind = 'gallery' | 'camera' | 'document' | 'audio';

export type ChatAttachmentPickPayload =
  | { kind: 'gallery' | 'camera'; assets: Asset[] }
  | {
      kind: 'document' | 'audio';
      file: DocumentPickerResponse;
    };

interface AttachmentOptionsModalProps {
  visible: boolean;
  onClose: () => void;
  /** Extra space above the home indicator / nav bar so the sheet clears the composer */
  bottomInset: number;
  /** Optional hook when the user completes a pick (cancel does not call this) */
  onPickResult?: (payload: ChatAttachmentPickPayload) => void;
}

const WA_PURPLE = '#AC44CC';
const WA_CORAL = '#EB5757';
const WA_INDIGO = '#515BD4';
const WA_ORANGE = '#FF9F43';

const isAppCachedFileUri = (uri: string): boolean =>
  /\/Library\/Caches\//i.test(uri) ||
  /\/Library\/Application Support\//i.test(uri) ||
  /\/Documents\//i.test(uri) ||
  uri.includes('chat_upload_');

const shouldCopyPickedFileToCache = (uri: string): boolean => {
  if (isAppCachedFileUri(uri)) return false;
  if (uri.startsWith('content://')) return true;
  // iOS picker URIs are often temporary; copy into app cache before upload.
  if (Platform.OS === 'ios' && !uri.startsWith('http')) return true;
  return false;
};

const copyPickedFileToAppStorage = async (
  file: DocumentPickerResponse,
  fallbackName: string,
): Promise<string | null> => {
  const fileName = file.name || `${fallbackName}_${Date.now()}`;
  const destinations: Array<'cachesDirectory' | 'documentDirectory'> = [
    'cachesDirectory',
    'documentDirectory',
  ];

  for (const destination of destinations) {
    const [copyResult] = await keepLocalCopy({
      files: [{ uri: file.uri, fileName }],
      destination,
    });

    if (copyResult.status === 'success' && copyResult.localUri) {
      return copyResult.localUri;
    }
  }

  return null;
};

const resolvePickedFileUri = async (
  file: DocumentPickerResponse,
  fallbackName: string,
): Promise<string | null> => {
  if (!file.uri) return null;

  if (!shouldCopyPickedFileToCache(file.uri)) {
    return file.uri;
  }

  return copyPickedFileToAppStorage(file, fallbackName);
};

const OPTIONS: {
  kind: ChatAttachmentKind;
  label: string;
  icon: string;
  circleColor: string;
}[] = [
  {
    kind: 'gallery',
    label: 'Photos & Videos',
    icon: 'Images',
    circleColor: WA_PURPLE,
  },
  { kind: 'camera', label: 'Camera', icon: 'Camera', circleColor: WA_CORAL },
  {
    kind: 'document',
    label: 'Document',
    icon: 'FileText',
    circleColor: WA_INDIGO,
  },
  {
    kind: 'audio',
    label: 'Audio',
    icon: 'Headphones',
    circleColor: WA_ORANGE,
  },
];

const AttachmentOptionsModal: React.FC<AttachmentOptionsModalProps> = ({
  visible,
  onClose,
  bottomInset,
  onPickResult,
}) => {
  const handleImagePickerResponse = useCallback(
    (kind: 'gallery' | 'camera', response: any) => {
      if (response?.didCancel) return;
      if (response?.errorCode) {
        console.log(
          '🚀 ~ AttachmentOptionsModal ~ response.errorMessage:',
          response.errorMessage,
        );
        ToastModule.errorBottom({
          msg: response.errorMessage || 'Something went wrong',
        });
        return;
      }
      const assets = response?.assets;
      if (!assets?.length) return;
      const payload: ChatAttachmentPickPayload = { kind, assets };
      onPickResult?.(payload);
      const first = assets[0];
      const label =
        first?.type?.startsWith('video') || first?.duration != null
          ? 'Video'
          : 'Photo';
      ToastModule.successTop({
        msg:
          assets.length > 1
            ? `${assets.length} items selected`
            : `${label} selected`,
      });
    },
    [onPickResult],
  );

  const openGallery = useCallback(() => {
    onClose();
    setTimeout(() => {
      launchImageLibrary(
        {
          mediaType: 'mixed',
          selectionLimit: Platform.OS === 'ios' ? 30 : 15,
          quality: 0.92,
        },
        res => handleImagePickerResponse('gallery', res),
      );
    }, 320);
  }, [onClose, handleImagePickerResponse]);

  const openCamera = useCallback(() => {
    onClose();
    setTimeout(() => {
      launchCamera(
        {
          mediaType: 'mixed',
          cameraType: 'back',
          saveToPhotos: true,
          quality: 0.92,
        },
        res => handleImagePickerResponse('camera', res),
      );
    }, 320);
  }, [onClose, handleImagePickerResponse]);

  const openDocumentPicker = useCallback(async () => {
    onClose();
    await new Promise(r => setTimeout(r, 320));
    try {
      const [file] = await pick({
        type: [types.allFiles],
        allowMultiSelection: false,
      });
      if (!file) return;

      const localUri = await resolvePickedFileUri(file, 'document');
      if (!localUri) {
        ToastModule.errorBottom({ msg: 'Could not access selected file' });
        return;
      }

      const payload: ChatAttachmentPickPayload = {
        kind: 'document',
        file: { ...file, uri: localUri },
      };
      onPickResult?.(payload);
      ToastModule.successTop({
        msg: file.name ? `Document: ${file.name}` : 'Document selected',
      });
    } catch (err) {
      if (isErrorWithCode(err) && err.code === errorCodes.OPERATION_CANCELED) {
        return;
      }
      ToastModule.errorBottom({
        msg: 'Could not open document picker',
      });
    }
  }, [onClose, onPickResult]);

  const openAudioPicker = useCallback(async () => {
    onClose();
    await new Promise(r => setTimeout(r, 320));
    try {
      const [file] = await pick({
        type: [types.audio],
        allowMultiSelection: false,
      });
      if (!file) return;

      const localUri = await resolvePickedFileUri(file, 'audio');
      if (!localUri) {
        ToastModule.errorBottom({
          msg: 'Could not access selected audio file',
        });
        return;
      }

      const payload: ChatAttachmentPickPayload = {
        kind: 'audio',
        file: { ...file, uri: localUri },
      };
      onPickResult?.(payload);
      ToastModule.successTop({
        msg: file.name ? `Audio: ${file.name}` : 'Audio file selected',
      });
    } catch (err) {
      if (isErrorWithCode(err) && err.code === errorCodes.OPERATION_CANCELED) {
        return;
      }
      ToastModule.errorBottom({
        msg: 'Could not open audio picker',
      });
    }
  }, [onClose, onPickResult]);

  const onOptionPress = useCallback(
    (kind: ChatAttachmentKind) => {
      switch (kind) {
        case 'gallery':
          openGallery();
          break;
        case 'camera':
          openCamera();
          break;
        case 'document':
          openDocumentPicker().catch(() => {});
          break;
        case 'audio':
          openAudioPicker().catch(() => {});
          break;
      }
    },
    [openGallery, openCamera, openDocumentPicker, openAudioPicker],
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.root}>
        <Pressable
          style={styles.backdrop}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close attachment options"
        />
        <View
          style={[
            styles.sheet,
            { paddingBottom: bottomInset + mvs(14), paddingTop: mvs(18) },
          ]}
          pointerEvents="box-none"
        >
          <View style={styles.row}>
            {OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt.kind}
                activeOpacity={0.85}
                style={styles.option}
                onPress={() => onOptionPress(opt.kind)}
              >
                <View
                  style={[
                    styles.iconCircle,
                    { backgroundColor: opt.circleColor },
                  ]}
                >
                  <Icon name={opt.icon} size={26} color={COLORS.white} />
                </View>
                <Text style={styles.optionLabel}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    backgroundColor: 'transparent',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'flex-start',
    paddingHorizontal: ms(4),
  },
  option: {
    alignItems: 'center',
    maxWidth: ms(88),
    flex: 1,
  },
  iconCircle: {
    width: ms(56),
    height: ms(56),
    borderRadius: ms(28),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: mvs(8),
  },
  optionLabel: {
    color: COLORS.white,
    fontSize: ms(11),
    textAlign: 'center',
    lineHeight: mvs(14),
    opacity: 0.95,
  },
});

export default AttachmentOptionsModal;
