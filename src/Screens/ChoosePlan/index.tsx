import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import styles from './style';
import { PLANS } from '@/Constants/customData';
import PlanCard from '@/Components/Core/PlanCard';
import AppHeader from '@/Components/Navigation/AppHeader';

const ChoosePlan = () => {
  const handleStartNow = plan => {
    console.log('Selected Plan:', plan);
    // You can navigate or trigger payment here
  };

  return (
    <View style={styles.container}>
      {/* <AppHeader /> */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* <Text style={styles.mainText}>Choose Your Perfect Plan</Text> */}
        <Text style={styles.subText}>
          Select The Perfect Plan For Your Community. You Can Upgrade Or
          Downgrade At Any Time.
        </Text>

        {PLANS.map(plan => (
          <PlanCard key={plan.id} item={plan} onStartNow={handleStartNow} />
        ))}
      </ScrollView>
    </View>
  );
};

export default ChoosePlan;
