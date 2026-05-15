import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import Modal from 'react-native-modal';
import Icon from '@/Components/Core/Icons';
import { COLORS } from '@/Assets/Theme/colors';
import { THEME } from '@/Assets/Theme';
import { ms, mvs } from '@/Assets/Theme/fontStyle';

interface Props {
  isVisible: boolean;
  onClose: () => void;
  channelData: any;
  members: any[];
}

const ChannelDetailsModal = ({
  isVisible,
  onClose,
  channelData,
  members,
}: Props) => {
  const renderMember = ({ item }: { item: any }) => {
    const isAdmin = item?.isAdmin; // item.role === 'admin' || item.role === 'owner';
    const initials = item.firstName ? item.firstName[0] : 'U';

    return (
      <View style={styles.memberRow}>
        <View style={styles.memberAvatar}>
          {item.profilePicture?.url ? (
            <Image
              source={{ uri: item.profilePicture.url }}
              style={styles.avatarImg}
            />
          ) : (
            <Text style={styles.avatarTxt}>{initials}</Text>
          )}
        </View>
        <View style={styles.memberInfo}>
          <Text style={styles.memberName}>
            {item.firstName} {item.lastName}
          </Text>
          <Text style={styles.memberEmail}>{item.email}</Text>
        </View>
        {isAdmin && (
          <View
            style={[
              styles.roleBadge,
              item.role === 'owner' ? styles.ownerBadge : styles.adminBadge,
            ]}
          >
            <Text style={styles.roleText}>
              {item.role === 'owner' ? 'OWNER' : 'ADMIN'}
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection="down"
      style={styles.modal}
      propagateSwipe
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationInTiming={350}
      animationOutTiming={300}
      backdropTransitionInTiming={350}
      backdropTransitionOutTiming={0}
      hideModalContentWhileAnimating
      useNativeDriver
      useNativeDriverForBackdrop
      statusBarTranslucent
    >
      <View style={styles.container}>
        <View style={styles.handle} />

        <View style={styles.header}>
          <Text style={styles.headerTitle}>Channel Details</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Icon name="X" size={20} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.channelIcon}>
            <Text style={styles.hash}>#</Text>
          </View>
          <Text style={styles.channelName}>
            {channelData?.name || 'General'}
          </Text>
          <Text style={styles.channelDesc}>
            {channelData?.description ||
              'No description provided for this channel.'}
          </Text>
        </View>

        <View style={styles.membersSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>MEMBERS</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{members.length}</Text>
            </View>
          </View>

          <FlatList
            data={members}
            renderItem={renderMember}
            keyExtractor={item => item._id || item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: COLORS.cardBG,
    borderTopLeftRadius: ms(20),
    borderTopRightRadius: ms(20),
    height: '80%',
    paddingBottom: ms(20),
  },
  handle: {
    width: ms(40),
    height: mvs(4),
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: ms(2),
    alignSelf: 'center',
    marginTop: mvs(10),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: ms(20),
    paddingVertical: mvs(15),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.input,
  },
  headerTitle: {
    ...THEME.fontStyle.h4Bold,
  },
  closeBtn: {
    padding: ms(5),
  },
  infoSection: {
    alignItems: 'center',
    padding: ms(20),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.input,
  },
  channelIcon: {
    width: ms(60),
    height: ms(60),
    borderRadius: ms(30),
    backgroundColor: COLORS.innerCardBG,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: mvs(12),
  },
  hash: {
    ...THEME.fontStyle.h2Bold,
    color: COLORS.primary,
  },
  channelName: {
    ...THEME.fontStyle.h3Bold,
    marginBottom: mvs(6),
  },
  channelDesc: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.subText,
    textAlign: 'center',
  },
  membersSection: {
    flex: 1,
    paddingTop: mvs(20),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: ms(20),
    marginBottom: mvs(15),
    gap: ms(10),
  },
  sectionTitle: {
    ...THEME.fontStyle.h5Bold,
    letterSpacing: 0.5,
  },
  countBadge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: ms(8),
    paddingVertical: mvs(2),
    borderRadius: ms(10),
  },
  countText: {
    ...THEME.fontStyle.h6Bold,
    color: COLORS.primary,
  },
  listContent: {
    paddingHorizontal: ms(20),
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: mvs(12),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  memberAvatar: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(20),
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: ms(12),
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    borderRadius: ms(20),
  },
  avatarTxt: {
    ...THEME.fontStyle.h4Bold,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    ...THEME.fontStyle.h5SemiBold,
  },
  memberEmail: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.subText,
    marginTop: mvs(2),
  },
  roleBadge: {
    paddingHorizontal: ms(8),
    paddingVertical: mvs(2),
    borderRadius: ms(4),
  },
  ownerBadge: {
    backgroundColor: 'rgba(255, 193, 7, 0.2)',
  },
  adminBadge: {
    backgroundColor: 'rgba(33, 150, 243, 0.2)',
  },
  roleText: {
    ...THEME.fontStyle.h6SemiBold,
  },
});

export default ChannelDetailsModal;
