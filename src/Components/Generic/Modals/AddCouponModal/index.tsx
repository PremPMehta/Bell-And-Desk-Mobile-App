import { View, Text, TouchableOpacity, Platform, Alert, Switch } from 'react-native';
import React, { useState } from 'react';
import Modal from 'react-native-modal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS } from '@/Assets/Theme/colors';
import Icon from '@/Components/Core/Icons';
import TextInputField from '@/Components/Core/TextInputField';
import CommonListModal from '@/Components/Generic/Modals/CommonListModal';
import UserSelectionModal from '@/Components/Generic/Modals/UserSelectionModal';
import styles from './style';
import useUserApi from '@/Hooks/Apis/UserApis/use-user-api';

interface AddCouponModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (couponData: CouponData, couponId?: string) => void;
  communityId?: string;
  initialData?: any; // coupon object from API for edit mode
  couponId?: string; // _id of coupon being edited
}

export interface CouponData {
  name: string;
  discountPercentage: number;
  discountMonths: number;
  allowedUsers: 'all' | 'selected' | 'new';
  startDate: Date | null;
  endDate: Date | null;
  selectedUserIds?: string[];
  visibilityDurationMonths: string;
  autoIncludeNewUsers: boolean;
  newUserStartDate: Date | null;
  newUserEndDate: Date | null;
  visibleOnMemberSide: boolean;
}

