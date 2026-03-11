import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import React, { useState } from 'react';
import Modal from 'react-native-modal';
import DateTimePicker from '@react-native-community/datetimepicker';
import { launchImageLibrary } from 'react-native-image-picker';
import { RadioButton } from 'react-native-paper';
import { COLORS } from '@/Assets/Theme/colors';
import Icon from '@/Components/Core/Icons';
import TextInputField from '@/Components/Core/TextInputField';
import styles from './style';
import CommonListModal from '../CommonListModal';

interface ScheduleLivestreamModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const STREAM_TYPE_DATA = [
  { id: '1', value: 'Livestream' },
  { id: '2', value: 'Conference' },
];

const ScheduleLivestreamModal: React.FC<ScheduleLivestreamModalProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(
    undefined,
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');
  const [maxViewers, setMaxViewers] = useState('');
  const [sendNotification, setSendNotification] = useState(true);
  const [streamType, setStreamType] = useState('Livestream');
  const [visibility, setVisibility] = useState('Public(Everyone)');

  const handleCancel = () => {
    setTitle('');
    setDescription('');
    setThumbnail(null);
    setScheduledDate(undefined);
    setMaxViewers('');
    setSendNotification(true);
    setShowDatePicker(false);
    setPickerMode('date');
    setStreamType('Livestream');
    setVisibility('Public(Everyone)');
    onClose();
  };

  const handleSchedule = () => {
    onSubmit({
      title,
      description,
      thumbnail,
      scheduledDate,
      maxViewers,
      sendNotification,
      streamType,
      visibility,
    });
    handleCancel();
  };

  const handleImagePicker = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
    });

    if (result.assets && result.assets.length > 0) {
      setThumbnail(result.assets[0].uri || null);
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    if (event.type === 'dismissed') {
      setShowDatePicker(false);
      return;
    }

    if (Platform.OS === 'android') {
      if (pickerMode === 'date') {
        // After date is picked, show time picker
        setPickerMode('time');
        if (selectedDate) {
          setScheduledDate(selectedDate);
        }
      } else {
        // After time is picked, close picker
        setShowDatePicker(false);
        setPickerMode('date');
        if (selectedDate) {
          // Merge time with existing date
          const current = scheduledDate || new Date();
          const merged = new Date(
            current.getFullYear(),
            current.getMonth(),
            current.getDate(),
            selectedDate.getHours(),
            selectedDate.getMinutes(),
          );
          setScheduledDate(merged);
        }
      }
    } else {
      // iOS handling
      if (selectedDate) {
        setScheduledDate(selectedDate);
      }
    }
  };

  const handleShowPicker = () => {
    setPickerMode('date');
    setShowDatePicker(true);
  };

  const formatDate = (date?: Date): string => {
    if (!date) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
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
      avoidKeyboard={true}
    >
      <View style={styles.mainModalView}>
        <View style={styles.header}>
          <Text style={styles.title}>Schedule Livestream</Text>
          <TouchableOpacity onPress={handleCancel}>
            <Icon name="X" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.formContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          <TextInputField
            label="Title"
            placeholder="Enter course title"
            value={title}
            onChangeText={setTitle}
            theme={{
              colors: {
                background: '#1F1F1F',
                text: COLORS.white,
                placeholder: COLORS.outlineGrey,
              },
            }}
            textColor={COLORS.white}
            outlineColor="#333"
            activeOutlineColor={COLORS.white}
          />

          <TextInputField
            label="Description"
            placeholder="Enter course description"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            style={styles.descriptionStyle}
            theme={{
              colors: {
                background: '#1F1F1F',
                text: COLORS.white,
                placeholder: COLORS.outlineGrey,
              },
            }}
            textColor={COLORS.white}
            outlineColor="#333"
            activeOutlineColor={COLORS.white}
          />

          <CommonListModal
            textInputLabel="Stream Type"
            textInputValue={streamType}
            placeholder="Select stream type"
            dropDownData={STREAM_TYPE_DATA}
            dropDownSelectedValue={streamType}
            onDropDownSelect={item => setStreamType(item.value)}
          />

          <View style={styles.thumbnailContainer}>
            <Text style={styles.thumbnailLabel}>Thumbnail *</Text>
            <View style={styles.uploadBox}>
              {thumbnail ? (
                <>
                  <Image
                    source={{ uri: thumbnail }}
                    style={styles.imagePreview}
                  />
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setThumbnail(null)}
                  >
                    <Icon name="X" size={16} color={COLORS.white} />
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  style={{
                    width: '100%',
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={handleImagePicker}
                >
                  <Icon name="Inbox" size={48} color={COLORS.white} />
                  <Text style={styles.uploadText}>
                    Click to upload thumbnail
                  </Text>
                  <Text style={styles.uploadSubText}>
                    Recommended: 1280x720px (16:9 ratio)
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.dateInputContainer}>
            <Text style={styles.label}>Scheduled Date & Time</Text>
            <TouchableOpacity
              style={styles.dateInput}
              onPress={handleShowPicker}
            >
              <Text
                style={
                  scheduledDate
                    ? styles.dateInputText
                    : styles.dateInputPlaceholder
                }
              >
                {formatDate(scheduledDate) || 'Select date'}
              </Text>
              <Icon name="Calendar" size={20} color={COLORS.outlineGrey} />
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={scheduledDate || new Date()}
              mode={Platform.OS === 'ios' ? 'datetime' : pickerMode}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onDateChange}
              textColor={COLORS.white}
              is24Hour={true}
            />
          )}

          <TextInputField
            label="Maximum Viewers"
            placeholder="Enter course title"
            value={maxViewers}
            onChangeText={setMaxViewers}
            leftIcon="account-group-outline"
            keyboardType="numeric"
            theme={{
              colors: {
                background: '#1F1F1F',
                text: COLORS.white,
                placeholder: COLORS.outlineGrey,
              },
            }}
            textColor={COLORS.white}
            outlineColor="#333"
            activeOutlineColor={COLORS.white}
          />
          <Text style={styles.helperText}>
            Your current viewer limit is 2. You can set a lower value, but not
            higher than 2. Billing is based on stream duration only, not viewer
            count.
          </Text>

          <View style={{ marginTop: 20 }}>
            <Text style={styles.sectionTitle}>Visibility Settings</Text>
            <Text style={styles.sectionSubHeader}>Who can watch this stream?</Text>

            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={styles.radioItem}
                onPress={() => setVisibility('Public(Everyone)')}
                activeOpacity={0.8}
              >
                <RadioButton.Android
                  value="Public(Everyone)"
                  status={visibility === 'Public(Everyone)' ? 'checked' : 'unchecked'}
                  onPress={() => setVisibility('Public(Everyone)')}
                  color={COLORS.primary}
                  uncheckedColor={COLORS.outlineGrey}
                />
                <Text style={styles.radioLabel}>Public(Everyone)</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.radioItem}
                onPress={() => setVisibility('All Paid Members')}
                activeOpacity={0.8}
              >
                <RadioButton.Android
                  value="All Paid Members"
                  status={visibility === 'All Paid Members' ? 'checked' : 'unchecked'}
                  onPress={() => setVisibility('All Paid Members')}
                  color={COLORS.primary}
                  uncheckedColor={COLORS.outlineGrey}
                />
                <Text style={styles.radioLabel}>All Paid Members</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.radioItem}
                onPress={() => setVisibility('Specific Plans')}
                activeOpacity={0.8}
              >
                <RadioButton.Android
                  value="Specific Plans"
                  status={visibility === 'Specific Plans' ? 'checked' : 'unchecked'}
                  onPress={() => setVisibility('Specific Plans')}
                  color={COLORS.primary}
                  uncheckedColor={COLORS.outlineGrey}
                />
                <Text style={styles.radioLabel}>Specific Plans</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setSendNotification(!sendNotification)}
          >
            <View
              style={[
                styles.checkbox,
                sendNotification && styles.checkboxSelected,
              ]}
            >
              {sendNotification && (
                <Icon name="Check" size={14} color={COLORS.white} />
              )}
            </View>
            <Text style={styles.checkboxLabel}>
              Send email notification to all community members
            </Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.scheduleButton}
            onPress={handleSchedule}
          >
            <Text style={styles.scheduleButtonText}>Schedule Stream</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ScheduleLivestreamModal;
