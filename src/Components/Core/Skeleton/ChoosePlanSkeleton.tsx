import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Skeleton from './index';
import { ms } from '@/Assets/Theme/fontStyle';

const ChoosePlanSkeleton = () => {
    return (
        <ScrollView
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
        >
            {/* Subtext Skeleton */}
            <View style={styles.subTextContainer}>
                <Skeleton width="80%" height={ms(16)} style={styles.subTextLine} />
                <Skeleton width="60%" height={ms(16)} style={styles.subTextLine} />
            </View>

            {/* Plan Card Skeletons */}
            {[1, 2].map(i => (
                <View key={i} style={styles.cardSkeleton}>
                    {/* Title */}
                    <Skeleton width={ms(120)} height={ms(24)} style={styles.title} />

                    {/* Price */}
                    <Skeleton width={ms(80)} height={ms(32)} style={styles.price} />

                    {/* Button */}
                    <Skeleton width="100%" height={ms(48)} borderRadius={ms(40)} style={styles.button} />

                    {/* What's included */}
                    <Skeleton width={ms(100)} height={ms(20)} style={styles.includedHeader} />

                    {/* Features */}
                    {[1, 2, 3, 4].map(j => (
                        <View key={j} style={styles.featureRow}>
                            <Skeleton width={ms(16)} height={ms(16)} borderRadius={ms(8)} />
                            <Skeleton width={ms(180)} height={ms(14)} style={styles.featureText} />
                        </View>
                    ))}
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: ms(20),
        paddingBottom: ms(40),
    },
    subTextContainer: {
        alignItems: 'center',
        marginTop: ms(20),
        marginBottom: ms(20),
    },
    subTextLine: {
        marginBottom: ms(8),
    },
    cardSkeleton: {
        backgroundColor: '#1E293B',
        borderRadius: ms(15),
        padding: ms(18),
        paddingTop: ms(25),
        marginBottom: ms(25),
        opacity: 0.6,
    },
    title: {
        marginBottom: ms(10),
    },
    price: {
        marginBottom: ms(20),
    },
    button: {
        marginBottom: ms(25),
    },
    includedHeader: {
        marginBottom: ms(15),
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: ms(12),
    },
    featureText: {
        marginLeft: ms(10),
    },
});

export default ChoosePlanSkeleton;
