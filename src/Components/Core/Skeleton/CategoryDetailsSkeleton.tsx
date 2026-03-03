import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Skeleton from './index';
import { ms, sc, vs, width } from '@/Assets/Theme/fontStyle';
import { COLORS } from '@/Assets/Theme/colors';

const CategoryDetailsSkeleton = () => {
    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
        >
            {/* Banner */}
            <Skeleton width="100%" height={width * 0.9} borderRadius={0} />

            {/* Carousel */}
            <View style={styles.carousel}>
                {[1, 2, 3, 4].map((i) => (
                    <Skeleton
                        key={i}
                        width={sc(90)}
                        height={vs(50)}
                        borderRadius={ms(6)}
                        style={{ marginRight: ms(10) }}
                    />
                ))}
            </View>

            <View style={{ paddingHorizontal: ms(16) }}>
                {/* Title Row */}
                <View style={styles.titleRow}>
                    <Skeleton width={ms(150)} height={ms(28)} />
                    <Skeleton width={ms(80)} height={ms(36)} borderRadius={ms(20)} />
                </View>

                {/* Social Row */}
                <View style={styles.socialRow}>
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} width={ms(24)} height={ms(24)} borderRadius={ms(12)} />
                    ))}
                </View>

                {/* Link Row */}
                <View style={styles.linkRow}>
                    <Skeleton width="80%" height={ms(20)} />
                    <Skeleton width={ms(18)} height={ms(18)} style={{ marginLeft: ms(10) }} />
                </View>

                {/* Description */}
                <View style={styles.description}>
                    <Skeleton width="100%" height={ms(14)} style={{ marginBottom: ms(6) }} />
                    <Skeleton width="100%" height={ms(14)} style={{ marginBottom: ms(6) }} />
                    <Skeleton width="60%" height={ms(14)} />
                </View>

                {/* Stats Row */}
                <View style={styles.statsRow}>
                    {[1, 2, 3].map((i) => (
                        <View key={i} style={styles.statCard}>
                            <Skeleton width={ms(40)} height={ms(40)} borderRadius={ms(5)} />
                            <View>
                                <Skeleton width={ms(30)} height={ms(20)} style={{ marginBottom: ms(4) }} />
                                <Skeleton width={ms(50)} height={ms(12)} />
                            </View>
                        </View>
                    ))}
                </View>

                {/* Further Content */}
                <View style={{ marginTop: ms(28) }}>
                    <Skeleton width={ms(200)} height={ms(24)} style={{ marginBottom: ms(12) }} />
                    {[1, 2, 3].map((i) => (
                        <View key={i} style={styles.bulletRow}>
                            <Skeleton width={ms(10)} height={ms(10)} borderRadius={ms(5)} style={{ marginRight: ms(8), marginTop: ms(4) }} />
                            <Skeleton width="90%" height={ms(14)} />
                        </View>
                    ))}
                </View>
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
        paddingBottom: ms(50),
    },
    carousel: {
        flexDirection: 'row',
        paddingVertical: ms(12),
        paddingHorizontal: ms(16),
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: ms(10),
    },
    socialRow: {
        flexDirection: 'row',
        marginTop: ms(18),
        gap: ms(10),
    },
    linkRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: ms(12),
    },
    description: {
        marginTop: ms(12),
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: ms(22),
    },
    statCard: {
        flexDirection: 'row',
        gap: ms(10),
        width: '32%',
        paddingVertical: ms(2),
        alignItems: 'center',
    },
    bulletRow: {
        flexDirection: 'row',
        marginTop: ms(10),
        alignItems: 'flex-start',
    },
});

export default CategoryDetailsSkeleton;
