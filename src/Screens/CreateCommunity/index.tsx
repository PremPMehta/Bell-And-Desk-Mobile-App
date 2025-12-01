import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
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

const CreateCommunity = () => {
  const navigation = useNavigation();

  const CommunitySchema = Yup.object().shape({
    name: Yup.string().required('Community name is required'),
    slug: Yup.string().required('URL slug is required'),
    description: Yup.string().required('Description is required'),
    category: Yup.string().required('Category is required'),
  });

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

        <Formik
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
          }) => (
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
                    background: '#1A1A1A',
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
                    background: '#1A1A1A',
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
                style={[
                  styles.inputStyle,
                  {
                    height: 100,
                  },
                ]}
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
              />

              {/* Welcome Message */}
              <RichTextEditor
                label="Welcome Message (Optional)"
                placeholder="Create a personalized welcome message..."
                value={values.welcomeMessage}
                onChangeText={handleChange('welcomeMessage')}
              />

              {/* Category */}
              <DropdownField
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
                    background: '#1A1A1A',
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
                    background: '#1A1A1A',
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
                    background: '#1A1A1A',
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
                    background: '#1A1A1A',
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
                    background: '#1A1A1A',
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
                    background: '#1A1A1A',
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
                label="Community Logo"
                buttonText="Upload Logo"
                onPress={() => console.log('Upload Logo')}
              />

              <ImageUploadField
                label="Community Banner"
                buttonText="Upload Banner"
                onPress={() => console.log('Upload Banner')}
              />

              {/* Media */}
              <Text style={styles.sectionTitle}>Community Media</Text>
              <Text style={styles.mediaHelpText}>
                Add images and videos to showcase your community. At least one
                media item (image, video, or link) is required.
              </Text>

              <TouchableOpacity style={styles.addMediaBtn} onPress={() => {}}>
                <Icon name="Plus" size={22} color={COLORS.white} />
                <Text style={styles.addMediaBtnText}>Add Media</Text>
              </TouchableOpacity>

              {/* Submit Button */}
              <PrimaryButton
                title="Create Community"
                onPress={handleSubmit}
                buttonStyle={styles.createBtnStyle}
                textStyle={styles.createBtnText}
                loading={false}
              />
            </>
          )}
        </Formik>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default CreateCommunity;