const AddCouponModal: React.FC<AddCouponModalProps> = ({
  visible,
  onClose,
  onSubmit,
  communityId,
  initialData,
  couponId,
}) => {
  const isEditMode = !!initialData;
  const { getCommunityMembers, apiGetCommunityMembersLoading, apiGetCommunityMembers } = useUserApi();
  const [couponName, setCouponName] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [discountMonths, setDiscountMonths] = useState('');
  const [allowedUsers, setAllowedUsers] = useState<'all' | 'selected' | 'new'>(
    'all',
  );
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [showUserSelectionModal, setShowUserSelectionModal] = useState(false);
  const [visibilityDuration, setVisibilityDuration] = useState('');
  const [autoIncludeNewUsers, setAutoIncludeNewUsers] = useState(false);
  const [registrationStartDate, setRegistrationStartDate] = useState<Date | undefined>(undefined);
  const [registrationEndDate, setRegistrationEndDate] = useState<Date | undefined>(undefined);
  const [showRegStartDatePicker, setShowRegStartDatePicker] = useState(false);
  const [showRegEndDatePicker, setShowRegEndDatePicker] = useState(false);
  const [showOnMemberSide, setShowOnMemberSide] = useState(true);
  const [fetchedUsers, setFetchedUsers] = useState<any[]>([]);

  const isAll = allowedUsers === 'all';
  const isSelected = allowedUsers === 'selected';
  const isNew = allowedUsers === 'new';

  const fetchMembers = async () => {
    if (communityId) {
      const res = await getCommunityMembers(communityId, '?limit=1000&page=1');
      if (res?.data?.members) {
        const formattedUsers = res.data.members.map((member: any) => ({
          id: member.id || member._id,
          name: member.firstName && member.lastName ? `${member.firstName} ${member.lastName}` : member.firstName || 'Unknown',
          email: member.email || '',
        }));
        setFetchedUsers(formattedUsers);
      }
    }
  };

  React.useEffect(() => {
    if (isSelected && communityId && fetchedUsers.length === 0) {
       fetchMembers();
    }
  }, [isSelected, communityId]);

  // Prefill form data when in edit mode and modal opens
  React.useEffect(() => {
    if (visible && initialData) {
      setCouponName(initialData.name || '');
      setDiscountPercentage(String(initialData.discountPercentage || ''));
      const months = initialData.discountMonths;
      setDiscountMonths(months ? `${months} month${months > 1 ? 's' : ''}` : '');
      setAllowedUsers(initialData.allowedUsers || 'all');
      setStartDate(initialData.startDate ? new Date(initialData.startDate) : undefined);
      setEndDate(initialData.endDate ? new Date(initialData.endDate) : undefined);
      setSelectedUserIds(initialData.selectedUserIds || []);
      setVisibilityDuration(initialData.visibilityDurationMonths ? String(initialData.visibilityDurationMonths) : '');
      setAutoIncludeNewUsers(initialData.autoIncludeNewUsers || false);
      setRegistrationStartDate(initialData.newUserStartDate ? new Date(initialData.newUserStartDate) : undefined);
      setRegistrationEndDate(initialData.newUserEndDate ? new Date(initialData.newUserEndDate) : undefined);
      setShowOnMemberSide(initialData.visibleOnMemberSide || false);
    } else if (visible && !initialData) {
      // Reset form for create mode
      setCouponName('');
      setDiscountPercentage('');
      setDiscountMonths('');
      setAllowedUsers('all');
      setStartDate(undefined);
      setEndDate(undefined);
      setSelectedUserIds([]);
      setVisibilityDuration('');
      setAutoIncludeNewUsers(false);
      setRegistrationStartDate(undefined);
      setRegistrationEndDate(undefined);
      setShowOnMemberSide(true);
      setTouched({});
      setErrors({});
      setFetchedUsers([]);
    }
  }, [visible, initialData]);

  // Discount months options (1-12 months)
  const monthsOptions = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    value: `${i + 1} month${i + 1 > 1 ? 's' : ''}`,
    numericValue: (i + 1).toString(),
  }));

  const handleCancel = () => {
    // Reset form
    setCouponName('');
    setDiscountPercentage('');
    setDiscountMonths('');
    setAllowedUsers('all');
    setStartDate(undefined);
    setEndDate(undefined);
    setSelectedUserIds([]);
    setVisibilityDuration('');
    setAutoIncludeNewUsers(false);
    setRegistrationStartDate(undefined);
    setRegistrationStartDate(undefined);
    setRegistrationEndDate(undefined);
    setShowOnMemberSide(true);
    setTouched({});
    setErrors({});
    onClose();
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    let isValid = true;

    if (!couponName.trim()) {
      newErrors.couponName = 'Please enter a coupon name';
      isValid = false;
    }
    if (!discountPercentage.trim()) {
      newErrors.discountPercentage = 'Please enter a discount percentage';
      isValid = false;
    }
    if (!discountMonths) {
      newErrors.discountMonths = 'Please select discount months';
      isValid = false;
    }

    if (allowedUsers === 'selected' && selectedUserIds.length === 0) {
      newErrors.selectedUsers = 'Please select at least one user';
      isValid = false;
    }

    if (allowedUsers === 'new') {
      if (!registrationStartDate) {
        newErrors.newUserStartDate = 'Please select registration start date';
        isValid = false;
      }
      if (!registrationEndDate) {
        newErrors.newUserEndDate = 'Please select registration end date';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleCreate = () => {
    setTouched({
      couponName: true,
      discountPercentage: true,
      discountMonths: true,
      newUserStartDate: true,
      newUserEndDate: true,
    });

    if (validate()) {
      const couponData: CouponData = {
        name: couponName,
        discountPercentage: Number(discountPercentage),
        discountMonths: Number(discountMonths.split(' ')[0]),
        allowedUsers,
        startDate: startDate || null,
        endDate: endDate || null,
        selectedUserIds: allowedUsers === 'selected' ? selectedUserIds : undefined,
        visibilityDurationMonths: visibilityDuration || '',
        autoIncludeNewUsers,
        newUserStartDate: allowedUsers === 'new' ? (registrationStartDate || null) : null,
        newUserEndDate: allowedUsers === 'new' ? (registrationEndDate || null) : null,
        visibleOnMemberSide: showOnMemberSide,
      };

      onSubmit(couponData, couponId);
      handleCancel();
    }
  };

  const formatDate = (date?: Date): string => {
    if (!date) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const onStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const onEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  const onRegStartDateChange = (event: any, selectedDate?: Date) => {
    setShowRegStartDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setRegistrationStartDate(selectedDate);
      if (touched.registrationStartDate) {
        setErrors(prev => ({ ...prev, registrationStartDate: '' }));
      }
    }
  };

  const onRegEndDateChange = (event: any, selectedDate?: Date) => {
    setShowRegEndDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setRegistrationEndDate(selectedDate);
      if (touched.registrationEndDate) {
        setErrors(prev => ({ ...prev, registrationEndDate: '' }));
      }
    }
  };

  return (
    <Modal
      isVisible={visible}
      onSwipeComplete={handleCancel}
      onBackdropPress={handleCancel}
      swipeDirection="down"
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationInTiming={500}
      animationOutTiming={500}
      backdropTransitionInTiming={1000}
      backdropTransitionOutTiming={1000}
      style={styles.modalContainer}
    >
      <View style={styles.mainModalView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{isEditMode ? 'Edit Coupon' : 'Add Coupon'}</Text>
          <TouchableOpacity onPress={handleCancel}>
            <Icon name="X" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        {/* Form Content */}
        <KeyboardAwareScrollView
          style={styles.formContainer}
          showsVerticalScrollIndicator={false}
          enableOnAndroid={true}
          extraScrollHeight={20}
        >
          {/* Coupon Name */}
          <TextInputField
            label="Coupon Name *"
            placeholder="Coupon Name *"
            value={couponName}
            onChangeText={text => {
              setCouponName(text);
              if (touched.couponName) {
                setErrors(prev => ({ ...prev, couponName: '' }));
              }
            }}
            theme={{
              colors: {
                background: COLORS.cardBG,
                text: COLORS.white,
                placeholder: COLORS.outlineGrey,
              },
            }}
            textColor={COLORS.white}
            outlineColor={COLORS.outlineGrey}
            activeOutlineColor={COLORS.white}
            touched={touched.couponName}
            error={errors.couponName}
          />

          {/* Discount Percentage */}
          <TextInputField
            label="Discount Percentage *"
            placeholder="Discount Percentage *"
            value={discountPercentage}
            onChangeText={text => {
              setDiscountPercentage(text);
              if (touched.discountPercentage) {
                setErrors(prev => ({ ...prev, discountPercentage: '' }));
              }
            }}
            keyboardType="numeric"
            theme={{
              colors: {
                background: COLORS.cardBG,
                text: COLORS.white,
                placeholder: COLORS.outlineGrey,
              },
            }}
            textColor={COLORS.white}
            outlineColor={COLORS.outlineGrey}
            activeOutlineColor={COLORS.white}
            touched={touched.discountPercentage}
            error={errors.discountPercentage}
          />

          {/* Discount Months */}
          <CommonListModal
            textInputLabel="Discount Months *"
            textInputValue={discountMonths}
            placeholder="Select Discount Months"
            dropDownData={monthsOptions}
            dropDownSelectedValue={discountMonths}
            onDropDownSelect={item => {
              setDiscountMonths(item.value);
              if (touched.discountMonths) {
                setErrors(prev => ({ ...prev, discountMonths: '' }));
              }
            }}
            touched={touched.discountMonths}
            error={errors.discountMonths}
            type="dropdown"
          />

          {/* Allowed Users */}
          <View style={styles.radioContainer}>
            <Text style={styles.radioLabel}>Allowed Users *</Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setAllowedUsers('all')}
              >
                <View
                  style={[styles.radioCircle, isAll && styles.radioOuterCircle]}
                >
                  {isAll && <View style={styles.radioCircleSelected} />}
                </View>
                <Text style={styles.radioText}>All users</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setAllowedUsers('selected')}
              >
                <View
                  style={[
                    styles.radioCircle,
                    isSelected && styles.radioOuterCircle,
                  ]}
                >
                  {isSelected && <View style={styles.radioCircleSelected} />}
                </View>
                <Text style={styles.radioText}>Selected users</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setAllowedUsers('new')}
              >
                <View
                  style={[styles.radioCircle, isNew && styles.radioOuterCircle]}
                >
                  {isNew && <View style={styles.radioCircleSelected} />}
                </View>
                <Text style={styles.radioText}>New User</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* User Selection, Visibility Duration, and Auto Include for 'selected' type */}
          {isSelected && (
            <>
              <View style={styles.selectedUserContainer}>
                <TouchableOpacity
                  style={styles.selectUserButton}
                  onPress={() => setShowUserSelectionModal(true)}
                >
                  <Text style={[styles.selectUserText, selectedUserIds.length > 0 && styles.selectUserTextActive]}>
                    {selectedUserIds.length > 0
                      ? `${selectedUserIds.length} User${selectedUserIds.length > 1 ? 's' : ''} Selected`
                      : 'Select Users'
                    }
                  </Text>
                  <Icon name="ChevronDown" size={20} color={COLORS.outlineGrey} />
                </TouchableOpacity>
                {errors.selectedUsers && (
                  <Text style={styles.errorText}>{errors.selectedUsers}</Text>
                )}

                <Text style={styles.helperText}>Select one or more users ({fetchedUsers.length > 0 ? fetchedUsers.length : '0'} available)</Text>
              </View>

              {/* Visibility Duration (Optional) */}
              <View style={styles.visibilityContainer}>
                <TextInputField
                  label="Coupon Visibility Duration (Months) - Optional"
                  placeholder="Coupon Visibility Duration (Months)"
                  value={visibilityDuration}
                  onChangeText={(text) => {
                    // Allow only numeric input
                    if (/^\d*$/.test(text)) {
                      setVisibilityDuration(text);
                    }
                  }}
                  keyboardType="numeric"
                  theme={{
                    colors: {
                      background: COLORS.cardBG,
                      text: COLORS.white,
                      placeholder: COLORS.outlineGrey,
                    },
                  }}
                  textColor={COLORS.white}
                  outlineColor={COLORS.outlineGrey}
                  activeOutlineColor={COLORS.white}
                />
                <Text style={styles.helperText}>
                  If set, coupon will only be visible/usable for new users (without subscriptions) for this many months from coupon creation
                </Text>
              </View>

              {/* Auto Include Checkbox */}
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => {
                  const newValue = !autoIncludeNewUsers;
                  setAutoIncludeNewUsers(newValue);
                  if (newValue) {
                    setSelectedUserIds(fetchedUsers.map(user => user.id));
                    setErrors(prev => ({ ...prev, selectedUsers: '' }));
                  } else {
                    setSelectedUserIds([]);
                  }
                }}
              >
                <View style={[styles.checkbox, autoIncludeNewUsers && styles.checkboxSelected]}>
                  {autoIncludeNewUsers && <Icon name="Check" size={14} color={COLORS.white} />}
                </View>
                <Text style={styles.checkboxLabel}>
                  Automatically include all new users (users without subscriptions) in Selected Users
                </Text>
              </TouchableOpacity>
            </>
          )}

          {/* New User Eligibility Period */}
          {isNew && (
            <View style={styles.newUserEligibilityContainer}>
              <Text style={styles.eligibilityTitle}>New User Eligibility Period</Text>
              <Text style={styles.eligibilityDescription}>
                Define the registration date range for eligible users. Only users who registered between these dates will be able to see and use this coupon.
              </Text>

              {/* Registration Start Date */}
              <View style={styles.dateInputContainer}>
                <Text style={styles.dateLabel}>Registration Start Date *</Text>
                <TouchableOpacity
                  style={styles.dateInput}
                  onPress={() => setShowRegStartDatePicker(true)}
                >
                  <Text style={registrationStartDate ? styles.dateInputText : styles.dateInputPlaceholder}>
                    {formatDate(registrationStartDate) || 'dd/mm/yyyy'}
                  </Text>
                  <Icon name="Calendar" size={20} color={COLORS.outlineGrey} />
                </TouchableOpacity>
                {errors.newUserStartDate && <Text style={styles.errorText}>{errors.newUserStartDate}</Text>}
                <Text style={styles.helperText}>Users registered from this date onwards are eligible</Text>
              </View>

              {/* Registration End Date */}
              <View style={styles.dateInputContainer}>
                <Text style={styles.dateLabel}>Registration End Date *</Text>
                <TouchableOpacity
                  style={styles.dateInput}
                  onPress={() => setShowRegEndDatePicker(true)}
                >
                  <Text style={registrationEndDate ? styles.dateInputText : styles.dateInputPlaceholder}>
                    {formatDate(registrationEndDate) || 'dd/mm/yyyy'}
                  </Text>
                  <Icon name="Calendar" size={20} color={COLORS.outlineGrey} />
                </TouchableOpacity>
                {errors.newUserEndDate && <Text style={styles.errorText}>{errors.newUserEndDate}</Text>}
                <Text style={styles.helperText}>Users registered up to this date are eligible</Text>
              </View>

              {/* Date Pickers for Registration */}
              {showRegStartDatePicker && (
                <DateTimePicker
                  value={registrationStartDate || new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onRegStartDateChange}
                  textColor={COLORS.white}
                />
              )}
              {showRegEndDatePicker && (
                <DateTimePicker
                  value={registrationEndDate || new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onRegEndDateChange}
                  textColor={COLORS.white}
                />
              )}
            </View>
          )}

          {/* Start Date */}
          <View style={styles.dateInputContainer}>
            <Text style={styles.dateLabel}>Start Date (Optional)</Text>
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => setShowStartDatePicker(true)}
            >
              <Text
                style={
                  startDate ? styles.dateInputText : styles.dateInputPlaceholder
                }
              >
                {formatDate(startDate) || 'dd-mm-yyyy'}
              </Text>
            </TouchableOpacity>
          </View>

          {showStartDatePicker && (
            <DateTimePicker
              value={startDate || new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onStartDateChange}
              textColor={COLORS.white}
            />
          )}

          {/* End Date */}
          <View style={styles.dateInputContainer}>
            <Text style={styles.dateLabel}>End Date (Optional)</Text>
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => setShowEndDatePicker(true)}
            >
              <Text
                style={
                  endDate ? styles.dateInputText : styles.dateInputPlaceholder
                }
              >
                {formatDate(endDate) || 'dd-mm-yyyy'}
              </Text>
            </TouchableOpacity>
          </View>

          {showEndDatePicker && (
            <DateTimePicker
              value={endDate || new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onEndDateChange}
              textColor={COLORS.white}
            />
          )}

          {/* Show on Member Side Toggle */}
          <View style={styles.showMemberContainer}>
            <Switch
              value={showOnMemberSide}
              onValueChange={setShowOnMemberSide}
              trackColor={{ false: COLORS.outlineGrey, true: COLORS.primary }}
              thumbColor={COLORS.white}
              ios_backgroundColor={COLORS.outlineGrey}
            />
            <View style={styles.showMemberTextContainer}>
              <Text style={styles.showMemberTitle}>Show on Member Side</Text>
              <Text style={styles.showMemberDescription}>
                When enabled, this coupon will be visible in the coupon strip on member pages
              </Text>
            </View>
          </View>
        </KeyboardAwareScrollView>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
            <Text style={styles.createButtonText}>{isEditMode ? 'Update' : 'Create'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <UserSelectionModal
        visible={showUserSelectionModal}
        onClose={() => setShowUserSelectionModal(false)}
        onSelect={(ids) => {
          setSelectedUserIds(ids);
          if (ids.length > 0) {
            setErrors(prev => ({ ...prev, selectedUsers: '' }));
          }
        }}
        initialSelectedIds={selectedUserIds}
        users={fetchedUsers.length > 0 ? fetchedUsers : undefined}
      />
    </Modal>
  );
};

export default AddCouponModal;
