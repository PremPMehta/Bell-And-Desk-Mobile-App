import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { launchImageLibrary, Asset } from 'react-native-image-picker';

import TextInputField from '@/Components/Core/TextInputField';
import RichTextEditor from '@/Components/Core/RichTextEditor';
import ImageUploadField from '@/Components/Core/ImageUploadField';
import PrimaryButton from '@/Components/Core/PrimaryButton';
import { COLORS } from '@/Assets/Theme/colors';
import styles from './style';
import { useNavigation } from '@/Hooks/Utils/use-navigation';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '@/Components/Core/Icons';
import { useAtom } from 'jotai';
import {
  addMediaVisibleAtom,
  onMediaAddedAtom,
  communityRefreshAtom,
} from '@/Jotai/Atoms';
import CommonListModal from '@/Components/Generic/Modals/CommonListModal';
import { CREATE_CATEGORY_DATA } from '@/Constants/customData';
import useUserApi from '@/Hooks/Apis/UserApis/use-user-api';
import { useRoute } from '@react-navigation/native';
import { getFullImageUrl } from '@/Utils/ImageUtils';

// ─── Types ───────────────────────────────────────────────────────────────────

interface MediaItem {
  id: string;
  type: 'image' | 'video';
  /** Remote URL (for existing items loaded from the server) */
  remoteUrl?: string;
  /** Local URI (for newly-picked images) */
  localUri?: string;
  /** For video items: the YouTube/Vimeo/direct URL */
  videoUrl?: string;
  /** Raw asset from image-picker (new image uploads) */
  asset?: Asset;
  /** Original object from server (preserved for PUT payload) */
  originalData?: any;
}

interface CommunityFormValues {
  name: string;
  slug: string;
  description: string;
  welcomeMessage: string;
  category: string;
  instagram: string;
  telegram: string;
  whatsapp: string;
  youtube: string;
  linkedin: string;
  external: string;
  logo: Asset | null;
  banner: Asset | null;
  mediaCount: number;
  phoneNumber: string;
}

// ─── Validation schemas ───────────────────────────────────────────────────────

const CreateCommunitySchema = Yup.object().shape({
  name: Yup.string().required('Community name is required'),
  slug: Yup.string().required('URL slug is required'),
  description: Yup.string().required('Description is required'),
  category: Yup.string().required('Category is required'),
  logo: Yup.mixed().required('Community logo is required'),
  banner: Yup.mixed().required('Community banner is required'),
  mediaCount: Yup.number()
    .min(1, 'At least one media item is required')
    .required(),
});

