import { StyleSheet } from 'react-native';
import { COLORS } from '@/Assets/Theme/colors';
import { ms } from '@/Assets/Theme/fontStyle';
import { THEME } from '@/Assets/Theme';

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: COLORS.cardBG,
        borderRadius: ms(12),
        overflow: 'hidden',
        marginBottom: ms(16),
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    bannerImage: {
        width: '100%',
        height: ms(140),
        resizeMode: 'cover',
    },
    contentContainer: {
        padding: ms(12),
        paddingTop: ms(40), // Space for overlapping logo
    },
    logoContainer: {
        position: 'absolute',
        top: ms(100), // Overlap banner
        left: ms(12),
        width: ms(80),
        height: ms(80),
        borderRadius: ms(40),
        borderWidth: 2,
        borderColor: COLORS.cardBG,
        backgroundColor: COLORS.black,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        zIndex: 1,
    },
    logoImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    tagsContainer: {
        flexDirection: 'row',
        position: 'absolute',
        top: ms(148), // Just below banner line
        left: ms(100), // Right of logo
        flexWrap: 'wrap',
        gap: ms(8),
    },
    tag: {
        paddingHorizontal: ms(10),
        paddingVertical: ms(4),
        borderRadius: ms(12),
        borderWidth: 1,
        borderColor: COLORS.outlineGrey,
        backgroundColor: 'transparent',
    },
    tagText: {
        ...THEME.fontStyle.h6Regular,
        color: COLORS.white,
        fontSize: ms(10),
    },
    communityName: {
        ...THEME.fontStyle.h4Bold,
        color: COLORS.white,
        marginTop: ms(8),
        marginBottom: ms(4),
    },
    description: {
        ...THEME.fontStyle.h6Regular,
        color: COLORS.gray,
        marginBottom: ms(16),
        lineHeight: ms(18),
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: ms(12),
    },
    viewButton: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: ms(20),
        paddingVertical: ms(8),
        borderRadius: ms(20),
    },
    settingsButton: {
        backgroundColor: COLORS.uploadBG,
        paddingHorizontal: ms(20),
        paddingVertical: ms(8),
        borderRadius: ms(20),
    },
    buttonText: {
        ...THEME.fontStyle.h5Bold,
        color: COLORS.white,
        fontSize: ms(12),
    },
});

export default styles;
