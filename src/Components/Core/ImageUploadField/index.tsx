import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '@/Assets/Theme/colors';
import { ms } from '@/Assets/Theme/fontStyle';
import { THEME } from '@/Assets/Theme';
import Icon from '../Icons';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface ImageUploadFieldProps {
  label?: string;
  onPress?: () => void;
  error?: string;
  touched?: boolean;
  iconName?: string;
  buttonText?: string;
}

const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  onPress,
  error,
  touched,
  iconName = 'Upload', // Default icon
  buttonText = 'Upload',
}) => {
  return (
    <View style={styles.mainContainer}>
      {label && <Text style={styles.labelStyle}>{label}</Text>}

      <TouchableOpacity
        style={styles.uploadContainer}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.content}>
          {/* <Icon name={iconName} size={32} color={COLORS.white} style={styles.icon} /> */}
          <Icon name={iconName} size={32} color={COLORS.white} />
          <Text style={styles.buttonText}>{buttonText}</Text>
        </View>
      </TouchableOpacity>

      {touched && error ? (
        <Text style={styles.errorTxtStyle}>{error}</Text>
      ) : null}
    </View>
  );
};

export default ImageUploadField;

const styles = StyleSheet.create({
  mainContainer: {
    marginBottom: ms(18),
  },
  labelStyle: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.white,
    marginBottom: ms(8),
  },
  uploadContainer: {
    backgroundColor: '#1A1A1A',
    borderRadius: ms(8),
    borderWidth: 1,
    borderColor: '#333', // Darker border
    borderStyle: 'dashed',
    height: ms(120),
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  icon: {
    marginBottom: ms(8),
  },
  buttonText: {
    ...THEME.fontStyle.h4Bold,
    marginTop: ms(8),
  },
  errorTxtStyle: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.red,
    marginTop: ms(5),
  },
});
