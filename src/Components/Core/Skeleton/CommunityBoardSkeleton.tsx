import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Skeleton from './index';
import { ms } from '@/Assets/Theme/fontStyle';
import { COLORS } from '@/Assets/Theme/colors';

const CommunityBoardSkeleton = () => {
    const renderPostSkeleton = (key: number) => (
        <View key={key} style={styles.postCard}>
            {/* Header */}
            <View style={styles.header}>
                <Skeleton width={ms(40)} height={ms(40)} borderRadius={ms(20)} />
                <View style={styles.headerInfo}>
                    <Skeleton width={ms(120)} height={ms(16)} style={{ marginBottom: ms(6) }} />
                    <Skeleton width={ms(60)} height={ms(12)} />
                </View>
                <Skeleton width={ms(20)} height={ms(20)} borderRadius={ms(10)} />
            </View>

            {/* Content */}
            <View style={styles.content}>
                <Skeleton width="100%" height={ms(12)} style={{ marginBottom: ms(8) }} />
                <Skeleton width="90%" height={ms(12)} style={{ marginBottom: ms(8) }} />
                <Skeleton width="40%" height={ms(12)} />
            </View>

            {/* Media placeholder (occasional) */}
            {key % 2 === 0 && (
                <Skeleton width="100%" height={ms(180)} borderRadius={ms(8)} style={{ marginTop: ms(12) }} />
            )}

            {/* Footer */}
            <View style={styles.footer}>
                <Skeleton width={ms(80)} height={ms(24)} borderRadius={ms(12)} />
            </View>
        </View>
    );

    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
            {/* Board Title */}
            <Skeleton width={ms(100)} height={ms(32)} style={{ marginTop: ms(10), marginBottom: ms(8) }} />
            {/* Subtitle */}
            <Skeleton width="80%" height={ms(16)} style={{ marginBottom: ms(24) }} />

            {/* Category Bar */}
            <View style={styles.categoryBar}>
                {[1, 2, 3, 4].map(i => (
                    <Skeleton key={i} width={ms(60)} height={ms(32)} borderRadius={ms(16)} style={{ marginRight: ms(8) }} />
                ))}
            </View>

            {/* Create Post Section */}
            <View style={styles.createPostCard}>
                <View style={styles.inputRow}>
                    <Skeleton width={ms(36)} height={ms(36)} borderRadius={ms(18)} style={{ marginRight: ms(12) }} />
                    <Skeleton width="80%" height={ms(40)} borderRadius={ms(20)} />
                </View>
                <View style={styles.actionsRow}>
                    {[1, 2, 3, 4].map(i => (
                        <Skeleton key={i} width="22%" height={ms(36)} borderRadius={ms(8)} />
                    ))}
                </View>
            </View>

            {/* Posts List */}
            {[1, 2, 3].map(i => renderPostSkeleton(i))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: ms(16),
        paddingBottom: ms(100),
    },
    categoryBar: {
        flexDirection: 'row',
        marginBottom: ms(24),
    },
    createPostCard: {
        backgroundColor: COLORS.newModalBG,
        borderRadius: ms(12),
        padding: ms(16),
        marginBottom: ms(24),
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: ms(16),
    },
    actionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    postCard: {
        backgroundColor: COLORS.newModalBG,
        borderRadius: ms(12),
        padding: ms(16),
        marginBottom: ms(16),
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: ms(12),
    },
    headerInfo: {
        flex: 1,
        marginLeft: ms(12),
    },
    content: {
        marginVertical: ms(12),
    },
    footer: {
        marginTop: ms(12),
        paddingTop: ms(8),
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
});

export default CommunityBoardSkeleton;
