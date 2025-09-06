# AgriSense - Smart Farming Made Simple

A React Native mobile application that helps farmers make data-backed decisions using GPS field scanning, soil analysis, and crop recommendations.

## 🌱 Features

### ✅ Implemented Features

- **GPS Field Scanning** - Walk around your field boundary to create accurate field maps
- **Real-time Area Calculation** - Live polygon area calculation as you scan
- **Field Management** - Save and manage multiple fields with Supabase backend
- **Offline-First Architecture** - Works without internet, syncs when online
- **Multi-language Support** - English and Hindi support
- **Modern UI/UX** - Clean, farmer-friendly interface

### 🚧 Planned Features

- Soil Analysis with Hardware Integration
- Crop Suggestions based on Soil Data
- Weather Alerts and Irrigation Recommendations
- Report Generation and Export
- Advanced Analytics Dashboard

## 🛠 Tech Stack

- **Frontend**: React Native with Expo
- **Backend**: Supabase (PostgreSQL + Real-time APIs)
- **State Management**: Zustand
- **Navigation**: React Navigation
- **Maps**: Custom GPS tracking implementation
- **Internationalization**: i18next

## 📱 Screenshots

*Screenshots will be added once the app is deployed*

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Expo CLI
- iOS Simulator or Android Emulator
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Anikketsingh/agri_sense.git
   cd agri_sense
   ```

2. **Install dependencies**
   ```bash
   cd app
   npm install
   ```

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Run the SQL schema from `app/database/schema.sql` in your Supabase SQL editor
   - Update the Supabase configuration in `app/lib/supabase.ts` with your project URL and API key

4. **Start the development server**
   ```bash
   npx expo start
   ```

5. **Run on device/simulator**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your phone

## 🗄 Database Schema

The app uses Supabase with the following main tables:

- **farmers** - User profiles and authentication
- **fields** - Field boundaries stored as GeoJSON polygons
- **soil_scans** - Soil analysis data from hardware sensors
- **suggestions** - AI-powered crop and irrigation recommendations
- **alerts** - Weather and field condition alerts
- **reports** - Generated field reports and analytics

## 🗺 Field Scanning Feature

The core feature allows farmers to:

1. **Start GPS Tracking** - Tap "Start Scan" to begin walking around field boundary
2. **Real-time Visualization** - See live polygon formation and area calculation
3. **Manual Editing** - Add/remove points manually if needed
4. **Field Naming** - Name your field with suggestions
5. **Save to Database** - Store field data locally and sync to Supabase

### Technical Implementation

- **GPS Tracking**: Custom hook using Expo Location API
- **Polygon Calculation**: Shoelace formula for accurate area calculation
- **GeoJSON Storage**: Standard format for geographic data
- **Offline Support**: Local storage with background sync

## 🌍 Internationalization

Currently supports:
- English (en)
- Hindi (hi)

Adding new languages:
1. Create new locale file in `app/i18n/locales/`
2. Add to resources in `app/i18n/simple.ts`
3. Update language selector in settings

## 📁 Project Structure

```
app/
├── components/          # Reusable UI components
│   ├── Button.tsx
│   ├── FieldMap.tsx
│   ├── FieldNameModal.tsx
│   └── Input.tsx
├── hooks/              # Custom React hooks
│   ├── useGPSTracking.ts
│   └── useI18n.ts
├── lib/                # Utilities and configurations
│   ├── geoUtils.ts     # Geographic calculations
│   ├── supabase.ts     # Database client
│   └── utils.ts        # General utilities
├── screens/            # App screens
│   ├── Scan/           # Field scanning
│   ├── Fields/         # Field management
│   ├── Home/           # Dashboard
│   └── ...
├── services/           # API services
│   ├── FieldService.ts
│   └── ...
├── store/              # State management
│   ├── fieldsStore.ts
│   └── authStore.ts
├── i18n/               # Internationalization
└── database/           # Database schemas
    └── schema.sql
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Expo team for the amazing React Native platform
- Supabase for the backend infrastructure
- React Native community for excellent libraries
- Farmers who provided feedback and requirements

## 📞 Contact

- **Developer**: Anikket Singh
- **GitHub**: [@Anikketsingh](https://github.com/Anikketsingh)
- **Project Link**: [https://github.com/Anikketsingh/agri_sense](https://github.com/Anikketsingh/agri_sense)

---

**Made with ❤️ for farmers worldwide**
