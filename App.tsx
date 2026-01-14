// Main App component with Expo Router
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
    },
  },
});

export default function RootLayout() {
  useEffect(() => {
    // Hide the splash screen after the app is ready
    const hideSplashScreen = async () => {
      await SplashScreen.hideAsync();
    };

    // Simulate loading time
    const timer = setTimeout(hideSplashScreen, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: '#6366f1',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          >
            <Stack.Screen 
              name="index" 
              options={{ 
                title: 'Life Productivity Hub',
                headerShown: false 
              }} 
            />
            <Stack.Screen 
              name="tasks" 
              options={{ 
                title: 'Tasks',
                presentation: 'card'
              }} 
            />
            <Stack.Screen 
              name="notes" 
              options={{ 
                title: 'Notes',
                presentation: 'card'
              }} 
            />
            <Stack.Screen 
              name="finance" 
              options={{ 
                title: 'Finance',
                presentation: 'card'
              }} 
            />
            <Stack.Screen 
              name="dashboard" 
              options={{ 
                title: 'Dashboard',
                presentation: 'card'
              }} 
            />
          </Stack>
          <StatusBar style="light" />
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}