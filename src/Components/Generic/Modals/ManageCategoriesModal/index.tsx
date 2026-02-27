import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Modal from 'react-native-modal';
import Icon from '@/Components/Core/Icons';
import { COLORS } from '@/Assets/Theme/colors';
import styles from './style';
import TextInputField from '@/Components/Core/TextInputField';

export interface Category {
  id: string;
  name: string;
  isDefault?: boolean;
}

interface ManageCategoriesModalProps {
  visible: boolean;
  onClose: () => void;
  categories: Category[];
  onAdd: (name: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newName: string) => void;
  isCreating?: boolean;
  isUpdating?: boolean;
  isDeleting?: boolean;
}

const ManageCategoriesModal: React.FC<ManageCategoriesModalProps> = ({
  visible,
  onClose,
  categories,
  onAdd,
  onDelete,
  onEdit,
  isCreating,
  isUpdating,
  isDeleting,
}) => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const prevIsUpdatingRef = React.useRef(isUpdating);

  React.useEffect(() => {
    // If we just finished updating
    if (prevIsUpdatingRef.current && !isUpdating) {
      setProcessingId(null);
      setEditingId(null);
      setEditingName('');
    }
    prevIsUpdatingRef.current = isUpdating;
  }, [isUpdating]);

  const prevIsDeletingRef = React.useRef(isDeleting);

  React.useEffect(() => {
    // If we just finished deleting
    if (prevIsDeletingRef.current && !isDeleting) {
      setProcessingId(null);
    }
    prevIsDeletingRef.current = isDeleting;
  }, [isDeleting]);

  const handleCreate = () => {
    const trimmed = newCategoryName.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setNewCategoryName('');
  };

  const handleEditConfirm = (id: string) => {
    const trimmed = editingName.trim();
    if (trimmed) {
      setProcessingId(id);
      onEdit(id, trimmed);
    } else {
      setEditingId(null);
      setEditingName('');
    }
  };

  const handleDelete = (id: string) => {
    setProcessingId(id);
    onDelete(id);
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditingName(cat.name);
  };

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection="down"
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationInTiming={400}
      animationOutTiming={400}
      backdropTransitionInTiming={800}
      backdropTransitionOutTiming={800}
      style={styles.modalContainer}
    >
      <View style={styles.sheet}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Manage Categories</Text>
          <TouchableOpacity
            onPress={onClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon name="X" size={22} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Create New Category Section */}
          <Text style={styles.sectionTitle}>Create New Category</Text>

          {/* <TextInput
                        style={styles.input}
                        placeholder="Category Name *"
                        placeholderTextColor={COLORS.outlineGrey}
                        value={newCategoryName}
                        onChangeText={setNewCategoryName}
                    /> */}
          <View style={styles.inputContainer}>
            <TextInputField
              label="Category Name *"
              //   placeholder="Category Name *"
              value={newCategoryName}
              onChangeText={text => {
                setNewCategoryName(text);
              }}
              theme={{
                colors: {
                  background: COLORS.cardBG,
                  text: COLORS.white,
                  placeholder: COLORS.outlineGrey,
                },
              }}
              textColor={COLORS.white}
              outlineColor={COLORS.outlineGrey}
              activeOutlineColor={COLORS.white}
              style={styles.inputField}
            />

            <TouchableOpacity
              style={styles.createBtn}
              onPress={handleCreate}
              disabled={isCreating}
            >
              {isCreating ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <Text style={styles.createBtnText}>Create</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {/* Existing Categories Section */}
          <Text style={styles.sectionTitle}>Existing Categories</Text>

          {categories.map(cat => (
            <View key={cat.id} style={styles.categoryRow}>
              {editingId === cat.id ? (
                /* Inline edit mode */
                <View style={styles.editRow}>
                  <TextInput
                    style={[styles.input, styles.editInput]}
                    value={editingName}
                    onChangeText={setEditingName}
                    autoFocus
                    placeholderTextColor={COLORS.outlineGrey}
                  />
                  <TouchableOpacity
                    style={styles.confirmEditBtn}
                    onPress={() => handleEditConfirm(cat.id)}
                    disabled={isUpdating && processingId === cat.id}
                  >
                    {isUpdating && processingId === cat.id ? (
                      <ActivityIndicator size="small" color={COLORS.primary} />
                    ) : (
                      <Icon name="Check" size={16} color={COLORS.primary} />
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.closeEditBtn}
                    onPress={() => setEditingId(null)}
                  >
                    <Icon name="X" size={16} color={COLORS.white} />
                  </TouchableOpacity>
                </View>
              ) : (
                /* Normal display mode */
                <View style={styles.catNameRow}>
                  <Text style={styles.catName}>{cat.name}</Text>
                  {cat.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultBadgeText}>Default</Text>
                    </View>
                  )}
                </View>
              )}

              {/* Edit + Delete icons */}
              {editingId !== cat.id && (
                <View style={styles.iconRow}>
                  <TouchableOpacity
                    onPress={() => startEdit(cat)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    style={styles.iconBtn}
                  >
                    <Icon name="Pencil" size={16} color={COLORS.white} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDelete(cat.id)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    style={styles.iconBtn}
                    disabled={isDeleting && processingId === cat.id}
                  >
                    {isDeleting && processingId === cat.id ? (
                      <ActivityIndicator size="small" color={COLORS.red} />
                    ) : (
                      <Icon name="Trash2" size={16} color={COLORS.red} />
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
        </ScrollView>

        {/* Close button */}
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Text style={styles.closeBtnText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default ManageCategoriesModal;
