import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
  Modal,
} from 'react-native';
import { semanticSearch } from '../lib/ai';
import { getAllItems, deleteItem, updateItem, getAllCategories } from '../data/inventory';

export default function SearchScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    category: '',
    condition: '',
    summary: '',
  });
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Load all categories
  React.useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const allCategories = await getAllCategories();
      setCategories(allCategories);
    } catch (error) {
      console.error('Load categories failed:', error);
    }
  };

  // Execute semantic search
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Notice', 'Please enter search query');
      return;
    }

    setIsLoading(true);

    try {
      // Load inventory from storage
      let inventory = await getAllItems();

      // Filter by category if selected
      if (selectedCategory) {
        inventory = inventory.filter(item => item.category === selectedCategory);
      }

      // Call Gemini AI for semantic search
      const results = await semanticSearch(searchQuery, inventory);

      setSearchResults(results);

      if (results.length === 0) {
        Alert.alert('Search Complete', 'No matching items found, try a different description');
      } else {
        Alert.alert('Search Success', `Found ${results.length} matching items`);
      }
    } catch (error) {
      console.error('Search error:', error);
      Alert.alert('Search Failed', error.message || 'Please check API Key configuration or network connection');
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle category filter
  const handleCategoryToggle = (category) => {
    setSelectedCategory(prev => prev === category ? null : category);
  };

  // Delete item
  const handleDeleteItem = async (itemId, itemName) => {
    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to delete "${itemName}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const success = await deleteItem(itemId);
            if (success) {
              // Remove from search results
              setSearchResults(prev => prev.filter(item => item.id !== itemId));
              setRefreshKey(prev => prev + 1);
              Alert.alert('Success', 'Item deleted');
            } else {
              Alert.alert('Failed', 'Delete failed, please retry');
            }
          },
        },
      ]
    );
  };

  // Start editing item
  const handleEditItem = (item) => {
    setEditingItem(item);
    setEditForm({
      name: item.name,
      category: item.category,
      condition: item.condition,
      summary: item.summary,
    });
  };

  // Save edit
  const handleSaveEdit = async () => {
    if (!editForm.name.trim()) {
      Alert.alert('Notice', 'Item name cannot be empty');
      return;
    }

    try {
      const updatedItem = await updateItem(editingItem.id, editForm);
      if (updatedItem) {
        // Update item in search results
        setSearchResults(prev =>
          prev.map(item => (item.id === editingItem.id ? { ...item, ...editForm } : item))
        );
        setEditingItem(null);
        Alert.alert('Success', 'Item information updated');
      } else {
        Alert.alert('Failed', 'Update failed, please retry');
      }
    } catch (error) {
      console.error('Update error:', error);
      Alert.alert('Failed', 'Update failed, please retry');
    }
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setEditingItem(null);
    setEditForm({
      name: '',
      category: '',
      condition: '',
      summary: '',
    });
  };

  return (
    <View style={styles.container}>
      {/* Search input area */}
      <View style={styles.searchSection}>
        <Text style={styles.hint}>
          💡 Try describing in natural language, e.g., "looking for a toy for a child"
        </Text>

        {/* Category quick filter */}
        {categories.length > 0 && (
          <View style={styles.categorySection}>
            <Text style={styles.categoryLabel}>Quick Filter:</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoryScroll}
            >
              {categories.map((category, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.categoryChip,
                    selectedCategory === category && styles.categoryChipSelected
                  ]}
                  onPress={() => handleCategoryToggle(category)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.categoryChipText,
                    selectedCategory === category && styles.categoryChipTextSelected
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.searchCard}>
          <TextInput
            style={styles.searchInput}
            placeholder="Enter what you need..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            multiline
            numberOfLines={3}
          />

          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSearch}
            disabled={isLoading}
            activeOpacity={0.7}
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.searchButtonText}>🔍 Smart Search</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Search results area */}
      <ScrollView style={styles.resultsSection}>
        {searchResults.length > 0 && (
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsTitle}>
              Found {searchResults.length} matching items
            </Text>
          </View>
        )}

        {searchResults.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.itemCard}
            onPress={() => navigation.navigate('ItemDetail', { itemId: item.id })}
            activeOpacity={0.7}
          >
            {/* Item image */}
            {item.imageUrl && (
              <Image
                source={{ uri: item.imageUrl }}
                style={styles.itemImage}
                resizeMode="cover"
              />
            )}

            <View style={styles.itemHeader}>
              <Text style={styles.itemName}>{item.name}</Text>
              {item.isTopMatch && (
                <View style={styles.matchBadge}>
                  <Text style={styles.matchText}>Top Match</Text>
                </View>
              )}
            </View>

            {/* Match reason */}
            {item.matchReason && (
              <View style={styles.matchReasonContainer}>
                <Text style={styles.matchReasonLabel}>💡 Match Reason:</Text>
                <Text style={styles.matchReasonText}>{item.matchReason}</Text>
              </View>
            )}

            <View style={styles.itemRow}>
              <Text style={styles.itemLabel}>Category:</Text>
              <Text style={styles.itemValue}>{item.category}</Text>
            </View>

            <View style={styles.itemRow}>
              <Text style={styles.itemLabel}>Condition:</Text>
              <Text style={styles.itemValue}>{item.condition}</Text>
            </View>

            <View style={styles.itemRow}>
              <Text style={styles.itemLabel}>Description:</Text>
              <Text style={styles.itemValue}>{item.summary}</Text>
            </View>

            {/* Display keywords */}
            {item.keywords && item.keywords.length > 0 && (
              <View style={styles.tagsContainer}>
                <View style={styles.tagsWrapper}>
                  {item.keywords.slice(0, 5).map((keyword, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>{keyword}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Edit and delete buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={(e) => {
                  e.stopPropagation();
                  handleEditItem(item);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.editButtonText}>✏️ Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={(e) => {
                  e.stopPropagation();
                  handleDeleteItem(item.id, item.name);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.deleteButtonText}>🗑️ Delete</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}

        {searchResults.length === 0 && !isLoading && searchQuery && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyText}>No matching items found</Text>
            <Text style={styles.emptyHint}>Try a different description</Text>
          </View>
        )}
      </ScrollView>

      {/* Edit item modal */}
      <Modal
        visible={editingItem !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCancelEdit}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Item</Text>

            <Text style={styles.inputLabel}>Item Name</Text>
            <TextInput
              style={styles.input}
              value={editForm.name}
              onChangeText={(text) => setEditForm({ ...editForm, name: text })}
              placeholder="Enter item name"
              placeholderTextColor="#999"
            />

            <Text style={styles.inputLabel}>Category</Text>
            <TextInput
              style={styles.input}
              value={editForm.category}
              onChangeText={(text) => setEditForm({ ...editForm, category: text })}
              placeholder="Enter category"
              placeholderTextColor="#999"
            />

            <Text style={styles.inputLabel}>Condition</Text>
            <TextInput
              style={styles.input}
              value={editForm.condition}
              onChangeText={(text) => setEditForm({ ...editForm, condition: text })}
              placeholder="e.g., Good, Fair, Excellent"
              placeholderTextColor="#999"
            />

            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={editForm.summary}
              onChangeText={(text) => setEditForm({ ...editForm, summary: text })}
              placeholder="Enter item description"
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancelEdit}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveEdit}
                activeOpacity={0.7}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  searchSection: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  hint: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  searchCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
  },
  searchInput: {
    fontSize: 16,
    color: '#1a1a1a',
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  searchButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  resultsSection: {
    flex: 1,
    padding: 16,
  },
  resultsHeader: {
    marginBottom: 16,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  itemCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  itemImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: '#e0e0e0',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    flex: 1,
  },
  matchBadge: {
    backgroundColor: '#34C759',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  matchText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  itemRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  itemLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    width: 60,
  },
  itemValue: {
    flex: 1,
    fontSize: 14,
    color: '#1a1a1a',
  },
  itemPrice: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  contactButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  contactButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptyHint: {
    fontSize: 14,
    color: '#999',
  },
  matchReasonContainer: {
    backgroundColor: '#f0f7ff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  matchReasonLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 4,
  },
  matchReasonText: {
    fontSize: 13,
    color: '#555',
    lineHeight: 18,
  },
  tagsContainer: {
    marginTop: 8,
    marginBottom: 8,
  },
  tagsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#E8F4FF',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  tagText: {
    color: '#007AFF',
    fontSize: 12,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
    marginTop: 8,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#e0e0e0',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#1a1a1a',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#34C759',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  categorySection: {
    marginBottom: 16,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  categoryScroll: {
    flexDirection: 'row',
  },
  categoryChip: {
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  categoryChipSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  categoryChipText: {
    fontSize: 14,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  categoryChipTextSelected: {
    color: '#ffffff',
  },
});
