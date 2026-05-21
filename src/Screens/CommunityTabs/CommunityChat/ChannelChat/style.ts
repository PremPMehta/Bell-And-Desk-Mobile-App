import { THEME } from '@/Assets/Theme';
import { COLORS } from '@/Assets/Theme/colors';
import { ms, mvs, sc, vs } from '@/Assets/Theme/fontStyle';
import { Dimensions, StyleSheet, Platform } from 'react-native';

// Keep attachment width inside bubble maxWidth (75%) minus horizontal padding.
const SCREEN_WIDTH = Dimensions.get('window').width;
const BUBBLE_MAX_WIDTH = SCREEN_WIDTH * 0.75;
const BUBBLE_MEDIA_PADDING = ms(8) * 2;
const ATTACHMENT_WIDTH = Math.min(
  sc(220),
  BUBBLE_MAX_WIDTH - BUBBLE_MEDIA_PADDING - ms(4),
);

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
  headerDeleteBtn: {
    padding: ms(8),
    marginLeft: ms(4),
  },
  bubbleSelectedWrap: {
    position: 'relative',
    borderWidth: 2,
    borderColor: COLORS.white,
    borderRadius: ms(20),
    borderBottomRightRadius: ms(6),
    padding: ms(2),
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  bubbleSelected: {
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  selectionBadge: {
    position: 'absolute',
    top: mvs(-8),
    right: ms(-8),
    width: ms(22),
    height: ms(22),
    borderRadius: ms(11),
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
    zIndex: 2,
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
  // IMPORTANT: flex:1 is required here so the bubble's `maxWidth: '75%'`
  // can resolve against the row width (not the bubble's own content width),
  // otherwise short messages collapse and the text wraps one character per line.
  bubbleWrapperMe: {
    flex: 1,
    alignItems: 'flex-end',
  },
  bubbleWrapperThem: {
    flex: 1,
    alignItems: 'flex-start',
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
    minWidth: 0,
    paddingHorizontal: ms(14),
    paddingTop: mvs(8),
    paddingBottom: mvs(7),
    borderRadius: ms(18),
  },
  bubbleMe: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: ms(4),
  },
  bubbleThem: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderBottomLeftRadius: ms(4),
  },
  // Extra space reserved when a reaction pill is overlapping the bubble bottom
  bubbleWithReaction: {
    marginBottom: mvs(14),
  },
  senderName: {
    ...THEME.fontStyle.h6Bold,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: mvs(2),
  },
  msgRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: ms(8),
  },
  msgText: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.white,
    lineHeight: ms(20),
  },
  // Transparent non-breaking spacer. It creates the visible gap before
  // the time and keeps the timestamp attached to the last word.
  timeSpacer: {
    ...THEME.fontStyle.h5Regular,
    color: 'transparent',
  },
  // Smaller, dimmer timestamp inlined at the end of the message <Text>.
  // Because it's nested inline, the platform's native text layout
  // baseline-aligns it with the message line — and the smaller font
  // size naturally makes it sit visually lower in the line box, which
  // is the WhatsApp look. Font/opacity tuned to match WhatsApp's look
  // on both light (gray "them") and dark/blue ("me") bubble backgrounds.
  timeTextInline: {
    ...THEME.fontStyle.h6Regular,
    color: 'rgba(255,255,255,0.65)',
    top: mvs(1),
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
    marginTop: 100,
  },
  typingIndicator: {
    paddingHorizontal: ms(16),
    paddingVertical: mvs(4),
  },
  typingText: {
    color: COLORS.subText,
    fontSize: ms(12),
    fontStyle: 'italic',
  },
  composer: {
    // flexDirection: 'row',
    // alignItems: 'center',
    // paddingHorizontal: ms(12),
    // paddingTop: mvs(10),
    // // paddingBottom: vs(10),
    // borderTopWidth: 1,
    // borderTopColor: 'rgba(255,255,255,0.08)',
    // backgroundColor: COLORS.black,
    // gap: ms(8),
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  inputMainContainer: {
    backgroundColor: COLORS.black,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255,255,255,0.1)',

    paddingHorizontal: 10,
    paddingTop: 10,
  },
  inputInnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(8),
  },
  fileContainer: {
    // padding: ms(8),
    transform: [{ rotate: '-45deg' }],
  },
  input: {
    flex: 1,
    ...THEME.fontStyle.h5Regular,
    backgroundColor: COLORS.input,
    borderRadius: ms(20),
    paddingHorizontal: ms(16),
    paddingVertical: mvs(10),
    // width: sc(50),
    // // color: COLORS.white,
    // maxHeight: mvs(100),

    // flex: 1,
    // color: COLORS.white,

    // minHeight: 40,
    // maxHeight: 120,

    // paddingTop: Platform.OS === 'ios' ? 10 : 8,
    // paddingBottom: Platform.OS === 'ios' ? 10 : 8,
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
  dateSeparator: {
    alignItems: 'center',
    marginVertical: mvs(20),
  },
  dateSeparatorText: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    ...THEME.fontStyle.h6Bold,
    color: COLORS.white,
    paddingHorizontal: ms(12),
    paddingVertical: mvs(4),
    borderRadius: ms(12),
    overflow: 'hidden',
  },
  // Reactions
  reactionContainer: {
    position: 'absolute',
    bottom: mvs(-5),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3a3a3c',
    borderRadius: ms(20),
    paddingHorizontal: ms(8),
    paddingVertical: mvs(3),
    minHeight: ms(24),
    // Solid border that visually "separates" the pill from the bubble
    borderWidth: 2,
    borderColor: COLORS.black,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 3,
    // Elevation for Android
    elevation: 4,
  },
  // Anchor the pill to the same side as the bubble's pointed corner
  reactionContainerMe: {
    right: ms(6),
  },
  reactionContainerThem: {
    left: ms(6),
  },
  reactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(2),
  },
  reactionEmoji: {
    fontSize: ms(13),
    lineHeight: ms(16),
  },
  reactionCount: {
    ...THEME.fontStyle.h6Bold,
    color: COLORS.white,
    fontSize: ms(11),
    marginLeft: ms(3),
  },
  bubbleWithMedia: {
    paddingHorizontal: ms(8),
    paddingTop: mvs(8),
    paddingBottom: mvs(8),
    overflow: 'hidden',
    minWidth: 0,
  },
  attachmentsContainer: {
    gap: mvs(6),
    marginBottom: mvs(2),
    width: ATTACHMENT_WIDTH,
    maxWidth: '100%',
    alignSelf: 'flex-start',
  },
  attachmentImageWrap: {
    width: ATTACHMENT_WIDTH,
    maxWidth: '100%',
    borderRadius: ms(12),
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  attachmentImage: {
    width: '100%',
    height: mvs(160),
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  attachmentVideoPlaceholder: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  attachmentPlayOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  attachmentPlayCircle: {
    width: ms(48),
    height: ms(48),
    borderRadius: ms(24),
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  attachmentFileWrap: {
    width: ATTACHMENT_WIDTH,
    maxWidth: '100%',
    overflow: 'hidden',
  },
  attachmentFileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(8),
    width: '100%',
    paddingVertical: mvs(8),
    paddingHorizontal: ms(8),
    borderRadius: ms(10),
    backgroundColor: 'rgba(0,0,0,0.22)',
    overflow: 'hidden',
  },
  attachmentFileIconBox: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(8),
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  attachmentFileContent: {
    flex: 1,
    minWidth: 0,
  },
  attachmentFileType: {
    ...THEME.fontStyle.h6Bold,
    color: 'rgba(255,255,255,0.55)',
    fontSize: ms(10),
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: mvs(2),
  },
  attachmentFileName: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.white,
    lineHeight: ms(16),
    fontSize: ms(12),
  },
  attachmentFileSize: {
    ...THEME.fontStyle.h6Regular,
    color: 'rgba(255,255,255,0.5)',
    marginTop: mvs(3),
    fontSize: ms(10),
  },
  attachmentFileOpen: {
    width: ms(24),
    height: ms(24),
    borderRadius: ms(12),
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  timeTextBlock: {
    alignSelf: 'flex-end',
    marginTop: mvs(2),
  },
  pendingAttachmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: mvs(10),
    paddingHorizontal: ms(4),
  },
  pendingAttachmentPreview: {
    width: ms(72),
    height: ms(72),
    borderRadius: ms(10),
    overflow: 'hidden',
    backgroundColor: COLORS.input,
  },
  pendingAttachmentImage: {
    width: '100%',
    height: '100%',
  },
  pendingAttachmentFilePreview: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: ms(8),
  },
  pendingAttachmentFileName: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.white,
    textAlign: 'center',
    marginTop: mvs(4),
  },
  pendingAttachmentRemove: {
    position: 'absolute',
    top: mvs(-6),
    right: ms(-6),
    width: ms(24),
    height: ms(24),
    borderRadius: ms(12),
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  pendingAttachmentWrap: {
    position: 'relative',
    marginRight: ms(12),
  },
});

export default styles;
