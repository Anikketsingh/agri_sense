import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import AuthScreen from '../screens/Auth/AuthScreen';
import TutorialIntroScreen from '../screens/Tutorial/TutorialIntroScreen';
import TutorialGPSScreen from '../screens/Tutorial/TutorialGPSScreen';
import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import HomeScreen from '../screens/Home/HomeScreen';
import FieldsScreen from '../screens/Fields/FieldsScreen';
import MyFarmScreen from '../screens/MyFarm/MyFarmScreen';
import CropDiseaseScreen from '../screens/CropDisease/CropDiseaseScreen';
import MarketScreen from '../screens/Market/MarketScreen';
import ScanScreen from '../screens/Scan/ScanScreen';
import SoilScreen from '../screens/Soil/SoilScreen';
import SuggestionsScreen from '../screens/Suggestions/SuggestionsScreen';
import AlertsScreen from '../screens/Alerts/AlertsScreen';
import ReportsScreen from '../screens/Reports/ReportsScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';

// Import stores
import { useAuthStore } from '../store/authStore';
import { useTutorialStore } from '../store/tutorialStore';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Main Tab Navigator (shown after auth)
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Fields') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'Alerts') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          } else if (route.name === 'Reports') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2E7D32',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={DashboardScreen} />
      <Tab.Screen name="Fields" component={FieldsScreen} />
      <Tab.Screen name="Alerts" component={AlertsScreen} />
      <Tab.Screen name="Reports" component={ReportsScreen} />
    </Tab.Navigator>
  );
}

// Root Stack Navigator
export default function AppNavigator() {
  const { isAuthenticated } = useAuthStore();
  const { isTutorialCompleted, isIntroCompleted, isGPSCompleted } = useTutorialStore();

  // Debug logging
  console.log('AppNavigator - isAuthenticated:', isAuthenticated);
  console.log('AppNavigator - isTutorialCompleted:', isTutorialCompleted);
  console.log('AppNavigator - isIntroCompleted:', isIntroCompleted);
  console.log('AppNavigator - isGPSCompleted:', isGPSCompleted);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthScreen} />
      ) : !isTutorialCompleted ? (
        <>
          <Stack.Screen name="TutorialIntro" component={TutorialIntroScreen} />
          <Stack.Screen name="TutorialGPS" component={TutorialGPSScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen 
            name="MyFarm" 
            component={MyFarmScreen}
            options={{ presentation: 'modal' }}
          />
          <Stack.Screen 
            name="CropDisease" 
            component={CropDiseaseScreen}
            options={{ presentation: 'modal' }}
          />
          <Stack.Screen 
            name="Market" 
            component={MarketScreen}
            options={{ presentation: 'modal' }}
          />
          <Stack.Screen 
            name="Scan" 
            component={ScanScreen}
            options={{ presentation: 'modal' }}
          />
          <Stack.Screen 
            name="Soil" 
            component={SoilScreen}
            options={{ presentation: 'modal' }}
          />
          <Stack.Screen 
            name="Suggestions" 
            component={SuggestionsScreen}
            options={{ presentation: 'modal' }}
          />
          <Stack.Screen 
            name="Settings" 
            component={SettingsScreen}
            options={{ presentation: 'modal' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
