import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  TextInput,
  Switch,
  ScrollView,
  Image,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import Modal from 'react-native-modal';
import Toast from 'react-native-toast-message';
import { useAtom } from 'jotai';
import {
  createPostVisibleAtom,
  onCreatePostMediaAddedAtom,
  postsAtom,
  Post,
  editingPostAtom,
  currentCommunityIdAtom,
  communityCategoriesAtom,
  Category,
  refreshSocialFeedsAtom,
} from '@/Jotai/Atoms';
import useUserApi from '@/Hooks/Apis/UserApis/use-user-api';
import DropdownField from '@/Components/Core/DropdownField';
import { TextInput as PaperTextInput } from 'react-native-paper';

import { Asset, launchImageLibrary } from 'react-native-image-picker';
import styles from './style';
import Icon from '@/Components/Core/Icons';
import { COLORS } from '@/Assets/Theme/colors';
import { THEME } from '@/Assets/Theme';
import { ms } from '@/Assets/Theme/fontStyle';
import TextInputField from '@/Components/Core/TextInputField';
import ToastModule from '@/Components/Core/Toast';

const { height: DEVICE_HEIGHT, width: DEVICE_WIDTH } = Dimensions.get('window');

const CreateNewPostModal = () => {
  const {
    createSocialFeedPost,
    apiCreateSocialFeedLoading,
    updateSocialFeedPost,
    apiUpdateSocialFeedLoading,
  } = useUserApi();
  const [isCreatePostModalVisible, setIsCreatePostModalVisible] = useAtom(
    createPostVisibleAtom,
  );
  const [onCreatePostMediaAdded] = useAtom(onCreatePostMediaAddedAtom);
  const [editingPost, setEditingPost] = useAtom(editingPostAtom); // Edit Mode Atom

  const [description, setDescription] = useState('');
  const [isPollEnabled, setIsPollEnabled] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<Asset[]>([]);
  const [communityId] = useAtom(currentCommunityIdAtom);
  const { getSocialFeedCategories } = useUserApi();

  const [categories] = useAtom(communityCategoriesAtom);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  const [visibility, setVisibility] = useState('Everyone');
  const [isVisibilityDropdownVisible, setIsVisibilityDropdownVisible] =
    useState(false);

  const [title, setTitle] = useState('');
  const [videoLinkInput, setVideoLinkInput] = useState('');
  const [videoLinks, setVideoLinks] = useState<
    { url: string; platform: string }[]
  >([]);

  const getLinkPlatform = (url: string) => {
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) {
      return 'YouTube';
    } else if (lowerUrl.includes('linkedin.com')) {
      return 'LinkedIn';
    } else if (lowerUrl.includes('instagram.com')) {
      return 'Instagram';
    } else if (lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com')) {
      return 'X (Twitter)';
    }
    return 'Other';
  };

  const visibilityOptions = [
    { label: 'Everyone', value: 'Everyone', icon: 'Earth' },
    { label: 'Paid Members Only', value: 'Paid Members Only', icon: 'Diamond' },
    { label: 'Admins Only', value: 'Admins Only', icon: 'Lock' },
    {
      label: 'Specific Plans/Products',
      value: 'Specific Plans/Products',
      icon: 'Key',
    },
  ];

  // Effect to populate fields when editing
  useEffect(() => {
    if (editingPost) {
      setDescription(editingPost.content || '');
      setSelectedMedia((editingPost.media as Asset[]) || []);
      setIsPollEnabled(!!editingPost.isPoll);
      setSelectedCategoryId(editingPost.categoryId || null);

      // Normalize visibility to match one of the options
      const normalizedVisibility =
        visibilityOptions.find(
          opt =>
            opt.value.toLowerCase() === editingPost.visibility?.toLowerCase(),
        )?.value || 'Everyone';
      setVisibility(normalizedVisibility);

      setTitle(editingPost.title || '');
      setVideoLinks(editingPost.videoLinks || []);
    }
  }, [editingPost]);

  // Toast Ref
  const toastRef = useRef<any>(null);

  // Poll State
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState<string[]>(['', '']);
  const [allowMultipleAnswers, setAllowMultipleAnswers] = useState(false);

  const handleCancel = () => {
    setIsCreatePostModalVisible(false);
    setEditingPost(null); // Clear edit mode
    setDescription('');
    setIsPollEnabled(false);
    setSelectedMedia([]);
    setPollQuestion('');
    setPollOptions(['', '']);
    setAllowMultipleAnswers(false);
    setSelectedCategoryId(null);
    setVisibility('Everyone');
    setTitle('');
    setVideoLinkInput('');
    setVideoLinks([]);
  };

  const handleOptionChange = (text: string, index: number) => {
    const newOptions = [...pollOptions];
    newOptions[index] = text;
    setPollOptions(newOptions);
  };

  const addOption = () => {
    setPollOptions([...pollOptions, '']);
  };

  const removeOption = (index: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index));
    }
  };

  const handleAddVideoLink = () => {
    if (videoLinkInput.trim()) {
      const platform = getLinkPlatform(videoLinkInput.trim());
      setVideoLinks(prev => [
        ...prev,
        { url: videoLinkInput.trim(), platform: platform },
      ]);
      setVideoLinkInput('');
    }
  };

  const removeVideoLink = (index: number) => {
    setVideoLinks(prev => prev.filter((_, i) => i !== index));
  };

  const handleMediaSelection = (type: 'photo' | 'video') => {
    launchImageLibrary(
      {
        mediaType: type,
        quality: 1,
        selectionLimit: 0,
      },
      response => {
        if (
          !response.didCancel &&
          !response.errorCode &&
          response.assets?.length
        ) {
          console.log('Media selected:', response.assets);
          setSelectedMedia(prev => [...prev, ...response.assets!]);
        }
      },
    );
  };

  const removeMedia = (index: number) => {
    setSelectedMedia(prev => prev.filter((_, i) => i !== index));
  };

  const [posts, setPosts] = useAtom(postsAtom);

  const [refreshSocialFeeds, setRefreshSocialFeeds] = useAtom(
    refreshSocialFeedsAtom,
  );
  const handlePost = async () => {
    if (isPollEnabled) {
      const validOptions = pollOptions.filter(opt => opt.trim() !== '');
      if (pollQuestion.trim() === '' || validOptions.length < 2) {
        Alert.alert(
          'Error',
          'Please provide a question and at least 2 options.',
        );
        return;
      }
      // TODO: Handle poll creation via API if supported
    }

    if (!isPollEnabled && !description?.trim()) {
      ToastModule.errorTop({
        msg: 'Please add some content to your post.',
        ref: toastRef,
      });
      return;
    }

    if (!selectedCategoryId) {
      ToastModule.errorTop({
        msg: 'Please select a category.',
        ref: toastRef,
      });
      return;
    }

    const formData = new FormData();
    formData.append('isPinned', 'false');
    formData.append('isPublic', 'true');
    formData.append('visibility', visibility.toLowerCase());
    formData.append('categoryId', selectedCategoryId);

    if (isPollEnabled) {
      const validOptions = pollOptions.filter(opt => opt.trim() !== '');
      const pollData = {
        question: pollQuestion,
        allowMultipleAnswers: allowMultipleAnswers,
        options: validOptions,
      };
      formData.append('poll', JSON.stringify(pollData));
      formData.append('content', pollQuestion);
      formData.append('title', ''); // Polls usually don't have separate titles in this UI
    } else {
      formData.append('content', description);
      formData.append('title', title);
    }

    if (!isPollEnabled && selectedMedia.length > 0) {
      selectedMedia.forEach((media: Asset) => {
        if (media.uri && media.fileName && media.type) {
          const isVideo = media.type.includes('video');
          const fieldName = isVideo ? 'videos' : 'images';

          formData.append(fieldName, {
            uri: media.uri,
            name: media.fileName,
            type: media.type,
          } as any);
        }
      });
    }

    if (videoLinks.length > 0) {
      formData.append('videoLinks', JSON.stringify(videoLinks));
    }

    const res = editingPost
      ? await updateSocialFeedPost(`posts/${editingPost.id}`, {
        title,
        content: description,
        isPublic: true,
        visibility: visibility.toLowerCase(),
        videoLinks: JSON.stringify(videoLinks),
      })
      : await createSocialFeedPost(`/${communityId}/posts`, formData);

    if (res?.success) {
      ToastModule.successTop({
        msg:
          res?.message ||
          (editingPost
            ? 'Post updated successfully!'
            : 'Post created successfully!'),
        ref: toastRef,
      });
      setRefreshSocialFeeds(!refreshSocialFeeds); // Trigger refresh
      handleCancel();
    }
  };

  return (
    <Modal
      isVisible={isCreatePostModalVisible}
      onSwipeComplete={handleCancel}
      onBackdropPress={handleCancel}
      swipeDirection="down"
      style={styles.modalContainer}
      avoidKeyboard
      useNativeDriver={true}
      useNativeDriverForBackdrop={true}
      hideModalContentWhileAnimating={true}
      backdropTransitionOutTiming={0}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationInTiming={300}
      animationOutTiming={300}
      deviceHeight={DEVICE_HEIGHT}
      deviceWidth={DEVICE_WIDTH}
    >
      <View style={styles.mainModalView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>
            {editingPost ? 'Edit Post' : 'Create New Post'}
          </Text>
          <TouchableOpacity onPress={handleCancel}>
            <Icon name="X" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Select Category */}
          {!editingPost && (
            <>
              <View style={styles.labelRow}>
                <Text style={styles.sectionTitle}>
                  Select Category<Text style={{ color: COLORS.red }}> *</Text>
                </Text>
              </View>

              <View style={{ marginBottom: ms(20) }}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {categories.map(cat => (
                    <TouchableOpacity
                      key={cat.id}
                      style={[
                        styles.categoryChip,
                        selectedCategoryId === cat.id &&
                        styles.categoryChipActive,
                      ]}
                      onPress={() => setSelectedCategoryId(cat.id)}
                    >
                      <Text
                        style={[
                          styles.categoryChipText,
                          selectedCategoryId === cat.id &&
                          styles.categoryChipTextActive,
                        ]}
                      >
                        {cat.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </>
          )}

          <View style={styles.visibilityContainer}>
            <Text style={styles.sectionTitle}>Visibility</Text>
            <DropdownField
              placeholder="Select Visibility"
              value={visibility}
              onPress={() => setIsVisibilityDropdownVisible(true)}
              left={
                <PaperTextInput.Icon
                  icon={
                    visibilityOptions
                      .find(opt => opt.value === visibility)
                      ?.icon?.toLowerCase() || 'globe'
                  }
                  color={COLORS.white}
                />
              }
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

          {/* Poll Toggle */}
          {!editingPost && (
            <TouchableOpacity
              style={styles.toggleRow}
              onPress={() => setIsPollEnabled(!isPollEnabled)}
              activeOpacity={1}
            >
              <Switch
                trackColor={{ false: '#767577', true: COLORS.primary }}
                thumbColor={COLORS.white}
                ios_backgroundColor="#3e3e3e"
                onValueChange={setIsPollEnabled}
                value={isPollEnabled}
              />
              <Text style={styles.toggleLabel}>Create poll</Text>
            </TouchableOpacity>
          )}

          {!isPollEnabled ? (
            <>
              {/* Title Field */}
              <View style={styles.titleInputContainer}>
                <TextInputField
                  label="Title (optional)"
                  placeholder="Title (optional)"
                  value={title}
                  onChangeText={text => setTitle(text.slice(0, 200))}
                  style={[styles.inputStyle]}
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
                <Text style={styles.charCount}>
                  {title.length}/200 characters
                </Text>
              </View>
              <TextInputField
                label="Content"
                placeholder="What do you want to share ?*"
                multiline
                numberOfLines={4}
                value={description}
                onChangeText={setDescription}
                onBlur={setDescription}
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

              {!editingPost && (
                <View style={styles.mediaActionsRow}>
                  <TouchableOpacity
                    style={styles.mediaButton}
                    onPress={() => handleMediaSelection('photo')}
                  >
                    <Icon name="Image" size={18} color={COLORS.primary} />
                    <Text style={styles.mediaButtonText}>Photo</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.mediaButton}
                    onPress={() => handleMediaSelection('video')}
                  >
                    <Icon name="Video" size={18} color={COLORS.green} />
                    <Text style={styles.mediaButtonText}>Video</Text>
                  </TouchableOpacity>
                </View>
              )}

              {!editingPost && selectedMedia.length > 0 && (
                <View style={styles.mediaListContainer}>
                  <FlatList
                    data={selectedMedia}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({ item, index }) => (
                      <View style={styles.mediaItem}>
                        <Image
                          source={{ uri: item.uri }}
                          style={styles.mediaImage}
                        />
                        {item.type?.includes('video') && (
                          <View style={styles.videoIconContainer}>
                            <Icon name="Video" size={24} color={COLORS.white} />
                          </View>
                        )}
                        <TouchableOpacity
                          style={styles.deleteButton}
                          onPress={() => removeMedia(index)}
                        >
                          <Icon name="X" size={12} color={COLORS.white} />
                        </TouchableOpacity>
                      </View>
                    )}
                  />
                </View>
              )}

              {/* Video Links Selection */}
              {!editingPost && (
                <View style={styles.videoLinksContainer}>
                  <Text style={styles.sectionTitle}>
                    Add Video Links (YouTube, LinkedIn, Instagram, X/Twitter,
                    Video Bank)
                  </Text>
                  <View style={styles.videoLinkRow}>
                    <TextInputField
                      label="Add Link"
                      placeholder="Paste video URL from YouTube, LinkedIn, Instagram, or X (Twitter)"
                      value={videoLinkInput}
                      onChangeText={setVideoLinkInput}
                      style={styles.videoInput}
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
                    <TouchableOpacity
                      style={styles.addLinkButton}
                      onPress={handleAddVideoLink}
                    >
                      <Text style={styles.addLinkText}>Add</Text>
                    </TouchableOpacity>
                  </View>

                  {videoLinks.length > 0 && (
                    <View style={styles.addedLinksList}>
                      {videoLinks.map((linkObj, index) => (
                        <View key={index} style={styles.addedLinkItem}>
                          <View style={{ flex: 1 }}>
                            <Text
                              style={styles.addedLinkText}
                              numberOfLines={1}
                              ellipsizeMode="middle"
                            >
                              {linkObj.url}
                            </Text>
                            <Text
                              style={{
                                color: COLORS.primary,
                                fontSize: ms(10),
                                marginTop: ms(2),
                              }}
                            >
                              Platform: {linkObj.platform}
                            </Text>
                          </View>
                          <TouchableOpacity
                            onPress={() => removeVideoLink(index)}
                          >
                            <Icon name="X" size={16} color={COLORS.red} />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              )}

              {/* {!editingPost && selectedMedia.length > 0 && (
                <View style={styles.mediaListContainer}>
                  <FlatList
                    data={selectedMedia}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({ item, index }) => (
                      <View style={styles.mediaItem}>
                        <Image
                          source={{ uri: item.uri }}
                          style={styles.mediaImage}
                        />
                        {item.type?.includes('video') && (
                          <View style={styles.videoIconContainer}>
                            <Icon name="Video" size={24} color={COLORS.white} />
                          </View>
                        )}
                        <TouchableOpacity
                          style={styles.deleteButton}
                          onPress={() => removeMedia(index)}
                        >
                          <Icon name="X" size={12} color={COLORS.white} />
                        </TouchableOpacity>
                      </View>
                    )}
                  />
                </View>
              )} */}
            </>
          ) : (
            <>
              <TextInputField
                label="Poll Question *"
                placeholder="Poll Question *"
                multiline
                numberOfLines={4}
                value={pollQuestion}
                onChangeText={setPollQuestion}
                onBlur={setPollQuestion}
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

              <Text style={styles.optionLabel}>Options</Text>
              {pollOptions.map((option, index) => (
                <View key={index} style={styles.optionRow}>
                  <TextInput
                    style={styles.optionInput}
                    placeholder={'Option' + ' ' + (index + 1)}
                    placeholderTextColor={COLORS.placeholder}
                    value={option}
                    onChangeText={text => handleOptionChange(text, index)}
                  />
                  {pollOptions.length > 2 && (
                    <TouchableOpacity
                      style={styles.removeOptionButton}
                      onPress={() => removeOption(index)}
                    >
                      <Icon
                        name="CircleX"
                        size={20}
                        color={COLORS.placeholder}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              ))}

              <TouchableOpacity
                style={styles.addOptionButton}
                onPress={addOption}
              >
                <Text style={styles.addOptionText}>Add Option</Text>
              </TouchableOpacity>

              <View style={styles.multipleAnswersRow}>
                <Switch
                  trackColor={{ false: '#767577', true: COLORS.primary }}
                  thumbColor={COLORS.white}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={setAllowMultipleAnswers}
                  value={allowMultipleAnswers}
                />
                <Text style={styles.multipleAnswersLabel}>
                  Allow multiple answers
                </Text>
              </View>
            </>
          )}
        </ScrollView>
        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.postButton,
              (apiCreateSocialFeedLoading || apiUpdateSocialFeedLoading) && {
                opacity: 0.7,
              },
            ]}
            onPress={handlePost}
            disabled={apiCreateSocialFeedLoading || apiUpdateSocialFeedLoading}
          >
            {apiCreateSocialFeedLoading || apiUpdateSocialFeedLoading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.postText}>
                {editingPost
                  ? 'Update Post'
                  : isPollEnabled
                    ? 'Create Poll'
                    : 'Post'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Visibility Options Modal/Picker */}
      <Modal
        isVisible={isVisibilityDropdownVisible}
        onBackdropPress={() => setIsVisibilityDropdownVisible(false)}
        style={{ justifyContent: 'flex-end', margin: 0 }}
        useNativeDriver={true}
        useNativeDriverForBackdrop={true}
        hideModalContentWhileAnimating={true}
        backdropTransitionOutTiming={0}
        animationIn="slideInUp"
        animationOut="slideOutDown"
      >
        <View
          style={{
            backgroundColor: COLORS.newModalBG,
            padding: ms(20),
            borderTopLeftRadius: ms(16),
            borderTopRightRadius: ms(16),
          }}
        >
          <Text
            style={[
              styles.sectionTitle,
              { marginBottom: ms(20), textAlign: 'center' },
            ]}
          >
            Select Visibility
          </Text>
          {visibilityOptions.map(option => (
            <TouchableOpacity
              key={option.value}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: ms(15),
                borderBottomWidth: 1,
                borderBottomColor: COLORS.innerCardBG,
              }}
              onPress={() => {
                setVisibility(option.value);
                setIsVisibilityDropdownVisible(false);
              }}
            >
              <Icon
                name={option.icon as any}
                size={20}
                color={
                  visibility === option.value ? COLORS.primary : COLORS.white
                }
              />
              <Text
                style={{
                  marginLeft: ms(15),
                  ...THEME.fontStyle.h5Regular,
                  color:
                    visibility === option.value ? COLORS.primary : COLORS.white,
                }}
              >
                {option.label}
              </Text>
              {visibility === option.value && (
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                  <Icon name="Check" size={20} color={COLORS.primary} />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </Modal>

      {/* @ts-ignore */}
      <Toast ref={toastRef} />
    </Modal>
  );
};

export default CreateNewPostModal;
