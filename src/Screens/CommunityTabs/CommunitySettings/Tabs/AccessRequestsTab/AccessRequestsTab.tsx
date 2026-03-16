import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import styles from './style';
import { COLORS } from '@/Assets/Theme/colors';
import Icon from '@/Components/Core/Icons';
import { ms } from '@/Assets/Theme/fontStyle';
import useUserApi from '@/Hooks/Apis/UserApis/use-user-api';
import AccessRequestsSkeleton from '@/Components/Core/Skeleton/AccessRequestsSkeleton';

interface Props {
  communityId?: string;
  slug?: string;
}

const AccessRequestsTab = ({ slug }: Props) => {
  const {
    updateMemberAutoApprove,
    apiUpdateMemberAutoApproveLoading,
    getMemberAutoApprove,
    apiGetMemberAutoApproveLoading,
    clearMemberAutoApproveState,
  } = useUserApi();
  const [accessRequestAcceptance, setAccessRequestAcceptance] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);

  React.useEffect(() => {
    if (slug) {
      setIsPageLoading(true);
      clearMemberAutoApproveState();
      handleFetchSettings();
    }
  }, [slug]);

  const handleFetchSettings = async () => {
    const res = await getMemberAutoApprove(slug!);
    if (res?.success) {
      setAccessRequestAcceptance(res?.data?.autoApproveMembers ?? false);
    }
    setIsPageLoading(false);
  };

  const handleSaveChanges = async () => {
    if (slug) {
      await updateMemberAutoApprove(slug, {
        autoApproveMembers: accessRequestAcceptance,
      });
    }
  };

  if (isPageLoading) {
    return <AccessRequestsSkeleton />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Access Request Settings</Text>
        <Text style={styles.subtitle}>
          Configure how access requestes are handled for your community
        </Text>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.optionContainer}>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>
              Automatic Access Request Acceptance
            </Text>
            <Text style={styles.optionDescription}>
              {accessRequestAcceptance
                ? 'When enabled, users are automatically added to the community when they send a join request, No manual approval is required'
                : 'When disabled, you must manually approve each join request. Users will remain in pending status until you accept or reject their request.'}
            </Text>
          </View>
          <Switch
            ios_backgroundColor={COLORS.outlineGrey}
            trackColor={{ false: COLORS.outlineGrey, true: COLORS.primary }}
            thumbColor={COLORS.white}
            onValueChange={setAccessRequestAcceptance}
            value={accessRequestAcceptance}
            disabled={apiUpdateMemberAutoApproveLoading}
          />
        </View>

        <View style={styles.infoContainer}>
          <Icon name="Info" size={ms(20)} color={COLORS.white} />
          <Text style={styles.infoText}>
            <Text style={styles.boldText}>
              {accessRequestAcceptance
                ? 'Auto-approval is enabled.'
                : 'Manual approval is required.'}
            </Text>{' '}
            {accessRequestAcceptance
              ? 'All new join requests will be automatically accepted and users will be added to your community immediately.'
              : 'You will need to review and approve each join request manually. Users will be notified when their request is approved or rejected.'}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.buttonContainer,
          apiUpdateMemberAutoApproveLoading && { opacity: 0.7 },
        ]}
        onPress={handleSaveChanges}
        disabled={apiUpdateMemberAutoApproveLoading}
      >
        {apiUpdateMemberAutoApproveLoading ? (
          <ActivityIndicator color={COLORS.white} />
        ) : (
          <Text style={styles.buttonText}>Save Changes</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default AccessRequestsTab;
