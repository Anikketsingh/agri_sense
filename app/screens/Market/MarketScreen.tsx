import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '../../hooks/useI18n';

interface CropPrice {
  id: string;
  name: string;
  price: number;
  unit: string;
  change: number;
  market: string;
  lastUpdated: string;
}

const mockCropPrices: CropPrice[] = [
  {
    id: '1',
    name: 'Wheat',
    price: 2150,
    unit: 'quintal',
    change: 2.5,
    market: 'Delhi Mandi',
    lastUpdated: '2 hours ago',
  },
  {
    id: '2',
    name: 'Rice',
    price: 1850,
    unit: 'quintal',
    change: -1.2,
    market: 'Mumbai APMC',
    lastUpdated: '1 hour ago',
  },
  {
    id: '3',
    name: 'Maize',
    price: 1650,
    unit: 'quintal',
    change: 0.8,
    market: 'Pune APMC',
    lastUpdated: '3 hours ago',
  },
  {
    id: '4',
    name: 'Cotton',
    price: 6500,
    unit: 'quintal',
    change: 3.2,
    market: 'Gujarat Mandi',
    lastUpdated: '30 min ago',
  },
  {
    id: '5',
    name: 'Sugarcane',
    price: 320,
    unit: 'quintal',
    change: -0.5,
    market: 'UP Mandi',
    lastUpdated: '1 hour ago',
  },
  {
    id: '6',
    name: 'Potato',
    price: 850,
    unit: 'quintal',
    change: 1.8,
    market: 'Punjab Mandi',
    lastUpdated: '45 min ago',
  },
];

export default function MarketScreen() {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filteredCrops = mockCropPrices.filter(crop => 
    crop.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderCropItem = ({ item }: { item: CropPrice }) => (
    <TouchableOpacity style={styles.cropCard}>
      <View style={styles.cropHeader}>
        <Text style={styles.cropName}>{item.name}</Text>
        <View style={[
          styles.changeBadge,
          { backgroundColor: item.change >= 0 ? '#e8f5e8' : '#ffebee' }
        ]}>
          <Ionicons 
            name={item.change >= 0 ? 'trending-up' : 'trending-down'} 
            size={16} 
            color={item.change >= 0 ? '#2E7D32' : '#D32F2F'} 
          />
          <Text style={[
            styles.changeText,
            { color: item.change >= 0 ? '#2E7D32' : '#D32F2F' }
          ]}>
            {item.change >= 0 ? '+' : ''}{item.change}%
          </Text>
        </View>
      </View>
      
      <View style={styles.cropPrice}>
        <Text style={styles.priceValue}>₹{item.price.toLocaleString()}</Text>
        <Text style={styles.priceUnit}>/{item.unit}</Text>
      </View>
      
      <View style={styles.cropDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="location" size={14} color="#6c757d" />
          <Text style={styles.detailText}>{item.market}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="time" size={14} color="#6c757d" />
          <Text style={styles.detailText}>{item.lastUpdated}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const filterOptions = [
    { key: 'all', label: 'All Crops' },
    { key: 'rising', label: 'Rising' },
    { key: 'falling', label: 'Falling' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('market.title')}</Text>
        <TouchableOpacity style={styles.refreshButton}>
          <Ionicons name="refresh" size={20} color="#2E7D32" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color="#6c757d" />
            <TextInput
              style={styles.searchInput}
              placeholder={t('market.searchPlaceholder')}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#6c757d"
            />
          </View>
        </View>

        {/* Filter Buttons */}
        <View style={styles.filterContainer}>
          {filterOptions.map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.filterButton,
                selectedFilter === option.key && styles.filterButtonActive
              ]}
              onPress={() => setSelectedFilter(option.key)}
            >
              <Text style={[
                styles.filterButtonText,
                selectedFilter === option.key && styles.filterButtonTextActive
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Market Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>₹2,150</Text>
            <Text style={styles.statLabel}>Avg Wheat Price</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>+2.1%</Text>
            <Text style={styles.statLabel}>Market Trend</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>6</Text>
            <Text style={styles.statLabel}>Active Markets</Text>
          </View>
        </View>

        {/* Crop Prices List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('market.currentPrices')}</Text>
          <FlatList
            data={filteredCrops}
            renderItem={renderCropItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Market News Placeholder */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('market.marketNews')}</Text>
          <View style={styles.newsPlaceholder}>
            <Ionicons name="newspaper-outline" size={48} color="#ccc" />
            <Text style={styles.newsPlaceholderText}>{t('market.newsComingSoon')}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
  },
  refreshButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#212529',
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  filterButtonActive: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6c757d',
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 16,
  },
  cropCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  cropHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cropName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
  },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  cropPrice: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  priceValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2E7D32',
  },
  priceUnit: {
    fontSize: 14,
    color: '#6c757d',
    marginLeft: 4,
  },
  cropDetails: {
    flexDirection: 'row',
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#6c757d',
  },
  newsPlaceholder: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  newsPlaceholderText: {
    fontSize: 16,
    color: '#6c757d',
    marginTop: 12,
    textAlign: 'center',
  },
});
