import React, { useLayoutEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Modal from 'react-native-modal';
import { launchImageLibrary } from 'react-native-image-picker';
import styles from './style';
import VideoPlayer from '@/Components/Core/VideoPlayer';
import Icon from '@/Components/Core/Icons';
import { COLORS } from '@/Assets/Theme/colors';
import useUserApi from '@/Hooks/Apis/UserApis/use-user-api';
import TextInputField from '@/Components/Core/TextInputField';
import ImageUploadField from '@/Components/Core/ImageUploadField';

interface VideoData {
  _id: string;
  title: string;
  videoUrl: string;
  assetId?: string;
  duration?: number;
  createdAt: string;
  fileSize?: number;
  allowDownload?: boolean;
  thumbnailUrl?: string;
}

const VideoBankDetails = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const {
    deleteVideoBankItem,
    apiDeleteVideoBankItemLoading,
    updateVideoBankItem,
    apiUpdateVideoBankItemLoading,
    uploadCommunityMedia,
    apiUploadCommunityMediaLoading,
    user,
  } = useUserApi();

  const [videoData, setVideoData] = useState<VideoData>(
    route.params?.videoData,
  );
  const communityId = route.params?.communityId;

  /* Edit Modal State */
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editTitle, setEditTitle] = useState(videoData?.title || '');
  const [editThumb, setEditThumb] = useState<any>(null);
  const [isDownloadAllowed, setIsDownloadAllowed] = useState(
    videoData?.allowDownload || false,
  );
  const [isUploading, setIsUploading] = useState(false);

  /* Delete Modal State */
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  /* ─── Header Actions ───────────────────── */
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.actionIcon}
            onPress={() => setIsEditModalVisible(true)}
          >
            <Icon name="Pencil" size={20} color={COLORS.white} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionIcon}
            onPress={() => setIsDeleteModalVisible(true)}
          >
            <Icon name="Trash2" size={20} color={COLORS.red} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  if (!videoData) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Video details not found</Text>
      </View>
    );
  }

  /* ─── Helpers: format duration ─────────────── */
  const formatDuration = (seconds?: number) => {
    if (!seconds) return '—';
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
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  /* ─── Helper: format size ────────────────── */
  const formatSize = (size?: number) => {
    if (!size) return '—';
    const mb = size / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  /* ─── Actions: Delete ────────────────────── */
  const handleConfirmDelete = async () => {
    const res = await deleteVideoBankItem(videoData._id);
    if (res?.success) {
      setIsDeleteModalVisible(false);
      route.params?.onRefresh?.();
      navigation.goBack();
    }
  };

  /* ─── Actions: Edit ──────────────────────── */
  const handleEditThumbSelect = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 1 }, res => {
      if (res.assets && res.assets.length > 0) {
        setEditThumb(res.assets[0]);
      }
    });
  };

  const handleSave = async () => {
    if (!editTitle.trim()) return;
    const userId = user?._id || user?.id;

    setIsUploading(true);
    let thumbnailUrl = videoData.thumbnailUrl || '';

    try {
      // Step 1: Upload thumbnail if a new one is picked
      if (editThumb && communityId) {
        const thumbFormData = new FormData();
        thumbFormData.append('introImages', {
          uri: editThumb.uri,
          type: editThumb.type || 'image/jpeg',
          name: editThumb.fileName || `edit_thumb_${Date.now()}.jpg`,
        } as any);

        const thumbRes = await uploadCommunityMedia(communityId, thumbFormData);
        if (thumbRes?.success || thumbRes?.data) {
          const commData = thumbRes?.data?.community || thumbRes?.data;
          const images =
            commData?.introImages || commData?.finalIntroImages || [];
          if (images.length > 0) {
            const lastImage = images[images.length - 1];
            thumbnailUrl =
              typeof lastImage === 'string'
                ? lastImage
                : lastImage.url || lastImage.uri;
          }
        } else {
          setIsUploading(false);
          return;
        }
      }

      // Step 2: Update with JSON payload as per attachment
      const updatePayload = {
        title: editTitle.trim(),
        allowDownload: isDownloadAllowed,
        thumbnailUrl: thumbnailUrl,
        // Optional properties depending on backend flexibility,
        // but including community/user for maximum compatibility
        communityId: communityId,
        userId: userId,
      };

      const res = await updateVideoBankItem(videoData._id, updatePayload);
      if (res?.success) {
        setVideoData({
          ...videoData,
          title: editTitle.trim(),
          thumbnailUrl: thumbnailUrl,
          allowDownload: isDownloadAllowed,
        });
        setIsEditModalVisible(false);
        setEditThumb(null);
        route.params?.onRefresh?.();
      }
    } catch (error) {
      console.error('Save Video Error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const DetailRow = ({
    label,
    value,
    isLast = false,
  }: {
    label: string;
    value: string | undefined;
    isLast?: boolean;
  }) => (
    <View style={[styles.detailRow, isLast && styles.lastRow]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value} numberOfLines={2}>
        {value || '—'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Video Player Section */}
        <View style={styles.videoContainer}>
          <VideoPlayer
            source={{ uri: videoData.videoUrl }}
            controls={true}
            autoPlay={true}
            muted={false}
            resizeMode="contain"
          />
        </View>

        {/* Content Section */}
        <View style={styles.content}>
          <Text style={styles.title}>{videoData.title}</Text>

          <View style={styles.detailsCard}>
            <DetailRow label="Title" value={videoData.title} />
            <DetailRow
              label="Asset ID"
              value={videoData.assetId || videoData._id}
            />
            <DetailRow
              label="Created At"
              value={formatDate(videoData.createdAt)}
            />
            <DetailRow
              label="Duration"
              value={formatDuration(videoData.duration)}
            />
            <DetailRow
              label="Video Size"
              value={formatSize(videoData.fileSize)}
              isLast={true}
            />
          </View>
        </View>
      </ScrollView>

      {/* ─── Edit Modal ────────────────────── */}
      <Modal
        isVisible={isEditModalVisible}
        onBackdropPress={() => setIsEditModalVisible(false)}
        style={{ justifyContent: 'flex-end', margin: 0 }}
        avoidKeyboard
      >
        <View style={styles.mainModalView}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit Video Details</Text>
            <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
              <Icon name="X" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Video Title</Text>
              <TextInputField
                placeholder="Enter video title"
                value={editTitle}
                onChangeText={setEditTitle}
                theme={{
                  colors: {
                    background: COLORS.cardBG,
                    text: COLORS.white,
                    placeholder: COLORS.outlineGrey,
                  },
                }}
                textColor={COLORS.white}
              />
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Thumbnail Image</Text>
              <ImageUploadField
                type="media"
                buttonText={
                  editThumb ? editThumb.fileName : 'Update thumbnail here'
                }
                onPress={handleEditThumbSelect}
                imageUri={editThumb?.uri || videoData.thumbnailUrl}
              />
            </View>
          </ScrollView>

          <View style={styles.modalFooterFixed}>
            <TouchableOpacity
              style={[
                styles.saveButton,
                (!editTitle.trim() || isUploading) && { opacity: 0.6 },
              ]}
              onPress={handleSave}
              disabled={!editTitle.trim() || isUploading}
            >
              {isUploading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.saveButtonText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ─── Delete Confirmation Modal ─────── */}
      <Modal
        isVisible={isDeleteModalVisible}
        onBackdropPress={() => setIsDeleteModalVisible(false)}
        style={{ justifyContent: 'flex-end', margin: 0 }}
      >
        <View style={styles.mainModalView}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Delete Video</Text>
            <TouchableOpacity onPress={() => setIsDeleteModalVisible(false)}>
              <Icon name="X" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
            <View style={styles.modalIconWrap}>
              <Icon name="Trash2" size={30} color={COLORS.red} />
            </View>
            <Text style={styles.modalMessage}>
              Are you sure you want to delete{' '}
              <Text style={styles.boldName}>"{videoData.title}"</Text>? This
              action cannot be undone.
            </Text>
          </View>

          <View style={styles.modalFooter}>
            <TouchableOpacity onPress={() => setIsDeleteModalVisible(false)}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalRemoveButton}
              onPress={handleConfirmDelete}
              disabled={apiDeleteVideoBankItemLoading}
            >
              {apiDeleteVideoBankItemLoading ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <Text style={styles.modalRemoveText}>Delete</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default VideoBankDetails;
