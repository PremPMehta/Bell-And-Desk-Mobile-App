import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import styles from './style';
import Icon from '@/Components/Core/Icons';
import { COLORS } from '@/Assets/Theme/colors';
import { ms } from '@/Assets/Theme/fontStyle';

const CouponsTab = () => {
  const couponsData = [
    {
      id: 1,
      couponCode: 'ABC123',
      discount: '45',
      discountMonths: '12',
      validity: 'No end date',
      allowedUsers: 'All',
      status: 'active',
    },
    {
      id: 2,
      couponCode: 'DEF456',
      discount: '50',
      discountMonths: '2',
      validity: '12/04/2025 - 12/06/2025',
      allowedUsers: 'All',
      status: 'expired',
    },
    // Add more mock data if needed
  ];

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Coupons</Text>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.row}>
          <Text style={styles.label}>Total Coupons</Text>
          <Text style={styles.value}>1</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Users Who Used Coupons</Text>
          <Text style={styles.value}>0</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Total Usage Count</Text>
          <Text style={styles.value}>0</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.addButton}>
        <Icon name="CirclePlus" size={14} color={COLORS.white} />
        <Text style={styles.addButtonText}>Add Coupons</Text>
      </TouchableOpacity>

      <View style={styles.tableContainer}>
        {couponsData.map(coupon => (
          <View key={coupon.id} style={styles.couponContainer}>
            <View style={styles.couponHeader}>
              <View style={styles.couponCodeContainer}>
                <Icon
                  name="TicketPercent"
                  size={ms(18)}
                  color={COLORS.lightGray}
                />
                <Text style={styles.couponCodeTxt}>{coupon.couponCode}</Text>
                <Text style={styles.couponCodeTxt}>
                  {coupon.discount + '%'}
                </Text>
              </View>
              <View style={styles.couponStatusContainer}>
                <Text style={styles.couponStatus}>{coupon.status}</Text>
              </View>
              <View style={styles.editDeleteContainer}>
                <TouchableOpacity style={styles.commonButton}>
                  <Icon name="Pencil" size={ms(14)} color={COLORS.white} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.commonButton}>
                  <Icon name="Trash2" size={ms(14)} color={COLORS.white} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.couponFooter}>
              <View style={styles.couponFooterRow}>
                <Icon name="Calendar" size={ms(14)} color={COLORS.lightGray} />
                <Text style={styles.couponFooterTxt}>
                  {coupon.discountMonths}
                </Text>
              </View>
              <View style={styles.couponFooterRow}>
                <Icon name="Users" size={ms(14)} color={COLORS.lightGray} />
                <Text style={styles.couponFooterTxt}>
                  {coupon.allowedUsers}
                </Text>
              </View>
              <View style={styles.couponFooterRow}>
                <Icon name="Calendars" size={ms(14)} color={COLORS.lightGray} />
                <Text style={styles.couponFooterTxt}>{coupon.validity}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CouponsTab;
