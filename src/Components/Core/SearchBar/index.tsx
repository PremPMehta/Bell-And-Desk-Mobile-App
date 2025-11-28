import React from 'react';
import { TextInput, View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from '@/Components/Core/Icons';
import { ms } from '@/Assets/Theme/fontStyle';
import { COLORS } from '@/Assets/Theme/colors';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  searchInputStyle?: any;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search...',
  searchInputStyle,
}) => {
  return (
    <View style={styles.searchWrapper}>
      <View style={styles.iconContainerLeft}>
        <Icon name="Search" size={18} color={COLORS.white} />
      </View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.placeholder}
        style={[styles.searchInput, searchInputStyle]}
      />
      {value.length > 0 && (
        <TouchableOpacity
          onPress={() => onChangeText('')}
          style={styles.iconContainerRight}
        >
          <Icon name="X" size={18} color={COLORS.white} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  searchWrapper: {
    position: 'relative',
    marginVertical: ms(16),
    justifyContent: 'center',
    backgroundColor: COLORS.searchBarBG,
    borderRadius: ms(14),
    paddingLeft: ms(35),

    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainerLeft: {
    position: 'absolute',
    left: ms(10),
    top: '50%',
    transform: [{ translateY: -9 }],
    zIndex: 1,
  },
  searchInput: {
    color: COLORS.white,
    height: ms(35),
  },
  iconContainerRight: {
    position: 'absolute',
    right: ms(10),
    top: '50%',
    transform: [{ translateY: -9 }],
    zIndex: 1,
  },
});
