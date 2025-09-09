import { supabase, isSupabaseAvailable } from '../lib/supabase';
import { calculatePolygonArea, validatePolygon, createGeoJSONPolygon } from '../lib/geoUtils';

// FieldService - Handles field management and GPS operations with Supabase
export class FieldService {
  async createField(fieldData: {
    farmerId: string;
    name: string;
    polygonGeoJSON: any;
    area_m2: number;
    crop?: string;
  }): Promise<{ success: boolean; field?: any; message: string }> {
    try {
      // Validate polygon
      if (!validatePolygon(fieldData.polygonGeoJSON.geometry.coordinates[0])) {
        return { success: false, message: 'Invalid polygon data' };
      }

      // Check if Supabase is available
      if (!isSupabaseAvailable()) {
        console.warn('Supabase not configured, field saved locally only');
        return {
          success: true,
          field: {
            id: `local_${Date.now()}`,
            farmerId: fieldData.farmerId,
            name: fieldData.name,
            polygonGeoJSON: fieldData.polygonGeoJSON,
            area_m2: fieldData.area_m2,
            crop: fieldData.crop,
            createdAt: new Date().toISOString(),
          },
          message: 'Field saved locally (Supabase not configured)',
        };
      }

      // Insert field into Supabase
      const { data, error } = await supabase
        .from('fields')
        .insert([
          {
            farmer_id: fieldData.farmerId,
            name: fieldData.name,
            polygon_geojson: fieldData.polygonGeoJSON,
            area_m2: fieldData.area_m2,
            crop: fieldData.crop,
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        return { success: false, message: 'Failed to create field in database' };
      }

      return {
        success: true,
        field: {
          id: data.id,
          farmerId: data.farmer_id,
          name: data.name,
          polygonGeoJSON: data.polygon_geojson,
          area_m2: data.area_m2,
          crop: data.crop,
          createdAt: data.created_at,
        },
        message: 'Field created successfully',
      };
    } catch (error) {
      console.error('FieldService.createField error:', error);
      return { success: false, message: 'Failed to create field' };
    }
  }

  async getFields(farmerId: string): Promise<any[]> {
    try {
      // Check if Supabase is available
      if (!isSupabaseAvailable()) {
        console.warn('Supabase not configured, returning empty fields array');
        return [];
      }

      const { data, error } = await supabase
        .from('fields')
        .select('*')
        .eq('farmer_id', farmerId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw new Error('Failed to fetch fields from database');
      }

      return data.map(field => ({
        id: field.id,
        farmerId: field.farmer_id,
        name: field.name,
        polygonGeoJSON: field.polygon_geojson,
        area_m2: field.area_m2,
        crop: field.crop,
        createdAt: field.created_at,
      }));
    } catch (error) {
      console.error('FieldService.getFields error:', error);
      throw new Error('Failed to fetch fields');
    }
  }

  async updateField(fieldId: string, updates: any): Promise<{ success: boolean; message: string }> {
    try {
      // Check if Supabase is available
      if (!isSupabaseAvailable()) {
        console.warn('Supabase not configured, field update skipped');
        return { success: false, message: 'Supabase not configured' };
      }

      const updateData: any = {};
      
      if (updates.name) updateData.name = updates.name;
      if (updates.polygonGeoJSON) {
        updateData.polygon_geojson = updates.polygonGeoJSON;
        if (updates.area_m2) updateData.area_m2 = updates.area_m2;
      }
      if (updates.crop !== undefined) updateData.crop = updates.crop;

      const { error } = await supabase
        .from('fields')
        .update(updateData)
        .eq('id', fieldId);

      if (error) {
        console.error('Supabase error:', error);
        return { success: false, message: 'Failed to update field in database' };
      }

      return { success: true, message: 'Field updated successfully' };
    } catch (error) {
      console.error('FieldService.updateField error:', error);
      return { success: false, message: 'Failed to update field' };
    }
  }

  async deleteField(fieldId: string): Promise<{ success: boolean; message: string }> {
    try {
      // Check if Supabase is available
      if (!isSupabaseAvailable()) {
        console.warn('Supabase not configured, field deletion skipped');
        return { success: false, message: 'Supabase not configured' };
      }

      const { error } = await supabase
        .from('fields')
        .delete()
        .eq('id', fieldId);

      if (error) {
        console.error('Supabase error:', error);
        return { success: false, message: 'Failed to delete field from database' };
      }

      return { success: true, message: 'Field deleted successfully' };
    } catch (error) {
      console.error('FieldService.deleteField error:', error);
      return { success: false, message: 'Failed to delete field' };
    }
  }

  calculateArea(polygon: any): number {
    if (!polygon || !polygon.geometry || !polygon.geometry.coordinates) {
      return 0;
    }
    return calculatePolygonArea(polygon.geometry.coordinates[0]);
  }

  validatePolygon(polygon: any): boolean {
    if (!polygon || !polygon.geometry || !polygon.geometry.coordinates) {
      return false;
    }
    return validatePolygon(polygon.geometry.coordinates[0]);
  }

  createGeoJSONPolygon(coordinates: number[][], name: string): any {
    return createGeoJSONPolygon(coordinates, name);
  }
}

