import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useAtom } from 'jotai';
import { userAtom } from '@/Jotai/Atoms';
import useUserApi from '@/Hooks/Apis/UserApis/use-user-api';
import Modal from 'react-native-modal';
import styles from './style';
import Icon from '@/Components/Core/Icons';
import { COLORS } from '@/Assets/Theme/colors';
import TextInputField from '@/Components/Core/TextInputField';
import ImageUploadField from '@/Components/Core/ImageUploadField';
import CommonListModal from '@/Components/Generic/Modals/CommonListModal';
import {
  CATEGORY_DATA,
  COURSE_TYPE_DATA,
  TARGET_AUDIENCE_DATA,
  CONTENT_TYPE_DATA,
} from '@/Constants/customData';
import { launchImageLibrary } from 'react-native-image-picker';

interface CreateCourseModalProps {
  visible: boolean;
  communityId: string;
  onClose: () => void;
  onSave: (courseData: any) => void;
}

const CreateCourseModal: React.FC<CreateCourseModalProps> = ({
  visible,
  communityId,
  onClose,
  onSave,
}) => {
  const [user] = useAtom(userAtom);
  const { createCourse, apiCreateCourseLoading } = useUserApi();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [category, setCategory] = useState('');
  const [courseType, setCourseType] = useState('');
  const [contentType, setContentType] = useState('');
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!title.trim()) newErrors.title = 'Course title is required';
    if (!description.trim())
      newErrors.description = 'Course description is required';
    if (!targetAudience)
      newErrors.targetAudience = 'Target audience is required';
    if (!category) newErrors.category = 'Category is required';
    if (!courseType) newErrors.courseType = 'Course type is required';
    if (!contentType) newErrors.contentType = 'Content type is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (validate()) {
      const payload = {
        title: title,
        description: description,
        category: category,
        chapters: [],
        community: communityId,
        contentType: contentType === 'Video Based' ? 'video' : 'text',
        instructor: (user as any)?._id || (user as any)?.id,
        isFree: courseType === 'Free',
        learningOutcomes: [],
        price: 0,
        requirements: [],
        status: 'draft',
        tags: [],
        targetAudience: targetAudience,
        thumbnail: thumbnail || '',
      };

      const res = await createCourse(payload);
      if (res) {
        onSave(res.data || res);
        handleClose();
      }
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setTargetAudience('');
    setCategory('');
    setCourseType('');
    setContentType('');
    setThumbnail(null);
    setErrors({});
    onClose();
  };

  const handleImageUpload = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1,
      });
      console.log('🚀 ~ handleImageUpload ~ result:', result);

      if (result.assets && result.assets.length > 0) {
        setThumbnail(result.assets[0].uri || null);
      }
    } catch (error) {
      console.log('Image picker error:', error);
    }
  };

  const handleRemoveImage = () => {
    setThumbnail(null);
  };

  return (
    <Modal
      isVisible={visible}
      onSwipeComplete={handleClose}
      onBackdropPress={handleClose}
      swipeDirection="down"
      style={styles.modalContainer}
    >
      <View style={styles.mainModalView}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Course</Text>
          <TouchableOpacity onPress={handleClose}>
            <Icon name="X" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View>
            <Text style={styles.sectionTitle}>Course Basic Information</Text>
            <Text style={styles.sectionDescription}>
              Provide the essential details to set up your course foundation.
            </Text>
          </View>

          <TextInputField
            label="Course title"
            placeholder="Enter course title"
            value={title}
            onChangeText={text => {
              setTitle(text);
              if (errors.title) setErrors({ ...errors, title: '' });
            }}
            error={errors.title}
            touched={!!errors.title}
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
            label="Course Description"
            placeholder="Enter course description"
            value={description}
            onChangeText={text => {
              setDescription(text);
              if (errors.description) setErrors({ ...errors, description: '' });
            }}
            multiline
            numberOfLines={4}
            error={errors.description}
            touched={!!errors.description}
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

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <CommonListModal
                textInputLabel={'Target Audience'}
                placeholder={'Select target audience'}
                textInputValue={targetAudience}
                error={errors.targetAudience}
                touched={!!errors.targetAudience}
                type="dropdown"
                dropDownData={TARGET_AUDIENCE_DATA}
                dropDownSelectedValue={targetAudience}
                onDropDownSelect={item => {
                  setTargetAudience(item.value);
                  if (errors.targetAudience)
                    setErrors({ ...errors, targetAudience: '' });
                }}
              />
            </View>
            <View style={styles.halfInput}>
              <CommonListModal
                textInputLabel={'Category'}
                placeholder={'Select category'}
                textInputValue={category}
                error={errors.category}
                touched={!!errors.category}
                type="dropdown"
                dropDownData={CATEGORY_DATA}
                dropDownSelectedValue={category}
                onDropDownSelect={item => {
                  setCategory(item.value);
                  if (errors.category) setErrors({ ...errors, category: '' });
                }}
              />
            </View>
          </View>

          <CommonListModal
            textInputLabel={'Course Type'}
            placeholder={'Select course type'}
            textInputValue={courseType}
            error={errors.courseType}
            touched={!!errors.courseType}
            type="dropdown"
            dropDownData={COURSE_TYPE_DATA}
            dropDownSelectedValue={courseType}
            onDropDownSelect={item => {
              setCourseType(item.value);
              if (errors.courseType) setErrors({ ...errors, courseType: '' });
            }}
          />

          <Text style={styles.primaryContentTitle}>Primary Content Type</Text>

          <CommonListModal
            textInputLabel={'Content Type'}
            placeholder={'Select content type'}
            textInputValue={contentType}
            error={errors.contentType}
            touched={!!errors.contentType}
            type="dropdown"
            dropDownData={CONTENT_TYPE_DATA}
            dropDownSelectedValue={contentType}
            onDropDownSelect={item => {
              setContentType(item.value);
              if (errors.contentType) setErrors({ ...errors, contentType: '' });
            }}
          />

          <Text style={styles.thumbnailLabel}>Course Thumbnail</Text>
          <ImageUploadField
            label=""
            buttonText="Upload Thumbnail"
            imageUri={thumbnail}
            onPress={handleImageUpload}
            onRemoveImgPress={handleRemoveImage}
          />
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.saveButton,
              apiCreateCourseLoading && { opacity: 0.7 },
            ]}
            onPress={handleSave}
            disabled={apiCreateCourseLoading}
          >
            {apiCreateCourseLoading ? (
              <ActivityIndicator color={COLORS.white} size="small" />
            ) : (
              <Text style={styles.saveButtonText}>Save</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CreateCourseModal;
