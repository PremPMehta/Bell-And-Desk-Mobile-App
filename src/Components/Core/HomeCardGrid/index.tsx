import React from 'react';
import { View, FlatList, Image, Text, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styles from './style';
import { COLORS } from '@/Assets/Theme/colors';

const HomeCardGrid = ({ data, onPressCard }) => {
  const renderCard = ({ item }) => (
    <LinearGradient
      colors={[COLORS.blue, COLORS.black]}
      style={styles.gradientBorder}
    >
      <TouchableOpacity
        style={styles.cardContainer}
        onPress={() => onPressCard?.(item)}
      >
        <View style={styles.card}>
          <Image source={{ uri: item.image }} style={styles.image} />

          <View style={styles.categoryContainer}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>

          <Text style={styles.title}>{item.title}</Text>
        </View>
      </TouchableOpacity>
    </LinearGradient>
  );

  return (
    <FlatList
      data={data}
      numColumns={2}
      renderItem={renderCard}
      keyExtractor={item => item.id.toString()}
      columnWrapperStyle={{ justifyContent: 'space-between' }}
      scrollEnabled={false}
      contentContainerStyle={{ paddingTop: 10 }}
    />
  );
};

export default HomeCardGrid;
