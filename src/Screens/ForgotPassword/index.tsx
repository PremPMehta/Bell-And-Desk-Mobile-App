import React from 'react';
import { View, Text, Image, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { AppImages } from '@/Assets/Images';
import { useNavigation } from '@/Hooks/Utils/use-navigation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Formik } from 'formik';
import * as Yup from 'yup';
import TextInputField from '@/Components/Core/TextInputField';
import styles from './style';
import { COLORS } from '@/Assets/Theme/colors';
import PrimaryButton from '@/Components/Core/PrimaryButton';
import useUserApi from '@/Hooks/Apis/UserApis/use-user-api';

const { height: screenHeight } = Dimensions.get('screen');
const ForgotPassword = () => {
  const navigation = useNavigation();
  const { getUserForgotPassword, apiForgotPasswordLoading } = useUserApi();

  // FORM VALIDATION SCHEMA
  const ForgotSchema = Yup.object().shape({
    email: Yup.string()
      .email('Enter a valid email')
      .required('Email is required'),
  });

  return (
    <View style={styles.imgBgStyle}>
      <Image
        source={AppImages.authBG}
        style={[styles.backgroundImage, { height: screenHeight }]}
        resizeMode="cover"
      />
      <LinearGradient
        colors={[COLORS.grDark, COLORS.grMedium, COLORS.grDark]}
        style={styles.gradientStyle}
      >
        <KeyboardAwareScrollView
          enableOnAndroid
          extraScrollHeight={0}
          enableAutomaticScroll={true}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.kbContentStyle}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.middileViewStyle}>
            {/* LOGO */}
            <Image
              source={AppImages.companyLogo}
              style={styles.logoStyle}
              resizeMode="contain"
            />

            {/* TITLE */}
            <View style={styles.wlcmHeaderViewStyle}>
              <Text style={styles.wlcmTxtStyle}>Reset Password</Text>
              <Text style={styles.subTxtStyle}>
                Enter your email to receive a reset link.
              </Text>
            </View>

            {/* FORM */}
            <Formik
              initialValues={{ email: '' }}
              validationSchema={ForgotSchema}
              onSubmit={async values => {
                console.log('FORGOT FORM DATA:', values);
                const res = await getUserForgotPassword(values);
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
                <View>
                  {/* EMAIL FIELD */}
                  <TextInputField
                    label="Email"
                    leftIcon="email"
                    value={values.email}
                    onChangeText={handleChange('email')}
                    onBlur={() => setFieldTouched('email')}
                    error={errors.email}
                    touched={touched.email}
                    rightIcon={undefined}
                  />

                  {/* RESET PASSWORD BUTTON */}
                  <PrimaryButton
                    title="Send Reset Link"
                    onPress={handleSubmit}
                    loading={apiForgotPasswordLoading}
                    buttonStyle={styles.signInBtnStyle}
                    textStyle={styles.signInTxtStyle}
                  />
                </View>
              )}
            </Formik>

            {/* SIGN UP LINK */}
            <View style={styles.commonContainer}>
              <Text style={styles.accTxtStyle}>
                Remember your password?{' '}
                <Text
                  style={styles.signUpTxtStyle}
                  onPress={() => navigation.goBack()}
                >
                  Sign In
                </Text>
              </Text>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </LinearGradient>
    </View>
  );
};

export default ForgotPassword;
