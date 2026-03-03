import { StyleSheet } from 'react-native';
import { ms, fontStyle } from '@/Assets/Theme/fontStyle';
import { COLORS } from '@/Assets/Theme/colors';

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.newModalBG,
        borderRadius: ms(12),
        overflow: 'hidden',
        marginTop: ms(12),
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    loadingContainer: {
        height: ms(200),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.newModalBG,
        borderRadius: ms(12),
        marginTop: ms(12),
    },
    bannerContainer: {
        width: '100%',
        height: ms(180),
        position: 'relative',
    },
    banner: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    fallbackBanner: {
        backgroundColor: COLORS.innerCardBG,
        justifyContent: 'center',
        alignItems: 'center',
    },
    playOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        padding: ms(16),
    },
    title: {
        ...fontStyle.h5Bold,
        color: COLORS.white,
        marginBottom: ms(4),
    },
    description: {
        ...fontStyle.h6Regular,
        color: COLORS.subText,
        marginBottom: ms(8),
    },
    domain: {
        ...fontStyle.h7Regular,
        color: COLORS.subText,
        textTransform: 'lowercase',
    },
});

export default styles;
