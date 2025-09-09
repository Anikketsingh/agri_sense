import { createClient } from '@supabase/supabase-js';

// Supabase configuration - Replace with your actual credentials
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

// Check if Supabase is properly configured
const isSupabaseConfigured = supabaseUrl !== 'https://your-project.supabase.co' && 
                            supabaseAnonKey !== 'your-anon-key';

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Helper function to check if Supabase is available
export const isSupabaseAvailable = () => supabase !== null;

// Database types
export interface Database {
  public: {
    Tables: {
      farmers: {
        Row: {
          id: string;
          phone: string;
          name: string;
          language: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          phone: string;
          name: string;
          language?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          phone?: string;
          name?: string;
          language?: string;
          created_at?: string;
        };
      };
      fields: {
        Row: {
          id: string;
          farmer_id: string;
          name: string;
          polygon_geojson: any;
          area_m2: number;
          crop?: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          farmer_id: string;
          name: string;
          polygon_geojson: any;
          area_m2: number;
          crop?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          farmer_id?: string;
          name?: string;
          polygon_geojson?: any;
          area_m2?: number;
          crop?: string;
          created_at?: string;
        };
      };
      soil_scans: {
        Row: {
          id: string;
          field_id: string;
          device_id: string;
          ph: number;
          n_ppm: number;
          p_ppm: number;
          k_ppm: number;
          moisture_pct: number;
          ec_ds_m: number;
          temp_c: number;
          score: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          field_id: string;
          device_id: string;
          ph: number;
          n_ppm: number;
          p_ppm: number;
          k_ppm: number;
          moisture_pct: number;
          ec_ds_m: number;
          temp_c: number;
          score: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          field_id?: string;
          device_id?: string;
          ph?: number;
          n_ppm?: number;
          p_ppm?: number;
          k_ppm?: number;
          moisture_pct?: number;
          ec_ds_m?: number;
          temp_c?: number;
          score?: number;
          created_at?: string;
        };
      };
    };
  };
}
