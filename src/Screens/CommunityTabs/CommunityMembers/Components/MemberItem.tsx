import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { THEME } from '@/Assets/Theme';
import { COLORS } from '@/Assets/Theme/colors';
import { ms } from '@/Assets/Theme/fontStyle';
import Icon from '@/Components/Core/Icons';

interface MemberItemProps {
  name: string;
  email: string;
  joinedDate: string;
  status: 'Active' | 'Inactive' | 'Banned'; // Add other statuses as needed
  role: 'Owner' | 'Subscriber';
  profileImage?: string; // Placeholder for now, assume avatar logic later if needed
  onBlockPress?: () => void;
  type: 'Free' | 'Paid';
}

const MemberItem: React.FC<MemberItemProps> = ({
  name,
  email,
  joinedDate,
  role,
  onBlockPress,
  type,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.userInfo}>
          {/* Placeholder Avatar Circle */}
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.email}>{email}</Text>
          </View>
        </View>

        <TouchableOpacity onPress={onBlockPress} style={styles.blockButton}>
          <Icon name="Ban" size={20} color={COLORS.red} />
        </TouchableOpacity>
      </View>

      <View style={styles.separator} />

      <View style={styles.bottomRow}>
        <View>
          <Text style={styles.joinedLabel}>Joined</Text>
          <Text style={styles.joinedDate}>{joinedDate}</Text>
        </View>

        <View style={styles.badgesContainer}>
          {type === 'Free' && (
            <View style={styles.badge}>
              <>
                <Icon
                  name="User"
                  size={12}
                  color={COLORS.white}
                  style={styles.badgeIcon}
                />
                <Text style={styles.badgeText}>{type}</Text>
              </>
            </View>
          )}
          {role === 'Owner' && (
            <View style={[styles.badge, styles.ownerStyle]}>
              <Text style={styles.badgeText}>Owner</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default MemberItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.cardBG,
    borderRadius: ms(12),
    padding: ms(16),
    marginBottom: ms(16),
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: ms(16),
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(20),
    backgroundColor: COLORS.border, // Or a specific avatar bg color
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: ms(12),
  },
  avatarText: {
    ...THEME.fontStyle.h4Bold,
    color: COLORS.white,
  },
  textContainer: {
    justifyContent: 'center',
  },
  name: {
    ...THEME.fontStyle.h4Bold,
    color: COLORS.white,
  },
  email: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.placeholder,
  },
  blockButton: {
    padding: ms(8),
    backgroundColor: 'rgba(255, 99, 71, 0.1)', // Light red background
    borderRadius: ms(8),
    borderWidth: 1,
    borderColor: 'rgba(255, 99, 71, 0.3)',
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: ms(16),
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  joinedLabel: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.placeholder,
    marginBottom: ms(4),
  },
  joinedDate: {
    ...THEME.fontStyle.h6Bold,
    color: COLORS.white,
  },
  badgesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: ms(20),
    paddingHorizontal: ms(12),
    paddingVertical: ms(4),
  },
  badgeIcon: {
    marginRight: ms(4),
  },
  badgeText: {
    ...THEME.fontStyle.h7Bold,
    color: COLORS.white,
  },
  ownerStyle: {
    marginLeft: ms(8),
    backgroundColor: COLORS.primary,
  },
});
