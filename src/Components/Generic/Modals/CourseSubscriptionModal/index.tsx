import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Modal from 'react-native-modal';
import { COLORS } from '@/Assets/Theme/colors';
import Icon from '@/Components/Core/Icons';
import useUserApi from '@/Hooks/Apis/UserApis/use-user-api';
import CourseSubscriptionSkeleton from '@/Components/Core/Skeleton/CourseSubscriptionSkeleton';
import styles from './style';

interface Props {
  visible: boolean;
  onClose: () => void;
  communitySlug: string;
  communityName: string;
  courses: any[];
  course?: any; // The specific course being unlocked (if one-time)
}

const CourseSubscriptionModal: React.FC<Props> = ({
  visible,
  onClose,
  communitySlug,
  communityName,
  courses,
  course,
}) => {
  const {
    getSubscriptionSettings,
    getOneTimePaymentSettings,
    getAvailableCoupons,
    validateCoupon,
    apiValidateCouponLoading,
  } = useUserApi();

  // ── Mode detection ────────────────────────────────────────────────────────
  const isOneTime = course?.paymentType === 'one-time';

  // ── Local state ─────────────────────────────────────────────────────────────
  const [subscriptionData, setSubscriptionData] = useState<any>(null);
  const [availableCoupons, setAvailableCoupons] = useState<any[]>([]);
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(0);
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [loadingSettings, setLoadingSettings] = useState(false);

  // ── Derived data ─────────────────────────────────────────────────────────────
  const settings = isOneTime
    ? subscriptionData?.oneTimePaymentSettings
    : subscriptionData?.subscriptionSettings;

  const availableOptions: any[] = React.useMemo(() => {
    if (isOneTime) return [];
    const options: any[] = [];
    if (settings?.availableOptions?.monthly) {
      options.push({
        id: 'monthly',
        interval: 'month',
        intervalCount: 1,
        amount: settings.monthlyPrice,
        label: 'Monthly',
      });
    }
    if (settings?.availableOptions?.yearly) {
      options.push({
        id: 'yearly',
        interval: 'year',
        intervalCount: 1,
        amount: settings.yearlyPrice,
        label: 'Yearly',
      });
    }
    return options;
  }, [settings, isOneTime]);

  const subtitle: string = settings?.description ?? '';

  /** Filtered courses this subscription/payment gives access to */
  const subscriptionCourses = React.useMemo(() => {
    if (isOneTime && course) {
      return [course];
    }
    return courses.filter(
      (c: any) => c.courseType === 'paid' && c.paymentType === 'subscription',
    );
  }, [isOneTime, course, courses]);

  /** Header title */
  const headerTitle = isOneTime
    ? 'Unlock ' + (course?.title || 'Course')
    : 'Join ' + communityName;

  /** One-time price calculation (with coupon) */
  const getOneTimePrice = useCallback((): string => {
    const baseAmount: number = (course?.price ?? 0) / 100;
    const currency = settings?.currency || 'USD';
    const amount = appliedCoupon?.discountPercentage
      ? baseAmount * (1 - appliedCoupon.discountPercentage / 100)
      : baseAmount;
    return `$${amount.toFixed(2)}`;
  }, [course, appliedCoupon, settings]);

  /** Calculate price display for a plan, applying coupon discount if present */
  const getPlanPrice = useCallback(
    (option: any): string => {
      const baseAmount: number = (option?.amount ?? 0) / 100; // stripe amounts are in cents
      if (!appliedCoupon?.discountPercentage) {
        return formatPrice(baseAmount, option);
      }
      const discounted =
        baseAmount * (1 - appliedCoupon.discountPercentage / 100);
      return formatPrice(discounted, option);
    },
    [appliedCoupon],
  );

  function formatPrice(amount: number, option: any): string {
    const interval = option?.interval ?? 'month';
    const count = option?.intervalCount ?? 1;
    const period = count === 1 ? interval : `${count} ${interval}s`;
    return `$${amount.toFixed(2)}/${period}`;
  }

  // ── Fetch on open ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!visible || !communitySlug) return;

    setLoadingSettings(true);
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponError('');
    setSelectedPlanIndex(0);

    const fetchSettings = isOneTime
      ? getOneTimePaymentSettings(communitySlug)
      : getSubscriptionSettings(communitySlug);

    Promise.all([fetchSettings, getAvailableCoupons(communitySlug)])
      .then(([settingsRes, couponsRes]) => {
        setSubscriptionData(settingsRes?.data ?? settingsRes ?? null);
        const coupons =
          couponsRes?.data?.coupons ??
          couponsRes?.data ??
          couponsRes?.coupons ??
          [];
        setAvailableCoupons(Array.isArray(coupons) ? coupons : []);
      })
      .finally(() => setLoadingSettings(false));
  }, [visible, communitySlug, isOneTime]);

  // ── Coupon helpers ───────────────────────────────────────────────────────────
  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }
    setCouponError('');
    const res = await validateCoupon(communitySlug, couponInput.trim());
    if (res?.data || res?.coupon || res?.discountPercentage !== undefined) {
      const couponObj = res?.data ?? res;
      setAppliedCoupon(couponObj);
      setCouponError('');
    } else {
      setCouponError('Invalid or expired coupon');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponError('');
  };

  // ── Selected plan ────────────────────────────────────────────────────────────
  const selectedOption = availableOptions[selectedPlanIndex];
  const subscribePriceLabel = selectedOption
    ? getPlanPrice(selectedOption)
    : '';

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection="down"
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationInTiming={400}
      animationOutTiming={400}
      backdropTransitionInTiming={400}
      backdropTransitionOutTiming={400}
      style={styles.modalContainer}
      propagateSwipe
    >
      <View style={styles.mainModalView}>
        {/* Drag indicator */}
        <View style={styles.dragIndicator} />

        {/* ── Header ─────────────────────────────── */}
        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.communityName}>{headerTitle}</Text>
            {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Icon name="X" size={22} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {loadingSettings ? (
            <CourseSubscriptionSkeleton isOneTime={isOneTime} />
          ) : (
            <>
              {/* ── Subscription Plan Selector ──────── */}
              {!isOneTime && availableOptions.length > 0 && (
                <>
                  {/* ── Subscription Info Banner ──────── */}
                  <View style={styles.section}>
                    <View style={styles.infoBanner}>
                      <Icon name="Info" size={16} color={COLORS.primary} />
                      <Text style={styles.infoBannerText}>
                        🔄 Subscription Required - Monthly or Annual billing
                      </Text>
                    </View>
                  </View>
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Choose your plan</Text>
                    <View style={styles.plansRow}>
                      {availableOptions.map((option: any, index: number) => {
                        const isSelected = index === selectedPlanIndex;
                        return (
                          <TouchableOpacity
                            key={index}
                            style={[
                              styles.planCard,
                              isSelected && styles.planCardSelected,
                            ]}
                            onPress={() => setSelectedPlanIndex(index)}
                            activeOpacity={0.8}
                          >
                            {/* Selection dot */}
                            <View style={styles.planRadioRow}>
                              <View
                                style={[
                                  styles.radioCircle,
                                  isSelected && styles.radioCircleSelected,
                                ]}
                              >
                                {isSelected && (
                                  <View style={styles.radioInner} />
                                )}
                              </View>
                              <Text style={styles.planInterval}>
                                {option.intervalCount > 1
                                  ? `${option.intervalCount} ${option.interval}s`
                                  : option.interval === 'month'
                                  ? 'Monthly'
                                  : option.interval === 'year'
                                  ? 'Yearly'
                                  : option.interval}
                              </Text>
                            </View>
                            {/* Price row */}
                            <Text
                              style={[
                                styles.planPrice,
                                isSelected && styles.planPriceSelected,
                              ]}
                            >
                              {getPlanPrice(option)}
                            </Text>
                            {/* Discounted price */}
                            {!!appliedCoupon?.discountPercentage && (
                              <Text style={styles.originalPrice}>
                                ${((option?.amount ?? 0) / 100).toFixed(2)}{' '}
                                orig.
                              </Text>
                            )}
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                </>
              )}

              {/* ── One-Time Payment Banner ─────────── */}
              {isOneTime && (
                <View style={styles.section}>
                  <View style={styles.infoBanner}>
                    <Icon name="Info" size={16} color={COLORS.primary} />
                    <Text style={styles.infoBannerText}>
                      💎 One-Time Payment - {getOneTimePrice()} - Pay once,
                      access forever
                    </Text>
                  </View>
                </View>
              )}

              {/* ── Coupon / Discount (Only if community has active coupons) ──── */}
              {availableCoupons.length > 0 && (
                <>
                  <View style={styles.divider} />

                  {/* ── Available Coupon Banner ─────────── */}
                  {!appliedCoupon && (
                    <View style={styles.couponBanner}>
                      <Icon name="Tag" size={16} color={COLORS.primary} />
                      <Text style={styles.couponBannerText}>
                        {availableCoupons
                          .map((c: any) => {
                            const code = c.name ?? c.code ?? '';
                            const pct = c.discountPercentage ?? 0;
                            const months = c.discountMonths ?? '';
                            return `Use coupon ${code} to get ${pct}% off${
                              months
                                ? ` for ${months} month${months > 1 ? 's' : ''}`
                                : ''
                            }`;
                          })
                          .join(' · ')}
                      </Text>
                    </View>
                  )}

                  {/* ── Coupon Input ────────────────────── */}
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Have a Coupon?</Text>

                    {!appliedCoupon ? (
                      <>
                        <View style={styles.couponRow}>
                          <TextInput
                            style={styles.couponInput}
                            placeholder="Enter coupon code"
                            placeholderTextColor={COLORS.placeholder}
                            value={couponInput}
                            onChangeText={t => {
                              setCouponInput(t);
                              if (couponError) setCouponError('');
                            }}
                            autoCapitalize="characters"
                          />
                          <TouchableOpacity
                            style={[
                              styles.applyButton,
                              (!couponInput.trim() ||
                                apiValidateCouponLoading) &&
                                styles.applyButtonDisabled,
                            ]}
                            onPress={handleApplyCoupon}
                            disabled={
                              !couponInput.trim() || apiValidateCouponLoading
                            }
                          >
                            {apiValidateCouponLoading ? (
                              <ActivityIndicator
                                size="small"
                                color={COLORS.white}
                              />
                            ) : (
                              <Text style={styles.applyButtonText}>Apply</Text>
                            )}
                          </TouchableOpacity>
                        </View>
                        {!!couponError && (
                          <Text style={styles.errorText}>{couponError}</Text>
                        )}
                      </>
                    ) : (
                      <View style={styles.appliedCouponRow}>
                        <View style={styles.appliedCouponBadge}>
                          <Icon name="Check" size={14} color={COLORS.green} />
                          <Text style={styles.appliedCouponCode}>
                            {appliedCoupon?.name ??
                              appliedCoupon?.code ??
                              couponInput}{' '}
                            applied
                            {appliedCoupon?.discountPercentage
                              ? ` (${appliedCoupon.discountPercentage}% off)`
                              : ''}
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={handleRemoveCoupon}
                          style={styles.removeButton}
                        >
                          <Text style={styles.removeButtonText}>Remove</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </>
              )}

              {/* ── Referral ────────────────────────── */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  Referred by a friend?{' '}
                  <Text style={styles.optionalLabel}>(Optional)</Text>
                </Text>
                <TextInput
                  style={styles.referralInput}
                  placeholder="Enter referral code"
                  placeholderTextColor={COLORS.placeholder}
                  value={referralCode}
                  onChangeText={setReferralCode}
                />
                <Text style={styles.referralHint}>
                  If you followed a link, this might be pre-filled.
                </Text>
              </View>

              <View style={styles.divider} />

              {/* ── What you'll get ─────────────────── */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>What you'll get:</Text>

                {subscriptionCourses.map((courseItem: any) => (
                  <View
                    key={courseItem._id ?? courseItem.id}
                    style={styles.benefitRow}
                  >
                    <View style={styles.benefitIconWrapper}>
                      <Icon name="BookOpen" size={16} color={COLORS.primary} />
                    </View>
                    <View style={styles.benefitTextContainer}>
                      <Text style={styles.benefitTitle}>
                        {courseItem.title}
                      </Text>
                      {!!courseItem.description && (
                        <Text style={styles.benefitSubtitle} numberOfLines={2}>
                          {courseItem.description}
                        </Text>
                      )}
                    </View>
                  </View>
                ))}

                {/* Static future content row (only for subscription) */}
                {!isOneTime && (
                  <View style={styles.benefitRow}>
                    <View style={styles.benefitIconWrapper}>
                      <Icon name="Star" size={16} color={COLORS.gold} />
                    </View>
                    <View style={styles.benefitTextContainer}>
                      <Text style={styles.benefitTitle}>
                        All future premium content!
                      </Text>
                      <Text style={styles.benefitSubtitle}>
                        Get access to new courses as they're added
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </>
          )}
        </ScrollView>

        {/* ── Footer Buttons ──────────────────────── */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.maybeLaterButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={styles.maybeLaterText}>Maybe Later</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.subscribeButton,
              !isOneTime && !selectedOption && styles.subscribeButtonDisabled,
            ]}
            activeOpacity={0.85}
            disabled={!isOneTime && !selectedOption}
          >
            <Text style={styles.subscribeButtonText}>
              {isOneTime ? 'Pay Once -' : 'Subscribe Now for'}{' '}
              <Text style={styles.subscribePriceText}>
                {isOneTime ? getOneTimePrice() : subscribePriceLabel}
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CourseSubscriptionModal;
