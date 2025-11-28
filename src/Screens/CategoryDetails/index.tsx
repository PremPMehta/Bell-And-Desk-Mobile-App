import Icon from '@/Components/Core/Icons';
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styles from './style';
import { COLORS } from '@/Assets/Theme/colors';

// Add video type item also
const mediaList = [
  { type: 'image', uri: 'https://picsum.photos/800/900?random=1' },
  { type: 'image', uri: 'https://picsum.photos/800/900?random=2' },
  { type: 'video', uri: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4' },
  { type: 'image', uri: 'https://picsum.photos/800/900?random=4' },
];

const CategoryDetails = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const activeItem = mediaList[activeIndex];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* ---------------------- HEADER MEDIA ---------------------- */}
      <View style={styles.bannerContainer}>
        {activeItem.type === 'image' ? (
          <Image source={{ uri: activeItem.uri }} style={styles.bannerImage} />
        ) : (
          <Image
            source={{ uri: 'https://picsum.photos/800/900?blur=3' }}
            style={styles.bannerImage}
          />
        )}

        {/* Play Icon only for video */}
        {activeItem.type === 'video' && (
          <View style={styles.playButton}>
            <Icon name="CirclePlay" color={COLORS.white} size={40} />
          </View>
        )}

        {/* GRADIENT SHADOW AT BOTTOM */}
        <LinearGradient
          colors={['transparent', COLORS.grLight, COLORS.grDark]}
          style={styles.headerGradient}
        />
      </View>

      {/* ---------------------- THUMBNAILS ---------------------- */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.carousel}
        contentContainerStyle={styles.carouselContainer}
      >
        {mediaList.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setActiveIndex(index)}
            style={[
              styles.thumbWrapper,
              activeIndex === index && styles.activeThumb,
            ]}
          >
            <Image
              source={{
                uri: item.uri.includes('mp4')
                  ? 'https://picsum.photos/200/300?blur=2'
                  : item.uri,
              }}
              style={styles.thumbnail}
            />

            {item.type === 'video' && (
              <View style={styles.videoSmallIcon}>
                <Icon name="CirclePlay" color={COLORS.white} size={24} />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ---------------------- CONTENT ---------------------- */}
      <View style={{ paddingHorizontal: 16 }}>
        <TouchableOpacity style={styles.joinNow}>
          <Text style={styles.joinText}>Join Now</Text>
        </TouchableOpacity>

        <View style={styles.socialRow}>
          <TouchableOpacity>
            <Icon name="Instagram" color={COLORS.white} size={24} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name="Linkedin" color={COLORS.white} size={24} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name="Youtube" color={COLORS.white} size={24} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name="Twitter" color={COLORS.white} size={24} />
          </TouchableOpacity>
        </View>

        <View style={styles.linkRowWrapper}>
          <TouchableOpacity
            onPress={() => Linking.openURL('https://balindesk.com/cryptomanji')}
            style={styles.linkRow}
          >
            <Text style={styles.linkText}>
              https://balindesk.com/cryptomanji
            </Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name="Copy" color={COLORS.white} size={18} />
          </TouchableOpacity>
        </View>

        <Text style={styles.descTop}>
          Comunidad De Criptomonedas Diseñado Para Aquellos Que Buscan Aprender,
          Crecer Y Prosperar En El Emocionante Mundo De Inversiones En Activos
          Digitales.
        </Text>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            { number: '12', label: 'Courses', icon: 'GraduationCap' },
            { number: '12', label: 'Videos', icon: 'CirclePlay' },
            { number: '12', label: 'Chapters', icon: 'BookOpenText' },
          ].map((item, index) => (
            <View key={index} style={styles.statCard}>
              <View style={styles.statIcon}>
                <Icon name={item.icon} color={COLORS.white} size={24} />
              </View>
              <View>
                <Text style={styles.statNumber}>{item.number}</Text>
                <Text style={styles.statLabel}>{item.label}</Text>
              </View>
            </View>
          ))}
        </View>

        <Text style={styles.heading}>Bienvenido A Cryptomanji</Text>

        <Text style={styles.subText}>
          La Comunidad Hispana Que Está Dejando De Carrera En Carreras
          Saturadas…
        </Text>

        {[
          'Cursos Premium De Web3, Blockchain, DeFi, Legal Tech, AI',
          'Certificación On-Chain Para Validar Tus Conocimientos',
          'Aprende Con Expertos En El Mundo Cripto',
          'Reportes Semanales: Análisis Y Tendencias Web3',
          'Comunidad Activa En Slack Y Telegram',
        ].map((text, index) => (
          <View key={index} style={styles.bulletRow}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>{text}</Text>
          </View>
        ))}

        <Text style={[styles.subText, { marginTop: 12 }]}>
          🔥 Bonus: Trades Ideas Semanales Y Ejemplos Reales.
        </Text>
      </View>
    </ScrollView>
  );
};

export default CategoryDetails;
