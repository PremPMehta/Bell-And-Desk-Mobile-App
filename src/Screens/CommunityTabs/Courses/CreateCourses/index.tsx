import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './style';
import Icon from '@/Components/Core/Icons';
import { COLORS } from '@/Assets/Theme/colors';
import { useNavigation } from '@/Hooks/Utils/use-navigation';
import TextInputField from '@/Components/Core/TextInputField';
import ImageUploadField from '@/Components/Core/ImageUploadField';
import CommonListModal from '@/Components/Generic/Modals/CommonListModal';
import { STEPS } from '@/Constants/customData';
import { launchImageLibrary } from 'react-native-image-picker';
import AddChapterModal from '@/Components/Generic/Modals/AddChapterModal';
import AddLessonModal, { VideoSource } from '@/Components/Generic/Modals/AddLessonModal';

const TARGET_AUDIENCE_DATA = [
  { id: '1', value: 'Beginner' },
  { id: '2', value: 'Intermediate' },
  { id: '3', value: 'Advanced' },
];

const CATEGORY_DATA = [
  { id: '1', value: 'Technology' },
  { id: '2', value: 'Business' },
  { id: '3', value: 'Art' },
];

const COURSE_TYPE_DATA = [
  { id: '1', value: 'Free' },
  { id: '2', value: 'Paid' },
];

