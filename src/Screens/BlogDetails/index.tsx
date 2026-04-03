import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import {
  View,
  Text,
  Animated,
  Image,
  TouchableOpacity,
  Platform,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';
import LinearGradient from 'react-native-linear-gradient';
import useUserApi from '@/Hooks/Apis/UserApis/use-user-api';
import { COLORS } from '@/Assets/Theme/colors';
import { getFullImageUrl } from '@/Utils/ImageUtils';
import { AppImages } from '@/Assets/Images';
import Icon from '@/Components/Core/Icons';
import styles from './style';
import { vs } from '@/Assets/Theme/fontStyle';
import BlogDetailsSkeleton from '@/Components/Core/Skeleton/BlogDetailsSkeleton';

const BlogDetails = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { slug } = route.params || {};

  const { getBlogDetails, apiGetBlogDetailsLoading, apiGetBlogDetails } =
    useUserApi();

  const scrollY = useRef(new Animated.Value(0)).current;
  const [webHeight, setWebHeight] = useState(1);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (slug) {
      fetchBlogDetails();
    }
  }, [slug]);

  const fetchBlogDetails = async () => {
    const res = await getBlogDetails(slug);
    if (res?.data) {
      setData(res.data);
    }
  };

  // Header animations
  const headerBgColor = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: ['transparent', COLORS.header],
    extrapolate: 'clamp',
  });

  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [150, 250],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const backButtonBgColor = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: ['rgba(0,0,0,0.4)', 'transparent'],
    extrapolate: 'clamp',
  });

  const handleWebViewMessage = useCallback(
    (event: any) => {
      const height = Number(event.nativeEvent.data);
      if (height > 0 && Math.abs(height - webHeight) > 5) {
        setWebHeight(height + 20);
      }
    },
    [webHeight],
  );

  const blogData = data || apiGetBlogDetails?.data || {};
  const imageUrl = blogData?.image
    ? { uri: getFullImageUrl(blogData.image) }
    : AppImages.homeBanner;
  const authorName = blogData?.author ? blogData.author : 'Admin';
  const authorAvatar = blogData?.user?.avatar
    ? { uri: getFullImageUrl(blogData.user.avatar) }
    : blogData?.author?.avatar
    ? { uri: getFullImageUrl(blogData.author.avatar) }
    : null;
  const dateStr = blogData?.createdAt
    ? new Date(blogData.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  const welcomeMessageHtml = useMemo(() => {
    const content = blogData?.content || '';
    if (!content) return null;
    return {
      html: `<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
    <style>
      html, body {
        margin: 0 !important;
        padding: 0 !important;
        background-color: #000 !important;
        color: #fff;
        font-family: -apple-system, system-ui, Roboto, "Helvetica Neue", Arial, sans-serif;
        overflow-x: hidden;
        width: 100%;
        line-height: 1.6;
      }
      * {
        min-height: 0 !important;
        box-sizing: border-box;
      }
      img { max-width: 100% !important; height: auto !important; display: block; border-radius: 8px; margin: 10px 0; }
      p { font-size: 16px; margin-bottom: 16px; color: #CCCCCC; }
      h1, h2, h3, h4, h5, h6 { color: #FFFFFF; margin-top: 24px; margin-bottom: 16px; }
      ul, ol { margin-bottom: 16px; padding-left: 20px; color: #CCCCCC; }
      li { margin-bottom: 8px; }
      blockquote { border-left: 4px solid #1B7CFF; padding-left: 16px; margin: 20px 0; font-style: italic; color: #EEEEEE; }
      a { color: #1B7CFF; text-decoration: underline; }
    </style>
  </head>
  <body>
    <div id="cw">${content}</div>
    <script>
      function reportHeight() {
        var height = Math.max(
          document.body.scrollHeight,
          document.documentElement.scrollHeight,
          document.getElementById('cw') ? document.getElementById('cw').scrollHeight : 0
        );
        window.ReactNativeWebView.postMessage(String(height));
      }
      window.addEventListener('load', reportHeight);
      setTimeout(reportHeight, 500);
      setTimeout(reportHeight, 1500);
    </script>
  </body>
</html>`,
    };
  }, [blogData?.content]);

  if (apiGetBlogDetailsLoading && !data) {
    return (
      <View style={styles.container}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="light-content"
        />

        {/* Render header skeleton or just the back button to allow navigation back */}
        <View
          style={[
            styles.header,
            {
              paddingTop: Math.max(insets.top, vs(15)),
              backgroundColor: 'transparent',
              height: insets.top + vs(45),
            },
          ]}
        >
          <View
            style={[styles.backButton, { backgroundColor: 'rgba(0,0,0,0.4)' }]}
          >
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon
                name={Platform.OS === 'ios' ? 'ChevronLeft' : 'ArrowLeft'}
                color={COLORS.white}
                size={24}
              />
            </TouchableOpacity>
          </View>
        </View>

        <BlogDetailsSkeleton />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      {/* ---------------------- ANIMATED HEADER ---------------------- */}
      <Animated.View
        style={[
          styles.header,
          {
            paddingTop: Math.max(insets.top, vs(15)),
            backgroundColor: headerBgColor,
            height: insets.top + vs(45),
          },
        ]}
      >
        <Animated.View
          style={[styles.backButton, { backgroundColor: backButtonBgColor }]}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon
              name={Platform.OS === 'ios' ? 'ChevronLeft' : 'ArrowLeft'}
              color={COLORS.white}
              size={24}
            />
          </TouchableOpacity>
        </Animated.View>
        <Animated.Text
          numberOfLines={1}
          style={[
            styles.headerTitle,
            { opacity: headerTitleOpacity, color: COLORS.white },
          ]}
        >
          {blogData?.title || 'Blog Details'}
        </Animated.Text>
      </Animated.View>

      <Animated.ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
      >
        {/* ---------------------- BANNER IMAGE ---------------------- */}
        <View style={styles.bannerContainer}>
          <Image
            source={imageUrl as any}
            style={styles.bannerImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.5)', COLORS.black]}
            style={styles.headerGradient}
          />
        </View>

        {/* ---------------------- CONTENT ---------------------- */}
        <View style={styles.blogContentWrapper}>
          {blogData?.category && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{blogData.category}</Text>
            </View>
          )}

          <Text style={styles.title}>{blogData?.title}</Text>

          <View style={styles.metaRow}>
            <View style={styles.authorRow}>
              {authorAvatar ? (
                <Image
                  source={{ uri: authorAvatar.uri } as any}
                  style={styles.authorAvatar}
                />
              ) : (
                <Icon name="UserRoundPen" size={18} color={COLORS.lightGray} />
              )}
              <Text style={styles.authorName}>{authorName}</Text>
            </View>
            <View style={styles.dateRow}>
              <Icon name="Calendar" size={14} color={COLORS.lightGray} />
              <Text style={styles.dateText}>{dateStr}</Text>
            </View>
          </View>

          {welcomeMessageHtml ? (
            <WebView
              originWhitelist={['*']}
              scrollEnabled={false}
              nestedScrollEnabled={false}
              showsVerticalScrollIndicator={false}
              overScrollMode="never"
              javaScriptEnabled={true}
              style={{
                width: '100%',
                height: webHeight,
                backgroundColor: 'transparent',
                opacity: webHeight > 1 ? 1 : 0,
              }}
              source={welcomeMessageHtml}
              onMessage={handleWebViewMessage}
            />
          ) : (
            <Text style={{ color: COLORS.lightGray, fontSize: 16 }}>
              {blogData?.description || 'No content available for this blog.'}
            </Text>
          )}
        </View>
      </Animated.ScrollView>
    </View>
  );
};

export default BlogDetails;
