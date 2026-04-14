import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Animated,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  TouchableWithoutFeedback,
  ScrollView,
  Switch,
  Platform,
} from 'react-native';
import Modal from 'react-native-modal';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import SearchBar from '@/Components/Core/SearchBar';
import Icon from '@/Components/Core/Icons';
import TextInputField from '@/Components/Core/TextInputField';
import ImageUploadField from '@/Components/Core/ImageUploadField';
import { COLORS } from '@/Assets/Theme/colors';
import { ms, mvs } from '@/Assets/Theme/fontStyle';
import useUserApi from '@/Hooks/Apis/UserApis/use-user-api';
import styles from './style';

/* ─── Types ─────────────────────────────── */
interface Video {
  _id: string;
  title: string;
  thumbnailUrl?: string;
  duration?: number;
  createdAt: string;
  mimeType?: string;
  allowDownload?: boolean;
}

interface Props {
  communityId?: string;
  onScroll?: (...args: any[]) => void;
  scrollEventThrottle?: number;
}

/* ─── Dropdown option sets ───────────────── */
const SORT_OPTIONS = [
  { label: 'Upload Date', value: 'createdAt' },
  { label: 'Title', value: 'title' },
  { label: 'Duration', value: 'duration' },
];

const ORDER_OPTIONS = [
  { label: 'Newest to Oldest', value: 'desc' },
  { label: 'Oldest to Newest', value: 'asc' },
];

/* ─── Helper: format seconds ─────────────── */
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
  });
};

/* ─── Skeleton card ──────────────────────── */
const SkeletonCard = () => (
  <View style={styles.skeletonCard}>
    <View style={styles.skeletonThumb} />
    <View style={styles.skeletonBody}>
      <View style={styles.skeletonLine} />
      <View style={[styles.skeletonLine, { width: '50%' }]} />
    </View>
  </View>
);

