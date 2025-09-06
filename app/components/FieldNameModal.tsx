import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from './Button';

interface FieldNameModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (fieldName: string) => void;
  area: number;
  pointCount: number;
}

export const FieldNameModal: React.FC<FieldNameModalProps> = ({
  visible,
  onClose,
  onSave,
  area,
  pointCount,
}) => {
  const [fieldName, setFieldName] = useState('');
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (visible) {
      setFieldName('');
      setIsValid(false);
    }
  }, [visible]);

  useEffect(() => {
    setIsValid(fieldName.trim().length >= 2);
  }, [fieldName]);

  const handleSave = () => {
    if (!isValid) {
      Alert.alert('Invalid Name', 'Please enter a field name with at least 2 characters');
      return;
    }

    onSave(fieldName.trim());
    setFieldName('');
  };

  const handleClose = () => {
    setFieldName('');
    onClose();
  };

  const formatArea = (areaInM2: number): string => {
    if (areaInM2 >= 10000) {
      return `${(areaInM2 / 10000).toFixed(2)} hectares`;
    }
    return `${areaInM2.toFixed(0)} m²`;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
          <Text style={styles.title}>Name Your Field</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.content}>
          <View style={styles.fieldInfo}>
            <View style={styles.infoItem}>
              <Ionicons name="resize" size={20} color="#2E7D32" />
              <Text style={styles.infoLabel}>Area:</Text>
              <Text style={styles.infoValue}>{formatArea(area)}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Ionicons name="location" size={20} color="#2E7D32" />
              <Text style={styles.infoLabel}>Points:</Text>
              <Text style={styles.infoValue}>{pointCount}</Text>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Field Name</Text>
            <TextInput
              style={styles.textInput}
              value={fieldName}
              onChangeText={setFieldName}
              placeholder="Enter field name (e.g., North Plot, Rice Field)"
              placeholderTextColor="#999"
              autoFocus
              maxLength={50}
              returnKeyType="done"
              onSubmitEditing={handleSave}
            />
            <Text style={styles.characterCount}>
              {fieldName.length}/50
            </Text>
          </View>

          <View style={styles.suggestions}>
            <Text style={styles.suggestionsTitle}>Suggestions:</Text>
            <View style={styles.suggestionChips}>
              {['North Plot', 'South Field', 'Rice Field', 'Wheat Field', 'Vegetable Garden'].map((suggestion) => (
                <TouchableOpacity
                  key={suggestion}
                  style={styles.suggestionChip}
                  onPress={() => setFieldName(suggestion)}
                >
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Button
            title="Cancel"
            onPress={handleClose}
            variant="outline"
            style={styles.cancelButton}
          />
          <Button
            title="Save Field"
            onPress={handleSave}
            disabled={!isValid}
            style={styles.saveButton}
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  fieldInfo: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
    marginRight: 8,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  characterCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 4,
  },
  suggestions: {
    marginBottom: 24,
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
  },
  suggestionChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  suggestionChip: {
    backgroundColor: '#e8f5e8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#c8e6c9',
  },
  suggestionText: {
    fontSize: 14,
    color: '#2E7D32',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 1,
  },
});
