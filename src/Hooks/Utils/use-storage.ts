import AsyncStorage from '@react-native-async-storage/async-storage';

const useStorage = {
  async setItem(key, value) {
    try {
      const stringifiedValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, stringifiedValue);
    } catch (error) {
      console.error(
        `Error saving item to AsyncStorage under key "${key}":`,
        error,
      );
    }
  },

  async getItem(key) {
    try {
      const storedValue = await AsyncStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : null;
    } catch (error) {
      console.error(
        `Error retrieving item from AsyncStorage under key "${key}":`,
        error,
      );
      return null;
    }
  },

  async clearAll() {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing all AsyncStorage data:', error);
    }
  },
};

export default useStorage;
