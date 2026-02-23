import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import styles from './style';
import PlanCard from '@/Components/Core/PlanCard';
import useUserApi from '@/Hooks/Apis/UserApis/use-user-api';
import ChoosePlanSkeleton from '@/Components/Core/Skeleton/ChoosePlanSkeleton';
import { useNavigation } from '@/Hooks/Utils/use-navigation';

const gradients = [
  ['#ff734d', '#ff3bb5'],
  ['#17c8ff', '#007adf'],
];

const ChoosePlan = () => {
  const navigation = useNavigation();
  const { getPlansPublic, apiGetCommunitiesPlansLoading } = useUserApi();
  const [plans, setPlans] = useState<any[]>([]);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    const res = await getPlansPublic();
    console.log('🚀 ~ fetchPlans ~ res:', res);
    if (res?.success && res?.plans) {
      const formattedPlans = res.plans.map((plan, index) => ({
        ...plan,
        gradient:
          index === 0 ? null : gradients[(index - 1) % gradients.length],
      }));
      setPlans(formattedPlans);
    }
  };

  const handleStartNow = plan => {
    console.log('Selected Plan:', plan);
    // You can navigate or trigger payment here
  };

  const handleTermsAndConditions = () => {
    // Navigate to Terms of Service screen
    navigation.navigate('TermsAndConditions');
  };

  const handlePrivacyPolicy = () => {
    // Navigate to Privacy Policy screen
    navigation.navigate('PrivacyPolicy');
  };

  if (apiGetCommunitiesPlansLoading) {
    return (
      <View style={styles.container}>
        <ChoosePlanSkeleton />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.subText}>
          Start building your community today. Scale as you grow with flexible
          pricing that adapts to your needs. Get started instantly.
        </Text>

        {plans.map(plan => (
          <PlanCard
            key={plan._id || plan.id}
            item={plan}
            onStartNow={handleStartNow}
          />
        ))}

        <View style={styles.bottomTextContainer}>
          <Text style={styles.bottomText}>
            By continuing, you agree to our{'\n'}
            <Text style={styles.bottomLink} onPress={handleTermsAndConditions}>
              Terms and Conditions
            </Text>{' '}
            and{' '}
            <Text style={styles.bottomLink} onPress={handlePrivacyPolicy}>
              Privacy Policy
            </Text>
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default ChoosePlan;
