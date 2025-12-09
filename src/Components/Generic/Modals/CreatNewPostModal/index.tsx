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
} from 'react-native';
import React, { useState, useRef } from 'react';
import Modal from 'react-native-modal';
import Toast from 'react-native-toast-message';
import { useAtom } from 'jotai';
import {
  createPostVisibleAtom,
  onCreatePostMediaAddedAtom,
  postsAtom,
  Post,
  editingPostAtom,
} from '@/Jotai/Atoms';

import { Asset, launchImageLibrary } from 'react-native-image-picker';
import styles from './style';
import Icon from '@/Components/Core/Icons';
import { COLORS } from '@/Assets/Theme/colors';
import TextInputField from '@/Components/Core/TextInputField';
import ToastModule from '@/Components/Core/Toast';

const CreateNewPostModal = () => {
  const [isCreatePostModalVisible, setIsCreatePostModalVisible] = useAtom(
    createPostVisibleAtom,
  );
  const [onCreatePostMediaAdded] = useAtom(onCreatePostMediaAddedAtom);
  const [editingPost, setEditingPost] = useAtom(editingPostAtom); // Edit Mode Atom

  const [description, setDescription] = useState('');
  const [isPollEnabled, setIsPollEnabled] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<Asset[]>([]);

  // Effect to populate fields when editing
  React.useEffect(() => {
    if (editingPost) {
      setDescription(editingPost.content || '');
      setSelectedMedia((editingPost.media as Asset[]) || []);
      setIsPollEnabled(!!editingPost.isPoll);
      // Pre-fill poll data if needed, but we currently restrict editing to non-polls
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

  const handlePost = () => {
    const newPost: Post = {
      id: Date.now().toString(),
      author: {
        name: 'You', // Or get from user profile
        avatar: 'Y',
      },
      timestamp: 'Just now',
      content: isPollEnabled ? '' : description,
      likes: 0,
      comments: 0,
      isPoll: isPollEnabled,
      media: isPollEnabled ? [] : selectedMedia,
    };

    if (isPollEnabled) {
      // Filter out empty options
      const validOptions = pollOptions.filter(opt => opt.trim() !== '');
      if (pollQuestion.trim() === '' || validOptions.length < 2) {
        Alert.alert(
          'Error',
          'Please provide a question and at least 2 options.',
        );
        return;
      }

      newPost.pollData = {
        question: pollQuestion,
        options: validOptions.map((text, index) => ({
          id: `opt-${Date.now()}-${index}`,
          text,
          votes: 0,
        })),
        totalVotes: 0,
        allowMultipleAnswers,
        userVotedOptionIds: [],
      };
    } else {
      if (!description?.trim()) {
        // Alert.alert('Error', 'Please add some content to your post.');
        ToastModule.errorTop({
          msg: 'Please add some content to your post.',
          ref: toastRef,
        });
        return;
      }
    }



    if (editingPost) {
      // Update Existing Post
      const updatedPosts = posts.map(p => {
        if (p.id === editingPost.id) {
          return {
            ...p,
            content: description, // Only update content
            // Keep original media and poll properties unchanged
          };
        }
        return p;
      });
      setPosts(updatedPosts);
    } else {
      // Create New Post
      setPosts([newPost, ...posts]);
    }

    handleCancel();
  };

  return (
    <Modal
      isVisible={isCreatePostModalVisible}
      onSwipeComplete={handleCancel}
      onBackdropPress={handleCancel}
      swipeDirection="down"
      style={styles.modalContainer}
      avoidKeyboard
    >
      <View style={styles.mainModalView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{editingPost ? 'Edit Post' : 'Create New Post'}</Text>
          <TouchableOpacity onPress={handleCancel}>
            <Icon name="X" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.contentContainer}>
          {/* Poll Toggle */}
          {/* Poll Toggle - Hide when editing */}
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

          {/* Conditional Content */}
          {!isPollEnabled ? (
            <>
              {/* Description Input */}
              {/* <Text style={styles.inputLabel}>Description</Text> */}
              {/* <TextInput
                style={styles.descriptionInput}
                placeholder="What do you want to share ?*"
                placeholderTextColor={COLORS.placeholder}
                multiline
                value={description}
                onChangeText={setDescription}
              /> */}
              <TextInputField
                label="Content"
                placeholder="What do you want to share ?*"
                multiline
                numberOfLines={4}
                value={description}
                onChangeText={setDescription}
                onBlur={setDescription}
                // touched={touched.name}
                // error={errors.name}
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

              {/* Media Buttons */}
              {/* Media Buttons - Hide when editing */}
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

              {/* Media List - Hide when editing */}
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
            </>
          ) : (
            <>
              {/* Poll Question */}
              {/* <Text style={styles.inputLabel}>Question *</Text>
              <TextInput
                style={styles.pollQuestionInput}
                placeholder="Poll Question *"
                placeholderTextColor={COLORS.placeholder}
                multiline
                value={pollQuestion}
                onChangeText={setPollQuestion}
              /> */}
              <TextInputField
                label="Poll Question *"
                placeholder="Poll Question *"
                multiline
                numberOfLines={4}
                value={pollQuestion}
                onChangeText={setPollQuestion}
                onBlur={setPollQuestion}
                // touched={touched.name}
                // error={errors.name}
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

              {/* Poll Options */}
              <Text style={styles.optionLabel}>Option</Text>
              {pollOptions.map((option, index) => (
                <View key={index} style={styles.optionRow}>
                  <TextInput
                    style={styles.optionInput}
                    placeholder={'Add'}
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
                  {/* {pollOptions.length <= 2 && (
                    <View style={styles.removeOptionButton}>
                      <Icon name="CircleX" size={20} color={'transparent'} />
                    </View>
                  )} */}
                </View>
              ))}

              <TouchableOpacity
                style={styles.addOptionButton}
                onPress={addOption}
              >
                <Text style={styles.addOptionText}>Add Option</Text>
              </TouchableOpacity>

              {/* Allow Multiple Answers */}
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
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.postButton} onPress={handlePost}>
            <Text style={styles.postText}>
              {editingPost ? 'Update Post' : (isPollEnabled ? 'Create Poll' : 'Post')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* @ts-ignore */}
      <Toast ref={toastRef} />
    </Modal>
  );
};

export default CreateNewPostModal;
