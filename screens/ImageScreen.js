import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { analyzeItem } from '../lib/ai';
import { addItem } from '../data/inventory';

export default function ImageScreen() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [itemData, setItemData] = useState(null);
  const [processingStage, setProcessingStage] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  // Select image
  const pickImage = async () => {
    // Request media library permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant photo library access to select images');
      return;
    }

    // Open image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.5, // Balance quality and speed
      base64: true, // Get base64 data
      exif: false, // Exclude EXIF data
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
      setItemData(null); // Clear previous recognition result
    }
  };

  // Take photo
  const takePhoto = async () => {
    // Request camera permission
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant camera access to take photos');
      return;
    }

    // Open camera
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.5, // Balance quality and speed
      base64: true,
      exif: false, // Exclude EXIF data
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
      setItemData(null);
    }
  };

  // Recognize image (call Gemini Vision API)
  const recognizeImage = async () => {
    if (!selectedImage) {
      Alert.alert('Notice', 'Please select an image first');
      return;
    }

    if (!selectedImage.base64) {
      Alert.alert('Error', 'Failed to get image data, please select again');
      return;
    }

    setIsLoading(true);
    setUploadProgress(0);

    try {
      setProcessingStage('Preparing image data...');
      setUploadProgress(20);

      setProcessingStage('Uploading to AI engine...');
      setUploadProgress(40);

      // Call Gemini Vision API to recognize image
      const result = await analyzeItem(
        selectedImage.base64,
        selectedImage.mimeType || 'image/jpeg'
      );

      setProcessingStage('AI analysis complete!');
      setUploadProgress(100);

      setItemData(result);
      Alert.alert('Recognition Success', `Identified item: ${result.name}`);
    } catch (error) {
      console.error('Recognition error:', error);
      Alert.alert('Recognition Failed', error.message || 'Please check API Key configuration or network connection');
    } finally {
      setIsLoading(false);
      setProcessingStage('');
      setUploadProgress(0);
    }
  };

  // Save item to inventory
  const saveToInventory = async () => {
    if (!itemData) {
      Alert.alert('Notice', 'No item data to save');
      return;
    }

    try {
      // Add image URL (using selected image)
      const itemToSave = {
        ...itemData,
        imageUrl: selectedImage.uri,
      };

      await addItem(itemToSave);
      Alert.alert(
        'Saved',
        'Item added to inventory and is now searchable',
        [
          {
            text: 'Add More',
            onPress: () => {
              setSelectedImage(null);
              setItemData(null);
            },
          },
          {
            text: 'OK',
            style: 'cancel',
          },
        ]
      );
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert('Save Failed', error.message || 'Please try again later');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>

        {/* Button area */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.button}
            onPress={pickImage}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonEmoji}>🖼️</Text>
            <Text style={styles.buttonText}>Select Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={takePhoto}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonEmoji}>📷</Text>
            <Text style={styles.buttonText}>Take Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Image preview area */}
        {selectedImage && (
          <View style={styles.imageCard}>
            <Image
              source={{ uri: selectedImage.uri }}
              style={styles.previewImage}
              resizeMode="cover"
            />

            <TouchableOpacity
              style={styles.recognizeButton}
              onPress={recognizeImage}
              disabled={isLoading}
              activeOpacity={0.7}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.recognizeButtonText}>
                  🤖 Start Recognition
                </Text>
              )}
            </TouchableOpacity>

            {/* Progress indicator */}
            {isLoading && (
              <View style={styles.progressContainer}>
                <Text style={styles.progressText}>{processingStage}</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${uploadProgress}%` }]} />
                </View>
                <Text style={styles.progressPercent}>{uploadProgress}%</Text>
              </View>
            )}
          </View>
        )}

        {/* Recognition result card */}
        {itemData && (
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>✨ Recognition Result</Text>

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Item Name:</Text>
              <Text style={styles.resultValue}>{itemData.name}</Text>
            </View>

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Category:</Text>
              <Text style={styles.resultValue}>{itemData.category}</Text>
            </View>

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Condition:</Text>
              <Text style={styles.resultValue}>{itemData.condition}</Text>
            </View>

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Description:</Text>
              <Text style={styles.resultValue}>{itemData.summary}</Text>
            </View>

            {/* Display keywords */}
            {itemData.keywords && itemData.keywords.length > 0 && (
              <View style={styles.tagsContainer}>
                <Text style={styles.tagsLabel}>Keywords:</Text>
                <View style={styles.tagsWrapper}>
                  {itemData.keywords.map((keyword, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>{keyword}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            <TouchableOpacity
              style={styles.saveButton}
              onPress={saveToInventory}
              activeOpacity={0.7}
            >
              <Text style={styles.saveButtonText}>💾 Save to Inventory</Text>
            </TouchableOpacity>
          </View>
        )}

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    padding: 16,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  button: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  imageCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  previewImage: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: '#e0e0e0',
  },
  recognizeButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  recognizeButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  resultCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  resultRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  resultLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    width: 100,
  },
  resultValue: {
    flex: 1,
    fontSize: 16,
    color: '#1a1a1a',
  },
  saveButton: {
    backgroundColor: '#34C759',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  tagsContainer: {
    marginTop: 8,
    marginBottom: 8,
  },
  tagsLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  tagsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#007AFF',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tagText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '500',
  },
  progressContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  progressText: {
    fontSize: 14,
    color: '#007AFF',
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  progressPercent: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});
