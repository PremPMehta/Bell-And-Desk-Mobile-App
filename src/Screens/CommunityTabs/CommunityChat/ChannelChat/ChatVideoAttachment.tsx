import React, { useMemo, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleProp,
  ViewStyle,
  ImageStyle,
} from 'react-native';
import Video from 'react-native-video';
import { useSetAtom } from 'jotai';
import { mediaPreviewAtom } from '@/Jotai/Atoms';
import Icon from '@/Components/Core/Icons';
import { COLORS } from '@/Assets/Theme/colors';
import { getFullImageUrl } from '@/Utils/ImageUtils';
import styles from './style';

type ChatVideoAttachmentProps = {
  uri: string;
  attachment?: any;
  wrapStyle?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
};

const resolveThumbnailUri = (attachment?: any): string | null => {
  const thumb =
    attachment?.thumbnail ||
    attachment?.thumbnailUrl ||
    attachment?.poster ||
    attachment?.preview;
  if (!thumb) return null;
  return getFullImageUrl(String(thumb));
};

const ChatVideoAttachment: React.FC<ChatVideoAttachmentProps> = ({
  uri,
  attachment,
  wrapStyle,
  imageStyle,
}) => {
  const setMediaPreview = useSetAtom(mediaPreviewAtom);
  const [isThumbnailReady, setIsThumbnailReady] = useState(false);
  const thumbnailUri = useMemo(
    () => resolveThumbnailUri(attachment),
    [attachment],
  );

  const openInAppPlayer = () => {
    setMediaPreview({
      visible: true,
      uri,
      type: 'video',
    });
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={openInAppPlayer}
      style={[styles.attachmentImageWrap, wrapStyle]}
    >
      {thumbnailUri ? (
        <Image
          source={{ uri: thumbnailUri }}
          style={[styles.attachmentImage, imageStyle]}
          resizeMode="cover"
          onLoad={() => setIsThumbnailReady(true)}
          onError={() => setIsThumbnailReady(false)}
        />
      ) : (
        <Video
          source={{ uri }}
          style={[styles.attachmentImage, imageStyle]}
          resizeMode="cover"
          paused
          muted
          repeat={false}
          controls={false}
          playInBackground={false}
          playWhenInactive={false}
          ignoreSilentSwitch="ignore"
          onLoad={() => setIsThumbnailReady(true)}
          onReadyForDisplay={() => setIsThumbnailReady(true)}
          onError={() => setIsThumbnailReady(false)}
        />
      )}

      {!isThumbnailReady && !thumbnailUri ? (
        <View style={styles.attachmentVideoPlaceholder} />
      ) : null}

      <View style={styles.attachmentPlayOverlay}>
        <View style={styles.attachmentPlayCircle}>
          <Icon
            name="Play"
            size={28}
            color={COLORS.white}
            fill={COLORS.white}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(ChatVideoAttachment);
