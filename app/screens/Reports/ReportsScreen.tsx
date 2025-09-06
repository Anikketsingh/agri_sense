import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '../../hooks/useI18n';
import { useFieldsStore } from '../../store/fieldsStore';

interface Report {
  id: string;
  fieldId: string;
  fieldName: string;
  dateRange: string;
  soilScans: number;
  suggestions: number;
  alerts: number;
  createdAt: string;
}

export default function ReportsScreen() {
  const { t } = useI18n();
  const { fields } = useFieldsStore();
  const [selectedField, setSelectedField] = useState<string>('all');
  const [selectedDateRange, setSelectedDateRange] = useState<string>('30');

  // Mock data - in real app, this would come from the reports service
  const reports: Report[] = [
    {
      id: '1',
      fieldId: 'field1',
      fieldName: 'North Plot',
      dateRange: 'Last 30 days',
      soilScans: 3,
      suggestions: 2,
      alerts: 1,
      createdAt: '2024-01-15',
    },
    {
      id: '2',
      fieldId: 'field2',
      fieldName: 'South Field',
      dateRange: 'Last 30 days',
      soilScans: 2,
      suggestions: 1,
      alerts: 0,
      createdAt: '2024-01-10',
    },
  ];

  const handleGenerateReport = () => {
    Alert.alert('Generate Report', 'Report generation will be implemented here');
  };

  const handleExportReport = (reportId: string) => {
    Alert.alert('Export Report', `Exporting report ${reportId}...`);
  };

  const handleShareReport = (reportId: string) => {
    Alert.alert('Share Report', `Sharing report ${reportId}...`);
  };

  const renderReport = (report: Report) => (
    <View key={report.id} style={styles.reportCard}>
      <View style={styles.reportHeader}>
        <View>
          <Text style={styles.reportTitle}>{report.fieldName}</Text>
          <Text style={styles.reportDateRange}>{report.dateRange}</Text>
        </View>
        <View style={styles.reportActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleExportReport(report.id)}
          >
            <Ionicons name="download-outline" size={20} color="#1976D2" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleShareReport(report.id)}
          >
            <Ionicons name="share-outline" size={20} color="#4CAF50" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.reportStats}>
        <View style={styles.statItem}>
          <Ionicons name="leaf-outline" size={16} color="#7B1FA2" />
          <Text style={styles.statText}>{report.soilScans} scans</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="bulb-outline" size={16} color="#F57C00" />
          <Text style={styles.statText}>{report.suggestions} suggestions</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="notifications-outline" size={16} color="#D32F2F" />
          <Text style={styles.statText}>{report.alerts} alerts</Text>
        </View>
      </View>

      <Text style={styles.reportCreatedAt}>Created: {report.createdAt}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('reports.title')}</Text>
        <TouchableOpacity style={styles.generateButton} onPress={handleGenerateReport}>
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.generateButtonText}>{t('reports.generateReport')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.filtersSection}>
          <Text style={styles.sectionTitle}>Filters</Text>
          
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>{t('reports.selectField')}</Text>
            <View style={styles.filterOptions}>
              <TouchableOpacity
                style={[styles.filterOption, selectedField === 'all' && styles.filterOptionActive]}
                onPress={() => setSelectedField('all')}
              >
                <Text style={[styles.filterOptionText, selectedField === 'all' && styles.filterOptionTextActive]}>
                  All Fields
                </Text>
              </TouchableOpacity>
              {fields.map((field) => (
                <TouchableOpacity
                  key={field.id}
                  style={[styles.filterOption, selectedField === field.id && styles.filterOptionActive]}
                  onPress={() => setSelectedField(field.id)}
                >
                  <Text style={[styles.filterOptionText, selectedField === field.id && styles.filterOptionTextActive]}>
                    {field.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>{t('reports.dateRange')}</Text>
            <View style={styles.filterOptions}>
              {['7', '30', '90'].map((days) => (
                <TouchableOpacity
                  key={days}
                  style={[styles.filterOption, selectedDateRange === days && styles.filterOptionActive]}
                  onPress={() => setSelectedDateRange(days)}
                >
                  <Text style={[styles.filterOptionText, selectedDateRange === days && styles.filterOptionTextActive]}>
                    {days} days
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.reportsSection}>
          <Text style={styles.sectionTitle}>Generated Reports</Text>
          {reports.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="document-outline" size={64} color="#ccc" />
              <Text style={styles.emptyText}>No reports generated yet</Text>
              <Text style={styles.emptySubtext}>Generate your first report to get started</Text>
            </View>
          ) : (
            <View style={styles.reportsList}>
              {reports.map(renderReport)}
            </View>
          )}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  generateButton: {
    backgroundColor: '#2E7D32',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  filtersSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  filterRow: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  filterOptionActive: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },
  filterOptionText: {
    fontSize: 12,
    color: '#666',
  },
  filterOptionTextActive: {
    color: '#fff',
  },
  reportsSection: {
    flex: 1,
  },
  reportsList: {
    gap: 12,
  },
  reportCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  reportDateRange: {
    fontSize: 12,
    color: '#666',
  },
  reportActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#f5f5f5',
  },
  reportStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#666',
  },
  reportCreatedAt: {
    fontSize: 12,
    color: '#999',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

