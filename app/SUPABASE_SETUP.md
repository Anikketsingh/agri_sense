# Supabase Setup Guide

## Current Issue
The app is showing "Invalid API key" errors because Supabase is not properly configured.

## Quick Fix
The app will now work without Supabase (offline mode) but you'll need to configure it for full functionality.

## Setup Steps

### 1. Create Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Sign up/Login and create a new project
3. Wait for the project to be ready

### 2. Get API Credentials
1. Go to your project dashboard
2. Navigate to **Settings** > **API**
3. Copy the following values:
   - **Project URL** (e.g., `https://xyz.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

### 3. Configure Environment Variables
Create a `.env` file in the `app` directory with:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Set Up Database Schema
1. Go to **SQL Editor** in your Supabase dashboard
2. Copy and run the SQL from `app/database/schema.sql`
3. This will create all necessary tables

### 5. Test the Connection
Restart your Expo development server:
```bash
npm start
```

The app should now connect to Supabase without errors.

## Offline Mode
If you don't want to set up Supabase right now, the app will work in offline mode:
- Fields will be saved locally
- No cloud sync
- All other features work normally

## Troubleshooting
- Make sure the `.env` file is in the `app` directory
- Restart the development server after adding environment variables
- Check that your Supabase project is active and not paused
