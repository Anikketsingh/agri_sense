import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useI18n } from '../../hooks/useI18n';
import { useAuthStore } from '../../store/authStore';

interface HomeTileProps {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  color?: string;
}

const HomeTile: React.FC<HomeTileProps> = ({ title, icon, onPress, color = '#2E7D32' }) => (
  <TouchableOpacity style={styles.tile} onPress={onPress}>
    <View style={[styles.tileIcon, { backgroundColor: color + '20' }]}>
      <Ionicons name={icon} size={32} color={color} />
    </View>
    <Text style={styles.tileText}>{title}</Text>
  </TouchableOpacity>
);

export default function HomeScreen() {
  const { t } = useI18n();
  const { farmer } = useAuthStore();
  const navigation = useNavigation();

  const handleTilePress = (screenName: string) => {
    if (screenName === 'Scan' || screenName === 'Soil' || screenName === 'Suggestions' || screenName === 'Settings') {
      navigation.navigate(screenName as never);
    } else {
      // For tab screens, just switch tabs
      navigation.navigate(screenName as never);
    }
  };

  const tiles = [
    {
      title: t('home.myFields'),
      icon: 'map-outline' as keyof typeof Ionicons.glyphMap,
      screen: 'Fields',
      color: '#2E7D32',
    },
    {
      title: t('home.scanFarm'),
      icon: 'scan-outline' as keyof typeof Ionicons.glyphMap,
      screen: 'Scan',
      color: '#1976D2',
    },
    {
      title: t('home.soilAnalysis'),
      icon: 'leaf-outline' as keyof typeof Ionicons.glyphMap,
      screen: 'Soil',
      color: '#7B1FA2',
    },
    {
      title: t('home.cropSuggestions'),
      icon: 'bulb-outline' as keyof typeof Ionicons.glyphMap,
      screen: 'Suggestions',
      color: '#F57C00',
    },
    {
      title: t('home.alerts'),
      icon: 'notifications-outline' as keyof typeof Ionicons.glyphMap,
      screen: 'Alerts',
      color: '#D32F2F',
    },
    {
      title: t('home.reports'),
      icon: 'document-text-outline' as keyof typeof Ionicons.glyphMap,
      screen: 'Reports',
      color: '#455A64',
    },
    {
      title: t('home.settings'),
      icon: 'settings-outline' as keyof typeof Ionicons.glyphMap,
      screen: 'Settings',
      color: '#616161',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>{t('auth.welcome')}</Text>
          <Text style={styles.farmerId}>{farmer?.id}</Text>
        </View>
        <View style={styles.syncStatus}>
          <Ionicons name="cloud-done-outline" size={20} color="#4CAF50" />
          <Text style={styles.syncText}>Synced</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.tilesContainer}>
          {tiles.map((tile, index) => (
            <HomeTile
              key={index}
              title={tile.title}
              icon={tile.icon}
              color={tile.color}
              onPress={() => handleTilePress(tile.screen)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  farmerId: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '500',
    marginTop: 2,
  },
  syncStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  syncText: {
    fontSize: 12,
    color: '#4CAF50',
    marginLeft: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  tilesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  tile: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tileIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  tileText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
});

