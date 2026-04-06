import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Clipboard,
} from 'react-native';
import Modal from 'react-native-modal';
import { COLORS } from '@/Assets/Theme/colors';
import Icon from '@/Components/Core/Icons';
import ToastModule from '@/Components/Core/Toast';
import styles from './style';

interface CommunityReferralModalProps {
  isVisible: boolean;
  onClose: () => void;
  communityName?: string;
  creatorName?: string;
  referralData?: {
    code?: string;
    success?: boolean;
    percentage?: number;
  };
  isLoading?: boolean;
  slug?: string;
  username?: string;
}


const CommunityReferralModal: React.FC<CommunityReferralModalProps> = ({
  isVisible,
  onClose,
  communityName,
  creatorName,
  referralData,
  isLoading,
  slug,
  username,
}) => {
  console.log('🚀 ~ CommunityReferralModal ~ referralData:', referralData);
  const referralCode = referralData?.code || '';
  const referralLink = `https://bellndesk.com/${
    slug || ''
  }?ref=${username || referralCode}`;


  const handleCopy = () => {
    if (referralLink) {
      Clipboard.setString(referralLink);
      ToastModule.successTop({ msg: 'Link copied to clipboard!' });
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection="down"
      style={styles.modalContainer}
      backdropOpacity={0.5}
    >
      <View style={styles.mainModalView}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Icon name="UserPlus" size={24} color={COLORS.primary} />
            <Text style={styles.title} numberOfLines={1}>
              Refer Friends to {communityName} by {creatorName}
            </Text>
          </View>
          <TouchableOpacity onPress={onClose}>
            <Icon name="X" size={24} color={COLORS.subText} />
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : (
          <View style={styles.contentSection}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Member Referral Link</Text>
              {referralCode ? (
                <View style={styles.codeBadge}>
                  <Text style={styles.codeText}>Code: {referralCode}</Text>
                </View>
              ) : null}
            </View>

            <Text style={styles.description}>
              Share this link to invite friends. You'll earn rewards when they
              join!
            </Text>

            <View style={styles.linkContainer}>
              <Icon
                name="Link"
                size={18}
                color={COLORS.subText}
                style={styles.linkIcon}
              />
              <Text style={styles.linkText} numberOfLines={2}>
                {referralLink}
              </Text>
              <TouchableOpacity style={styles.copyButton} onPress={handleCopy}>
                <Icon name="Copy" size={16} color={COLORS.white} />
                <Text style={styles.copyButtonText}>Copy</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
};

export default CommunityReferralModal;
