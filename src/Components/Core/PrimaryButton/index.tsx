import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { COLORS } from '@/Assets/Theme/colors';

const PrimaryButton = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  buttonStyle,
  textStyle,
}) => {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      style={[
        {
          backgroundColor: isDisabled ? COLORS.lightGray : COLORS.gray,
        },
        buttonStyle,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={COLORS.loader} />
      ) : (
        <Text style={textStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default PrimaryButton;
