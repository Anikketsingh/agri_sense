import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useI18n } from '../../hooks/useI18n';
import { useAuthStore } from '../../store/authStore';
import { useFieldsStore } from '../../store/fieldsStore';
import { LanguageSelector } from '../../components';

interface DashboardCardProps {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  color: string;
  badge?: number | undefined;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ 
  title, 
  subtitle, 
  icon, 
  onPress, 
  color,
  badge 
}) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <View style={[styles.cardIcon, { backgroundColor: color + '20' }]}>
      <Ionicons name={icon} size={32} color={color} />
    </View>
    <View style={styles.cardContent}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardSubtitle}>{subtitle}</Text>
    </View>
    {badge !== undefined && badge > 0 && (
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{badge.toString()}</Text>
      </View>
    )}
    <Ionicons name="chevron-forward" size={20} color="#666" />
  </TouchableOpacity>
);

const QuickStatsCard: React.FC<{ fields: any[] }> = ({ fields }) => {
  const totalArea = fields.reduce((sum, field) => sum + field.area_m2, 0);
  const fieldsWithCrops = fields.filter(field => field.crop).length;
  
  return (
    <View style={styles.statsCard}>
      <Text style={styles.statsTitle}>Quick Stats</Text>
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{fields.length}</Text>
          <Text style={styles.statLabel}>Fields</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{totalArea.toFixed(1)}m²</Text>
          <Text style={styles.statLabel}>Total Area</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{fieldsWithCrops}</Text>
          <Text style={styles.statLabel}>With Crops</Text>
        </View>
      </View>
    </View>
  );
};

export default function DashboardScreen() {
  const { t, changeLanguage, currentLanguage } = useI18n();
  const { farmer } = useAuthStore();
  const { fields, loading, fetchFields, refreshFields } = useFieldsStore();
  const navigation = useNavigation();

  // Fetch fields on component mount
  useEffect(() => {
    if (farmer?.id) {
      fetchFields(farmer.id);
    }
  }, [farmer?.id]);

  const handleRefresh = async () => {
    if (farmer?.id) {
      await refreshFields(farmer.id);
    }
  };

  const handleMyFarmPress = () => {
    navigation.navigate('MyFarm' as never);
  };

  const handleCropDiseasePress = () => {
    navigation.navigate('CropDisease' as never);
  };

  const handleMarketPress = () => {
    navigation.navigate('Market' as never);
  };

  const handleAddFieldPress = () => {
    navigation.navigate('Scan' as never);
  };


  const recentFields = fields.slice(0, 3);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>{t('dashboard.welcome')}</Text>
          <Text style={styles.farmerId}>{farmer?.id}</Text>
        </View>
        <LanguageSelector />
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={handleRefresh}
            colors={['#2E7D32']}
            tintColor="#2E7D32"
          />
        }
      >
        {/* Quick Stats */}
        {fields.length > 0 && (
          <QuickStatsCard fields={fields} />
        )}

        {/* Main Feature Cards */}
        <View style={styles.cardsContainer}>
          <DashboardCard
            title={t('dashboard.myFarm')}
            subtitle={t('dashboard.myFarmSubtitle')}
            icon="leaf-outline"
            onPress={handleMyFarmPress}
            color="#2E7D32"
            badge={fields.length}
          />
          
          <DashboardCard
            title={t('dashboard.cropDisease')}
            subtitle={t('dashboard.cropDiseaseSubtitle')}
            icon="bug-outline"
            onPress={handleCropDiseasePress}
            color="#D32F2F"
          />
          
          <DashboardCard
            title={t('dashboard.market')}
            subtitle={t('dashboard.marketSubtitle')}
            icon="storefront-outline"
            onPress={handleMarketPress}
            color="#1976D2"
          />
        </View>

        {/* Recent Fields */}
        {recentFields.length > 0 && (
          <View style={styles.recentSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t('dashboard.recentFields')}</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Fields' as never)}>
                <Text style={styles.seeAllText}>{t('common.seeAll')}</Text>
              </TouchableOpacity>
            </View>
            
            {recentFields.map((field) => (
              <TouchableOpacity key={field.id} style={styles.fieldItem}>
                <View style={styles.fieldInfo}>
                  <Text style={styles.fieldName}>{field.name}</Text>
                  <Text style={styles.fieldArea}>{field.area_m2.toFixed(1)}m²</Text>
                </View>
                {field.crop && (
                  <View style={styles.cropBadge}>
                    <Text style={styles.cropText}>{field.crop}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Add Field CTA */}
        {fields.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="map-outline" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>{t('dashboard.noFieldsTitle')}</Text>
            <Text style={styles.emptySubtitle}>{t('dashboard.noFieldsSubtitle')}</Text>
            <TouchableOpacity style={styles.addFieldButton} onPress={handleAddFieldPress}>
              <Ionicons name="add" size={20} color="#fff" />
              <Text style={styles.addFieldButtonText}>{t('dashboard.addFirstField')}</Text>
            </TouchableOpacity>
          </View>
        )}
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
  welcomeText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212529',
  },
  farmerId: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '600',
    marginTop: 2,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2E7D32',
  },
  statLabel: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 4,
  },
  cardsContainer: {
    gap: 16,
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6c757d',
  },
  badge: {
    backgroundColor: '#dc3545',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  recentSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
  },
  seeAllText: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '500',
  },
  fieldItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  fieldInfo: {
    flex: 1,
  },
  fieldName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#212529',
    marginBottom: 4,
  },
  fieldArea: {
    fontSize: 14,
    color: '#6c757d',
  },
  cropBadge: {
    backgroundColor: '#e8f5e8',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  cropText: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#212529',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  addFieldButton: {
    backgroundColor: '#2E7D32',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  addFieldButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
