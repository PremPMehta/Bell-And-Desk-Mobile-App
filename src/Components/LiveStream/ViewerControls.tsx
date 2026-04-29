import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from '@/Components/Core/Icons';
import { COLORS } from '@/Assets/Theme/colors';

interface Props {
  onLeave: () => void;
}

const ViewerControls = ({ onLeave }: Props) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.leaveButton} onPress={onLeave}>
        <Icon name="LogOut" color={COLORS.white} size={24} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    zIndex: 10,
  },
  leaveButton: {
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default ViewerControls;
