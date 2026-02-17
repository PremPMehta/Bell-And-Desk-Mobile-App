import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useAtom } from 'jotai';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { launchImageLibrary } from 'react-native-image-picker';
import { userAtom } from '@/Jotai/Atoms';
import Icon from '@/Components/Core/Icons';
import TextInputField from '@/Components/Core/TextInputField';
import { COLORS } from '@/Assets/Theme/colors';
import styles from './style';
import useUserApi from '@/Hooks/Apis/UserApis/use-user-api';

const Profile = () => {
  const { updateUserProfile, apiUpdateUserProfileLoading } = useUserApi();
  const [user, setUser]: [any, any] = useAtom(userAtom);
  console.log('🚀 ~ Profile ~ user:', user);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedImage, setSelectedImage] = useState<any>(null);

  // Fallback data for demonstration
  const initialValues = {
    firstName: user?.firstName || user?.name?.split(' ')[0] || 'Crypto',
    lastName: user?.lastName || user?.name?.split(' ')[1] || 'Manji',
    email: user?.email || 'admin@cryptomanji.com',
    username: user?.username || 'cryptomanji',
    profilePicture: user?.profilePicture || null,
  };

  const ProfileSchema = Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    username: Yup.string()
      .min(3, 'Username too short')
      .max(30, 'Username too long')
      .matches(/^[a-z0-p_\-]+$/, 'Invalid characters')
      .required('Username is required'),
  });

  const handleUpdate = async (values: any) => {
    const formData = new FormData();
    formData.append('firstName', values.firstName);
    formData.append('lastName', values.lastName);
    formData.append('username', values.username);

    if (selectedImage) {
      formData.append('profilePicture', {
        uri:
          Platform.OS === 'android'
            ? selectedImage.uri
            : selectedImage.uri.replace('file://', ''),
        type: selectedImage.type || 'image/jpeg',
        name: selectedImage.fileName || 'profile.jpg',
      });
    }

    const response = await updateUserProfile(formData);
    if (response) {
      setUser({ ...user, ...values, profilePicture: values.profilePicture });
      setIsEdit(false);
    }
  };

  const pickImage = (setFieldValue: any) => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 1,
      },
      response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          const source = response.assets[0];
          setSelectedImage(source);
          setFieldValue('profilePicture', source.uri);
        }
      },
    );
  };

  return (
    <View style={styles.container}>
      <Formik
        initialValues={initialValues}
        validationSchema={ProfileSchema}
        onSubmit={handleUpdate}
        enableReinitialize
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          setFieldValue,
          resetForm,
        }) => {
          console.log('🚀 ~ Profile ~ values:', values);
          return (
            <KeyboardAwareScrollView
              style={styles.container}
              contentContainerStyle={styles.innerContainer}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.card}>
                {/* Header Row */}
                <View style={styles.headerRow}>
                  {!isEdit ? (
                    <TouchableOpacity
                      style={styles.editIconContainer}
                      onPress={() => setIsEdit(true)}
                    >
                      <Icon name="Pencil" size={20} color={COLORS.white} />
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.topActions}>
                      {/* <TouchableOpacity
                        style={styles.saveIconContainer}
                        onPress={() => handleSubmit()}
                      >
                        <Icon name="Save" size={20} color={COLORS.white} />
                      </TouchableOpacity> */}
                      <TouchableOpacity
                        style={styles.closeIconContainer}
                        onPress={() => {
                          setIsEdit(false);
                          resetForm();
                        }}
                      >
                        <Icon name="X" size={20} color={COLORS.white} />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>

                {/* Avatar and Name */}
                <View style={styles.avatarContainer}>
                  <View style={styles.avatarWrapper}>
                    {values.profilePicture?.url ? (
                      <Image
                        source={{ uri: values.profilePicture?.url }}
                        style={styles.avatar}
                      />
                    ) : (
                      <View style={[styles.avatar, styles.withoutAvatar]}>
                        <Text style={styles.withoutAvatarText}>
                          {`${values.firstName?.charAt(0) || ''}${
                            values.lastName?.charAt(0) || ''
                          }`.toUpperCase()}
                        </Text>
                      </View>
                    )}
                    {isEdit && (
                      <TouchableOpacity
                        style={styles.cameraOverlay}
                        onPress={() => pickImage(setFieldValue)}
                      >
                        <Icon name="Camera" size={16} color={COLORS.white} />
                      </TouchableOpacity>
                    )}
                  </View>
                  <Text style={styles.userName}>
                    {isEdit
                      ? `${values.firstName} ${values.lastName}`
                      : initialValues.firstName + ' ' + initialValues.lastName}
                  </Text>
                </View>

                {/* Fields */}
                {isEdit ? (
                  <>
                    <TextInputField
                      label="First Name"
                      leftIcon="account"
                      value={values.firstName}
                      onChangeText={handleChange('firstName')}
                      onBlur={handleBlur('firstName')}
                      error={errors.firstName as string}
                      touched={touched.firstName as boolean}
                    />
                    <TextInputField
                      label="Last Name"
                      leftIcon="account"
                      value={values.lastName}
                      onChangeText={handleChange('lastName')}
                      onBlur={handleBlur('lastName')}
                      error={errors.lastName as string}
                      touched={touched.lastName as boolean}
                    />
                    <TextInputField
                      label="Email"
                      leftIcon="email"
                      value={values.email}
                      editable={false}
                      mediaHelpText="Email cannot be changed"
                    />
                    <TextInputField
                      label="Username"
                      leftIcon="account"
                      value={values.username}
                      onChangeText={handleChange('username')}
                      onBlur={handleBlur('username')}
                      error={errors.username as string}
                      touched={touched.username as boolean}
                      mediaHelpText="Username can only contain lowercase letters, numbers, hyphens, and underscores (3-30 characters)"
                    />
                  </>
                ) : (
                  <>
                    {/* View Mode Fields - Using TextInputField but simplified or styled customly if preferred */}
                    {/* The user wants to use the SignIn screen's component, so I'll use TextInputField even in view mode but possibly disabled */}
                    <TextInputField
                      label="Email"
                      leftIcon="email"
                      value={values.email}
                      editable={false}
                    />
                    <Text
                      style={[
                        styles.helpText,
                        { marginTop: -10, marginBottom: 15 },
                      ]}
                    >
                      Email cannot be changed
                    </Text>

                    <TextInputField
                      label="Username"
                      leftIcon="account"
                      value={values.username}
                      editable={false}
                    />
                  </>
                )}

                {/* Bottom Buttons in Edit Mode */}
                {isEdit && (
                  <View style={styles.bottomButtonsRow}>
                    <TouchableOpacity
                      style={styles.updateButton}
                      onPress={() => handleSubmit()}
                      disabled={apiUpdateUserProfileLoading}
                    >
                      {apiUpdateUserProfileLoading ? (
                        <ActivityIndicator size="small" color={COLORS.white} />
                      ) : (
                        <Icon name="Save" size={18} color={COLORS.white} />
                      )}
                      <Text style={styles.buttonText}>
                        {apiUpdateUserProfileLoading ? 'Updating' : 'Update'}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={() => {
                        setIsEdit(false);
                        resetForm();
                      }}
                    >
                      <Icon name="CircleX" size={18} color={COLORS.white} />
                      <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </KeyboardAwareScrollView>
          );
        }}
      </Formik>
    </View>
  );
};

export default Profile;
