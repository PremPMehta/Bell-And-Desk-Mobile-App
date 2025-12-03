import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { launchImageLibrary, Asset } from 'react-native-image-picker';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import TextInputField from '@/Components/Core/TextInputField';
import RichTextEditor from '@/Components/Core/RichTextEditor';
import DropdownField from '@/Components/Core/DropdownField';
import ImageUploadField from '@/Components/Core/ImageUploadField';
import PrimaryButton from '@/Components/Core/PrimaryButton';
import { COLORS } from '@/Assets/Theme/colors';
import styles from './style';
import { useNavigation } from '@/Hooks/Utils/use-navigation';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '@/Components/Core/Icons';
import { useAtom } from 'jotai';
import { addMediaVisibleAtom, onMediaAddedAtom } from '@/Jotai/Atoms';
import CommonListModal from '@/Components/Generic/Modals/CommonListModal';
import { categoryList } from '@/Constants/customData';

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
  media: any[];
}

const CommunitySchema = Yup.object().shape({
  name: Yup.string().required('Community name is required'),
  slug: Yup.string().required('URL slug is required'),
  description: Yup.string().required('Description is required'),
  category: Yup.string().required('Category is required'),
  logo: Yup.mixed().required('Community logo is required'),
  banner: Yup.mixed().required('Community banner is required'),
  media: Yup.array()
    .min(1, 'At least one media item is required')
    .required('Community media is required'),
});

const CreateCommunity = () => {
  const navigation = useNavigation();

  const [, setIsVisibleAddMediaModal] = useAtom(addMediaVisibleAtom);
  const [, setOnMediaAdded] = useAtom(onMediaAddedAtom);
  const [mediaItems, setMediaItems] = useState<any[]>([]);

  const handleAddMedia = () => {
    console.log('Add Media');
    setOnMediaAdded(() => (media: any) => {
      console.log('Media Added:', media);
      setMediaItems(prev => [...prev, media]);
    });
    setIsVisibleAddMediaModal(true);
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          {/* <Icon name="menu" size={24} color={COLORS.white} /> */}
          <Icon name="Menu" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bell n Desk</Text>
        <TouchableOpacity>
          <Icon name="CircleUserRound" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <KeyboardAwareScrollView
        enableOnAndroid
        extraScrollHeight={90}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.contentContainer}
      >
        <Text style={styles.title}>Create Your Community</Text>
        <Text style={styles.subtitle}>
          Step 1 of 2: Reserve your URL and choose your plan.
        </Text>

        <Formik<CommunityFormValues>
          initialValues={{
            name: '',
            slug: '',
            description: '',
            welcomeMessage: '',
            category: '',
            instagram: '',
            telegram: '',
            whatsapp: '',
            youtube: '',
            linkedin: '',
            external: '',
            logo: null,
            banner: null,
            media: [],
          }}
          validationSchema={CommunitySchema}
          onSubmit={values => {
            console.log('Community Values =>', values);
          }}
        >
          {({
            handleChange,
            handleSubmit,
            values,
            errors,
            touched,
            setFieldTouched,
            setFieldValue,
            isValid,
          }) => {
            const handleImageSelection = (fieldName: 'logo' | 'banner') => {
              launchImageLibrary(
                {
                  mediaType: 'photo',
                  quality: 1,
                  selectionLimit: 1,
                },
                response => {
                  if (response.didCancel) {
                    console.log('User cancelled image picker');
                    setFieldTouched(fieldName, true);
                  } else if (response.errorCode) {
                    console.log('ImagePicker Error: ', response.errorMessage);
                  } else if (response.assets && response.assets.length > 0) {
                    const selectedImage = response.assets[0];
                    setFieldValue(fieldName, selectedImage);
                    // setFieldTouched(fieldName, true); // Optional: setFieldValue usually triggers validation
                  }
                },
              );
            };

            // Sync media items with Formik
            React.useEffect(() => {
              setFieldValue('media', mediaItems);
            }, [mediaItems]);

            return (
              <>
                {/* Community Name */}
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

                {/* Community URL Slug */}
                <TextInputField
                  label="Community URL Slug"
                  placeholder="Enter community name"
                  leftIcon="newspaper-variant-outline"
                  value={values.slug}
                  onChangeText={handleChange('slug')}
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

                {/* Community Description */}
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

                {/* Welcome Message */}
                <RichTextEditor
                  label="Welcome Message (Optional)"
                  placeholder="Create a personalized welcome message..."
                  value={values.welcomeMessage}
                  onChangeText={handleChange('welcomeMessage')}
                />

                {/* Category */}
                {/* <DropdownField
                label="Category"
                placeholder="Enter category"
                value={values.category}
                onPress={() => {
                  // Handle dropdown open
                  handleChange('category')('Technology'); // Mock selection
                }}
                touched={touched.category}
                error={errors.category}
                style={styles.inputStyle}
                theme={{
                  colors: {
                    background: '#1A1A1A',
                    text: COLORS.white,
                    placeholder: COLORS.outlineGrey,
                  },
                }}
                textColor={COLORS.white}
                outlineColor={COLORS.outlineGrey}
                activeOutlineColor={COLORS.white}
              /> */}
                <CommonListModal
                  textInputLabel={'Category'}
                  placeholder={'Select Category'}
                  textInputValue={values.category}
                  touched={touched.category}
                  error={errors.category}
                  type={''}
                  dropDownData={categoryList}
                  dropDownSelectedValue={''}
                  onDropDownSelect={() => { }}
                />

                {/* Social Links */}
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

                {/* Uploads */}
                <ImageUploadField
                  type="community"
                  label="Community Logo"
                  buttonText="Upload Logo"
                  onPress={() => handleImageSelection('logo')}
                  imageUri={values.logo?.uri || null}
                  touched={touched.logo}
                  error={errors.logo as string}
                />

                <ImageUploadField
                  type="community"
                  label="Community Banner"
                  buttonText="Upload Banner"
                  onPress={() => handleImageSelection('banner')}
                  imageUri={values.banner?.uri || null}
                  touched={touched.banner}
                  error={errors.banner as string}
                />

                {/* Media */}
                <Text style={styles.sectionTitle}>Community Media</Text>
                <Text style={styles.mediaHelpText}>
                  Add images and videos to showcase your community. At least one
                  media item (image, video, or link) is required.
                </Text>

                <TouchableOpacity
                  style={styles.addMediaBtn}
                  onPress={handleAddMedia}
                >
                  <Icon name="Plus" size={22} color={COLORS.white} />
                  <Text style={styles.addMediaBtnText}>Add Media</Text>
                </TouchableOpacity>

                {touched.media && errors.media ? (
                  <Text style={styles.errorText}>{errors.media as string}</Text>
                ) : null}

                {/* Submit Button */}
                <PrimaryButton
                  title="Create Community"
                  onPress={handleSubmit}
                  buttonStyle={[
                    styles.createBtnStyle,
                    !isValid && styles.disabledButton,
                  ]}
                  textStyle={styles.createBtnText}
                  loading={false}
                  disabled={!isValid}
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
