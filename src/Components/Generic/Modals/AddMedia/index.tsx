import { View, Text, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import Modal from 'react-native-modal';
import { THEME } from '@/Assets/Theme';
import { useAtom } from 'jotai';
import styles from './style';
import { addMediaVisibleAtom, onMediaAddedAtom } from '@/Jotai/Atoms';
import Icon from '@/Components/Core/Icons';
import { COLORS } from '@/Assets/Theme/colors';
import ImageUploadField from '@/Components/Core/ImageUploadField';
import TextInputField from '@/Components/Core/TextInputField';
import { launchImageLibrary, Asset } from 'react-native-image-picker';

const AddMediaModal = () => {
  const [isAddMediaModalVisible, setIsAddMediaModalVisible] =
    useAtom(addMediaVisibleAtom);
  const [onMediaAdded] = useAtom(onMediaAddedAtom);

  const [selectedMedia, setSelectedMedia] = useState<Asset | null>(null);
  const [videoLink, setVideoLink] = useState('');

  const handleCancel = () => {
    setIsAddMediaModalVisible(false);
    setSelectedMedia(null);
    setVideoLink('');
  };

  const handleImageSelection = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 1,
        selectionLimit: 1,
      },
      response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          setSelectedMedia(response.assets[0]);
          setVideoLink(''); // Clear link if image is selected
        }
      },
    );
  };

  const handleVideoSelection = () => {
    launchImageLibrary(
      {
        mediaType: 'video',
        quality: 1,
        selectionLimit: 1,
      },
      response => {
        if (response.didCancel) {
          console.log('User cancelled video picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          setSelectedMedia(response.assets[0]);
          setVideoLink(''); // Clear link if video is selected
        }
      },
    );
  };

  const handleAdd = () => {
    if (selectedMedia) {
      onMediaAdded?.({ type: 'file', ...selectedMedia });
      handleCancel();
    } else if (videoLink) {
      onMediaAdded?.({ type: 'link', uri: videoLink });
      handleCancel();
    } else {
      Alert.alert('Error', 'Please select an image/video or enter a link');
    }
  };

  return (
    <Modal
      isVisible={isAddMediaModalVisible}
      onSwipeComplete={handleCancel}
      onBackdropPress={handleCancel}
      swipeDirection="down"
      animationIn="slideInUp"
      animationOut="slideOutDown"
      //   backdropColor={THEME.COLORS.modalBackdropColor}
      animationInTiming={500}
      animationOutTiming={500}
      backdropTransitionInTiming={1000}
      backdropTransitionOutTiming={1000}
      style={styles.modalContainer}
    >
      <View style={styles.mainModalView}>
        <View style={styles.header}>
          <Text style={styles.title}>Add Media</Text>
          <TouchableOpacity onPress={handleCancel}>
            <Icon name="X" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        {/* Uploads */}
        <View style={styles.uploadContainer}>
          <ImageUploadField
            type="media"
            label="Upload Image"
            buttonText="Upload image here"
            onPress={handleImageSelection}
            imageUri={selectedMedia?.type?.includes('image') ? selectedMedia.uri : null}
          />

          <Text style={styles.orText}>Or, add a video</Text>

          {/* Upload Video */}
          <TextInputField
            label="Upload Video"
            placeholder="YouTube, Loom, Vimeo or Wistia link"
            leftIcon="link"
            value={videoLink}
            onChangeText={text => {
              setVideoLink(text);
              if (text) setSelectedMedia(null); // Clear media if link is entered
            }}
            onBlur={() => console.log('onBlur')}
            touched={false}
            error={''}
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
          {/* <TouchableOpacity style={styles.addLink}>
            <Text style={styles.addLinkText}>Add link</Text>
          </TouchableOpacity> */}

          <View style={styles.spaceDivider} />
          <ImageUploadField
            type="media"
            label="Upload Video"
            buttonText="Upload video here"
            onPress={handleVideoSelection}
            imageUri={selectedMedia?.type?.includes('video') ? selectedMedia.uri : null}
            iconName="Video"
          />
          <TouchableOpacity style={styles.add} onPress={handleAdd}>
            <Text style={styles.addText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default AddMediaModal;
