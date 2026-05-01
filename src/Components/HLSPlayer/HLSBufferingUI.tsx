/**
 * HLSBufferingUI
 *
 * Shown while the HLS stream is initialising or in a buffering state.
 * Displays an animated spinner and a status message.
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Animated,
  Easing,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { COLORS } from '@/Assets/Theme/colors';

interface Props {
  /** Optional status label shown below the spinner (e.g. "Joining room…") */
  statusMessage?: string;
}

const HLSBufferingUI = ({ statusMessage = 'Loading stream…' }: Props) => {
  // Subtle pulsing animation on the outer ring
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  return (
    <View style={styles.container}>
      {/* Pulsing outer ring decoration */}
      <Animated.View
        style={[styles.pulseRing, { transform: [{ scale: pulseAnim }] }]}
      />

      {/* Spinner */}
      <ActivityIndicator size="large" color={COLORS.primary} style={styles.spinner} />

      {/* Status label */}
      <Text style={styles.statusText}>{statusMessage}</Text>
      <Text style={styles.subText}>Please wait while the stream loads</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  pulseRing: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  spinner: {
    marginBottom: 20,
  },
  statusText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
    marginBottom: 6,
  },
  subText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

export default HLSBufferingUI;
