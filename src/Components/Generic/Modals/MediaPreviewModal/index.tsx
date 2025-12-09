import { View, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import Modal from 'react-native-modal';
import { useAtom } from 'jotai';
import { mediaPreviewAtom } from '@/Jotai/Atoms';
import styles from './style';
import Icon from '@/Components/Core/Icons';
import { COLORS } from '@/Assets/Theme/colors';
import Video from 'react-native-video';

const MediaPreviewModal = () => {
    const [mediaPreview, setMediaPreview] = useAtom(mediaPreviewAtom);
    const videoRef = React.useRef(null);

    const handleClose = () => {
        setMediaPreview(prev => ({ ...prev, visible: false }));
    };

    return (
        <Modal
            isVisible={mediaPreview.visible}
            style={styles.modalContainer}
            onBackdropPress={handleClose}
            onBackButtonPress={handleClose}
            animationIn="fadeIn"
            animationOut="fadeOut"
            supportedOrientations={['portrait', 'landscape']}
        >
            <View style={styles.container}>
                <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                    <Icon name="X" size={24} color={COLORS.white} />
                </TouchableOpacity>

                {mediaPreview.type === 'image' ? (
                    <Image source={{ uri: mediaPreview.uri }} style={styles.image} />
                ) : (
                    <Video
                        source={{ uri: mediaPreview.uri }}
                        ref={videoRef}
                        style={styles.video}
                        controls={true}
                        resizeMode="contain"
                    />
                )}
            </View>
        </Modal>
    );
};

export default MediaPreviewModal;
