import { StyleSheet } from 'react-native';
import { THEME } from '@/Assets/Theme';
import { COLORS } from '@/Assets/Theme/colors';
import { ms } from '@/Assets/Theme/fontStyle';

const styles = StyleSheet.create({
    modalContainer: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    mainModalView: {
        backgroundColor: COLORS.cardBG,
        borderTopLeftRadius: ms(16),
        borderTopRightRadius: ms(16),
        padding: ms(16),
        maxHeight: '90%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: ms(16),
    },
    title: {
        ...THEME.fontStyle.h4Bold,
        color: COLORS.white,
    },
    searchContainer: {
        marginBottom: ms(16),
    },
    listContainer: {
        maxHeight: ms(400),
    },
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: ms(12),
        borderBottomWidth: 1,
        borderBottomColor: COLORS.outlineGrey,
    },
    userInfo: {
        flex: 1,
        marginLeft: ms(12),
    },
    userName: {
        ...THEME.fontStyle.h5Bold,
        color: COLORS.white,
    },
    userEmail: {
        ...THEME.fontStyle.h6Regular,
        color: COLORS.placeholder,
    },
    checkbox: {
        width: ms(20),
        height: ms(20),
        borderRadius: ms(4),
        borderWidth: 1,
        borderColor: COLORS.lightGray,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxSelected: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    footer: {
        marginTop: ms(16),
    },
    selectButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: ms(12),
        borderRadius: ms(8),
        alignItems: 'center',
    },
    selectButtonText: {
        ...THEME.fontStyle.h5Bold,
        color: COLORS.white,
    },
    footerText: {
        ...THEME.fontStyle.h6Regular,
        color: COLORS.placeholder,
        marginBottom: ms(8),
    },
});

export default styles;
