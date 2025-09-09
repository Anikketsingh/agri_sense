# 🌱 AgriSense - Smart Farming Mobile App

A comprehensive React Native mobile application for smart farming, featuring GPS field mapping, soil analysis, crop disease detection, and market price tracking.

## 🚀 Features

### Core Functionality
- **GPS Field Mapping** - Interactive tutorial for field boundary scanning
- **Real-time Area Calculation** - Automatic field area calculation using shoelace formula
- **Soil Analysis** - Integration with BLE soil sensors for pH, nutrients, and moisture
- **Crop Disease Detection** - AI-powered disease identification using image analysis
- **Market Price Tracking** - Real-time crop prices and market trends
- **Offline-First Architecture** - Works without internet connection
- **Multi-language Support** - English and Hindi translations

### Technical Features
- **React Native with Expo** - Cross-platform mobile development
- **TypeScript** - Type-safe development
- **Zustand State Management** - Lightweight state management
- **Supabase Backend** - PostgreSQL database with real-time subscriptions
- **React Navigation** - Stack and tab navigation
- **Animated UI** - Smooth animations and transitions
- **Error Handling** - Comprehensive error boundaries and fallbacks

## 📱 Screens

### Authentication
- **AuthScreen** - Phone number OTP-based authentication

### Tutorial Flow
- **TutorialIntroScreen** - Multi-slide onboarding carousel
- **TutorialGPSScreen** - Interactive GPS mapping tutorial
- **SimpleTutorial** - Simplified tutorial version

### Main App
- **DashboardScreen** - Main dashboard with field overview
- **FieldsScreen** - Field management and listing
- **MyFarmScreen** - Farm management and soil analysis
- **CropDiseaseScreen** - Disease detection and analysis
- **MarketScreen** - Market prices and trends
- **AlertsScreen** - Weather and irrigation alerts
- **ReportsScreen** - Report generation and export
- **SettingsScreen** - App configuration and preferences

## 🛠️ Tech Stack

### Frontend
- **React Native** - Mobile app framework
- **Expo** - Development platform and tools
- **TypeScript** - Type-safe JavaScript
- **React Navigation** - Navigation library
- **Zustand** - State management
- **React Native Animated** - Animation library
- **Expo Vector Icons** - Icon library

### Backend
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Database
- **Row Level Security (RLS)** - Data security
- **Real-time subscriptions** - Live data updates

### Development Tools
- **Metro** - JavaScript bundler
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Git** - Version control

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (for development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Anikketsingh/agri_sense.git
   cd agri_sense/app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Add your Supabase credentials to `.env`:
   ```
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase database**
   - Follow the instructions in `SUPABASE_SETUP.md`
   - Run the SQL schema from `database/schema.sql`

5. **Start the development server**
   ```bash
   npm start
   ```

6. **Run on device/simulator**
   ```bash
   npm run ios     # iOS
   npm run android # Android
   ```

## 📁 Project Structure

```
app/
├── components/          # Reusable UI components
├── screens/            # Screen components
│   ├── Auth/          # Authentication screens
│   ├── Tutorial/      # Tutorial and onboarding
│   ├── Dashboard/     # Main dashboard
│   ├── Fields/        # Field management
│   ├── MyFarm/        # Farm management
│   ├── CropDisease/   # Disease detection
│   ├── Market/        # Market prices
│   ├── Alerts/        # Alerts and notifications
│   ├── Reports/       # Reports and exports
│   └── Settings/      # App settings
├── navigation/         # Navigation configuration
├── store/             # Zustand state stores
├── services/          # API and business logic
├── hooks/             # Custom React hooks
├── lib/               # Utility functions
├── i18n/              # Internationalization
├── database/          # Database schema
└── assets/            # Images and static files
```

## 🔧 Configuration

### Supabase Setup
1. Create a new Supabase project
2. Run the SQL schema from `database/schema.sql`
3. Set up Row Level Security policies
4. Configure environment variables

### Environment Variables
- `EXPO_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key

## 📱 Features in Detail

### GPS Field Mapping
- Interactive tutorial with step-by-step guidance
- Real-time GPS point recording
- Automatic polygon formation
- Area calculation using shoelace formula
- Visual feedback with animations

### Soil Analysis
- BLE sensor integration
- Real-time pH, nutrient, and moisture readings
- Historical data tracking
- Recommendations based on soil health

### Crop Disease Detection
- Image capture and analysis
- AI-powered disease identification
- Treatment recommendations
- Historical disease tracking

### Market Integration
- Real-time crop price updates
- Market trend analysis
- Price alerts and notifications
- Export functionality

## 🐛 Troubleshooting

### Common Issues

1. **Metro bundler cache issues**
   ```bash
   npx expo start --clear
   ```

2. **React hooks order violations**
   - Ensure all hooks are called at the top level
   - No conditional hook calls
   - Consistent hook order on every render

3. **Supabase connection issues**
   - Check environment variables
   - Verify Supabase project configuration
   - Check network connectivity

4. **Navigation errors**
   - Ensure proper navigation setup
   - Check screen component exports
   - Verify navigation stack configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Aniket Singh** - Lead Developer
- **AgriSense Team** - Smart Farming Solutions

## 📞 Support

For support, email support@agrisense.com or create an issue in the GitHub repository.

## 🗺️ Roadmap

### Phase 1 (Current)
- ✅ GPS field mapping
- ✅ Basic soil analysis
- ✅ Crop disease detection
- ✅ Market price tracking

### Phase 2 (Upcoming)
- 🔄 Advanced analytics dashboard
- 🔄 Weather integration
- 🔄 Irrigation recommendations
- 🔄 Supply chain tracking

### Phase 3 (Future)
- 🔄 Machine learning predictions
- 🔄 IoT sensor integration
- 🔄 Blockchain integration
- 🔄 Advanced reporting

---

**Built with ❤️ for farmers by the AgriSense team**