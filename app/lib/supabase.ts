import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fmbuvqsvoweclddqvecd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZtYnV2cXN2b3dlY2xkZHF2ZWNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYxNDQwMDAsImV4cCI6MjA1MTcyMDAwMH0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
