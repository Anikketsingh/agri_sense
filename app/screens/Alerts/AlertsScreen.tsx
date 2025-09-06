import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '../../hooks/useI18n';

interface Alert {
  id: string;
  type: 'weather' | 'irrigation' | 'soil';
  severity: 'low' | 'medium' | 'high';
  title: string;
  message: string;
  timestamp: string;
  resolved: boolean;
}

export default function AlertsScreen() {
  const { t } = useI18n();

  // Mock data - in real app, this would come from the alerts service
  const alerts: Alert[] = [
    {
      id: '1',
      type: 'weather',
      severity: 'high',
      title: 'Heatwave Warning',
      message: 'Temperature expected to reach 42°C tomorrow. Consider early morning irrigation.',
      timestamp: '2 hours ago',
      resolved: false,
    },
    {
      id: '2',
      type: 'irrigation',
      severity: 'medium',
      title: 'Irrigation Needed',
      message: 'Soil moisture level is below 15%. Your wheat field needs watering.',
      timestamp: '1 day ago',
      resolved: false,
    },
    {
      id: '3',
      type: 'soil',
      severity: 'low',
      title: 'pH Level Alert',
      message: 'Soil pH is slightly acidic (5.8). Consider adding lime for optimal crop growth.',
      timestamp: '3 days ago',
      resolved: true,
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return '#D32F2F';
      case 'medium': return '#F57C00';
      case 'low': return '#2196F3';
      default: return '#666';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'weather': return 'cloudy-outline';
      case 'irrigation': return 'water-outline';
      case 'soil': return 'leaf-outline';
      default: return 'alert-circle-outline';
    }
  };

  const handleResolveAlert = (alertId: string) => {
    // TODO: Implement resolve alert logic
    console.log('Resolved alert:', alertId);
  };

  const renderAlert = ({ item }: { item: Alert }) => (
    <View style={[styles.alertCard, item.resolved && styles.alertCardResolved]}>
      <View style={styles.alertHeader}>
        <View style={styles.alertType}>
          <Ionicons
            name={getTypeIcon(item.type) as keyof typeof Ionicons.glyphMap}
            size={20}
            color={getSeverityColor(item.severity)}
          />
          <Text style={[styles.alertTitle, { color: getSeverityColor(item.severity) }]}>
            {item.title}
          </Text>
        </View>
        <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(item.severity) + '20' }]}>
          <Text style={[styles.severityText, { color: getSeverityColor(item.severity) }]}>
            {item.severity.toUpperCase()}
          </Text>
        </View>
      </View>

      <Text style={styles.alertMessage}>{item.message}</Text>
      
      <View style={styles.alertFooter}>
        <Text style={styles.alertTimestamp}>{item.timestamp}</Text>
        {!item.resolved && (
          <TouchableOpacity
            style={styles.resolveButton}
            onPress={() => handleResolveAlert(item.id)}
          >
            <Text style={styles.resolveButtonText}>Mark as Resolved</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const activeAlerts = alerts.filter(alert => !alert.resolved);
  const resolvedAlerts = alerts.filter(alert => alert.resolved);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('alerts.title')}</Text>
      </View>

      <FlatList
        data={alerts}
        renderItem={renderAlert}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="checkmark-circle-outline" size={64} color="#4CAF50" />
            <Text style={styles.emptyText}>{t('alerts.noAlerts')}</Text>
          </View>
        }
        ListHeaderComponent={
          alerts.length > 0 ? (
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{activeAlerts.length}</Text>
                <Text style={styles.statLabel}>Active</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{resolvedAlerts.length}</Text>
                <Text style={styles.statLabel}>Resolved</Text>
              </View>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
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
  list: {
    padding: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  alertCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  alertCardResolved: {
    opacity: 0.6,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertType: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  severityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  alertMessage: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  alertFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alertTimestamp: {
    fontSize: 12,
    color: '#999',
  },
  resolveButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  resolveButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
  },
});

