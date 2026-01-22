import {
  View,
  Text,
  Animated,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
} from 'react-native';
import React, { useState } from 'react';
import styles from './style';
import Icon from '@/Components/Core/Icons';
import { COLORS } from '@/Assets/Theme/colors';
import { ms } from '@/Assets/Theme/fontStyle';
import { useNavigation } from '@/Hooks/Utils/use-navigation';

interface Props {
  onScroll?: (...args: any[]) => void;
  scrollEventThrottle?: number;
}

const CommunityAbout = ({ onScroll, scrollEventThrottle }: Props) => {
  const navigation = useNavigation();
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  const mediaList = [
    {
      id: '1',
      thumbnail: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4',
      isVideo: true,
    },
    {
      id: '2',
      thumbnail: 'https://picsum.photos/800/900?random=1',
      isVideo: false,
    },
    {
      id: '3',
      thumbnail: 'https://picsum.photos/800/900?random=2',
      isVideo: false,
    },
  ];

  const bulletPoints = [
    'Cursos Premium De Web3, Blockchain, DAOs, Legal Tech, AI, RWA Y Más',
    'Certificación On-Chain Para Validar Tus Conocimientos En La Industria',
    'Clases En Vivo Con Expertos Y Moderadores Activos En El Mundo Cripto',
    'Reporterías Semanales: Análisis, Tendencias Y Oportunidades Web3 En Tiempo Real',
    'Comunidad Activa En Skool Y Telegram Para Colaborar, Preguntar Y Crecer',
    'Acceso Inmediato A Herramientas, Infografías Y Recursos Aplicables Desde El Día 1',
    'Roadmap Estructurado Para Que Vayas De Cero A Ofrecer Tus Servicios En El Ecosistema Web3',
  ];

  const renderThumbnail = ({ item, index }: any) => (
    <TouchableOpacity
      style={[
        styles.thumbnailItem,
        activeMediaIndex === index && styles.activeThumbnail,
      ]}
      onPress={() => setActiveMediaIndex(index)}
    >
      <Image source={{ uri: item.thumbnail }} style={styles.thumbnailImage} />
      {item.isVideo && (
        <View style={styles.thumbnailPlayIcon}>
          <Icon name="PlayCircle" size={24} color={COLORS.white} />
        </View>
      )}
    </TouchableOpacity>
  );

  const handleEditPress = () => {
    navigation.navigate('CreateCommunity');
  };

  return (
    <Animated.ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      onScroll={onScroll}
      scrollEventThrottle={scrollEventThrottle}
    >
      {/* Header Section */}
      <View style={styles.headerRow}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>E</Text>
          </View>
          <Text style={styles.userName}>Elton Hale</Text>
        </View>
        <TouchableOpacity style={styles.editButton} onPress={handleEditPress}>
          <Icon name="Pencil" size={14} color={COLORS.white} />
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>

      {/* Main Video/Media Section */}
      <View style={styles.mainVideoContainer}>
        {/* Placeholder for video player or main image */}
        <Image
          source={{ uri: mediaList[activeMediaIndex].thumbnail }}
          style={{
            width: '100%',
            height: '100%',
            resizeMode: 'cover',
            opacity: 0.5,
          }}
        />
        <TouchableOpacity style={styles.playOverlay}>
          <Icon
            name="Play"
            size={20}
            color={COLORS.primary}
            fill={COLORS.primary}
          />
        </TouchableOpacity>
      </View>

      {/* Thumbnails Gallery */}
      <FlatList
        data={mediaList}
        renderItem={renderThumbnail}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.thumbnailList}
      />

      {/* Community Info Section */}
      <View style={styles.communityInfo}>
        <View style={styles.communityNameRow}>
          <Text style={styles.communityTitle}>Elton Hale</Text>
          <TouchableOpacity style={styles.inviteButton}>
            <Text style={styles.inviteButtonText}>Invite People</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.communityLinkRow}>
          <Text style={styles.communityLink}>
            http://localhost:3000/utinofficissequi
          </Text>
          <Icon name="Copy" size={14} color={COLORS.subText} />
        </View>

        <View style={styles.socialIconsRow}>
          <TouchableOpacity style={styles.socialIcon}>
            <Icon name="Instagram" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialIcon}>
            <Icon name="Linkedin" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialIcon}>
            <Icon name="Youtube" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialIcon}>
            <Icon name="Twitter" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        <Text style={styles.communityDescription}>
          Comunidad De Criptomonedas Diseñada Para Aquellos Que Buscan Aprender,
          Crecer Y Prosperar En El Emocionante Mundo De Inversiones En Activos
          Digitales.
        </Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Icon name="GraduationCap" size={20} color={COLORS.white} />
          </View>
          <View style={styles.statValueContainer}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Courses</Text>
          </View>
        </View>
        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Icon name="Play" size={20} color={COLORS.white} />
          </View>
          <View>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Videos</Text>
          </View>
        </View>
        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Icon name="BookOpen" size={20} color={COLORS.white} />
          </View>
          <View>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Chapters</Text>
          </View>
        </View>
      </View>

      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeHeader}>Bienvenido A Cryptomanji</Text>
        <Text style={styles.welcomeDescription}>
          La Comunidad Hispana Que Está Dejando De Correr En Carreras
          Saturadas... Y Empieza A Prosperar Con Habilidades Del Futuro. Lo Que
          Desbloqueas Por Solo $27/Mes (Valorado En Más De $2,000)
        </Text>

        {bulletPoints.map((point, index) => (
          <View key={index} style={styles.bulletPointRow}>
            <View style={styles.bulletIcon}>
              <Icon name="Dot" size={24} color={COLORS.white} />
            </View>
            <View style={styles.bulletTextContainer}>
              <Text style={styles.bulletText}>{point}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Footer Notes */}
      <View style={styles.footerNote}>
        {/* <Icon name="CircleAlert" size={18} color="#FF6B6B" /> */}
        <Text style={styles.footerNoteText}>
          ❗️Todos Los Cursos Son Flexibles, Grabados Y Sin Relleno
        </Text>
      </View>
      <View style={styles.footerNote}>
        {/* <Icon name="Gift" size={18} color="#FFD93D" /> */}
        <Text style={styles.footerNoteText}>
          🎁 Bonus: Trade Ideas Semanales Y Ejemplos Reales Todo Esto, Por Solo
          $27 Al Mes.
        </Text>
      </View>
    </Animated.ScrollView>
  );
};

export default CommunityAbout;
