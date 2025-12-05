import React from 'react';
import { View, Text } from 'react-native';
import Icon from '@/Components/Core/Icons';
import { COLORS } from '@/Assets/Theme/colors';
import styles from './style';

interface Step {
  id: number;
  title: string;
}

interface Props {
  currentStep: number;
  steps: Step[];
}

const CreateCoursesStepper: React.FC<Props> = ({ currentStep, steps }) => {
  return (
    <View style={styles.stepperContainer}>
      {steps.map(step => {
        const isActive = step.id === currentStep;
        const isCompleted = step.id < currentStep;

        return (
          <View key={step.id} style={styles.stepItem}>
            <View
              style={[
                styles.stepCircle,
                isActive && styles.activeStepCircle,
                isCompleted && styles.completedStepCircle,
              ]}
            >
              {isCompleted ? (
                <Icon name="CircleCheck" size={15} color={COLORS.white} />
              ) : (
                <Text
                  style={[
                    styles.stepNumber,
                    (isActive || isCompleted) && styles.activeStepNumber,
                  ]}
                >
                  {step.id}
                </Text>
              )}
            </View>

            <Text
              style={[
                styles.stepLabel,
                (isActive || isCompleted) && styles.activeStepLabel,
              ]}
            >
              {step.title}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

export default CreateCoursesStepper;
