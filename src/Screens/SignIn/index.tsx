import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
} from 'react-native';
import { useNavigation } from '@/Hooks/Utils/use-navigation';
import { useRoute } from '@react-navigation/native';
import { useAtomValue } from 'jotai';
import { userTokenAtom } from '@/Jotai/Atoms';
import LinearGradient from 'react-native-linear-gradient';
import { AppImages } from '@/Assets/Images';
import TextInputField from '@/Components/Core/TextInputField';
import PrimaryButton from '@/Components/Core/PrimaryButton';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Formik } from 'formik';
import * as Yup from 'yup';
import styles from './style';
import { COLORS } from '@/Assets/Theme/colors';
import useUserApi from '@/Hooks/Apis/UserApis/use-user-api';

const SignIn = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { getUserUnifiedLogin, apiUnifiedLoginLoading } = useUserApi();
  const userToken = useAtomValue(userTokenAtom);

  // Redirect params (if coming from requireAuth)
  const redirectTo = route.params?.redirectTo;
  const redirectParams = route.params?.redirectParams;

  // FORM VALIDATION SCHEMA
  const SignInSchema = Yup.object().shape({
    email: Yup.string()
      .email('Enter a valid email')
      .required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  // ✅ Handle redirect after successful login
  useEffect(() => {
    if (!userToken) return;

    // If user was redirected from a protected screen
    if (redirectTo) {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'UserDrawer',
            state: {
              routes: [
                {
                  name: redirectTo,
                  params: redirectParams,
                },
              ],
            },
          },
        ],
      });
    } else {
      // Default after login → go to Home
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'UserDrawer',
            state: {
              routes: [{ name: 'Home' }],
            },
          },
        ],
      });
    }
  }, [userToken]);

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

            {/* TITLE */}
            <View style={styles.wlcmHeaderViewStyle}>
              <Text style={styles.wlcmTxtStyle}>Welcome Back</Text>
              <Text style={styles.subTxtStyle}>
                Sign in to access your communities.
              </Text>
            </View>

            {/* FORM */}
            <Formik
              initialValues={{
                email: 'baqy@mailinator.com', //  admin@cryptomanji.com
                password: 'Pa$$w0rd!', //  Password@123
              }}
              validationSchema={SignInSchema}
              onSubmit={async values => {
                console.log('SIGN IN DATA:', values);
                const response = await getUserUnifiedLogin(values);
                console.log('🚀 ~ SignIn ~ response:', response);
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

                  {/* PASSWORD FIELD */}
                  <TextInputField
                    label="Password"
                    leftIcon="lock"
                    secure
                    value={values.password}
                    onChangeText={handleChange('password')}
                    onBlur={() => setFieldTouched('password')}
                    error={errors.password}
                    touched={touched.password}
                    rightIcon={undefined}
                  />

                  {/* SIGN IN BUTTON */}
                  <PrimaryButton
                    title="Sign In"
                    onPress={handleSubmit}
                    loading={apiUnifiedLoginLoading}
                    buttonStyle={styles.signInBtnStyle}
                    textStyle={styles.signInTxtStyle}
                  />
                </View>
              )}
            </Formik>

            {/* FORGOT PASSWORD */}
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ForgotPassword');
              }}
              style={styles.commonContainer}
            >
              <Text style={styles.frgtTxtStyle}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* SIGN UP LINK */}
            <View style={styles.commonContainer}>
              <Text style={styles.accTxtStyle}>
                Don’t have an account?{' '}
                <Text
                  style={styles.signUpTxtStyle}
                  onPress={() => navigation.navigate('SignUp')}
                >
                  Sign Up
                </Text>
              </Text>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </LinearGradient>
    </ImageBackground>
  );
};

export default SignIn;
