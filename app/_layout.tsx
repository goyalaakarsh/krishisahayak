import { Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import './globals.css';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" backgroundColor="#ffffff" />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="chat-interface" 
          options={{ 
            headerShown: true, 
            title: 'AI Assistant',
            headerStyle: {
              backgroundColor: '#ffffff',
              borderBottomWidth: 1,
              borderBottomColor: '#e5e7eb',
            },
            headerTitleStyle: {
              fontSize: 18,
              fontWeight: 'bold',
              color: '#111827',
            },
            headerTintColor: '#059669',
          }} 
        />
        <Stack.Screen 
          name="weather-forecast" 
          options={{ 
            headerShown: true, 
            title: 'Weather Forecast',
            headerStyle: {
              backgroundColor: '#ffffff',
              borderBottomWidth: 1,
              borderBottomColor: '#e5e7eb',
            },
            headerTitleStyle: {
              fontSize: 18,
              fontWeight: 'bold',
              color: '#111827',
            },
            headerTintColor: '#059669',
          }} 
        />
      </Stack>
    </>
  );
}