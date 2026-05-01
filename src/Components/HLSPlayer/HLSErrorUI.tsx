/**
 * HLSErrorUI
 *
 * Shown when the HLS stream fails to load or a playback error occurs.
 * Displays a descriptive error message and a "Go Back" / optional "Retry" button.
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/Components/Core/Icons';
import { COLORS } from '@/Assets/Theme/colors';

interface Props {
  /** Human-readable error message to display */
  message?: string;
  /** Optional error code for debugging */
  errorCode?: string;
  /** Optional callback to retry. If not provided, only "Go Back" is shown. */
  onRetry?: () => void;
}

const HLSErrorUI = ({
  message = 'Failed to load the live stream.',
  errorCode,
  onRetry,
}: Props) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Error icon – AlertCircle is universally available in lucide-react-native */}
      <View style={styles.iconContainer}>
        <Icon name="AlertCircle" color="#E53E3E" size={38} />
      </View>

      {/* Title */}
      <Text style={styles.title}>Stream Unavailable</Text>

      {/* Message */}
      <Text style={styles.message}>{message}</Text>

      {/* Error code (shown only for debugging) */}
      {errorCode ? (
        <Text style={styles.errorCode}>Code: {errorCode}</Text>
      ) : null}

      {/* Action buttons */}
      <View style={styles.actions}>
        {/* Retry – only shown when a retry callback is provided */}
        {onRetry && (
          <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
            {/* RefreshCw is the standard lucide refresh icon */}
            <Icon name="RefreshCw" color={COLORS.white} size={16} />
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        )}

        {/* Go Back */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="ChevronLeft" color={COLORS.white} size={16} />
          <Text style={styles.backText}>Go Back</Text>
        </TouchableOpacity>
      </View>
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
  iconContainer: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: 'rgba(229,62,62,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(229,62,62,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  message: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 8,
  },
  errorCode: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 11,
    marginBottom: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  retryText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 14,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  backText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 14,
  },
});

export default HLSErrorUI;
