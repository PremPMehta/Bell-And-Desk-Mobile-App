import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Linking,
    ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import styles from './style';
import { COLORS } from '@/Assets/Theme/colors';
import Icon from '@/Components/Core/Icons';

interface LinkPreviewProps {
    url: string;
    platform?: string;
}

interface Metadata {
    title: string;
    description: string;
    image: string;
    domain: string;
}

const LinkPreview: React.FC<LinkPreviewProps> = ({ url, platform }) => {
    const [metadata, setMetadata] = useState<Metadata | null>(null);
    const [loading, setLoading] = useState(true);

    const getYoutubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const fetchMetadata = async () => {
        try {
            setLoading(true);
            const domain = url.split('/')[2].replace('www.', '');

            // Special handling for YouTube
            const youtubeId = getYoutubeId(url);
            if (youtubeId) {
                setMetadata({
                    title: 'YouTube Video',
                    description: 'Enjoy the videos and music you love, upload original content, and share it all with friends, family, and the world on YouTube.',
                    image: `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
                    domain: 'youtube.com',
                });
                setLoading(false);
                return;
            }

            // Generic fetching for others
            const response = await axios.get(url, { timeout: 5000 });
            const html = response.data;

            const getMetaTag = (tag: string) => {
                const regex = new RegExp(`<meta[^>]+property=["']${tag}["'][^>]+content=["']([^"']+)["']`, 'i');
                const match = html.match(regex);
                return match ? match[1] : null;
            };

            const title = getMetaTag('og:title') || html.match(/<title>(.*?)<\/title>/i)?.[1] || 'Link Preview';
            const description = getMetaTag('og:description') || 'No description available';
            const image = getMetaTag('og:image') || '';

            setMetadata({
                title,
                description,
                image,
                domain,
            });
        } catch (error) {
            console.log('Error fetching metadata:', error);
            // Fallback
            setMetadata({
                title: platform ? `${platform} Link` : 'Link Preview',
                description: url,
                image: '',
                domain: url.split('/')[2],
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMetadata();
    }, [url]);

    const handlePress = () => {
        Linking.openURL(url).catch(err => console.error('An error occurred', err));
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator color={COLORS.primary} />
            </View>
        );
    }

    if (!metadata) return null;

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={handlePress}
            activeOpacity={0.9}
        >
            <View style={styles.bannerContainer}>
                {metadata.image ? (
                    <Image source={{ uri: metadata.image }} style={styles.banner} />
                ) : (
                    <View style={[styles.banner, styles.fallbackBanner]}>
                        <Icon name="Link" size={40} color={COLORS.subText} />
                    </View>
                )}
                <View style={styles.playOverlay}>
                    <Icon name="PlayCircle" size={48} color={COLORS.white} />
                </View>
            </View>

            <View style={styles.contentContainer}>
                <Text style={styles.title} numberOfLines={2}>
                    {metadata.title}
                </Text>
                <Text style={styles.description} numberOfLines={2}>
                    {metadata.description}
                </Text>
                <Text style={styles.domain}>{metadata.domain}</Text>
            </View>
        </TouchableOpacity>
    );
};

export default LinkPreview;
