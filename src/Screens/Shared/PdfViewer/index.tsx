import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  SafeAreaView,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from '@/Components/Core/Icons';
import { COLORS } from '@/Assets/Theme/colors';
import styles from './style';
import { vs } from '@/Assets/Theme/fontStyle';

const PdfViewer = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();
  const { pdfUrl, title = 'Document' } = route.params || {};
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // For Android, we need to use Google Docs viewer or similar because WebView 
  // doesn't support direct PDF rendering on Android.
  const finalUrl = Platform.OS === 'android' 
    ? `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(pdfUrl)}`
    : pdfUrl;

  const handleRetry = () => {
    setError(false);
    setLoading(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? 0 : insets.top, height: (Platform.OS === 'ios' ? 0 : insets.top) + vs(60) }]}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Icon name="ChevronLeft" size={24} color={COLORS.white} />
        </TouchableOpacity>
        
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.headerSubTitle} numberOfLines={1}>
            Viewing PDF Document
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => {}} // Could add download or share here
          activeOpacity={0.7}
        >
          <Icon name="FileText" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.webViewContainer}>
        {error ? (
          <View style={styles.errorContainer}>
            <Icon name="FileWarning" size={48} color={COLORS.error} />
            <Text style={styles.errorText}>
              Failed to load PDF document. Please try again later.
            </Text>
            <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <WebView
              source={{ uri: finalUrl }}
              style={styles.webview}
              onLoadStart={() => setLoading(true)}
              onLoadEnd={() => setLoading(false)}
              onError={() => {
                setError(true);
                setLoading(false);
              }}
              scalesPageToFit
              startInLoadingState={true}
              renderLoading={() => (
                <View style={styles.loaderContainer}>
                  <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
              )}
            />
            {loading && (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
              </View>
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default PdfViewer;
