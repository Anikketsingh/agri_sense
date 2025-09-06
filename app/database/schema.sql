-- AgriSense Database Schema for Supabase
-- Run this in your Supabase SQL editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create farmers table
CREATE TABLE IF NOT EXISTS farmers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    phone VARCHAR(15) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    language VARCHAR(5) DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create fields table
CREATE TABLE IF NOT EXISTS fields (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    farmer_id UUID REFERENCES farmers(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    polygon_geojson JSONB NOT NULL,
    area_m2 DECIMAL(10,2) NOT NULL,
    crop VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create soil_scans table
CREATE TABLE IF NOT EXISTS soil_scans (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    field_id UUID REFERENCES fields(id) ON DELETE CASCADE,
    device_id VARCHAR(50) NOT NULL,
    ph DECIMAL(3,1) NOT NULL,
    n_ppm INTEGER NOT NULL,
    p_ppm INTEGER NOT NULL,
    k_ppm INTEGER NOT NULL,
    moisture_pct DECIMAL(4,1) NOT NULL,
    ec_ds_m DECIMAL(4,2) NOT NULL,
    temp_c DECIMAL(4,1) NOT NULL,
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create suggestions table
CREATE TABLE IF NOT EXISTS suggestions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    field_id UUID REFERENCES fields(id) ON DELETE CASCADE,
    soil_scan_id UUID REFERENCES soil_scans(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('crop', 'irrigation', 'fertilizer')),
    title VARCHAR(200) NOT NULL,
    rationale TEXT NOT NULL,
    confidence DECIMAL(3,2) CHECK (confidence >= 0 AND confidence <= 1),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create alerts table
CREATE TABLE IF NOT EXISTS alerts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    field_id UUID REFERENCES fields(id) ON DELETE CASCADE,
    kind VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create reports table
CREATE TABLE IF NOT EXISTS reports (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    field_id UUID REFERENCES fields(id) ON DELETE CASCADE,
    range_start DATE NOT NULL,
    range_end DATE NOT NULL,
    url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_fields_farmer_id ON fields(farmer_id);
CREATE INDEX IF NOT EXISTS idx_fields_created_at ON fields(created_at);
CREATE INDEX IF NOT EXISTS idx_soil_scans_field_id ON soil_scans(field_id);
CREATE INDEX IF NOT EXISTS idx_soil_scans_created_at ON soil_scans(created_at);
CREATE INDEX IF NOT EXISTS idx_suggestions_field_id ON suggestions(field_id);
CREATE INDEX IF NOT EXISTS idx_alerts_field_id ON alerts(field_id);
CREATE INDEX IF NOT EXISTS idx_alerts_resolved_at ON alerts(resolved_at);
CREATE INDEX IF NOT EXISTS idx_reports_field_id ON reports(field_id);

-- Enable Row Level Security (RLS)
ALTER TABLE farmers ENABLE ROW LEVEL SECURITY;
ALTER TABLE fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE soil_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (basic - you may want to customize these)
-- For now, allowing all operations for authenticated users
-- In production, you'd want more specific policies based on farmer_id

-- Farmers policies
CREATE POLICY "Allow all operations for authenticated users" ON farmers
    FOR ALL USING (auth.role() = 'authenticated');

-- Fields policies
CREATE POLICY "Allow all operations for authenticated users" ON fields
    FOR ALL USING (auth.role() = 'authenticated');

-- Soil scans policies
CREATE POLICY "Allow all operations for authenticated users" ON soil_scans
    FOR ALL USING (auth.role() = 'authenticated');

-- Suggestions policies
CREATE POLICY "Allow all operations for authenticated users" ON suggestions
    FOR ALL USING (auth.role() = 'authenticated');

-- Alerts policies
CREATE POLICY "Allow all operations for authenticated users" ON alerts
    FOR ALL USING (auth.role() = 'authenticated');

-- Reports policies
CREATE POLICY "Allow all operations for authenticated users" ON reports
    FOR ALL USING (auth.role() = 'authenticated');

-- Insert a sample farmer for testing
INSERT INTO farmers (id, phone, name, language) 
VALUES (
    '00000000-0000-0000-0000-000000000001',
    '+1234567890',
    'Test Farmer',
    'en'
) ON CONFLICT (id) DO NOTHING;
