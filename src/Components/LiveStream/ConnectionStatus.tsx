import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS } from '@/Assets/Theme/colors';

interface Props {
  status: string;
}

const ConnectionStatus = ({ status }: Props) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="small" color={COLORS.primary} />
      <Text style={styles.statusText}>{status}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'center',
    position: 'absolute',
    top: 120,
    zIndex: 20,
  },
  statusText: {
    color: COLORS.white,
    fontSize: 14,
    marginLeft: 8,
    fontWeight: '500',
  },
});

export default ConnectionStatus;
