import { View, Text, Image, Pressable, Linking, Alert } from 'react-native';
import React from 'react';
import { AppImages } from '@/Assets/Images';
import styles from './style';
import Icon from '@/Components/Core/Icons';
import { COLORS } from '@/Assets/Theme/colors';

const Support = () => {
  const handleSendEmail = () => {
    const email = 'support@bellndesk.com';
    const subject = 'Support Request';
    const body = 'Hello, I need help with...';

    const mailUrl = `mailto:${email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;

    Linking.openURL(mailUrl).catch(() => {
      Alert.alert('Error', 'Unable to open the mail app.');
    });
  };

  return (
    <View style={styles.container}>
      <Image source={AppImages.queMark} style={styles.image} />
      <Text style={styles.title}>Welcome to Bell n Desk Support</Text>
      <Text style={styles.subtitle}>
        We're here to help you with any questions or issues. Contact us directly
        via email or click the button below.
      </Text>
      <Pressable style={styles.button} onPress={handleSendEmail}>
        <Icon name="Mail" color={COLORS.white} size={18} />
        <Text style={styles.buttonText}>Send Email</Text>
      </Pressable>
    </View>
  );
};

export default Support;
