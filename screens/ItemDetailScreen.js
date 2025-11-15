import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { getItemById, deleteItem } from '../data/inventory';

export default function ItemDetailScreen({ route, navigation }) {
  const { itemId } = route.params;
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load item details
  useEffect(() => {
    loadItemDetail();
  }, [itemId]);

  const loadItemDetail = async () => {
    try {
      setLoading(true);
      const itemData = await getItemById(itemId);
      if (itemData) {
        setItem(itemData);
      } else {
        Alert.alert('Error', 'Item not found');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Load item details failed:', error);
      Alert.alert('Error', 'Failed to load, please retry');
    } finally {
      setLoading(false);
    }
  };

  // Delete item
  const handleDelete = () => {
    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to delete "${item.name}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const success = await deleteItem(item.id);
            if (success) {
              Alert.alert('Success', 'Item deleted', [
                {
                  text: 'OK',
                  onPress: () => navigation.goBack(),
                },
              ]);
            } else {
              Alert.alert('Failed', 'Delete failed, please retry');
            }
          },
        },
      ]
    );
  };

  if (loading || !item) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Item image */}
      {item.imageUrl && (
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      )}

      <View style={styles.content}>
        {/* Item title */}
        <View style={styles.header}>
          <Text style={styles.title}>{item.name}</Text>
          {item.isTopMatch && (
            <View style={styles.topMatchBadge}>
              <Text style={styles.topMatchText}>Top Match</Text>
            </View>
          )}
        </View>

        {/* Match reason (if available) */}
        {item.matchReason && (
          <View style={styles.matchReasonCard}>
            <Text style={styles.matchReasonLabel}>Match Reason</Text>
            <Text style={styles.matchReasonText}>{item.matchReason}</Text>
          </View>
        )}

        {/* Basic information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Category</Text>
            <Text style={styles.infoValue}>{item.category}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Condition</Text>
            <Text style={styles.infoValue}>{item.condition}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Created</Text>
            <Text style={styles.infoValue}>
              {new Date(item.createdAt).toLocaleString('en-US')}
            </Text>
          </View>

          {item.updatedAt && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Updated</Text>
              <Text style={styles.infoValue}>
                {new Date(item.updatedAt).toLocaleString('en-US')}
              </Text>
            </View>
          )}
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{item.summary}</Text>
        </View>

        {/* Keywords */}
        {item.keywords && item.keywords.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Keywords</Text>
            <View style={styles.tagsWrapper}>
              {item.keywords.map((keyword, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{keyword}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Action buttons */}
        <View style={styles.actionSection}>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
            activeOpacity={0.7}
          >
            <Text style={styles.deleteButtonText}>Delete Item</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  image: {
    width: '100%',
    height: 300,
    backgroundColor: '#e0e0e0',
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    flex: 1,
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  topMatchBadge: {
    backgroundColor: '#34C759',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  topMatchText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  matchReasonCard: {
    backgroundColor: '#f0f7ff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  matchReasonLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 8,
  },
  matchReasonText: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  infoLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
    width: 100,
  },
  infoValue: {
    flex: 1,
    fontSize: 15,
    color: '#1a1a1a',
  },
  description: {
    fontSize: 15,
    color: '#555',
    lineHeight: 24,
  },
  tagsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#E8F4FF',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  tagText: {
    color: '#007AFF',
    fontSize: 13,
    fontWeight: '500',
  },
  actionSection: {
    marginTop: 20,
    marginBottom: 40,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
