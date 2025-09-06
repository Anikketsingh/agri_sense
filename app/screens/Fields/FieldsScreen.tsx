import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '../../hooks/useI18n';
import { useFieldsStore } from '../../store/fieldsStore';

export default function FieldsScreen() {
  const { t } = useI18n();
  const { fields } = useFieldsStore();

  const handleAddField = () => {
    Alert.alert('Add Field', 'This will open the scan farm screen');
  };

  const renderField = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.fieldCard}>
      <View style={styles.fieldHeader}>
        <Text style={styles.fieldName}>{item.name}</Text>
        <Ionicons name="chevron-forward" size={20} color="#666" />
      </View>
      <View style={styles.fieldDetails}>
        <Text style={styles.fieldDetail}>Area: {item.area_m2} m²</Text>
        {item.crop && <Text style={styles.fieldDetail}>Crop: {item.crop}</Text>}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('fields.title')}</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddField}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {fields.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="map-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>{t('fields.noFields')}</Text>
          <TouchableOpacity style={styles.emptyButton} onPress={handleAddField}>
            <Text style={styles.emptyButtonText}>{t('fields.addField')}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={fields}
          renderItem={renderField}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      )}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#2E7D32',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginVertical: 20,
  },
  emptyButton: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  list: {
    padding: 20,
  },
  fieldCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  fieldHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  fieldName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  fieldDetails: {
    gap: 4,
  },
  fieldDetail: {
    fontSize: 14,
    color: '#666',
  },
});

