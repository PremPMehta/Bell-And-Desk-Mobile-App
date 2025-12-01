import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-paper';
import { COLORS } from '@/Assets/Theme/colors';
import { ms } from '@/Assets/Theme/fontStyle';
import { THEME } from '@/Assets/Theme';

interface DropdownFieldProps {
  label?: string;
  value?: string;
  placeholder?: string;
  onPress?: () => void;
  error?: string;
  touched?: boolean;
  [key: string]: any; // Allow passing other props like theme, style, etc.
}

const DropdownField: React.FC<DropdownFieldProps> = ({
  label,
  value,
  placeholder,
  onPress,
  error,
  touched,
  ...props
}) => {
  return (
    <View style={styles.mainContainer}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <View pointerEvents="none">
          <TextInput
            mode="outlined"
            label={label}
            value={value}
            placeholder={placeholder}
            editable={false}
            theme={{
              colors: {
                background: '#1A1A1A',
                text: COLORS.white,
                placeholder: COLORS.outlineGrey,
              },
            }}
            right={
              <TextInput.Icon icon="chevron-down" color={COLORS.outlineGrey} />
            }
            {...props}
          />
        </View>
      </TouchableOpacity>

      {touched && error ? (
        <Text style={styles.errorTxtStyle}>{error}</Text>
      ) : null}
    </View>
  );
};

export default DropdownField;

const styles = StyleSheet.create({
  mainContainer: {
    marginBottom: ms(18),
  },
  errorTxtStyle: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.red,
    marginTop: ms(5),
  },
});
