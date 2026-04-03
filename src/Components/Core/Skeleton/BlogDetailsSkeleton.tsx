import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import Skeleton from './index';
import { ms, vs } from '@/Assets/Theme/fontStyle';
import { COLORS } from '@/Assets/Theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const BlogDetailsSkeleton = () => {
    const insets = useSafeAreaInsets();

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainer}>
                {/* Banner Image Skeleton */}
                <View style={styles.bannerContainer}>
                    <Skeleton width={width} height={vs(350)} borderRadius={0} />
                </View>

                {/* Content Statistics Skeleton */}
                <View style={styles.blogContentWrapper}>
                    {/* Category Badge Skeleton */}
                    <Skeleton width={ms(80)} height={ms(24)} borderRadius={ms(12)} style={{ marginBottom: ms(12) }} />

                    {/* Title Skeleton */}
                    <Skeleton width="90%" height={ms(32)} borderRadius={ms(4)} style={{ marginBottom: ms(8) }} />
                    <Skeleton width="60%" height={ms(32)} borderRadius={ms(4)} style={{ marginBottom: ms(20) }} />

                    {/* Metadata Row Skeleton */}
                    <View style={styles.metaRow}>
                        <View style={styles.authorRow}>
                            <Skeleton width={ms(32)} height={ms(32)} borderRadius={ms(16)} style={{ marginRight: ms(10) }} />
                            <Skeleton width={ms(100)} height={ms(18)} borderRadius={ms(4)} />
                        </View>
                        <Skeleton width={ms(80)} height={ms(14)} borderRadius={ms(4)} />
                    </View>

                    {/* Content Paragraph Skeleton */}
                    <View style={styles.contentBlock}>
                        {[...Array(6)].map((_, index) => (
                            <Skeleton 
                                key={index} 
                                width={index === 5 ? "70%" : "100%"} 
                                height={ms(16)} 
                                borderRadius={ms(4)} 
                                style={{ marginBottom: ms(12) }} 
                            />
                        ))}
                    </View>

                    <View style={[styles.contentBlock, { marginTop: ms(20) }]}>
                        {[...Array(4)].map((_, index) => (
                            <Skeleton 
                                key={index} 
                                width={index === 3 ? "50%" : "100%"} 
                                height={ms(16)} 
                                borderRadius={ms(4)} 
                                style={{ marginBottom: ms(12) }} 
                            />
                        ))}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.black,
    },
    contentContainer: {
        paddingBottom: ms(40),
    },
    bannerContainer: {
        width: width,
        height: vs(350),
    },
    blogContentWrapper: {
        paddingHorizontal: ms(16),
        marginTop: ms(-20),
        backgroundColor: COLORS.black,
        borderTopLeftRadius: ms(24),
        borderTopRightRadius: ms(24),
        paddingTop: ms(24),
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: ms(24),
        paddingBottom: ms(20),
        borderBottomWidth: 1,
        borderBottomColor: '#1E293B',
    },
    authorRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    contentBlock: {
        marginTop: ms(10),
    },
});

export default BlogDetailsSkeleton;
