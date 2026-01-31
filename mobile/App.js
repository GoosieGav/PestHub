import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

// Theme
import { COLORS, GRADIENTS } from './theme';

// Custom Navigation Theme with proper fonts configuration
const PestHubTheme = {
  ...DarkTheme,
  dark: true,
  colors: {
    ...DarkTheme.colors,
    primary: COLORS.primary,
    background: COLORS.background,
    card: COLORS.background,
    text: COLORS.textPrimary,
    border: COLORS.glassBorder,
    notification: COLORS.primary,
  },
};

// Screens
import LandingScreen from './screens/LandingScreen';
import HomeScreen from './screens/HomeScreen';
import ClassifyScreen from './screens/ClassifyScreen';
import DirectoryScreen from './screens/DirectoryScreen';
import AboutScreen from './screens/AboutScreen';
import PestDetailScreen from './screens/PestDetailScreen';
import CameraScreen from './screens/CameraScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Custom Tab Bar Component with Glassmorphism
function CustomTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.tabBarContainer, { paddingBottom: insets.bottom }]}>
      <BlurView intensity={80} tint="dark" style={styles.tabBarBlur}>
        <LinearGradient
          colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
          style={styles.tabBarGradient}
        >
          <View style={styles.tabBarContent}>
            {state.routes.map((route, index) => {
              const { options } = descriptors[route.key];
              const label = options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                ? options.title
                : route.name;

              const isFocused = state.index === index;

          let iconName;
          if (route.name === 'Home') {
                iconName = isFocused ? 'home' : 'home-outline';
          } else if (route.name === 'Classify') {
                iconName = isFocused ? 'scan' : 'scan-outline';
          } else if (route.name === 'Directory') {
                iconName = isFocused ? 'library' : 'library-outline';
          } else if (route.name === 'About') {
                iconName = isFocused ? 'information-circle' : 'information-circle-outline';
          }

              const onPress = () => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });

                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              };

              return (
                <View
                  key={route.key}
                  style={[
                    styles.tabItem,
                    isFocused && styles.tabItemActive,
                  ]}
                >
                  <View
                    style={styles.tabButton}
                    onTouchEnd={onPress}
                  >
                    {isFocused && (
                      <View style={styles.activeIndicator}>
                        <LinearGradient
                          colors={GRADIENTS.button}
                          style={styles.activeGlow}
                        />
                      </View>
                    )}
                    <Ionicons
                      name={iconName}
                      size={24}
                      color={isFocused ? COLORS.primary : COLORS.textMuted}
                    />
                    <View style={[
                      styles.tabLabel,
                      { opacity: isFocused ? 1 : 0.6 }
                    ]}>
                      <Ionicons
                        name={iconName}
                        size={0}
                        color="transparent"
                      />
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </LinearGradient>
      </BlurView>
    </View>
  );
}

// Main Tab Navigator
function TabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'Home' }}
      />
      <Tab.Screen 
        name="Classify" 
        component={ClassifyScreen}
        options={{ title: 'Scan' }}
      />
      <Tab.Screen 
        name="Directory" 
        component={DirectoryScreen}
        options={{ title: 'Library' }}
      />
      <Tab.Screen 
        name="About" 
        component={AboutScreen}
        options={{ title: 'About' }}
      />
    </Tab.Navigator>
  );
}

// Root Stack Navigator
export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <NavigationContainer theme={PestHubTheme}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: COLORS.background },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen 
            name="Landing" 
            component={LandingScreen}
            options={{
              animation: 'fade',
            }}
          />
          <Stack.Screen 
            name="Main" 
            component={TabNavigator} 
            options={{
              animation: 'fade',
            }}
          />
          <Stack.Screen 
            name="PestDetail" 
            component={PestDetailScreen}
            options={{
              animation: 'slide_from_bottom',
              presentation: 'modal',
            }}
          />
          <Stack.Screen 
            name="Camera" 
            component={CameraScreen}
            options={{
              animation: 'fade',
              presentation: 'fullScreenModal',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 10,
    backgroundColor: 'transparent',
  },
  tabBarBlur: {
    borderRadius: 30,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  tabBarGradient: {
    borderRadius: 30,
  },
  tabBarContent: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabItemActive: {
    transform: [{ scale: 1.05 }],
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    position: 'relative',
  },
  activeIndicator: {
    position: 'absolute',
    top: -2,
    left: '50%',
    marginLeft: -15,
    width: 30,
    height: 3,
    borderRadius: 2,
    overflow: 'hidden',
  },
  activeGlow: {
    flex: 1,
    borderRadius: 2,
  },
  tabLabel: {
    marginTop: 4,
  },
});
