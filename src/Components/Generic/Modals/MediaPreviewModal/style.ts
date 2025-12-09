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
    }
});

export default styles;
