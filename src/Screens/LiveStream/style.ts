import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '@/Assets/Theme/colors';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoContainer: {
    flex: 1,
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  statusContainer: {
    position: 'absolute',
    top: height / 2 - 50,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 20,
  },
  statusText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '500',
    marginTop: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  contentContainer: {
    flex: 1,
  },
});
