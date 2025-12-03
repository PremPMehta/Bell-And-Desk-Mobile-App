import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import React, { useState } from 'react';
import Modal from 'react-native-modal';
import { THEME } from '@/Assets/Theme';
import styles from './style';
import Icon from '@/Components/Core/Icons';
import { COLORS } from '@/Assets/Theme/colors';
import { TextInput } from 'react-native-paper';

const CommonListModal = ({
  textInputLabel,
  textInputValue,
  placeholder,
  touched,
  error,
  type,
  dropDownData,
  dropDownSelectedValue,
  onDropDownSelect,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleDropDownPress = () => {
    setIsModalVisible(true);
  };

  return (
    <>
      <View style={styles.mainContainer}>
        <TouchableOpacity onPress={handleDropDownPress} activeOpacity={0.7}>
          <View pointerEvents="none">
            <TextInput
              mode="outlined"
              label={textInputLabel}
              value={textInputValue}
              placeholder={placeholder}
              editable={false}
              style={styles.inputStyle}
              theme={{
                colors: {
                  background: COLORS.cardBG,
                  text: COLORS.white,
                  placeholder: COLORS.outlineGrey,
                },
              }}
              right={
                <TextInput.Icon
                  icon="chevron-down"
                  color={COLORS.outlineGrey}
                />
              }
              textColor={COLORS.white}
              outlineColor={COLORS.outlineGrey}
              activeOutlineColor={COLORS.white}
            />
          </View>
        </TouchableOpacity>

        {touched && error ? (
          <Text style={styles.errorTxtStyle}>{error}</Text>
        ) : null}
      </View>

      <Modal
        isVisible={isModalVisible} // isLogoutModalVisible
        onSwipeComplete={handleCancel}
        onBackdropPress={handleCancel}
        swipeDirection="down"
        animationIn="slideInUp"
        animationOut="slideOutDown"
        // backdropColor={THEME.COLORS.modalBackdropColor}
        animationInTiming={500}
        animationOutTiming={500}
        backdropTransitionInTiming={1000}
        backdropTransitionOutTiming={1000}
        style={styles.modalContainer}
      >
        <View style={styles.mainModalView}>
          {/* <View style={styles.modalPanDownToClose} /> */}
          <View style={styles.header}>
            <Text style={styles.title}>{textInputLabel}</Text>
            <TouchableOpacity onPress={handleCancel}>
              <Icon name="X" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          <Text style={styles.modalMessage}>
            Please select a {textInputLabel}
          </Text>

          <FlatList
            data={dropDownData} // dropDownData
            style={styles.modalList}
            //   keyExtractor={item => item?.id}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.modalItem}
                  onPress={() => {
                    onDropDownSelect(item);
                    setIsModalVisible(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{item?.value}</Text>
                  {item?.value === dropDownSelectedValue && (
                    <Icon name="Check" size={18} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </Modal>
    </>
  );
};

export default CommonListModal;
