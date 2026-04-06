import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { THEME } from '@/Assets/Theme';
import { COLORS } from '@/Assets/Theme/colors';
import { ms } from '@/Assets/Theme/fontStyle';
import Icon from '@/Components/Core/Icons';

interface PendingMemberItemProps {
  name: string;
  email: string;
  message?: string;
  date: string;
  onAccept: () => void;
  onReject: () => void;
  isAccepting?: boolean;
  isRejecting?: boolean;
}

const PendingMemberItem: React.FC<PendingMemberItemProps> = ({
  name,
  email,
  message,
  date,
  onAccept,
  onReject,
  isAccepting,
  isRejecting,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.name} numberOfLines={1}>{name}</Text>
            <Text style={styles.email} numberOfLines={1}>{email}</Text>
          </View>
        </View>
        <View style={styles.dateContainer}>
          <Text style={styles.dateLabel}>Requested</Text>
          <Text style={styles.dateValue}>{date}</Text>
        </View>
       </View>

      {message ? (
        <View style={styles.messageBox}>
          <Icon name="MessageSquare" size={14} color={COLORS.placeholder} style={styles.messageIcon} />
          <Text style={styles.messageText}>"{message}"</Text>
        </View>
      ) : null}

      <View style={styles.separator} />

      <View style={styles.actionRow}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.rejectButton]} 
          onPress={onReject}
          disabled={isAccepting || isRejecting}
        >
          {isRejecting ? (
            <ActivityIndicator size="small" color={COLORS.red} />
          ) : (
            <>
              <Icon name="XCircle" size={18} color={COLORS.red} />
              <Text style={styles.rejectText}>Reject</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.acceptButton]} 
          onPress={onAccept}
          disabled={isAccepting || isRejecting}
        >
          {isAccepting ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <>
              <Icon name="CheckCircle" size={18} color={COLORS.white} />
              <Text style={styles.acceptText}>Accept</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PendingMemberItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.cardBG,
    borderRadius: ms(16),
    padding: ms(16),
    marginBottom: ms(16),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: ms(12),
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: ms(44),
    height: ms(44),
    borderRadius: ms(22),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: ms(12),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  avatarText: {
    ...THEME.fontStyle.h4Bold,
    color: COLORS.white,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    ...THEME.fontStyle.h4Bold,
    color: COLORS.white,
  },
  email: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.placeholder,
    marginTop: ms(2),
  },
  dateContainer: {
    alignItems: 'flex-end',
    marginLeft: ms(8),
  },
  dateLabel: {
    ...THEME.fontStyle.h7Regular,
    color: COLORS.placeholder,
    marginBottom: ms(2),
  },
  dateValue: {
    ...THEME.fontStyle.h7Bold,
    color: COLORS.placeholder,
  },
  messageBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: ms(10),
    padding: ms(10),
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: ms(16),
  },
  messageIcon: {
    marginTop: ms(2),
    marginRight: ms(8),
  },
  messageText: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.white,
    flex: 1,
    fontStyle: 'italic',
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: ms(16),
  },
  actionRow: {
    flexDirection: 'row',
    gap: ms(12),
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: ms(10),
    borderRadius: ms(10),
    gap: ms(8),
  },
  acceptButton: {
    backgroundColor: COLORS.primary,
  },
  rejectButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255, 99, 71, 0.5)',
  },
  acceptText: {
    ...THEME.fontStyle.h5Bold,
    color: COLORS.white,
  },
  rejectText: {
    ...THEME.fontStyle.h5Bold,
    color: COLORS.red,
  },
});
