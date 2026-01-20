import { View, Text, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import styles from './style';
import Icon from '@/Components/Core/Icons';
import { COLORS } from '@/Assets/Theme/colors';
import { ms } from '@/Assets/Theme/fontStyle';
import AddCouponModal, {
  CouponData,
} from '@/Components/Generic/Modals/AddCouponModal';



const CouponsTab = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [couponsData, setCouponsData] = useState([
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
  ]);

  const handleAddCoupon = (couponData: CouponData) => {
    // Format the validity string
    let validity = 'No end date';
    if (couponData.startDate && couponData.endDate) {
      const formatDate = (date: Date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      };
      validity = `${formatDate(couponData.startDate)} - ${formatDate(
        couponData.endDate,
      )}`;
    } else if (couponData.startDate) {
      const formatDate = (date: Date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      };
      validity = `From ${formatDate(couponData.startDate)}`;
    } else if (couponData.endDate) {
      const formatDate = (date: Date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      };
      validity = `Until ${formatDate(couponData.endDate)}`;
    }

    // Extract numeric value from discount months (e.g., "2 months" -> "2")
    const monthsNumeric = couponData.discountMonths.split(' ')[0];

    const newCoupon = {
      id: couponsData.length + 1,
      couponCode: couponData.couponName.toUpperCase().replace(/\s/g, ''),
      discount: couponData.discountPercentage,
      discountMonths: monthsNumeric,
      validity,
      allowedUsers: couponData.allowedUsers === 'all' ? 'All' : 'Selected',
      status: 'active',
    };

    setCouponsData([...couponsData, newCoupon]);
    console.log('New coupon created:', newCoupon);
  };


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

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setIsModalVisible(true)}
      >
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

      {/* Add Coupon Modal */}
      <AddCouponModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={handleAddCoupon}
      />
    </View>
  );
};

export default CouponsTab;
