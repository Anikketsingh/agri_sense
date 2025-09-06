import { create } from 'zustand';
import { FieldService } from '../services/FieldService';

export interface Field {
  id: string;
  farmerId: string;
  name: string;
  polygonGeoJSON: any; // GeoJSON polygon
  area_m2: number;
  crop?: string;
  createdAt: string;
}

interface FieldsState {
  fields: Field[];
  loading: boolean;
  error: string | null;
  addField: (field: Field) => void;
  updateField: (id: string, updates: Partial<Field>) => void;
  deleteField: (id: string) => void;
  getFieldById: (id: string) => Field | undefined;
  fetchFields: (farmerId: string) => Promise<void>;
  syncFieldToServer: (field: Field) => Promise<boolean>;
}

const fieldService = new FieldService();

export const useFieldsStore = create<FieldsState>((set, get) => ({
  fields: [],
  loading: false,
  error: null,
  
  addField: (field) => set((state) => ({ 
    fields: [...state.fields, field],
    error: null 
  })),
  
  updateField: (id, updates) =>
    set((state) => ({
      fields: state.fields.map((field) =>
        field.id === id ? { ...field, ...updates } : field
      ),
    })),
    
  deleteField: (id) =>
    set((state) => ({
      fields: state.fields.filter((field) => field.id !== id),
    })),
    
  getFieldById: (id) => get().fields.find((field) => field.id === id),
  
  fetchFields: async (farmerId: string) => {
    set({ loading: true, error: null });
    try {
      const fields = await fieldService.getFields(farmerId);
      set({ fields, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch fields',
        loading: false 
      });
    }
  },
  
  syncFieldToServer: async (field: Field) => {
    try {
      const result = await fieldService.createField(field);
      if (result.success) {
        // Update the field with the server response
        set((state) => ({
          fields: state.fields.map((f) => 
            f.id === field.id ? { ...f, ...result.field } : f
          )
        }));
        return true;
      } else {
        set({ error: result.message });
        return false;
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to sync field' 
      });
      return false;
    }
  },
}));

