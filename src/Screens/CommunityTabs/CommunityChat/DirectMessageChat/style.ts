import { THEME } from '@/Assets/Theme';
import { COLORS } from '@/Assets/Theme/colors';
import { ms, mvs } from '@/Assets/Theme/fontStyle';
import { StyleSheet } from 'react-native';
import channelChatStyles from '../ChannelChat/style';

const styles = StyleSheet.create({
  ...channelChatStyles,
  headerAvatar: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(18),
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: ms(10),
  },
  headerAvatarImage: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(18),
  },
  headerAvatarText: {
    ...THEME.fontStyle.h5Bold,
    color: COLORS.white,
  },
});

export default styles;
