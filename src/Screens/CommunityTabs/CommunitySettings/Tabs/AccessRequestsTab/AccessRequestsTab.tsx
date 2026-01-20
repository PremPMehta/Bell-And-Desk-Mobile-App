import { View, Text, Switch, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import styles from './style';
import { COLORS } from '@/Assets/Theme/colors';
import Icon from '@/Components/Core/Icons';
import { ms } from '@/Assets/Theme/fontStyle';

const AccessRequestsTab = () => {
  const [accessRequestAcceptance, setAccessRequestAcceptance] = useState(false);

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
              When enabled, users are automatically added to the community when
              they send a join request, No manual approval is required
            </Text>
          </View>
          <Switch
            ios_backgroundColor={COLORS.outlineGrey}
            trackColor={{ false: COLORS.outlineGrey, true: COLORS.primary }}
            thumbColor={COLORS.white}
            onValueChange={setAccessRequestAcceptance}
            value={accessRequestAcceptance}
          />
        </View>

        <View style={styles.infoContainer}>
          <Icon name="Info" size={ms(20)} color={COLORS.white} />
          <Text style={styles.infoText}>
            <Text style={styles.boldText}>Auto-approval is enabled.</Text> All
            new join requests will be automatically accepted and users will be
            added to your community immediately.
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.buttonContainer}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AccessRequestsTab;
