import { StyleSheet } from 'react-native';
import { COLORS } from '@/Assets/Theme/colors';
import { ms } from '@/Assets/Theme/fontStyle';

const styles = StyleSheet.create({
    modalContainer: {
        margin: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.black,
    },
    container: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: ms(40),
        right: ms(20),
        zIndex: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: ms(20),
        padding: ms(8),
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    errorText: {
        color: COLORS.white,
        marginTop: ms(20),
    },
    video: {
        width: '100%',
        height: '100%',
    },
    audioPanel: {
        width: '88%',
        maxWidth: ms(360),
        alignItems: 'center',
        paddingHorizontal: ms(20),
        paddingVertical: ms(28),
        borderRadius: ms(16),
        backgroundColor: 'rgba(255,255,255,0.08)',
    },
    audioIconBox: {
        width: ms(72),
        height: ms(72),
        borderRadius: ms(14),
        backgroundColor: 'rgba(155, 89, 182, 0.35)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: ms(16),
    },
    audioTitle: {
        color: COLORS.white,
        fontSize: ms(15),
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: ms(24),
    },
    audioPlayButton: {
        width: ms(64),
        height: ms(64),
        borderRadius: ms(32),
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: ms(16),
    },
    audioTimeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: ms(6),
    },
    audioTimeText: {
        color: 'rgba(255,255,255,0.75)',
        fontSize: ms(13),
    },
    audioHiddenVideo: {
        width: 1,
        height: 1,
        opacity: 0,
        position: 'absolute',
        left: -9999,
    },
});

export default styles;