// In edit mode logo + banner are optional (already exist on server)
const EditCommunitySchema = Yup.object().shape({
  name: Yup.string().required('Community name is required'),
  slug: Yup.string().required('URL slug is required'),
  description: Yup.string().required('Description is required'),
  category: Yup.string().required('Category is required'),
  mediaCount: Yup.number()
    .min(1, 'At least one media item is required')
    .required(),
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Returns a YouTube video-ID thumbnail URL if the URL is a YT link, else null */
const getYoutubeThumbnail = (url: string): string | null => {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null;
};

/** Returns a Vimeo thumbnail URL (vumbnail proxy) if the URL is a Vimeo link, else null */
const getVimeoThumbnail = (url: string): string | null => {
  const match = url.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
  return match ? `https://vumbnail.com/${match[1]}.jpg` : null;
};

const getVideoThumbnail = (url: string): string | null => {
  return getYoutubeThumbnail(url) || getVimeoThumbnail(url);
};

// ─── Component ────────────────────────────────────────────────────────────────

const CreateCommunity = () => {
  const navigation = useNavigation();
  const route = useRoute() as any;

  const isEditMode: boolean = route?.params?.isEditMode ?? false;
  const existingCommunityData: any = route?.params?.communityData ?? null;

  const {
    updateCommunity,
    apiUpdateCommunityLoading,
    uploadCommunityMedia,
    apiUploadCommunityMediaLoading,
    createCommunity,
    apiCreateCommunityLoading,
    checkCommunitySlug,
    apiCheckCommunitySlug,
    setApiCheckCommunitySlug,
    user,
  } = useUserApi();

  const [, setIsVisibleAddMediaModal] = useAtom(addMediaVisibleAtom);
  const [, setOnMediaAdded] = useAtom(onMediaAddedAtom);
  const [, setCommunityRefresh] = useAtom(communityRefreshAtom);

  // ── Build initial media list from existing community data ─────────────────
  const buildInitialMedia = useCallback((): MediaItem[] => {
    if (!existingCommunityData) return [];

    const images: MediaItem[] = (
      existingCommunityData?.finalIntroImages ||
      existingCommunityData?.introImages ||
      []
    ).map((img: any, idx: number) => {
      const url = typeof img === 'string' ? img : img?.url || img?.uri || '';
      return {
        id: `existing-image-${idx}`,
        type: 'image',
        remoteUrl: url,
        originalData: img,
      };
    });

    const videos: MediaItem[] = (
      existingCommunityData?.finalIntroVideos ||
      existingCommunityData?.introVideoLinks ||
      []
    ).map((v: any, idx: number) => {
      const url = typeof v === 'string' ? v : v?.url || v?.uri || '';
      return {
        id: `existing-video-${idx}`,
        type: 'video',
        remoteUrl: url,
        videoUrl: url,
        originalData: v,
      };
    });

    return [...images, ...videos];
  }, [existingCommunityData]);

  const [mediaItems, setMediaItems] = useState<MediaItem[]>(buildInitialMedia);

  // ── Existing logo / banner remote URLs (shown when no new pick) ───────────
  const existingLogoUrl: string =
    existingCommunityData?.logo || existingCommunityData?.logoUrl || '';
  const existingBannerUrl: string =
    existingCommunityData?.banner || existingCommunityData?.bannerUrl || '';

  // ── Add media via the modal ────────────────────────────────────────────────
  const handleAddMedia = () => {
    setOnMediaAdded(() => async (media: any) => {
      // media can be { type, uri, url, platform, title, ... }
      const url: string =
        typeof media === 'string' ? media : media?.uri || media?.url || '';
      const isVideo =
        media?.type === 'video' || url.match(/youtube|youtu\.be|vimeo/i);

      // If we are in edit mode, upload the media immediately
      if (isEditMode && existingCommunityData?._id) {
        const formData = new FormData();

        if (media?.type === 'image' || (!isVideo && media?.uri)) {
          // It's an image file
          formData.append('introImages', {
            uri: url,
            type: media?.type || 'image/jpeg',
            name: media?.fileName || `image_${Date.now()}.jpg`,
          } as any);
        } else if (isVideo && media?.uri && media?.type === 'video') {
          // It's a video file
          formData.append('introVideos', {
            uri: url,
            type: media?.type || 'video/mp4',
            name: media?.fileName || `video_${Date.now()}.mp4`,
          } as any);
        } else if (isVideo && url && !media?.uri) {
          // It's a video link
          formData.append('introVideoLinks', url);
        }

        const res = await uploadCommunityMedia(
          existingCommunityData._id,
          formData,
        );
        if (res?.success || res?.data) {
          // Re-sync media items using the entire updated arrays from the server
          const updatedCommunity = res?.data?.community || res?.data;

          if (updatedCommunity) {
            const serverImages: MediaItem[] = Array.isArray(
              updatedCommunity.introImages || updatedCommunity.finalIntroImages,
            )
              ? (
                  updatedCommunity.introImages ||
                  updatedCommunity.finalIntroImages
                ).map((img: any, idx: number) => ({
                  id: `server-image-${idx}-${Date.now()}`,
                  type: 'image',
                  remoteUrl: typeof img === 'string' ? img : img?.url || '',
                  originalData: img,
                }))
              : [];

            const serverVideoFiles: MediaItem[] = Array.isArray(
              updatedCommunity.introVideos || updatedCommunity.finalIntroVideos,
            )
              ? (
                  updatedCommunity.introVideos ||
                  updatedCommunity.finalIntroVideos
                ).map((v: any, idx: number) => ({
                  id: `server-video-file-${idx}-${Date.now()}`,
                  type: 'video',
                  remoteUrl: typeof v === 'string' ? v : v?.url || '',
                  videoUrl: typeof v === 'string' ? v : v?.url || '',
                  originalData: v,
                }))
              : [];

            const serverVideoLinks: MediaItem[] = Array.isArray(
              updatedCommunity.introVideoLinks,
            )
              ? updatedCommunity.introVideoLinks.map(
                  (link: any, idx: number) => ({
                    id: `server-video-link-${idx}-${Date.now()}`,
                    type: 'video',
                    remoteUrl:
                      typeof link === 'string' ? link : link?.url || '',
                    videoUrl: typeof link === 'string' ? link : link?.url || '',
                    originalData: link,
                  }),
                )
              : [];

            setMediaItems([
              ...serverImages,
              ...serverVideoFiles,
              ...serverVideoLinks,
            ]);
          }
        }
      } else {
        // Create mode (not yet implemented on server side possibly, or just local for now)
        const newItem: MediaItem = {
          id: `new-${Date.now()}-${Math.random()}`,
          type: isVideo ? 'video' : 'image',
          localUri: isVideo ? undefined : url,
          videoUrl: isVideo ? url : undefined,
          remoteUrl: url,
          asset: media?.asset || undefined,
          originalData: media,
        };
        setMediaItems(prev => [...prev, newItem]);
      }
    });
    setIsVisibleAddMediaModal(true);
  };

  // ── Remove a media item ───────────────────────────────────────────────────
  const handleRemoveMedia = (id: string) => {
    setMediaItems(prev => prev.filter(item => item.id !== id));
  };

  // ── Formik initial values ─────────────────────────────────────────────────
  const initialValues: CommunityFormValues = {
    name: existingCommunityData?.name || '',
    slug: existingCommunityData?.subdomain || existingCommunityData?.slug || '',
    description: existingCommunityData?.description || '',
    welcomeMessage: existingCommunityData?.welcomeMessage || '',
    category: existingCommunityData?.category || '',
    instagram: existingCommunityData?.instagramLink || '',
    telegram: existingCommunityData?.telegramLink || '',
    whatsapp: existingCommunityData?.whatsappLink || '',
    youtube: existingCommunityData?.youtubeLink || '',
    linkedin: existingCommunityData?.linkedinLink || '',
    external: existingCommunityData?.externalLink || '',
    logo: null,
    banner: null,
    mediaCount: buildInitialMedia().length,
    phoneNumber: existingCommunityData?.phoneNumber || '',
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (values: CommunityFormValues) => {
    if (isEditMode && existingCommunityData?._id) {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('subdomain', values.slug);
      formData.append('description', values.description);
      formData.append('welcomeMessage', values.welcomeMessage);
      formData.append('category', values.category);

      if (values.instagram) {
        formData.append('instagramLink', values.instagram);
      }
      if (values.telegram) {
        formData.append('telegramLink', values.telegram);
      }
      if (values.whatsapp) {
        formData.append('whatsappLink', values.whatsapp);
      }
      if (values.youtube) {
        formData.append('youtubeLink', values.youtube);
      }
      if (values.linkedin) {
        formData.append('linkedinLink', values.linkedin);
      }
      if (values.external) {
        formData.append('externalLink', values.external);
      }
      if (values.phoneNumber) {
        formData.append('phoneNumber', values.phoneNumber);
      }

      // New logo picked by user
      if (values.logo?.uri) {
        formData.append('logo', {
          uri: values.logo.uri,
          type: values.logo.type || 'image/jpeg',
          name: values.logo.fileName || 'logo.jpg',
        } as any);
      }

      // New banner picked by user
      if (values.banner?.uri) {
        formData.append('banner', {
          uri: values.banner.uri,
          type: values.banner.type || 'image/jpeg',
          name: values.banner.fileName || 'banner.jpg',
        } as any);
      }

      // Build final arrays for intro images and videos using synchronized server data
      const introImages = mediaItems
        .filter(m => m.type === 'image')
        .map(m => m.originalData)
        .filter(Boolean);

      const introVideoLinks = mediaItems
        .filter(m => m.type === 'video' && !m.localUri)
        .map(m =>
          typeof m.originalData === 'string' ? m.originalData : m.videoUrl,
        )
        .filter(Boolean);

      const introVideos = mediaItems
        .filter(m => m.type === 'video' && m.localUri)
        .map(m => m.originalData)
        .filter(Boolean);

      // Append as JSON stringified arrays per backend requirement
      // Sending both legacy 'final' keys and current 'intro' keys to ensure compatibility
      formData.append('introImages', JSON.stringify(introImages));
      formData.append('finalIntroImages', JSON.stringify(introImages));
      formData.append('introVideoLinks', JSON.stringify(introVideoLinks));
      formData.append('introVideos', JSON.stringify(introVideos));
      formData.append('finalIntroVideos', JSON.stringify(introVideos));

      const res = await updateCommunity(existingCommunityData._id, formData);
      if (res) {
        // Increment the refresh atom so CommunityAbout re-fetches updated data
        setCommunityRefresh(prev => prev + 1);
        navigation.goBack();
      }
    } else {
      // Create mode
      const formData = new FormData();
      formData.append('communityName', values.name);
      formData.append('subdomain', values.slug);
      formData.append('description', values.description);
      formData.append('category', values.category);

      // Explicitly append all fields seen in the target Form Data screenshot
      // sending empty strings for missing optional fields to match the target schema
      formData.append('welcomeMessage', values.welcomeMessage || '');
      formData.append('phoneNumber', values.phoneNumber || '');
      formData.append('instagramLink', values.instagram || '');
      formData.append('telegramLink', values.telegram || '');
      formData.append('whatsappLink', values.whatsapp || '');
      formData.append('youtubeLink', values.youtube || '');
      formData.append('linkedinLink', values.linkedin || '');
      formData.append('externalLink', values.external || '');

      // Logo
      if (values.logo?.uri) {
        formData.append('logo', {
          uri: values.logo.uri,
          type: values.logo.type || 'image/jpeg',
          name: values.logo.fileName || `logo_${Date.now()}.jpg`,
        } as any);
      }

      // Banner
      if (values.banner?.uri) {
        formData.append('banner', {
          uri: values.banner.uri,
          type: values.banner.type || 'image/jpeg',
          name: values.banner.fileName || `banner_${Date.now()}.jpg`,
        } as any);
      }

      // Media Items Separation (matching the successful pattern used in Edit Mode)
      const introImagesFiles: any[] = [];
      const introVideoLinks: string[] = [];

      mediaItems.forEach((m, index) => {
        if (m.type === 'image') {
          if (m.asset?.uri || m.localUri) {
            formData.append('introImages', {
              uri: m.asset?.uri || m.localUri,
              type: m.asset?.type || 'image/jpeg',
              name: m.asset?.fileName || `intro_image_${index}.jpg`,
            } as any);
          }
        } else if (m.type === 'video') {
          if (m.asset?.uri || m.localUri) {
            // Local video file
            formData.append('introImages', {
              uri: m.asset?.uri || m.localUri,
              type: m.asset?.type || 'video/mp4',
              name: m.asset?.fileName || `intro_video_${index}.mp4`,
            } as any);
          } else if (m.videoUrl?.trim()) {
            // Video link (YouTube/Vimeo)
            introVideoLinks.push(m.videoUrl);
          }
        }
      });

      // Pass video links as a stringified JSON array if present
      if (introVideoLinks.length > 0) {
        formData.append('introVideoLinks', JSON.stringify(introVideoLinks));
      }

      if (user?.activePlanId) {
        formData.append('planId', user.activePlanId);
      }

      // ── DEBUG LOG ──────────────────────────────────────────────────────────
      // @ts-ignore
      if (formData?._parts) {
        // @ts-ignore
        console.log('🚀 ~ Creation Payload Parts (Final):', formData._parts);
      }
      // ───────────────────────────────────────────────────────────────────────

      const res = await createCommunity(formData);
      if (res?.success || res?.data) {
        navigation.goBack();
      }
    }
  };

  // ── Render a single media grid item ───────────────────────────────────────
  const renderMediaItem = (item: MediaItem) => {
    const thumbnail =
      item.type === 'image'
        ? getFullImageUrl(item.localUri || item.remoteUrl || '') || ''
        : item.videoUrl
        ? getVideoThumbnail(item.videoUrl) ||
          getFullImageUrl(item.remoteUrl || '') ||
          ''
        : '';

    return (
      <View key={item.id} style={styles.mediaItemWrapper}>
        {thumbnail ? (
          <Image source={{ uri: thumbnail }} style={styles.mediaItemImage} />
        ) : (
          <View style={styles.mediaItemVideoPlaceholder}>
            <Icon name="CirclePlay" size={28} color={COLORS.outlineGrey} />
            <Text style={styles.mediaItemVideoText} numberOfLines={2}>
              {item.videoUrl || 'Video'}
            </Text>
          </View>
        )}

        {/* Video badge */}
        {item.type === 'video' && (
          <View style={styles.mediaItemVideoBadge}>
            <Icon name="Play" size={8} color={COLORS.white} />
            <Text style={styles.mediaItemVideoBadgeText}>Video</Text>
          </View>
        )}

        {/* Remove button */}
        <TouchableOpacity
          style={styles.mediaItemRemoveBtn}
          onPress={() => handleRemoveMedia(item.id)}
          hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
        >
          <Icon name="X" size={12} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    );
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.mainContainer}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon
            name={Platform.OS === 'ios' ? 'ChevronLeft' : 'ArrowLeft'}
            size={24}
            color={COLORS.white}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditMode ? 'Edit Community' : 'Create Community'}
        </Text>
      </View>

      <KeyboardAwareScrollView
        enableOnAndroid
        extraScrollHeight={90}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.contentContainer}
      >
        <Text style={styles.title}>
          {isEditMode ? 'Edit Your Community' : 'Create Your Community'}
        </Text>
        {!isEditMode && (
          <Text style={styles.subtitle}>
            Step 1 of 2: Reserve your URL and choose your plan.
          </Text>
        )}

        <Formik<CommunityFormValues>
          initialValues={initialValues}
          validationSchema={
            isEditMode ? EditCommunitySchema : CreateCommunitySchema
          }
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({
            handleChange,
            handleSubmit: formikSubmit,
            values,
            errors,
            touched,
            setFieldTouched,
            setFieldValue,
            isValid,
          }) => {
            const handleImageSelection = (fieldName: 'logo' | 'banner') => {
              launchImageLibrary(
                { mediaType: 'photo', quality: 1, selectionLimit: 1 },
                response => {
                  if (response.didCancel) {
                    setFieldTouched(fieldName, true);
                  } else if (response.errorCode) {
                    console.log('ImagePicker Error:', response.errorMessage);
                  } else if (response.assets && response.assets.length > 0) {
                    setFieldValue(fieldName, response.assets[0]);
                  }
                },
              );
            };

            // Sync mediaItems count with Formik for validation
            React.useEffect(() => {
              setFieldValue('mediaCount', mediaItems.length);
            }, [mediaItems.length]);

            // Real-time Slug validation
            React.useEffect(() => {
              if (values.slug && values.slug.length >= 3) {
                const timeoutId = setTimeout(() => {
                  checkCommunitySlug({ slug: values.slug });
                }, 500);
                return () => clearTimeout(timeoutId);
              } else {
                setApiCheckCommunitySlug(null);
              }
            }, [values.slug]);

            const handleSlugChange = (text: string) => {
              const transformed = text.toLowerCase().replace(/\s+/g, '-');
              setFieldValue('slug', transformed);
            };

            return (
              <>
                {/* ── Community Name ─────────────────────────── */}
                <TextInputField
                  label="Community Name"
                  placeholder="Enter community name"
                  value={values.name}
                  onChangeText={handleChange('name')}
                  onBlur={() => setFieldTouched('name')}
                  touched={touched.name}
                  error={errors.name}
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

                {/* ── URL Slug ───────────────────────────────── */}
                <TextInputField
                  label="Community URL Slug"
                  placeholder="Enter community slug"
                  value={values.slug}
                  onChangeText={handleSlugChange}
                  onBlur={() => setFieldTouched('slug')}
                  touched={touched.slug}
                  error={errors.slug}
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

                {/* Slug Availability Status */}
                {values.slug.length >= 3 && apiCheckCommunitySlug?.success && (
                  <View style={styles.slugAvailabilityContainer}>
                    <Icon
                      name={apiCheckCommunitySlug.available ? 'Check' : 'X'}
                      size={14}
                      color={
                        apiCheckCommunitySlug.available
                          ? COLORS.green
                          : COLORS.red
                      }
                    />
                    <Text
                      style={
                        apiCheckCommunitySlug.available
                          ? styles.availableText
                          : styles.unavailableText
                      }
                    >
                      {apiCheckCommunitySlug.message}
                    </Text>
                  </View>
                )}

                {/* ── Phone Number ──────────────────────────── */}
                <TextInputField
                  label="Phone Number (Optional)"
                  placeholder="Enter phone number"
                  keyboardType="phone-pad"
                  value={values.phoneNumber}
                  onChangeText={handleChange('phoneNumber')}
                  onBlur={() => setFieldTouched('phoneNumber')}
                  touched={touched.phoneNumber}
                  error={errors.phoneNumber}
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

                {/* ── Description ───────────────────────────── */}
                <TextInputField
                  label="Community Description"
                  placeholder="Enter community description"
                  multiline
                  numberOfLines={4}
                  value={values.description}
                  onChangeText={handleChange('description')}
                  onBlur={() => setFieldTouched('description')}
                  touched={touched.description}
                  error={errors.description}
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

                {/* ── Welcome Message ───────────────────────── */}
                <RichTextEditor
                  label="Welcome Message (Optional)"
                  placeholder="Create a personalized welcome message..."
                  value={values.welcomeMessage}
                  onChangeText={handleChange('welcomeMessage')}
                />

                {/* ── Category ──────────────────────────────── */}
                <CommonListModal
                  textInputLabel={'Category'}
                  placeholder={'Select Category'}
                  textInputValue={values.category}
                  touched={touched.category}
                  error={errors.category}
                  type={''}
                  dropDownData={CREATE_CATEGORY_DATA}
                  dropDownSelectedValue={values.category}
                  onDropDownSelect={(item: any) => {
                    setFieldValue('category', item?.value || item);
                  }}
                />

                {/* ── Social Links ──────────────────────────── */}
                <TextInputField
                  label="Instagram Link (Optional)"
                  placeholder="https://instagram.com/yourcommunity"
                  value={values.instagram}
                  onChangeText={handleChange('instagram')}
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
                  mediaHelpText="e.g., https://instagram.com/yourcommunity"
                />
                <TextInputField
                  label="Telegram Link (Optional)"
                  placeholder="https://t.me/yourcommunity"
                  value={values.telegram}
                  onChangeText={handleChange('telegram')}
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
                  mediaHelpText="e.g., https://t.me/yourcommunity"
                />
                <TextInputField
                  label="WhatsApp Link (Optional)"
                  placeholder="e.g., https://wa.me/1234567890"
                  value={values.whatsapp}
                  onChangeText={handleChange('whatsapp')}
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
                  mediaHelpText="e.g., https://wa.me/1234567890"
                />
                <TextInputField
                  label="YouTube Link (Optional)"
                  placeholder="https://youtube.com/@yourchannel"
                  value={values.youtube}
                  onChangeText={handleChange('youtube')}
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
                  mediaHelpText="e.g., https://youtube.com/@yourchannel"
                />
                <TextInputField
                  label="LinkedIn Link (Optional)"
                  placeholder="https://www.linkedin.com/company/your-company/"
                  value={values.linkedin}
                  onChangeText={handleChange('linkedin')}
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
                  mediaHelpText="e.g., https://www.linkedin.com/company/your-company/"
                />
                <TextInputField
                  label="External Link (Optional)"
                  placeholder="https://example.com/your-page"
                  value={values.external}
                  onChangeText={handleChange('external')}
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
                  mediaHelpText="Any external URL to feature on your community page"
                />

                {/* ── Community Logo ────────────────────────── */}
                {/*
                  In edit mode: show existing logo URL when no new pick.
                  In create mode: must pick a new one (imageUri starts null).
                */}
                <ImageUploadField
                  type="community"
                  label={
                    isEditMode
                      ? 'Community Logo (tap to change)'
                      : 'Community Logo'
                  }
                  buttonText="Upload Logo"
                  onPress={() => handleImageSelection('logo')}
                  imageUri={
                    values.logo?.uri ||
                    (isEditMode
                      ? getFullImageUrl(existingLogoUrl) || null
                      : null)
                  }
                  onRemoveImgPress={() => setFieldValue('logo', null)}
                  touched={touched.logo}
                  error={errors.logo as string}
                />

                {/* ── Community Banner ──────────────────────── */}
                <ImageUploadField
                  type="community"
                  label={
                    isEditMode
                      ? 'Community Banner (tap to change)'
                      : 'Community Banner'
                  }
                  buttonText="Upload Banner"
                  onPress={() => handleImageSelection('banner')}
                  imageUri={
                    values.banner?.uri ||
                    (isEditMode
                      ? getFullImageUrl(existingBannerUrl) || null
                      : null)
                  }
                  onRemoveImgPress={() => setFieldValue('banner', null)}
                  touched={touched.banner}
                  error={errors.banner as string}
                />

                {/* ── Community Media ───────────────────────── */}
                <Text style={styles.sectionTitle}>Community Media</Text>
                <Text style={styles.mediaHelpText}>
                  {isEditMode
                    ? 'Existing media is shown below. Tap × to remove, or add more.'
                    : 'Add images and videos to showcase your community.'}
                </Text>

                {/* Add Media button */}
                <TouchableOpacity
                  style={styles.addMediaBtn}
                  onPress={handleAddMedia}
                  disabled={apiUploadCommunityMediaLoading}
                >
                  {apiUploadCommunityMediaLoading ? (
                    <ActivityIndicator size="small" color={COLORS.white} />
                  ) : (
                    <>
                      <Icon name="Plus" size={22} color={COLORS.white} />
                      <Text style={styles.addMediaBtnText}>Add Media</Text>
                    </>
                  )}
                </TouchableOpacity>

                {/* Media grid — shown in both modes */}
                {mediaItems.length > 0 && (
                  <View style={styles.mediaGrid}>
                    {mediaItems.map(item => renderMediaItem(item))}
                  </View>
                )}

                {/* Validation error for media count */}
                {touched.mediaCount && errors.mediaCount ? (
                  <Text style={styles.errorText}>
                    {errors.mediaCount as string}
                  </Text>
                ) : null}

                {/* Validation error for logo/banner in create mode */}
                {!isEditMode && touched.logo && errors.logo ? (
                  <Text style={styles.errorText}>{errors.logo as string}</Text>
                ) : null}

                {/* ── Submit ────────────────────────────────── */}
                <PrimaryButton
                  title={isEditMode ? 'Update Community' : 'Create Community'}
                  onPress={formikSubmit as any}
                  buttonStyle={[
                    styles.createBtnStyle,
                    (!isValid ||
                      apiUpdateCommunityLoading ||
                      apiCreateCommunityLoading) &&
                      styles.disabledButton,
                  ]}
                  textStyle={styles.createBtnText}
                  loading={
                    apiUpdateCommunityLoading || apiCreateCommunityLoading
                  }
                  disabled={
                    !isValid ||
                    apiUpdateCommunityLoading ||
                    apiCreateCommunityLoading
                  }
                />
              </>
            );
          }}
        </Formik>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default CreateCommunity;
