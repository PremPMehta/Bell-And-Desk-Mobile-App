import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Skeleton from './index';
import { ms, mvs } from '@/Assets/Theme/fontStyle';
import { COLORS } from '@/Assets/Theme/colors';

const CommunityChatSkeleton = () => {
    const renderItemSkeleton = (key: number, isDM = false) => (
        <View key={key} style={styles.itemCard}>
            {/* Icon/Avatar */}
            <Skeleton 
                width={ms(44)} 
                height={ms(44)} 
                borderRadius={ms(22)} 
                style={{ marginRight: ms(15) }} 
            />
            
            {/* Info */}
            <View style={styles.itemInfo}>
                <Skeleton width={ms(150)} height={ms(16)} style={{ marginBottom: mvs(6) }} />
                <Skeleton width={ms(200)} height={ms(12)} />
            </View>
            
            {/* Meta */}
            <View style={styles.itemMeta}>
                {isDM && <Skeleton width={ms(40)} height={ms(10)} style={{ marginBottom: mvs(5) }} />}
                <Skeleton width={ms(18)} height={ms(18)} borderRadius={ms(9)} />
            </View>
        </View>
    );

    const renderSectionSkeleton = (titleWidth: number, count: number, isDM = false) => (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Skeleton width={ms(titleWidth)} height={ms(18)} />
                <Skeleton width={ms(30)} height={ms(20)} borderRadius={ms(10)} />
            </View>
            <View style={styles.listContainer}>
                {[1, 2, 3].map(i => renderItemSkeleton(`${isDM ? 'dm' : 'ch'}-${i}`, isDM))}
            </View>
        </View>
    );

    return (
        <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Skeleton width={ms(180)} height={ms(28)} style={{ marginBottom: mvs(8) }} />
                <Skeleton width={ms(240)} height={ms(16)} />
            </View>

            {/* Channels Section */}
            {renderSectionSkeleton(100, 3)}

            {/* Direct Messages Section */}
            {renderSectionSkeleton(150, 3, true)}

            <View style={{ height: 100 }} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.black,
    },
    header: {
        paddingHorizontal: ms(20),
        paddingVertical: mvs(15),
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    section: {
        marginTop: mvs(20),
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: ms(20),
        marginBottom: mvs(10),
    },
    listContainer: {
        paddingHorizontal: ms(10),
    },
    itemCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: ms(12),
        marginVertical: mvs(4),
        borderRadius: ms(12),
        backgroundColor: COLORS.cardBG,
    },
    itemInfo: {
        flex: 1,
    },
    itemMeta: {
        alignItems: 'flex-end',
    },
});

export default CommunityChatSkeleton;
