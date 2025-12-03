import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';
import { COLORS } from '@/Assets/Theme/colors';
import { ms, sc } from '@/Assets/Theme/fontStyle';
import { THEME } from '@/Assets/Theme';

interface TextInputFieldProps {
  label?: string;
  leftIcon?: string;
  rightIcon?: string;
  secure?: boolean;
  error?: string;
  touched?: boolean;
  onChangeText?: (text: string) => void;
  value?: string;
  [key: string]: any;
  mediaHelpText?: string;
}

const TextInputField: React.FC<TextInputFieldProps> = ({
  label,
  leftIcon,
  rightIcon,
  secure = false,
  error,
  touched,
  onChangeText,
  value,
  mediaHelpText,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = secure;

  return (
    <View style={styles.mainContainer}>
      <TextInput
        mode="outlined"
        label={label}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={isPassword && !showPassword}
        outlineColor={COLORS.outlineGrey}
        textColor={COLORS.white}
        theme={{
          colors: {
            primary: COLORS.white,
            background: COLORS.black,
            onSurfaceVariant: COLORS.outlineGrey,
          },
        }}
        style={styles.txtInputStyle}
        left={
          leftIcon ? (
            <TextInput.Icon icon={leftIcon} color={COLORS.outlineGrey} />
          ) : null
        }
        right={
          isPassword ? (
            <TextInput.Icon
              icon={showPassword ? 'eye' : 'eye-off'}
              color={COLORS.outlineGrey}
              onPress={() => setShowPassword(!showPassword)}
            />
          ) : rightIcon ? (
            <TextInput.Icon icon={rightIcon} color={COLORS.outlineGrey} />
          ) : null
        }
        {...props}
      />

      {/* ERROR MESSAGE */}
      {touched && error ? (
        <Text style={styles.errorTxtStyle}>{error}</Text>
      ) : null}

      {mediaHelpText && (
        <Text style={styles.mediaHelpText}>
          {mediaHelpText}
          {/* {mediaHelpText} e.g., https://instagram.com/yourcommunity */}
        </Text>
      )}
    </View>
  );
};

export default TextInputField;

const styles = StyleSheet.create({
  mainContainer: {
    marginBottom: ms(18),
  },
  txtInputStyle: {
    backgroundColor: 'transparent',
  },
  errorTxtStyle: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.red,
    marginTop: ms(5),
  },
  mediaHelpText: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.outlineGrey,
    marginTop: ms(5),
  },
});