/* ─── Main Component ────────────────────── */
const CommunityVideos = ({
  communityId,
  onScroll,
  scrollEventThrottle,
}: Props) => {
  const {
    getVideoBank,
    apiGetVideoBankLoading,
    deleteVideoBankItem,
    apiDeleteVideoBankItemLoading,
    updateVideoBankItem,
    apiUpdateVideoBankItemLoading,
    addVideoBankItem,
    apiAddVideoBankItemLoading,
    uploadCommunityMedia,
    apiUploadCommunityMediaLoading,
    user,
  } = useUserApi();
  const navigation = useNavigation<any>();

  /* list state */
  const [videos, setVideos] = useState<Video[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [initialLoading, setInitialLoading] = useState(true);

  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');

  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showOrderDropdown, setShowOrderDropdown] = useState(false);

  /* action dropdown per-card */
  const [activeCardMenu, setActiveCardMenu] = useState<string | null>(null);

  /* delete confirmation modal */
  const [deleteTarget, setDeleteTarget] = useState<Video | null>(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  /* add/edit video modal state */
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [editTarget, setEditTarget] = useState<Video | null>(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [selectedThumb, setSelectedThumb] = useState<any>(null);
  const [isDownloadAllowed, setIsDownloadAllowed] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const LIMIT = 9;

  /* ─── fetch ───────────────────────────── */
  const fetchVideos = useCallback(
    async (
      pageNum: number,
      search: string,
      sort: string,
      ord: string,
      isRefresh = false,
    ) => {
      if (!communityId) return;
      const query = `?sortBy=${sort}&order=${ord}&query=${encodeURIComponent(
        search,
      )}&page=${pageNum}&limit=${LIMIT}`;
      const res: any = await getVideoBank(communityId, query);
      const incoming: Video[] = res?.videos || [];
      if (isRefresh || pageNum === 1) {
        setVideos(incoming);
      } else {
        setVideos(prev => [...prev, ...incoming]);
      }
      setPagination(res?.pagination);
      setInitialLoading(false);
    },
    [communityId, getVideoBank],
  );

  React.useEffect(() => {
    setInitialLoading(true);
    setPage(1);
    const t = setTimeout(() => {
      fetchVideos(1, searchText, sortBy, order, true);
    }, 500);
    return () => clearTimeout(t);
  }, [communityId, searchText, sortBy, order]);

  /* ─── load more ────────────────────────── */
  const handleLoadMore = () => {
    if (!apiGetVideoBankLoading && pagination && page < pagination.pages) {
      const next = page + 1;
      setPage(next);
      fetchVideos(next, searchText, sortBy, order);
    }
  };

  /* ─── video picking ─────────────────────── */
  const handleVideoSelect = () => {
    launchImageLibrary({ mediaType: 'video', quality: 1 }, res => {
      if (res.assets && res.assets.length > 0) {
        setSelectedVideo(res.assets[0]);
      }
    });
  };

  const handleThumbSelect = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 1 }, res => {
      if (res.assets && res.assets.length > 0) {
        setSelectedThumb(res.assets[0]);
      }
    });
  };

  /* ─── edit flow ────────────────────────── */
  const handleEditPress = (video: Video) => {
    setActiveCardMenu(null);
    setEditTarget(video);
    setUploadTitle(video.title || '');
    setIsDownloadAllowed(video.allowDownload || false);
    setSelectedVideo(null); // Not editing video file
    setSelectedThumb(null);
    setIsAddModalVisible(true);
  };

  /* ─── upload/edit action ─────────────────── */
  const handleAddVideo = async () => {
    const isEdit = !!editTarget;
    const userId = user?._id || user?.id;

    // Verbose checks to prevent silent failures
    if (!communityId) {
      ToastModule.errorBottom({ msg: 'Community ID is missing' });
      return;
    }
    if (!uploadTitle.trim()) {
      ToastModule.errorBottom({ msg: 'Please enter a video title' });
      return;
    }
    if (!isEdit && !selectedVideo) {
      ToastModule.errorBottom({ msg: 'Please select a video file' });
      return;
    }
    if (!userId) {
      ToastModule.errorBottom({ msg: 'User session not found. Please log in again.' });
      return;
    }

    setIsUploading(true);
    let thumbnailUrl = editTarget?.thumbnailUrl || '';

    try {
      // Step 1: Upload thumbnail if a new one is selected
      if (selectedThumb) {
        const thumbFormData = new FormData();
        thumbFormData.append('introImages', {
          uri: selectedThumb.uri,
          type: selectedThumb.type || 'image/jpeg',
          name: selectedThumb.fileName || `thumb_${Date.now()}.jpg`,
        } as any);

        const thumbRes = await uploadCommunityMedia(communityId, thumbFormData);
        if (thumbRes?.success || thumbRes?.data) {
          const communityData = thumbRes?.data?.community || thumbRes?.data;
          const images = communityData?.introImages || communityData?.finalIntroImages || [];
          if (images.length > 0) {
            const lastImage = images[images.length - 1];
            thumbnailUrl = typeof lastImage === 'string' ? lastImage : lastImage.url || lastImage.uri;
          }
        } else {
          // Toast is already shown by the hook if it fails with an error
          setIsUploading(false);
          return;
        }
      }

      // Step 2: Final Upload / Update
      const formData = new FormData();
      formData.append('title', uploadTitle.trim());
      formData.append('allowDownload', String(isDownloadAllowed));
      formData.append('communityId', communityId);
      formData.append('userId', userId);
      formData.append('thumbnailUrl', thumbnailUrl);

      if (!isEdit && selectedVideo) {
        const videoFile = {
          uri: selectedVideo.uri,
          type: selectedVideo.type || 'video/mp4',
          name: selectedVideo.fileName || `video_${Date.now()}.mp4`,
        };
        formData.append('video', videoFile as any);
      }

      const res = isEdit
        ? await updateVideoBankItem(editTarget._id, {
            title: uploadTitle.trim(),
            allowDownload: isDownloadAllowed,
            thumbnailUrl: thumbnailUrl,
            communityId: communityId,
            userId: userId,
          })
        : await addVideoBankItem(formData);

      if (res?.success) {
        setIsAddModalVisible(false);
        setUploadTitle('');
        setSelectedVideo(null);
        setSelectedThumb(null);
        setIsDownloadAllowed(false);
        setEditTarget(null);
        fetchVideos(1, searchText, sortBy, order, true);
      }
    } catch (error) {
      console.error('Upload Error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  /* ─── navigation to details ────────────── */
  const handleVideoPress = (video: Video) => {
    navigation.navigate('VideoBankDetails', {
      videoData: video,
      communityId: communityId,
      onRefresh: () => fetchVideos(1, searchText, sortBy, order, true),
    });
  };

  /* ─── delete flow ──────────────────────── */
  const handleDeletePress = (video: Video) => {
    setActiveCardMenu(null);
    setDeleteTarget(video);
    setIsDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const res = await deleteVideoBankItem(deleteTarget._id);
    if (res?.success) {
      setVideos(prev => prev.filter(v => v._id !== deleteTarget._id));
    }
    setIsDeleteModalVisible(false);
    setDeleteTarget(null);
  };

  /* ─── header ───────────────────────────── */
  const renderHeader = () => (
    <View style={styles.headerRoot}>
      {/* Title row */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Videos</Text>
      </View>

      {/* Search bar */}
      <SearchBar
        value={searchText}
        onChangeText={setSearchText}
        placeholder="Search videos..."
      />

      {/* Sort + Order row */}
      <View style={styles.filterRow}>
        {/* Sort By */}
        <View style={styles.dropdownWrapper}>
          <Text style={styles.filterLabel}>Sort By</Text>
          <TouchableOpacity
            style={styles.dropdownBtn}
            onPress={() => {
              setShowOrderDropdown(false);
              setShowSortDropdown(v => !v);
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.dropdownBtnText} numberOfLines={1}>
              {SORT_OPTIONS.find(o => o.value === sortBy)?.label}
            </Text>
            <Icon name="ChevronDown" size={14} color={COLORS.gray} />
          </TouchableOpacity>

          {showSortDropdown && (
            <View style={styles.dropdownMenu}>
              {SORT_OPTIONS.map(opt => (
                <TouchableOpacity
                  key={opt.value}
                  style={[
                    styles.dropdownItem,
                    sortBy === opt.value && styles.dropdownItemActive,
                  ]}
                  onPress={() => {
                    setSortBy(opt.value);
                    setShowSortDropdown(false);
                  }}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      sortBy === opt.value && styles.dropdownItemTextActive,
                    ]}
                  >
                    {opt.label}
                  </Text>
                  {sortBy === opt.value && (
                    <Icon name="Check" size={14} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Order */}
        <View style={styles.dropdownWrapper}>
          <Text style={styles.filterLabel}>Order</Text>
          <TouchableOpacity
            style={styles.dropdownBtn}
            onPress={() => {
              setShowSortDropdown(false);
              setShowOrderDropdown(v => !v);
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.dropdownBtnText} numberOfLines={1}>
              {ORDER_OPTIONS.find(o => o.value === order)?.label}
            </Text>
            <Icon name="ChevronDown" size={14} color={COLORS.gray} />
          </TouchableOpacity>

          {showOrderDropdown && (
            <View style={styles.dropdownMenu}>
              {ORDER_OPTIONS.map(opt => (
                <TouchableOpacity
                  key={opt.value}
                  style={[
                    styles.dropdownItem,
                    order === opt.value && styles.dropdownItemActive,
                  ]}
                  onPress={() => {
                    setOrder(opt.value);
                    setShowOrderDropdown(false);
                  }}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      order === opt.value && styles.dropdownItemTextActive,
                    ]}
                  >
                    {opt.label}
                  </Text>
                  {order === opt.value && (
                    <Icon name="Check" size={14} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>
    </View>
  );

  /* ─── video card ────────────────────────── */
  const renderVideoCard = ({ item }: { item: Video }) => {
    const isMenuOpen = activeCardMenu === item._id;

    return (
      <TouchableOpacity
        style={[styles.card, isMenuOpen && styles.activeCard]}
        onPress={() => handleVideoPress(item)}
        activeOpacity={0.9}
      >
        <View style={styles.thumbContainer}>
          {item.thumbnailUrl ? (
            <Image
              source={{ uri: item.thumbnailUrl }}
              style={styles.thumbImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.thumbPlaceholder}>
              <Icon name="Video" size={32} color={COLORS.gray} />
            </View>
          )}
          {item.duration != null && (
            <View style={styles.durationBadge}>
              <Text style={styles.durationText}>
                {formatDuration(item.duration)}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.cardBody}>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle} numberOfLines={2}>
              {item.title || 'Untitled'}
            </Text>
            <View style={styles.cardMeta}>
              <Icon name="Calendar" size={11} color={COLORS.gray} />
              <Text style={styles.cardMetaText}>
                {formatDate(item.createdAt)}
              </Text>
            </View>
          </View>

          <View>
            <TouchableOpacity
              style={styles.menuTrigger}
              onPress={() => setActiveCardMenu(isMenuOpen ? null : item._id)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Icon name="EllipsisVertical" size={18} color={COLORS.gray} />
            </TouchableOpacity>

            {isMenuOpen && (
              <View style={styles.cardMenu}>
                <TouchableOpacity
                  style={styles.cardMenuItem}
                  onPress={() => handleEditPress(item)}
                >
                  <Icon name="Pencil" size={14} color={COLORS.white} />
                  <Text style={styles.cardMenuItemText}>Edit</Text>
                </TouchableOpacity>
                <View style={styles.cardMenuDivider} />
                <TouchableOpacity
                  style={styles.cardMenuItem}
                  onPress={() => handleDeletePress(item)}
                >
                  <Icon name="Trash2" size={14} color={COLORS.red} />
                  <Text
                    style={[styles.cardMenuItemText, { color: COLORS.red }]}
                  >
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  /* ─── empty / skeleton ──────────────────── */
  const renderEmpty = () => {
    if (initialLoading || (apiGetVideoBankLoading && page === 1)) {
      return (
        <View>
          {[1, 2, 3, 4].map(k => (
            <SkeletonCard key={k} />
          ))}
        </View>
      );
    }
    return (
      <View style={styles.emptyState}>
        <Icon name="Video" size={56} color={COLORS.placeholder} />
        <Text style={styles.emptyTitle}>No Videos Yet</Text>
        <Text style={styles.emptySubtitle}>
          Videos uploaded to this community will appear here.
        </Text>
      </View>
    );
  };

  /* ─── footer spinner ─────────────────────── */
  const renderFooter = () =>
    apiGetVideoBankLoading && page > 1 ? (
      <ActivityIndicator
        size="small"
        color={COLORS.primary}
        style={{ marginVertical: mvs(20) }}
      />
    ) : null;

  /* ─── Dismiss dropdowns on outside tap ───── */
  const dismissDropdowns = () => {
    setShowSortDropdown(false);
    setShowOrderDropdown(false);
    setActiveCardMenu(null);
  };

  return (
    <TouchableWithoutFeedback onPress={dismissDropdowns}>
      <View style={{ flex: 1 }}>
        <Animated.FlatList
          data={
            initialLoading || (apiGetVideoBankLoading && page === 1)
              ? []
              : videos
          }
          keyExtractor={(item, idx) => item._id || idx.toString()}
          renderItem={renderVideoCard}
          ListHeaderComponent={renderHeader()}
          ListHeaderComponentStyle={{ zIndex: 1000, elevation: 10 }}
          ListEmptyComponent={renderEmpty()}
          ListFooterComponent={renderFooter()}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          style={styles.container}
          onScroll={onScroll}
          scrollEventThrottle={scrollEventThrottle}
        />

        {/* ─── FAB ───────────────────────────── */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setIsAddModalVisible(true)}
          activeOpacity={0.8}
        >
          <Icon name="Plus" size={24} color={COLORS.white} />
        </TouchableOpacity>

        {/* ─── Add Video Modal ───────────────── */}
        <Modal
          isVisible={isAddModalVisible}
          onBackdropPress={() => {
            setIsAddModalVisible(false);
            setEditTarget(null);
            setUploadTitle('');
            setSelectedVideo(null);
            setSelectedThumb(null);
            setIsDownloadAllowed(false);
          }}
          onSwipeComplete={() => {
            setIsAddModalVisible(false);
            setEditTarget(null);
            setUploadTitle('');
            setSelectedVideo(null);
            setSelectedThumb(null);
            setIsDownloadAllowed(false);
          }}
          swipeDirection="down"
          style={{ justifyContent: 'flex-end', margin: 0 }}
          avoidKeyboard
        >
          <View style={styles.mainModalView}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editTarget ? 'Edit Video' : 'Upload Video'}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setIsAddModalVisible(false);
                  setEditTarget(null);
                  setUploadTitle('');
                  setSelectedVideo(null);
                  setSelectedThumb(null);
                  setIsDownloadAllowed(false);
                }}
              >
                <Icon name="X" size={24} color={COLORS.white} />
              </TouchableOpacity>
            </View>

            <ScrollView
              contentContainerStyle={styles.modalContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Title */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Video Title</Text>
                <TextInputField
                  placeholder="Enter video title"
                  value={uploadTitle}
                  onChangeText={setUploadTitle}
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

              {/* Video Picker */}
              {!editTarget && (
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Select Video File</Text>
                  <ImageUploadField
                    type="media"
                    buttonText={
                      selectedVideo ? selectedVideo.fileName : 'Upload video here'
                    }
                    onPress={handleVideoSelect}
                    iconName="Video"
                    imageUri={selectedVideo?.uri}
                  />
                </View>
              )}

              {/* Thumbnail Picker */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>
                  Thumbnail Image (Optional)
                </Text>
                <ImageUploadField
                  type="media"
                  buttonText={
                    selectedThumb
                      ? selectedThumb.fileName
                      : 'Upload thumbnail here'
                  }
                  onPress={handleThumbSelect}
                  imageUri={selectedThumb?.uri || editTarget?.thumbnailUrl}
                />
              </View>

              {/* Download Permission */}
              <View style={styles.modalSection}>
                <View style={styles.toggleRow}>
                  <View style={styles.toggleInfo}>
                    <Text style={styles.toggleTitle}>Allow Downloads</Text>
                    <Text style={styles.toggleSubtitle}>
                      Students will be able to download this video for offline
                      viewing
                    </Text>
                  </View>
                  <Switch
                    value={isDownloadAllowed}
                    onValueChange={setIsDownloadAllowed}
                    trackColor={{ false: COLORS.border, true: COLORS.primary }}
                    thumbColor={COLORS.white}
                    ios_backgroundColor={COLORS.border}
                  />
                </View>
              </View>

            </ScrollView>
            <View style={styles.modalFooterFixed}>
              <TouchableOpacity
                style={[
                  styles.saveButton,
                  (!uploadTitle.trim() ||
                    (!editTarget && !selectedVideo) ||
                    isUploading) && { opacity: 0.6 },
                ]}
                onPress={handleAddVideo}
                disabled={
                  !uploadTitle.trim() ||
                  (!editTarget && !selectedVideo) ||
                  isUploading
                }
              >
                {isUploading ? (
                  <ActivityIndicator color={COLORS.white} />
                ) : (
                  <Text style={styles.saveButtonText}>
                    {editTarget ? 'Save Changes' : 'Upload Video'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* ─── Delete Confirmation Modal ─────── */}
        <Modal
          isVisible={isDeleteModalVisible}
          onBackdropPress={() => setIsDeleteModalVisible(false)}
          onSwipeComplete={() => setIsDeleteModalVisible(false)}
          swipeDirection="down"
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
                <Text style={styles.boldName}>"{deleteTarget?.title}"</Text>?
                This action cannot be undone.
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
    </TouchableWithoutFeedback>
  );
};

export default CommunityVideos;
