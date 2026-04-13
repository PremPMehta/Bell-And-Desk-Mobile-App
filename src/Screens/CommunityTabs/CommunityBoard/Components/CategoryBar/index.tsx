import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import Icon from '@/Components/Core/Icons';
import { COLORS } from '@/Assets/Theme/colors';
import { ms } from '@/Assets/Theme/fontStyle';
import styles from './style';
import { Category } from '@/Components/Generic/Modals/ManageCategoriesModal';

interface CategoryBarProps {
    categories: Category[];
    selectedCategoryId: string | null;
    onSelectCategory: (id: string | null) => void;
    onPressSettings: () => void;
    /** When false, hides the settings / manage categories control */
    showSettingsButton?: boolean;
}

const CategoryBar: React.FC<CategoryBarProps> = ({
    categories,
    selectedCategoryId,
    onSelectCategory,
    onPressSettings,
    showSettingsButton = true,
}) => {
    return (
        <View style={styles.wrapper}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                {/* "All" pill */}
                <TouchableOpacity
                    style={[
                        styles.pill,
                        selectedCategoryId === null && styles.pillActive,
                    ]}
                    onPress={() => onSelectCategory(null)}
                    activeOpacity={0.7}
                >
                    <Icon
                        name="AlignLeft"
                        size={14}
                        color={selectedCategoryId === null ? COLORS.white : COLORS.subText}
                        style={{ marginRight: ms(5) }}
                    />
                    <Text
                        style={[
                            styles.pillText,
                            selectedCategoryId === null && styles.pillTextActive,
                        ]}
                    >
                        All
                    </Text>
                </TouchableOpacity>

                {/* Category pills */}
                {categories.map(cat => (
                    <TouchableOpacity
                        key={cat.id}
                        style={[
                            styles.pill,
                            selectedCategoryId === cat.id && styles.pillActive,
                        ]}
                        onPress={() => onSelectCategory(cat.id)}
                        activeOpacity={0.7}
                    >
                        <Text
                            style={[
                                styles.pillText,
                                selectedCategoryId === cat.id && styles.pillTextActive,
                            ]}
                        >
                            {cat.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Settings / gear icon (manage categories) */}
            {showSettingsButton ? (
                <TouchableOpacity
                    style={styles.settingsBtn}
                    onPress={onPressSettings}
                    activeOpacity={0.7}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                    <Icon name="Settings" size={20} color={COLORS.white} />
                </TouchableOpacity>
            ) : null}
        </View>
    );
};

export default CategoryBar;
