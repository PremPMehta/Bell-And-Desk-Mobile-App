import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { AppImages } from '@/Assets/Images';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Formik } from 'formik';
import * as Yup from 'yup';

// COMMON INPUT
import TextInputField from '@/Components/Core/TextInputField';
import { useNavigation } from '@/Hooks/Utils/use-navigation';
import styles from './style';
import { COLORS } from '@/Assets/Theme/colors';
import PrimaryButton from '@/Components/Core/PrimaryButton';

const SignUp = () => {
  const navigation = useNavigation();

  // -----------------------------------
  // VALIDATION SCHEMA
  // -----------------------------------
  const SignUpSchema = Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords do not match')
      .required('Confirm password is required'),
  });

  // -----------------------------------
  // HANDLE SIGN IN
  // -----------------------------------
  const handleSignIn = () => {
    navigation.goBack();
  };

  // -----------------------------------
  // HANDLE TERMS OF USE
  // -----------------------------------
  const handleTerms = () => {
    navigation.navigate('TermsAndConditions');
  };

  // -----------------------------------
  // HANDLE PRIVACY POLICY
  // -----------------------------------
  const handlePrivacy = () => {
    navigation.navigate('PrivacyPolicy');
  };

  return (
    <ImageBackground
      source={AppImages.authBG}
      style={styles.imgBgStyle}
      resizeMode="cover"
    >
      <LinearGradient
        colors={[COLORS.grDark, COLORS.grMedium, COLORS.grDark]}
        style={styles.gradientStyle}
      >
        <KeyboardAwareScrollView
          enableOnAndroid
          extraScrollHeight={90}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.kbContentStyle}
        >
          <View style={styles.middileViewStyle}>
            {/* LOGO */}
            <Image
              source={AppImages.companyLogo}
              style={styles.logoStyle}
              resizeMode="contain"
            />

            <Text style={styles.subTxtStyle}>
              Create your community. Explore others.
            </Text>

            {/* --------------------------------------
                  FORM START
            --------------------------------------- */}
            <Formik
              initialValues={{
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                confirmPassword: '',
              }}
              validationSchema={SignUpSchema}
              onSubmit={values => {
                console.log('FORM =>', values);
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
                  {/* FIRST NAME */}
                  <TextInputField
                    label="First Name"
                    leftIcon="account"
                    value={values.firstName}
                    onChangeText={handleChange('firstName')}
                    onBlur={() => setFieldTouched('firstName')}
                    touched={touched.firstName}
                    error={errors.firstName}
                    rightIcon={undefined}
                  />

                  {/* LAST NAME */}
                  <TextInputField
                    label="Last Name"
                    leftIcon="account"
                    value={values.lastName}
                    onChangeText={handleChange('lastName')}
                    onBlur={() => setFieldTouched('lastName')}
                    touched={touched.lastName}
                    error={errors.lastName}
                    rightIcon={undefined}
                  />

                  {/* EMAIL */}
                  <TextInputField
                    label="Email"
                    leftIcon="email"
                    value={values.email}
                    onChangeText={handleChange('email')}
                    onBlur={() => setFieldTouched('email')}
                    touched={touched.email}
                    error={errors.email}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    rightIcon={undefined}
                  />

                  {/* PASSWORD */}
                  <TextInputField
                    label="Password"
                    leftIcon="lock"
                    secure
                    value={values.password}
                    onChangeText={handleChange('password')}
                    onBlur={() => setFieldTouched('password')}
                    touched={touched.password}
                    error={errors.password}
                    rightIcon={undefined}
                  />

                  {/* CONFIRM PASSWORD */}
                  <TextInputField
                    label="Confirm Password"
                    leftIcon="lock-check"
                    secure
                    value={values.confirmPassword}
                    onChangeText={handleChange('confirmPassword')}
                    onBlur={() => setFieldTouched('confirmPassword')}
                    touched={touched.confirmPassword}
                    error={errors.confirmPassword}
                    rightIcon={undefined}
                  />

                  {/* BUTTON */}
                  {/* <TouchableOpacity
                    onPress={handleSubmit}
                    style={styles.accBtnStyle}
                  >
                    <Text style={styles.accTxtStyle}>Create Account</Text>
                  </TouchableOpacity> */}
                  <PrimaryButton
                    title="Create Account"
                    onPress={handleSubmit}
                    loading={false}
                    buttonStyle={styles.accBtnStyle}
                    textStyle={styles.accTxtStyle}
                  />
                </>
              )}
            </Formik>

            {/* TERMS */}
            <View style={styles.termsContainer}>
              <Text style={styles.termsTxtStyle}>
                By clicking "Create Account", you agree to our{' '}
              </Text>

              <TouchableOpacity onPress={handleTerms}>
                <Text style={styles.termsClickTxtStyle}>
                  Terms and Conditions
                </Text>
              </TouchableOpacity>

              <Text style={styles.termsTxtStyle}> and </Text>

              <TouchableOpacity onPress={handlePrivacy}>
                <Text style={styles.termsClickTxtStyle}>Privacy Policy</Text>
              </TouchableOpacity>
            </View>

            {/* LOGIN LINK */}
            <View style={styles.alreadyContainer}>
              <Text style={styles.termsTxtStyle}>
                Already have an account?{' '}
              </Text>

              <TouchableOpacity onPress={handleSignIn}>
                <Text style={styles.termsClickTxtStyle}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </LinearGradient>
    </ImageBackground>
  );
};

export default SignUp;
