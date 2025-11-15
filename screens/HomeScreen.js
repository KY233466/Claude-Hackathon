import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>AI ReUse Assistant</Text>
        <Text style={styles.subtitle}>Give items a second life</Text>
      </View>

      {/* Main Feature Buttons */}
      <View style={styles.mainContent}>

        {/* Image Recognition Button */}
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('ImageScreen')}
        >
          <View style={styles.cardContent}>
            <Text style={styles.cardEmoji}>📸</Text>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>Scan Donation Item</Text>
              <Text style={styles.cardDescription}>
                Upload item photos - AI auto-identifies and catalogs
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Semantic Search Button */}
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('SearchScreen')}
        >
          <View style={styles.cardContent}>
            <Text style={styles.cardEmoji}>🔍</Text>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>Search Items</Text>
              <Text style={styles.cardDescription}>
                Describe what you need - AI finds matching items
              </Text>
            </View>
          </View>
        </TouchableOpacity>

      </View>

      {/* Footer Hint */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Let AI help items find new homes
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingTop: 40,
    paddingBottom: 30,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardEmoji: {
    fontSize: 48,
    marginRight: 16,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  footer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#999',
  },
});
