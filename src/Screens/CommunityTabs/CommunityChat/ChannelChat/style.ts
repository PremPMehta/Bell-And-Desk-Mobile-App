import { THEME } from '@/Assets/Theme';
import { COLORS } from '@/Assets/Theme/colors';
import { ms, mvs, vs } from '@/Assets/Theme/fontStyle';
import { StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: ms(16),
    paddingVertical: mvs(12),
    backgroundColor: COLORS.header,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  backBtn: {
    padding: ms(8),
    marginRight: ms(8),
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    ...THEME.fontStyle.h4Bold,
    color: COLORS.white,
  },
  headerSubTitle: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.subText,
    marginTop: mvs(2),
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: ms(16),
    paddingBottom: ms(20),
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: mvs(16),
    gap: ms(8),
  },
  messageRowMe: {
    flexDirection: 'row-reverse',
  },
  avatar: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(16),
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: ms(16),
  },
  avatarText: {
    ...THEME.fontStyle.h5Bold,
    color: COLORS.white,
  },
  bubble: {
    maxWidth: '75%',
    paddingHorizontal: ms(12),
    paddingVertical: mvs(8),
    borderRadius: ms(16),
  },
  bubbleMe: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: ms(4),
  },
  bubbleThem: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderBottomLeftRadius: ms(4),
  },
  senderName: {
    ...THEME.fontStyle.h6Bold,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: mvs(2),
  },
  msgText: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.white,
    lineHeight: ms(20),
  },
  timeText: {
    ...THEME.fontStyle.h6Regular,
    color: 'rgba(255,255,255,0.3)',
    fontSize: ms(10),
    marginTop: mvs(4),
    alignSelf: 'flex-end',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: ms(12),
    paddingTop: mvs(10),
    // paddingBottom: vs(10),
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    backgroundColor: COLORS.black,
    gap: ms(8),
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: ms(20),
    paddingHorizontal: ms(16),
    paddingVertical: mvs(10),
    ...THEME.fontStyle.h5Regular,
    // color: COLORS.white,
    maxHeight: mvs(100),
  },
  sendBtn: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(20),
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnDisabled: {
    opacity: 0.4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.black,
  },
});

export default styles;
