# AgriSense - Smart Farming App

A mobile-first React Native app built with Expo that helps farmers make data-backed decisions using farm boundary scans, soil sensor readings, and crop suggestions.

## Features

### MVP Features (Current)
- **Authentication**: Phone OTP-based farmer registration and login
- **Field Management**: GPS-based farm boundary scanning and area calculation
- **Soil Analysis**: BLE-connected soil sensor integration with real-time readings
- **Crop Suggestions**: AI-powered crop recommendations based on soil data
- **Alerts & Tips**: Weather and irrigation alerts
- **Reports**: PDF/CSV export of field data and recommendations
- **Offline Support**: Local SQLite database with background sync
- **Multi-language**: Hindi and English support

### Target Users
- **Farmers**: Simple, voice-friendly interface with large buttons
- **Analysts/Advisors**: Deeper insights and data exports (future)
- **Field Technicians**: Sensor health monitoring (future)

## Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: React Navigation (Stack + Bottom Tabs)
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Database**: SQLite (Expo SQLite)
- **Maps**: Mapbox/Google Maps (to be integrated)
- **Internationalization**: i18next
- **Charts**: Recharts (to be integrated)

## Project Structure

```
/app
  /screens          # All screen components
    /Auth          # Authentication screens
    /Home          # Home dashboard
    /Fields        # Field management
    /Scan          # GPS farm scanning
    /Soil          # Soil analysis
    /Suggestions   # Crop suggestions
    /Alerts        # Alerts and tips
    /Reports       # Reports and exports
    /Settings      # App settings
  /components      # Reusable UI components
  /services        # Business logic services
  /store           # Zustand state stores
  /hooks           # Custom React hooks
  /navigation      # Navigation configuration
  /i18n            # Internationalization
  /lib             # Utilities and helpers
  /assets          # Images, fonts, etc.
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd kheticare/app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on specific platforms:
```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## Development

### Adding New Screens
1. Create screen component in `/screens/[ScreenName]/`
2. Add route to navigation in `/navigation/AppNavigator.tsx`
3. Update translations in `/i18n/locales/`

### Adding New Services
1. Create service class in `/services/`
2. Implement business logic
3. Add error handling and validation
4. Mock API calls for development

### State Management
- Use Zustand stores in `/store/`
- Keep stores focused and single-purpose
- Use React Query for server state

### Internationalization
- Add new strings to `/i18n/locales/en.json` and `/i18n/locales/hi.json`
- Use the `useI18n` hook in components
- Test both languages during development

## Data Model

### Core Entities
- **Farmer**: User profile and authentication
- **Field**: Farm plot with GPS boundaries
- **SoilScan**: Sensor readings and analysis
- **Suggestion**: Crop and farming recommendations
- **Alert**: Weather and farming alerts
- **Report**: Generated reports and exports

### Database Schema
The app uses SQLite for local storage with the following key tables:
- `farmers` - User profiles
- `fields` - Farm field data
- `soil_scans` - Sensor readings
- `suggestions` - AI recommendations
- `alerts` - System alerts
- `reports` - Generated reports

## API Integration

### Authentication
- OTP-based phone verification
- JWT token management
- Farmer profile management

### Field Management
- GPS polygon creation
- Area calculation
- Field CRUD operations

### Soil Analysis
- BLE device connection
- Real-time sensor readings
- Data validation and scoring

### Crop Suggestions
- AI-powered recommendations
- Soil-based crop matching
- Confidence scoring

## Hardware Integration

### Soil Sensor Stick
- BLE communication protocol
- Real-time data streaming
- Device health monitoring
- Battery level tracking

### GPS Integration
- High-accuracy location services
- Polygon boundary tracking
- Area calculation algorithms

## Testing

### Unit Tests
- Service layer testing
- Utility function testing
- State management testing

### Integration Tests
- BLE device integration
- GPS functionality
- Database operations

### E2E Tests
- Complete user workflows
- Cross-platform compatibility
- Performance testing

## Deployment

### Development
- Expo development builds
- Local testing on devices
- Hot reloading support

### Production
- Expo Application Services (EAS)
- App Store and Play Store deployment
- OTA updates support

## Contributing

1. Follow the existing code structure
2. Use TypeScript for type safety
3. Add proper error handling
4. Write tests for new features
5. Update documentation
6. Follow the coding standards

## Roadmap

### Phase 1 (Current - MVP)
- [x] Basic app structure and navigation
- [x] Authentication system
- [x] Core screens and UI
- [ ] GPS field scanning
- [ ] BLE soil sensor integration
- [ ] Basic crop suggestions
- [ ] Offline data sync

### Phase 2 (Future)
- [ ] Advanced analytics
- [ ] Weather integration
- [ ] Multi-season tracking
- [ ] Advisor dashboard
- [ ] Advanced reporting

### Phase 3 (Future)
- [ ] Machine learning models
- [ ] Custom sensor support
- [ ] Advanced recommendations
- [ ] Community features

## License

This project is proprietary and confidential.

## Support

For technical support or questions, please contact the development team.