const CreateCourses = () => {
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(1);
  const [isAddChapterModalVisible, setIsAddChapterModalVisible] =
    useState(false);
  const [isAddLessonModalVisible, setIsAddLessonModalVisible] = useState(false);

  // Form State
  const [title, setTitle] = useState('test');
  const [description, setDescription] = useState('test');
  const [targetAudience, setTargetAudience] = useState('test');
  const [category, setCategory] = useState('test');
  const [courseType, setCourseType] = useState('');
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  // Error State
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Chapter State
  const [chapters, setChapters] = useState<any[]>([]);
  const [modalChapterTitle, setModalChapterTitle] = useState('');
  const [modalChapterDescription, setModalChapterDescription] = useState('');
  const [modalChapterError, setModalChapterError] = useState('');
  const [modalChapterDescriptionError, setModalChapterDescriptionError] =
    useState('');

  // Lesson State
  const [modalLessonVideoSource, setModalLessonVideoSource] = useState<VideoSource>('none');
  const [modalLessonVideoLink, setModalLessonVideoLink] = useState('');

  const validateStep1 = () => {
    const newErrors: { [key: string]: string } = {};
    if (!title.trim()) newErrors.title = 'Course title is required';
    if (!description.trim())
      newErrors.description = 'Course description is required';
    if (!targetAudience)
      newErrors.targetAudience = 'Target audience is required';
    if (!category) newErrors.category = 'Category is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (validateStep1()) {
        setCurrentStep(currentStep + 1);
      }
    } else if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigation.goBack();
    }
  };

  const handleImageUpload = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1,
      });

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

  const renderStepper = () => {
    return (
      <View style={styles.stepperContainer}>
        {STEPS.map((step, index) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;

          return (
            <View key={step.id} style={styles.stepItem}>
              <View
                style={[
                  styles.stepCircle,
                  isActive && styles.activeStepCircle,
                  isCompleted && styles.completedStepCircle,
                ]}
              >
                {isCompleted ? (
                  <Icon name="CircleCheck" size={15} color={COLORS.white} />
                ) : (
                  <Text
                    style={[
                      styles.stepNumber,
                      (isActive || isCompleted) && styles.activeStepNumber,
                    ]}
                  >
                    {step.id}
                  </Text>
                )}
              </View>
              <Text
                style={[
                  styles.stepLabel,
                  (isActive || isCompleted) && styles.activeStepLabel,
                ]}
              >
                {step.title}
              </Text>
            </View>
          );
        })}
      </View>
    );
  };

  const handleAddChapter = () => {
    setIsAddChapterModalVisible(true);
  };

  const handleAddChapterCancel = () => {
    setIsAddChapterModalVisible(false);
    setModalChapterTitle('');
    setModalChapterDescription('');
    setModalChapterError('');
    setModalChapterDescriptionError('');
  };

  const handleAddLessonCancel = () => {
    setIsAddLessonModalVisible(false);
    setModalChapterTitle('');
    setModalChapterDescription('');
    setModalChapterError('');
    setModalChapterDescriptionError('');
    setModalLessonVideoSource('none');
    setModalLessonVideoLink('');
  };

  const handleAddChapterSubmit = () => {
    let isValid = true;
    if (!modalChapterTitle.trim()) {
      setModalChapterError('Chapter title is required');
      isValid = false;
    }
    if (!modalChapterDescription.trim()) {
      setModalChapterDescriptionError('Chapter description is required');
      isValid = false;
    }

    if (isValid) {
      const newChapter = {
        id: Date.now().toString(),
        title: modalChapterTitle,
        description: modalChapterDescription,
        videos: [], // Placeholder for videos
      };
      setChapters([...chapters, newChapter]);
      handleAddChapterCancel();
    }
  };

  const handleAddLesson = () => {
    setIsAddLessonModalVisible(true);
  };

  const handleDeleteChapter = (id: string) => {
    setChapters(chapters.filter(chapter => chapter.id !== id));
  };

  const renderChapterItem = (chapter: any, index: number) => {
    return (
      <View key={chapter.id} style={styles.chapterContainer}>
        <View style={styles.chapterHeader}>
          <Text style={styles.chapterTitleText}>Chapter {index + 1}</Text>
          <View style={styles.chapterActionButtons}>
            <TouchableOpacity style={styles.iconButton}>
              <Icon name="Pencil" size={16} color={COLORS.white} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => handleDeleteChapter(chapter.id)}
            >
              <Icon name="Trash2" size={16} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.chapterSubtitle}>{chapter.title}</Text>
        <Text style={styles.chapterDescriptionText}>{chapter.description}</Text>

        <View style={styles.videoSection}>
          <View style={styles.videoListHeader}>
            <Text style={styles.videoSectionTitle}>Video List</Text>
            <TouchableOpacity
              style={styles.addVideoButton}
              onPress={handleAddLesson}
            >
              <Icon name="CirclePlus" size={14} color={COLORS.white} />
              <Text style={styles.addVideoText}>Add Lesson</Text>
            </TouchableOpacity>
          </View>

          {/* Placeholder for video list - currently empty as per requirement to just show structure */}
          {/* You can add dummy videos here if needed to match the screenshot exactly */}
          <View style={styles.videoItem}>
            <View style={styles.videoInfo}>
              <Text style={styles.videoTitle}>1. Corporis et quasi co</Text>
              <Text style={styles.videoSubtitle}>youtube video</Text>
            </View>
            <View style={styles.chapterActionButtons}>
              <TouchableOpacity style={styles.iconButton}>
                <Icon name="Pencil" size={16} color={COLORS.white} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Icon name="Trash2" size={16} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={[styles.videoItem, { borderBottomWidth: 0 }]}>
            <View style={styles.videoInfo}>
              <Text style={styles.videoTitle}>2. Corporis et quasi co</Text>
              <Text style={styles.videoSubtitle}>youtube video</Text>
            </View>
            <View style={styles.chapterActionButtons}>
              <TouchableOpacity style={styles.iconButton}>
                <Icon name="Pencil" size={16} color={COLORS.white} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Icon name="Trash2" size={16} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="ChevronLeft" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ marginRight: 8 }}>
            <Icon name="ShieldCheck" size={24} color={COLORS.primary} />
          </View>
          <View>
            <Text style={styles.headerTitle}>CryptoManji Academy</Text>
            <Text style={{ color: COLORS.outlineGrey, fontSize: 12 }}>
              Create Course
            </Text>
          </View>
        </View>
        <TouchableOpacity>
          <Icon name="CircleUserRound" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* Stepper */}
      {renderStepper()}

      {/* Content */}
      <ScrollView style={styles.contentContainer}>
        {currentStep === 1 && (
          <>
            <View style={styles.sectionContainer}>
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
                if (errors.description)
                  setErrors({ ...errors, description: '' });
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
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <View style={{ flex: 0.48 }}>
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
              <View style={{ flex: 0.48 }}>
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
              error={''}
              touched={false}
              type="dropdown"
              dropDownData={COURSE_TYPE_DATA}
              dropDownSelectedValue={courseType}
              onDropDownSelect={item => setCourseType(item.value)}
            />
            <ImageUploadField
              label="Course Thumbnail"
              buttonText="Upload Thumbnail"
              imageUri={thumbnail}
              onPress={handleImageUpload}
              onRemoveImgPress={handleRemoveImage}
            />
          </>
        )}
        {currentStep === 2 && (
          <>
            <View style={styles.courseTitleContainer}>
              <Text style={styles.courseTitle}>Course Structure</Text>
              <TouchableOpacity
                style={styles.addChapter}
                onPress={handleAddChapter}
              >
                <Icon name="CirclePlus" size={16} color={COLORS.white} />
                <Text style={styles.addChapterText}>Add Chapter</Text>
              </TouchableOpacity>
            </View>

            {chapters.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No chapters added yet</Text>
                <Text style={styles.emptyDescription}>
                  Start by adding your first chapter to organize your course
                  content
                </Text>
              </View>
            ) : (
              <View style={{ marginTop: 20 }}>
                {chapters.map((chapter, index) =>
                  renderChapterItem(chapter, index),
                )}
              </View>
            )}

            <AddChapterModal
              isModalVisible={isAddChapterModalVisible}
              headerLabel="Add New Chapter"
              onHandleCancel={handleAddChapterCancel}
              chapterTitle={modalChapterTitle}
              onChapterTitleChange={text => {
                setModalChapterTitle(text);
                if (modalChapterError) setModalChapterError('');
              }}
              chapterError={modalChapterError}
              chapterDescription={modalChapterDescription}
              onChapterDescriptionChange={text => {
                setModalChapterDescription(text);
                if (modalChapterDescriptionError)
                  setModalChapterDescriptionError('');
              }}
              chapterDescriptionError={modalChapterDescriptionError}
              onAddChapter={handleAddChapterSubmit}
            />
            <AddLessonModal
              isModalVisible={isAddLessonModalVisible}
              headerLabel="Add Lesson"
              onHandleCancel={handleAddLessonCancel}
              lessonTitle={modalChapterTitle}
              onLessonTitleChange={text => {
                setModalChapterTitle(text);
                if (modalChapterError) setModalChapterError('');
              }}
              lessonError={modalChapterError}
              lessonDescription={modalChapterDescription}
              onLessonDescriptionChange={text => {
                setModalChapterDescription(text);
                if (modalChapterDescriptionError)
                  setModalChapterDescriptionError('');
              }}
              lessonDescriptionError={modalChapterDescriptionError}

              lessonContentValue="" // Placeholder
              onLessonContentChange={() => { }} // Placeholder

              videoSource={modalLessonVideoSource}
              onVideoSourceChange={setModalLessonVideoSource}
              videoLink={modalLessonVideoLink}
              onVideoLinkChange={setModalLessonVideoLink}

              onAddLesson={handleAddChapterSubmit}
            />
          </>
        )}
        {currentStep === 3 && (
          <View style={{ alignItems: 'center', marginTop: 50 }}>
            <Text style={{ color: COLORS.white }}>Review & Publish Step</Text>
          </View>
        )}
      </ScrollView>

      {/* Footer */}
      <View style={currentStep !== 1 ? styles.footer : styles.stepOnefooter}>
        {currentStep !== 1 && (
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Icon name="ChevronLeft" size={20} color={COLORS.white} />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Next</Text>
          <Icon name="ChevronRight" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CreateCourses;
