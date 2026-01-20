import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import Modal from 'react-native-modal';
import { COLORS } from '@/Assets/Theme/colors';
import Icon from '@/Components/Core/Icons';
import TextInputField from '@/Components/Core/TextInputField';
import styles from './style';

// Mock data for users
const MOCK_USERS = Array.from({ length: 20 }, (_, i) => ({
    id: (i + 1).toString(),
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
}));

interface User {
    id: string;
    name: string;
    email: string;
}

interface UserSelectionModalProps {
    visible: boolean;
    onClose: () => void;
    onSelect: (selectedIds: string[]) => void;
    initialSelectedIds?: string[];
}

const UserSelectionModal: React.FC<UserSelectionModalProps> = ({
    visible,
    onClose,
    onSelect,
    initialSelectedIds = [],
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIds, setSelectedIds] = useState<string[]>(initialSelectedIds);
    const [users, setUsers] = useState<User[]>(MOCK_USERS);

    useEffect(() => {
        if (visible) {
            setSelectedIds(initialSelectedIds);
            setSearchQuery('');
        }
    }, [visible, initialSelectedIds]);

    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleSelection = (id: string) => {
        setSelectedIds((prev) => {
            if (prev.includes(id)) {
                return prev.filter((item) => item !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    const handleSelect = () => {
        onSelect(selectedIds);
        onClose();
    };

    const renderItem = ({ item }: { item: User }) => {
        const isSelected = selectedIds.includes(item.id);
        return (
            <TouchableOpacity
                style={styles.userItem}
                onPress={() => toggleSelection(item.id)}
            >
                <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                    {isSelected && <Icon name="Check" size={14} color={COLORS.white} />}
                </View>
                <View style={styles.userInfo}>
                    <Text style={styles.userName}>{item.name}</Text>
                    <Text style={styles.userEmail}>{item.email}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <Modal
            isVisible={visible}
            onSwipeComplete={onClose}
            onBackdropPress={onClose}
            swipeDirection="down"
            style={styles.modalContainer}
        >
            <View style={styles.mainModalView}>
                <View style={styles.header}>
                    <Text style={styles.title}>Select Users</Text>
                    <TouchableOpacity onPress={onClose}>
                        <Icon name="X" size={24} color={COLORS.white} />
                    </TouchableOpacity>
                </View>

                <View style={styles.searchContainer}>
                    <Text style={styles.footerText}>Found {filteredUsers.length} users. Start typing to search.</Text>
                    <TextInputField
                        placeholder="Search users..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        leftIcon="magnify"
                        theme={{
                            colors: {
                                background: COLORS.black,
                                text: COLORS.white,
                                placeholder: COLORS.outlineGrey,
                            },
                        }}
                    />
                </View>

                <View style={styles.listContainer}>
                    <FlatList
                        data={filteredUsers}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                    />
                </View>

                <View style={styles.footer}>
                    <TouchableOpacity style={styles.selectButton} onPress={handleSelect}>
                        <Text style={styles.selectButtonText}>
                            Select ({selectedIds.length})
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default UserSelectionModal;
