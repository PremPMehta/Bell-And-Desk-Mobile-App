import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '@/Assets/Theme/colors';

interface Props {
  message?: string;
  subtext?: string;
}

const EmptyState = ({
  message = 'Waiting for host to go live...',
  subtext = 'The stream will appear here automatically',
}: Props) => {
  return (
    <View style={styles.container}>
      {/* Pulse ring decoration */}
      <View style={styles.iconWrapper}>
        <View style={styles.outerRing} />
        <View style={styles.innerRing} />
        <View style={styles.dot} />
      </View>
      <Text style={styles.message}>{message}</Text>
      <Text style={styles.subtext}>{subtext}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingHorizontal: 40,
  },
  iconWrapper: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  outerRing: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  innerRing: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    opacity: 0.8,
  },
  message: {
    color: COLORS.white,
    fontSize: 17,
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  subtext: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 13,
    textAlign: 'center',
  },
});

export default EmptyState;
