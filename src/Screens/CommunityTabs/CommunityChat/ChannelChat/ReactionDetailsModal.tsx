import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Platform,
  Pressable,
} from 'react-native';
import Modal from 'react-native-modal';
import Icon from '@/Components/Core/Icons';
import { COLORS } from '@/Assets/Theme/colors';
import { THEME } from '@/Assets/Theme';
import { ms, mvs } from '@/Assets/Theme/fontStyle';

interface Props {
  isVisible: boolean;
  onClose: () => void;
  message: any;
  currentUser: any;
  onRemoveReaction: (emoji: string) => void;
}

const normalizeId = (value: any): string => {
  if (value == null) return '';
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'object') {
    if (typeof value?.toHexString === 'function') return value.toHexString();
    if (value?._id != null) return String(value._id).trim();
    if (value?.id != null) return String(value.id).trim();
    if (typeof value?.$oid === 'string') return value.$oid.trim();
  }
  return String(value).trim();
};

const ReactionDetailsModal = ({
  isVisible,
  onClose,
  message,
  currentUser,
  onRemoveReaction,
}: Props) => {
  const reactions = message?.reactions || [];
  const [activeTab, setActiveTab] = useState('All');
  
  useEffect(() => {
    if (isVisible) {
      setActiveTab('All');
    }
  }, [isVisible]);

  const flattenedReactions = useMemo(() => {
    const result: any[] = [];
    reactions.forEach((group: any) => {
      if (group.users && Array.isArray(group.users)) {
        group.users.forEach((u: any) => {
          result.push({
            ...group,
            sender: u,
            senderId: u._id || u.id,
          });
        });
      } else {
        result.push(group);
      }
    });
    return result;
  }, [reactions]);

  const tabs = useMemo(() => {
    const counts: { [key: string]: number } = {};
    flattenedReactions.forEach((r: any) => {
      if (r?.emoji) {
        counts[r.emoji] = (counts[r.emoji] || 0) + 1;
      }
    });

    const result: { id: string; label: string; emoji: string | null }[] = [
      { id: 'All', label: `All ${flattenedReactions.length}`, emoji: null },
    ];
    Object.entries(counts).forEach(([emoji, count]) => {
      result.push({ id: emoji, label: `${count}`, emoji });
    });
    return result;
  }, [flattenedReactions]);

  const filteredReactions = useMemo(() => {
    if (activeTab === 'All') return flattenedReactions;
    return flattenedReactions.filter((r: any) => r.emoji === activeTab);
  }, [activeTab, flattenedReactions]);

  const renderReactionRow = ({ item }: { item: any }) => {
    const userObj = item.sender || item.user || item.member || {};
    const myId = normalizeId(currentUser?._id || currentUser?.id);
    const senderId = normalizeId(
      item.senderId || userObj?._id || userObj?.id || item.userId,
    );
    const isMe = !!myId && !!senderId && myId === senderId;

    const firstName = isMe
      ? 'You'
      : userObj.firstName ||
        userObj.name ||
        userObj.userName ||
        userObj.username ||
        'User';
    const lastName = isMe ? '' : userObj.lastName || '';
    const initials = isMe
      ? currentUser?.firstName
        ? currentUser.firstName[0]
        : 'Y'
      : userObj.firstName
      ? userObj.firstName[0]
      : userObj.name
      ? userObj.name[0]
      : 'U';
    const profilePic =
      userObj.profilePicture?.url || userObj.profilePic || userObj.avatar;

    return (
      <View style={styles.reactionRow}>
        <View style={styles.avatar}>
          {profilePic ? (
            <Image source={{ uri: profilePic }} style={styles.avatarImg} />
          ) : (
            <Text style={styles.avatarTxt}>{initials}</Text>
          )}
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>
            {firstName} {lastName}
          </Text>
          {isMe ? (
            <TouchableOpacity onPress={() => onRemoveReaction(item.emoji)}>
              <Text style={styles.removeText}>Click to remove</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.reactedInfo}>
              <Text style={styles.reactedEmoji}>{item.emoji}</Text>
              <Text style={styles.reactedText}> reacted</Text>
            </View>
          )}
        </View>
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
      backdropOpacity={0.5}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      useNativeDriver={true}
      useNativeDriverForBackdrop={true}
      hideModalContentWhileAnimating={true}
    >
      <View style={styles.container}>
        <View style={styles.handle} />

        <View style={styles.tabsContainer}>
          <FlatList
            horizontal
            data={tabs}
            keyExtractor={item => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsList}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => setActiveTab(item.id)}
                style={[
                  styles.tabItem,
                  activeTab === item.id && styles.activeTabItem,
                ]}
              >
                {item.emoji && (
                  <Text style={styles.tabEmoji}>{item.emoji}</Text>
                )}
                <Text
                  style={[
                    styles.tabLabel,
                    activeTab === item.id && styles.activeTabLabel,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>

        <FlatList
          data={filteredReactions}
          renderItem={renderReactionRow}
          keyExtractor={(item, index) =>
            `${normalizeId(item.senderId)}-${item.emoji}-${index}`
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No reactions yet</Text>
            </View>
          }
        />
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
    backgroundColor: '#1a1d21', // Dark background matching the screenshot
    borderTopLeftRadius: ms(20),
    borderTopRightRadius: ms(20),
    height: '50%',
    paddingBottom: ms(20),
  },
  handle: {
    width: ms(40),
    height: mvs(4),
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: ms(2),
    alignSelf: 'center',
    marginTop: mvs(10),
    marginBottom: mvs(10),
  },
  tabsContainer: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  tabsList: {
    paddingHorizontal: ms(16),
    paddingVertical: mvs(12),
    gap: ms(10),
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: ms(12),
    paddingVertical: mvs(6),
    borderRadius: ms(20),
    backgroundColor: 'rgba(255,255,255,0.05)',
    gap: ms(6),
  },
  activeTabItem: {
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  tabEmoji: {
    fontSize: ms(14),
  },
  tabLabel: {
    ...THEME.fontStyle.h6Bold,
    color: 'rgba(255,255,255,0.6)',
  },
  activeTabLabel: {
    color: COLORS.white,
  },
  listContent: {
    paddingHorizontal: ms(16),
    paddingVertical: mvs(10),
  },
  reactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: mvs(12),
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  avatar: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(20),
    backgroundColor: 'rgba(255,255,255,0.1)',
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
    ...THEME.fontStyle.h5Bold,
    color: COLORS.white,
  },
  info: {
    flex: 1,
  },
  name: {
    ...THEME.fontStyle.h5SemiBold,
    color: COLORS.white,
  },
  removeText: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.primary,
    marginTop: mvs(2),
  },
  reactedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: mvs(2),
  },
  reactedEmoji: {
    fontSize: ms(12),
  },
  reactedText: {
    ...THEME.fontStyle.h6Regular,
    color: 'rgba(255,255,255,0.5)',
  },
  emptyContainer: {
    paddingVertical: mvs(40),
    alignItems: 'center',
  },
  emptyText: {
    ...THEME.fontStyle.h5Regular,
    color: 'rgba(255,255,255,0.3)',
  },
});

export default ReactionDetailsModal;
