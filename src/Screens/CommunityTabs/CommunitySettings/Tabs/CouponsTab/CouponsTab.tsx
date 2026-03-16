import { View, Text, TouchableOpacity, RefreshControl, ScrollView, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import styles from './style';
import Icon from '@/Components/Core/Icons';
import { COLORS } from '@/Assets/Theme/colors';
import { ms } from '@/Assets/Theme/fontStyle';
import AddCouponModal, {
  CouponData,
} from '@/Components/Generic/Modals/AddCouponModal';
import useUserApi from '@/Hooks/Apis/UserApis/use-user-api';
import CouponsSkeleton from '@/Components/Core/Skeleton/CouponsSkeleton';
import Modal from 'react-native-modal';

interface Props {
  slug?: string;
  communityId?: string;
}

const CouponsTab = ({ slug, communityId }: Props) => {
  const {
    getCoupons,
    apiGetCouponsLoading,
    apiGetCoupons,
    createCoupon,
    apiCreateCouponLoading,
    updateCoupon,
    apiUpdateCouponLoading,
    deleteCoupon,
    apiDeleteCouponLoading,
    getCouponHistory,
    apiGetCouponHistoryLoading,
    apiGetCouponHistory,
  } = useUserApi();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<any>(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedCouponForDelete, setSelectedCouponForDelete] = useState<any>(null);
  const [isHistoryModalVisible, setIsHistoryModalVisible] = useState(false);
  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      setLocalLoading(true);
      getCoupons(slug).finally(() => {
        setLocalLoading(false);
      });
    }
  }, [slug]);

  const couponsData = apiGetCoupons?.data?.coupons || [];
  const summary = apiGetCoupons?.data?.summary || {
    totalCoupons: 0,
    totalUsage: 0,
    uniqueUsersCount: 0,
  };

  const handleOpenAdd = () => {
    setEditingCoupon(null);
    setIsModalVisible(true);
  };

  const handleOpenEdit = (coupon: any) => {
    setEditingCoupon(coupon);
    setIsModalVisible(true);
  };

  const handleSubmitCoupon = async (couponData: CouponData, couponId?: string) => {
    if (!slug) {
      setIsModalVisible(false);
      return;
    }

    let res: any;
    if (couponId) {
      res = await updateCoupon(slug, couponId, couponData);
    } else {
      res = await createCoupon(slug, couponData);
    }

    if (res?.success || res?.message) {
      getCoupons(slug);
      setIsModalVisible(false);
      setEditingCoupon(null);
    }
  };

  const handleDeleteCoupon = (coupon: any) => {
    setSelectedCouponForDelete(coupon);
    setIsDeleteModalVisible(true);
  };

  const confirmDeleteCoupon = async () => {
    if (slug && selectedCouponForDelete) {
      const res = await deleteCoupon(slug, selectedCouponForDelete._id);
      if (res?.success || res?.message) {
        setIsDeleteModalVisible(false);
        setSelectedCouponForDelete(null);
        getCoupons(slug);
      }
    }
  };

  const handleViewHistory = async (coupon: any) => {
    if (slug && coupon._id) {
      setIsHistoryModalVisible(true);
      await getCouponHistory(slug, coupon._id);
    }
  };

  if (localLoading || apiGetCouponsLoading || apiCreateCouponLoading || apiUpdateCouponLoading || apiDeleteCouponLoading) {
    return <CouponsSkeleton />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Coupons</Text>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.row}>
          <Text style={styles.label}>Total Coupons</Text>
          <Text style={styles.value}>{summary?.totalCoupons}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Users Who Used Coupons</Text>
          <Text style={styles.value}>{summary?.uniqueUsersCount}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Total Usage Count</Text>
          <Text style={styles.value}>{summary?.totalUsage}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={handleOpenAdd}
      >
        <Icon name="CirclePlus" size={14} color={COLORS.white} />
        <Text style={styles.addButtonText}>Add Coupons</Text>
      </TouchableOpacity>

      <View style={styles.tableContainer}>
        {couponsData?.map((coupon: any) => (
          <TouchableOpacity
            key={coupon._id}
            style={styles.couponContainer}
            onPress={() => handleViewHistory(coupon)}
          >
            <View style={styles.couponHeader}>
              <View style={styles.couponCodeContainer}>
                <Icon
                  name="TicketPercent"
                  size={ms(18)}
                  color={COLORS.lightGray}
                />
                <Text style={styles.couponCodeTxt}>{coupon.name}</Text>
                <Text style={styles.couponCodeTxt}>
                  {coupon.discountPercentage + '%'}
                </Text>
              </View>
              <View style={styles.couponStatusContainer}>
                <Text style={styles.couponStatus}>{coupon.status}</Text>
              </View>
              <View style={styles.editDeleteContainer}>
                <TouchableOpacity
                  style={styles.commonButton}
                  onPress={() => handleOpenEdit(coupon)}
                >
                  <Icon name="Pencil" size={ms(14)} color={COLORS.lightGray} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.commonButton}
                  onPress={() => handleDeleteCoupon(coupon)}
                >
                  <Icon name="Trash2" size={ms(14)} color={COLORS.red} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.couponFooter}>
              <View style={styles.couponFooterRow}>
                <Icon name="Calendar" size={ms(14)} color={COLORS.lightGray} />
                <Text style={styles.couponFooterTxt}>
                  {coupon.discountMonths} Months
                </Text>
              </View>
              <View style={styles.couponFooterRow}>
                <Icon name="Users" size={ms(14)} color={COLORS.lightGray} />
                <Text style={styles.couponFooterTxt}>
                  {coupon.allowedUsersDisplay || coupon.allowedUsers}
                </Text>
              </View>
              <View style={styles.couponFooterRow}>
                <Icon name="Calendars" size={ms(14)} color={COLORS.lightGray} />
                <Text style={styles.couponFooterTxt}>{coupon.validity || 'No end date'}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>

      {/* Add / Edit Coupon Modal */}
      <AddCouponModal
        visible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
          setEditingCoupon(null);
        }}
        onSubmit={handleSubmitCoupon}
        communityId={communityId}
        initialData={editingCoupon}
        couponId={editingCoupon?._id}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isVisible={isDeleteModalVisible}
        onBackdropPress={() => setIsDeleteModalVisible(false)}
        onSwipeComplete={() => setIsDeleteModalVisible(false)}
        swipeDirection="down"
        style={styles.modalContainer}
        avoidKeyboard
      >
        <View style={styles.mainModalView}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Delete Coupon</Text>
            <TouchableOpacity onPress={() => setIsDeleteModalVisible(false)}>
              <Icon name="X" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
            <Text style={styles.modalMessage}>
              Are you sure you want to delete{' '}
              <Text style={styles.boldName}>
                {selectedCouponForDelete?.name}
              </Text>? This action cannot be undone.
            </Text>
          </View>

          <View style={styles.modalFooter}>
            <TouchableOpacity onPress={() => setIsDeleteModalVisible(false)}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalRemoveButton}
              onPress={confirmDeleteCoupon}
            >
              <Text style={styles.modalRemoveText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Coupon History Modal */}
      <Modal
        isVisible={isHistoryModalVisible}
        onBackdropPress={() => setIsHistoryModalVisible(false)}
        onSwipeComplete={() => setIsHistoryModalVisible(false)}
        swipeDirection="down"
        style={styles.modalContainer}
        avoidKeyboard
      >
        <View style={styles.mainModalView}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Coupon Usage History</Text>
            <TouchableOpacity onPress={() => setIsHistoryModalVisible(false)}>
              <Icon name="X" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
            {apiGetCouponHistoryLoading ? (
              <ActivityIndicator size="large" color={COLORS.primary} />
            ) : (
              <View>
                <Text style={styles.historySubtitle}>
                  {apiGetCouponHistory?.data?.coupon?.name} -{' '}
                  {apiGetCouponHistory?.data?.coupon?.discountPercentage}% off for{' '}
                  {apiGetCouponHistory?.data?.coupon?.discountMonths} months
                </Text>

                {apiGetCouponHistory?.data?.usageHistory?.length > 0 ? (
                  apiGetCouponHistory.data.usageHistory.map(
                    (history: any, index: number) => (
                      <View key={index} style={styles.historyItem}>
                        <Text style={styles.historyUser}>
                          {history.user?.firstName} {history.user?.lastName}
                        </Text>
                        <Text style={styles.historyDate}>
                          {new Date(history.usedAt).toLocaleDateString()}
                        </Text>
                      </View>
                    ),
                  )
                ) : (
                  <Text style={styles.modalMessage}>
                    This coupon has not been used yet.
                  </Text>
                )}
              </View>
            )}
          </View>

          <View style={styles.modalFooter}>
            <TouchableOpacity onPress={() => setIsHistoryModalVisible(false)}>
              <Text style={styles.modalCancelText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CouponsTab;

