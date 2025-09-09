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
import { useFieldsStore } from '../../store/fieldsStore';

interface FarmOptionProps {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  color: string;
  comingSoon?: boolean;
}

const FarmOption: React.FC<FarmOptionProps> = ({ 
  title, 
  subtitle, 
  icon, 
  onPress, 
  color,
  comingSoon = false
}) => (
  <TouchableOpacity 
    style={[styles.optionCard, comingSoon && styles.comingSoonCard]} 
    onPress={onPress}
    disabled={comingSoon}
  >
    <View style={[styles.optionIcon, { backgroundColor: color + '20' }]}>
      <Ionicons name={icon} size={28} color={color} />
    </View>
    <View style={styles.optionContent}>
      <Text style={styles.optionTitle}>{title}</Text>
      <Text style={styles.optionSubtitle}>{subtitle}</Text>
      {comingSoon && (
        <Text style={styles.comingSoonText}>Coming Soon</Text>
      )}
    </View>
    <Ionicons name="chevron-forward" size={20} color="#666" />
  </TouchableOpacity>
);

export default function MyFarmScreen() {
  const { t } = useI18n();
  const { fields } = useFieldsStore();
  const navigation = useNavigation();

  const handleWithSensorPress = () => {
    navigation.navigate('Soil' as never);
  };

  const handleWithoutSensorPress = () => {
    Alert.alert('Manual Input', 'Manual soil input coming soon!');
  };

  const handleFertilizerMonitorPress = () => {
    Alert.alert('Fertilizer Monitor', 'Fertilizer monitoring coming soon!');
  };

  const handleIrrigationMonitorPress = () => {
    Alert.alert('Irrigation Monitor', 'Irrigation monitoring coming soon!');
  };

  const handleYieldPredictionPress = () => {
    Alert.alert('Yield Prediction', 'Yield prediction coming soon!');
  };

  const handleAddFieldPress = () => {
    navigation.navigate('Scan' as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('myFarm.title')}</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddFieldPress}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Field Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('myFarm.selectField')}</Text>
          {fields.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="map-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>{t('myFarm.noFields')}</Text>
              <TouchableOpacity style={styles.addFieldButton} onPress={handleAddFieldPress}>
                <Text style={styles.addFieldButtonText}>{t('myFarm.addFirstField')}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.fieldsList}>
              {fields.map((field) => (
                <TouchableOpacity key={field.id} style={styles.fieldCard}>
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
        </View>

        {/* Soil Analysis Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('myFarm.soilAnalysis')}</Text>
          
          <FarmOption
            title={t('myFarm.withSensor')}
            subtitle={t('myFarm.withSensorSubtitle')}
            icon="bluetooth"
            onPress={handleWithSensorPress}
            color="#7B1FA2"
          />
          
          <FarmOption
            title={t('myFarm.withoutSensor')}
            subtitle={t('myFarm.withoutSensorSubtitle')}
            icon="create-outline"
            onPress={handleWithoutSensorPress}
            color="#F57C00"
            comingSoon
          />
        </View>

        {/* Monitoring Tools */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('myFarm.monitoringTools')}</Text>
          
          <FarmOption
            title={t('myFarm.fertilizerMonitor')}
            subtitle={t('myFarm.fertilizerMonitorSubtitle')}
            icon="analytics-outline"
            onPress={handleFertilizerMonitorPress}
            color="#1976D2"
            comingSoon
          />
          
          <FarmOption
            title={t('myFarm.irrigationMonitor')}
            subtitle={t('myFarm.irrigationMonitorSubtitle')}
            icon="water-outline"
            onPress={handleIrrigationMonitorPress}
            color="#00BCD4"
            comingSoon
          />
          
          <FarmOption
            title={t('myFarm.yieldPrediction')}
            subtitle={t('myFarm.yieldPredictionSubtitle')}
            icon="trending-up-outline"
            onPress={handleYieldPredictionPress}
            color="#4CAF50"
            comingSoon
          />
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
  addButton: {
    backgroundColor: '#2E7D32',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    marginVertical: 16,
  },
  addFieldButton: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addFieldButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  fieldsList: {
    gap: 12,
  },
  fieldCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
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
  optionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  comingSoonCard: {
    opacity: 0.6,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#212529',
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 14,
    color: '#6c757d',
  },
  comingSoonText: {
    fontSize: 12,
    color: '#F57C00',
    fontWeight: '500',
    marginTop: 4,
  },
});
