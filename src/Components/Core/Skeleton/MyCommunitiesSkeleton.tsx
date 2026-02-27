import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Skeleton from './index';
import { ms, width } from '@/Assets/Theme/fontStyle';

const MyCommunitiesSkeleton = () => {
    return (
        <ScrollView
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
        >
            {/* Search Bar Skeleton */}
            <Skeleton
                height={ms(44)}
                borderRadius={ms(22)}
                style={styles.searchBar}
            />

            {/* Category Tabs Skeleton */}
            <View style={styles.tabsRow}>
                {[1, 2, 3, 4].map(i => (
                    <Skeleton
                        key={i}
                        width={ms(80)}
                        height={ms(32)}
                        borderRadius={ms(16)}
                        style={styles.tab}
                    />
                ))}
            </View>

            {/* Create Community Banner Skeleton */}
            <View style={styles.bannerCard}>
                <Skeleton width="50%" height={ms(20)} borderRadius={ms(6)} style={styles.bannerTitle} />
                <Skeleton width="90%" height={ms(14)} borderRadius={ms(4)} style={styles.bannerLine} />
                <Skeleton width="70%" height={ms(14)} borderRadius={ms(4)} style={styles.bannerLine} />
                <Skeleton width="100%" height={ms(44)} borderRadius={ms(26)} style={styles.bannerBtn} />
            </View>

            {/* Community Card Skeletons */}
            {[1, 2, 3].map(i => (
                <View key={i} style={styles.card}>
                    {/* Banner image */}
                    <Skeleton
                        width="100%"
                        height={ms(140)}
                        borderRadius={0}
                    />

                    {/* Tags row */}
                    <View style={styles.tagsRow}>
                        <Skeleton width={ms(60)} height={ms(24)} borderRadius={ms(12)} style={styles.tag} />
                        <Skeleton width={ms(60)} height={ms(24)} borderRadius={ms(12)} style={styles.tag} />
                    </View>

                    {/* Card content */}
                    <View style={styles.cardContent}>
                        <Skeleton width="60%" height={ms(20)} borderRadius={ms(4)} style={styles.cardTitle} />
                        <Skeleton width="100%" height={ms(14)} borderRadius={ms(4)} style={styles.cardLine} />
                        <Skeleton width="80%" height={ms(14)} borderRadius={ms(4)} style={styles.cardLine} />

                        {/* Buttons row */}
                        <View style={styles.buttonsRow}>
                            <Skeleton
                                width={(width - ms(56)) / 2}
                                height={ms(36)}
                                borderRadius={ms(20)}
                            />
                            <Skeleton
                                width={(width - ms(56)) / 2}
                                height={ms(36)}
                                borderRadius={ms(20)}
                            />
                        </View>
                    </View>
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: ms(16),
        paddingBottom: ms(20),
    },
    searchBar: {
        marginTop: ms(4),
        marginBottom: ms(12),
        width: '100%',
    },
    tabsRow: {
        flexDirection: 'row',
        marginBottom: ms(12),
    },
    tab: {
        marginRight: ms(10),
    },
    bannerCard: {
        borderRadius: ms(14),
        borderWidth: 1,
        borderColor: '#1E293B',
        backgroundColor: '#1E293B',
        padding: ms(16),
        marginVertical: ms(12),
        opacity: 0.6,
    },
    bannerTitle: {
        marginBottom: ms(10),
    },
    bannerLine: {
        marginBottom: ms(6),
    },
    bannerBtn: {
        marginTop: ms(16),
    },
    card: {
        backgroundColor: '#1E293B',
        borderRadius: ms(12),
        overflow: 'hidden',
        marginBottom: ms(16),
        opacity: 0.6,
    },
    tagsRow: {
        flexDirection: 'row',
        paddingHorizontal: ms(12),
        marginTop: ms(12),
        gap: ms(8),
    },
    tag: {},
    cardContent: {
        paddingHorizontal: ms(12),
        paddingVertical: ms(12),
    },
    cardTitle: {
        marginBottom: ms(10),
    },
    cardLine: {
        marginBottom: ms(6),
    },
    buttonsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: ms(12),
        gap: ms(12),
    },
});

export default MyCommunitiesSkeleton;
