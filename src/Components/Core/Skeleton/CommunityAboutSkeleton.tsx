import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Skeleton from './index';
import { ms, sc, vs, width } from '@/Assets/Theme/fontStyle';
import { COLORS } from '@/Assets/Theme/colors';

const CommunityAboutSkeleton = () => {
    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
        >
            {/* Header Section */}
            <View style={styles.headerRow}>
                <View style={styles.userInfo}>
                    <Skeleton width={ms(40)} height={ms(40)} borderRadius={ms(20)} />
                    <Skeleton width={ms(120)} height={ms(20)} style={{ marginLeft: ms(10) }} />
                </View>
                <Skeleton width={ms(60)} height={ms(30)} borderRadius={ms(6)} />
            </View>

            {/* Main Video/Media Section */}
            <Skeleton width="100%" height={vs(200)} style={{ marginBottom: vs(16) }} />

            {/* Thumbnails Gallery */}
            <View style={styles.thumbnailList}>
                {[1, 2, 3, 4].map((i) => (
                    <Skeleton
                        key={i}
                        width={sc(100)}
                        height={vs(60)}
                        borderRadius={ms(6)}
                        style={{ marginRight: ms(10) }}
                    />
                ))}
            </View>

            {/* Community Info Section */}
            <View style={styles.communityInfo}>
                <View style={styles.communityNameRow}>
                    <Skeleton width={ms(180)} height={ms(28)} />
                    <Skeleton width={ms(100)} height={ms(32)} borderRadius={ms(6)} />
                </View>

                <View style={styles.communityLinkRow}>
                    <Skeleton width="70%" height={ms(16)} />
                </View>

                <View style={styles.socialIconsRow}>
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Skeleton key={i} width={ms(24)} height={ms(24)} borderRadius={ms(4)} style={{ marginRight: ms(20) }} />
                    ))}
                </View>

                <View style={{ marginTop: vs(15) }}>
                    <Skeleton width="100%" height={ms(14)} style={{ marginBottom: ms(6) }} />
                    <Skeleton width="100%" height={ms(14)} style={{ marginBottom: ms(6) }} />
                    <Skeleton width="60%" height={ms(14)} />
                </View>
            </View>

            {/* Stats Cards */}
            <View style={styles.statsRow}>
                {[1, 2, 3].map((i) => (
                    <View key={i} style={styles.statCard}>
                        <Skeleton width={ms(40)} height={ms(40)} borderRadius={ms(8)} />
                        <View style={{ flex: 1 }}>
                            <Skeleton width="80%" height={ms(20)} style={{ marginBottom: ms(4) }} />
                            <Skeleton width="60%" height={ms(12)} />
                        </View>
                    </View>
                ))}
            </View>

            {/* Welcome Section */}
            <View style={styles.welcomeSection}>
                <Skeleton width={ms(200)} height={ms(24)} style={{ marginBottom: vs(15) }} />
                {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} width="100%" height={ms(14)} style={{ marginBottom: ms(8) }} />
                ))}
                <Skeleton width="70%" height={ms(14)} />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.black,
    },
    contentContainer: {
        paddingBottom: vs(30),
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: ms(16),
        paddingVertical: vs(16),
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    thumbnailList: {
        flexDirection: 'row',
        paddingHorizontal: ms(15),
        marginBottom: vs(16),
    },
    communityInfo: {
        paddingHorizontal: ms(15),
        marginBottom: vs(20),
    },
    communityNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: vs(5),
    },
    communityLinkRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: vs(15),
    },
    socialIconsRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: ms(15),
        marginBottom: vs(20),
    },
    statCard: {
        flexDirection: 'row',
        gap: ms(10),
        width: (width - ms(50)) / 3,
        backgroundColor: COLORS.cardBG,
        borderRadius: ms(8),
        padding: ms(10),
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    welcomeSection: {
        paddingHorizontal: ms(15),
        marginTop: vs(10),
    },
});

export default CommunityAboutSkeleton;
