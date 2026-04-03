import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@/Hooks/Utils/use-navigation';
import useUserApi from '@/Hooks/Apis/UserApis/use-user-api';
import AppHeader from '@/Components/Navigation/AppHeader';
import BlogCard from './Components/BlogCard';
import BlogsSkeleton from '@/Components/Core/Skeleton/BlogsSkeleton';
import Icon from '@/Components/Core/Icons';
import { COLORS } from '@/Assets/Theme/colors';
import styles from './style';

const Blogs = () => {
  const navigation = useNavigation();
  const { getBlogs, apiGetBlogsLoading } = useUserApi();
  const [blogs, setBlogs] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    const res = await getBlogs();
    if (res?.data) {
      setBlogs(res.data);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBlogs();
    setRefreshing(false);
  };

  const renderItem = ({ item }: { item: any }) => (
    <BlogCard 
      item={item} 
      onPress={() => {
        if (item?.slug) {
          navigation.navigate('BlogDetails', { slug: item.slug });
        }
      }} 
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconCircle}>
        <Icon name="BookOpen" size={40} color={COLORS.primary} />
      </View>
      <Text style={styles.emptyTitle}>No Blogs Found</Text>
      <Text style={styles.emptySubtitle}>
        There are no blog posts available at the moment. Please check back later.
      </Text>
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <AppHeader />
      
      {apiGetBlogsLoading && !refreshing ? (
        <BlogsSkeleton />
      ) : (
        <FlatList
          data={blogs}
          renderItem={renderItem}
          keyExtractor={(item) => item?._id || item?.id?.toString() || Math.random().toString()}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.primary}
              colors={[COLORS.primary]}
            />
          }
          ListEmptyComponent={renderEmptyState}
        />
      )}
    </View>
  );
};

export default Blogs;
