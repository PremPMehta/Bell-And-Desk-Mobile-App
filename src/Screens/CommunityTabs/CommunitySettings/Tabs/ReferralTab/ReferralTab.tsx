import { View, Text, Switch, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { RadioButton } from 'react-native-paper';
import styles from './style';
import { COLORS } from '@/Assets/Theme/colors';
import TextInputField from '@/Components/Core/TextInputField';
import DropdownField from '@/Components/Core/DropdownField';
import PrimaryButton from '@/Components/Core/PrimaryButton';
import Icon from '@/Components/Core/Icons';
import UserSelectionModal from '@/Components/Generic/Modals/UserSelectionModal';
import { THEME } from '@/Assets/Theme';

const MOCK_USERS = Array.from({ length: 20 }, (_, i) => ({
  id: (i + 1).toString(),
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
}));

const ReferralTab = () => {
  const [programEnabled, setProgramEnabled] = useState(false);

  // Commission Structure State
  const [commissionPercentage, setCommissionPercentage] = useState('15');

  // Access Control State
  const [accessControl, setAccessControl] = useState<'all' | 'specific'>('all');

  // Exceptions State
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<
    {
      id: string;
      name: string;
    }[]
  >([]);
  const [customPercentage, setCustomPercentage] = useState('15');
  const [exceptions, setExceptions] = useState<
    { id: string; name: string; email: string; percentage: string }[]
  >([]);

  // Whitelist State
  const [whitelistMembers, setWhitelistMembers] = useState<
    {
      id: string;
      name: string;
      email: string;
    }[]
  >([]);
  const [activeSelectionType, setActiveSelectionType] = useState<
    'exception' | 'whitelist' | null
  >(null);

  const handleUserSelect = (selectedIds: string[]) => {
    const members = selectedIds
      .map(id => MOCK_USERS.find(user => user.id === id))
      .filter((user): user is (typeof MOCK_USERS)[0] => !!user)
      .map(user => ({ id: user.id, name: user.name, email: user.email }));

    if (activeSelectionType === 'exception') {
      setSelectedMembers(members);
    } else if (activeSelectionType === 'whitelist') {
      setWhitelistMembers(members);
    }
  };

  const handleAddException = () => {
    if (selectedMembers.length > 0 && customPercentage) {
      let addedCount = 0;
      let duplicateCount = 0;
      const newExceptions = [...exceptions] as any;

      selectedMembers.forEach(member => {
        console.log('email checking --- ', member);

        if (!newExceptions.find(e => e.id === member.id)) {
          newExceptions.push({ ...member, percentage: customPercentage });
          addedCount++;
        } else {
          duplicateCount++;
        }
      });

      setExceptions(newExceptions);

      if (duplicateCount > 0) {
        Alert.alert(
          'Duplicates Found',
          `${duplicateCount} member(s) were already in the exception list and were not added again.`,
        );
      }

      // Reset fields
      setSelectedMembers([]);
      setCustomPercentage('15');
    }
  };

  const handleRemoveException = (id: string) => {
    setExceptions(exceptions.filter(e => e.id !== id));
  };

  const getSelectedMembersLabel = () => {
    if (selectedMembers.length === 0) return '';
    if (selectedMembers.length === 1) return selectedMembers[0].name;
    return `${selectedMembers.length} Members Selected`;
  };

  const getWhitelistMembersLabel = () => {
    if (whitelistMembers.length === 0) return '';
    if (whitelistMembers.length === 1) return whitelistMembers[0].name;
    return `${whitelistMembers.length} Members Selected`;
  };

  const openExceptionModal = () => {
    setActiveSelectionType('exception');
    setShowMemberModal(true);
  };

  const openWhitelistModal = () => {
    setActiveSelectionType('whitelist');
    setShowMemberModal(true);
  };

  return (
    <View style={styles.container}>
      {/* Header / Enable Toggle */}
      <View style={styles.headerContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Member Referral Program</Text>
          <Text style={styles.subtitle}>
            Incentivize members to bring new students to your courses.
          </Text>
        </View>
        <Switch
          value={programEnabled}
          onValueChange={setProgramEnabled}
          trackColor={{ false: COLORS.outlineGrey, true: COLORS.primary }}
          thumbColor={COLORS.white}
          ios_backgroundColor={COLORS.outlineGrey}
        />
      </View>

      {/* Commission Structure */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Commission Structure</Text>
        <TextInputField
          label="Commission Percentage"
          value={commissionPercentage}
          onChangeText={setCommissionPercentage}
          keyboardType="numeric"
          rightIcon="percent"
          theme={{
            colors: {
              background: COLORS.innerCardBG,
              text: COLORS.white,
              placeholder: COLORS.outlineGrey,
            },
          }}
          textColor={COLORS.white}
          outlineColor={COLORS.outlineGrey}
          activeOutlineColor={COLORS.white}
        />
        <Text style={styles.inputHelperText}>
          Percentage of course sales given to the referrer (0-100)
        </Text>
      </View>

      {/* Access Control */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Access Control</Text>
        <Text style={styles.sectionSubHeader}>
          Who can generate referral codes?
        </Text>

        <View style={styles.radioGroup}>
          <TouchableOpacity
            style={styles.radioItem}
            onPress={() => setAccessControl('all')}
            activeOpacity={0.8}
          >
            <RadioButton.Android
              value="all"
              status={accessControl === 'all' ? 'checked' : 'unchecked'}
              onPress={() => setAccessControl('all')}
              color={COLORS.primary}
              uncheckedColor={COLORS.outlineGrey}
            />
            <Text style={styles.radioLabel}>All Members</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.radioItem}
            onPress={() => setAccessControl('specific')}
            activeOpacity={0.8}
          >
            <RadioButton.Android
              value="specific"
              status={accessControl === 'specific' ? 'checked' : 'unchecked'}
              onPress={() => setAccessControl('specific')}
              color={COLORS.primary}
              uncheckedColor={COLORS.outlineGrey}
            />
            <Text style={styles.radioLabel}>Specific Members (Whitelist)</Text>
          </TouchableOpacity>
        </View>

        {accessControl === 'specific' && (
          <View style={{ marginTop: 16 }}>
            <DropdownField
              label="Search Members"
              value={getWhitelistMembersLabel()}
              placeholder="Select Members"
              onPress={openWhitelistModal}
              rightIcon="chevron-down"
              theme={{
                colors: {
                  background: COLORS.innerCardBG,
                  text: COLORS.white,
                  placeholder: COLORS.outlineGrey,
                },
              }}
              textColor={COLORS.white}
              outlineColor={COLORS.outlineGrey}
              activeOutlineColor={COLORS.white}
            />
            <Text style={styles.inputHelperText}>
              Only whitelisted members will be able to generate referral codes.
            </Text>
          </View>
        )}
      </View>

      {/* Commission Exceptions */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Commission Exceptions</Text>
        <Text style={styles.sectionSubHeader}>
          Set custom commission percentages for specific members (overrides
          default).
        </Text>

        <View style={styles.row}>
          <View style={[styles.exceptionInputContainer, { flex: 2 }]}>
            <DropdownField
              label="Search Member for Exception"
              value={getSelectedMembersLabel()}
              placeholder="Select Member"
              onPress={openExceptionModal}
              rightIcon="chevron-down"
              theme={{
                colors: {
                  background: COLORS.innerCardBG,
                  text: COLORS.white,
                  placeholder: COLORS.outlineGrey,
                },
              }}
              textColor={COLORS.white}
              outlineColor={COLORS.outlineGrey}
              activeOutlineColor={COLORS.white}
            />
          </View>
          <View style={[styles.exceptionInputContainer, { flex: 1 }]}>
            <TextInputField
              label="Custom %"
              value={customPercentage}
              onChangeText={setCustomPercentage}
              keyboardType="numeric"
              theme={{
                colors: {
                  background: COLORS.innerCardBG,
                  text: COLORS.white,
                  placeholder: COLORS.outlineGrey,
                },
              }}
              textColor={COLORS.white}
              outlineColor={COLORS.outlineGrey}
              activeOutlineColor={COLORS.white}
            />
          </View>
        </View>
        <TouchableOpacity
          onPress={handleAddException}
          style={[
            styles.addButton,
            selectedMembers.length === 0 && { opacity: 0.5 },
          ]}
          disabled={selectedMembers.length === 0}
        >
          <Icon name="CirclePlus" size={14} color={COLORS.white} />
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>

        <View style={styles.exceptionListContainer}>
          {exceptions.length === 0 ? (
            <Text style={styles.emptyText}>No exceptions added yet.</Text>
          ) : (
            exceptions.map(item => (
              <View key={item.id} style={styles.exceptionItem}>
                <View style={styles.exceptionUserIcon}>
                  <Icon name="User" size={18} color={COLORS.white} />
                </View>
                <View style={styles.exceptionUserInfo}>
                  <Text style={styles.exceptionUser}>{item.name}</Text>
                  <Text style={styles.exceptionUser}>{item.email}</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Text style={styles.exceptionValue}>{item.percentage}%</Text>
                  <TouchableOpacity
                    onPress={() => handleRemoveException(item.id)}
                    style={{ marginLeft: 16 }}
                  >
                    <Icon name="Trash2" size={18} color={COLORS.red} />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </View>

      <TouchableOpacity onPress={() => {}} style={styles.saveButtonContainer}>
        <Text style={styles.saveButton}>Save Settings</Text>
      </TouchableOpacity>

      <UserSelectionModal
        visible={showMemberModal}
        onClose={() => setShowMemberModal(false)}
        onSelect={handleUserSelect}
        initialSelectedIds={
          activeSelectionType === 'whitelist'
            ? whitelistMembers.map(m => m.id)
            : selectedMembers.map(m => m.id)
        }
      />
    </View>
  );
};

export default ReferralTab;
