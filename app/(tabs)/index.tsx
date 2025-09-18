import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React from 'react';
import { Dimensions, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function Dashboard() {
  console.log('Dashboard rendering...');
  const quickActions = [
    {
      title: 'Crop Scanner',
      subtitle: 'Detect pests & diseases',
      icon: 'camera-outline',
      color: 'bg-blue-500',
      href: '/(tabs)/crop-scanner'
    },
    {
      title: 'AI Recommendations',
      subtitle: 'Get crop suggestions',
      icon: 'bulb-outline',
      color: 'bg-green-500',
      href: '/(tabs)/crop-recommendations'
    },
    {
      title: 'Weather Forecast',
      subtitle: '7-day weather outlook',
      icon: 'partly-sunny-outline',
      color: 'bg-yellow-500',
      href: '/weather-forecast'
    },
    {
      title: 'Market Insights',
      subtitle: 'Price trends & demand',
      icon: 'trending-up-outline',
      color: 'bg-purple-500',
      href: '/(tabs)/market-insights'
    }
  ];

  const stats = [
    { label: 'Soil pH', value: '6.8', unit: '', status: 'good' },
    { label: 'Moisture', value: '65', unit: '%', status: 'optimal' },
    { label: 'Temperature', value: '24', unit: '°C', status: 'good' },
    { label: 'Humidity', value: '78', unit: '%', status: 'high' }
  ];

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 pt-4 pb-4">
          <View className="flex-row items-center justify-between mb-2">
            <View>
              <Text className="text-2xl font-bold text-gray-900">Good Morning!</Text>
              <Text className="text-gray-600">Welcome back to Farmula</Text>
            </View>
            <Link href="/(tabs)/profile" asChild>
              <TouchableOpacity className="w-10 h-10 bg-green-100 rounded-full items-center justify-center">
                <Ionicons name="person-outline" size={20} color="#059669" />
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        {/* Weather Card */}
        <View className="px-6 mb-6">
          <View className="gradient-blue rounded-2xl p-6">
            <View className="flex-row items-center justify-between mb-4">
              <View>
                <Text className="text-white text-lg font-semibold">Today's Weather</Text>
                <Text className="text-blue-100">Pune, Maharashtra</Text>
              </View>
              <Ionicons name="partly-sunny" size={32} color="white" />
            </View>
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-white text-3xl font-bold">28°C</Text>
                <Text className="text-blue-100">Partly Cloudy</Text>
              </View>
              <View className="items-end">
                <Text className="text-white text-sm">Humidity: 65%</Text>
                <Text className="text-white text-sm">Wind: 12 km/h</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Soil Stats */}
        <View className="px-6 mb-6">
          <Text className="text-xl font-bold text-gray-900 mb-4">Soil Conditions</Text>
          <View className="flex-row flex-wrap justify-between">
            {stats.map((stat, index) => (
              <View key={index} className="card w-[48%] mb-3">
                <Text className="text-gray-600 text-sm mb-1">{stat.label}</Text>
                <View className="flex-row items-baseline">
                  <Text className="text-2xl font-bold text-gray-900">{stat.value}</Text>
                  <Text className="text-gray-500 ml-1">{stat.unit}</Text>
                </View>
                <View className="flex-row items-center mt-2">
                  <View className={`w-2 h-2 rounded-full mr-2 ${
                    stat.status === 'good' ? 'bg-green-500' :
                    stat.status === 'optimal' ? 'bg-blue-500' : 'bg-yellow-500'
                  }`} />
                  <Text className="text-xs text-gray-600 capitalize">{stat.status}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View className="px-6 mb-6">
          <Text className="text-xl font-bold text-gray-900 mb-4">Quick Actions</Text>
          <View className="flex-row flex-wrap justify-between">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href as any} asChild>
                <TouchableOpacity className="card w-[48%] mb-3 items-center py-4">
                  <View className={`w-12 h-12 ${action.color} rounded-xl items-center justify-center mb-3`}>
                    <Ionicons name={action.icon as any} size={24} color="white" />
                  </View>
                  <Text className="font-semibold text-gray-900 text-center mb-1">{action.title}</Text>
                  <Text className="text-gray-600 text-xs text-center">{action.subtitle}</Text>
                </TouchableOpacity>
              </Link>
            ))}
          </View>
        </View>

        {/* AI Assistant Card */}
        <View className="px-6 mb-6">
          <Link href="/chat-interface" asChild>
            <TouchableOpacity className="gradient-green rounded-2xl p-6">
              <View className="flex-row items-center">
                <View className="w-12 h-12 bg-white/20 rounded-xl items-center justify-center mr-4">
                  <Ionicons name="chatbubble-outline" size={24} color="white" />
                </View>
                <View className="flex-1">
                  <Text className="text-white text-lg font-semibold mb-1">AI Assistant</Text>
                  <Text className="text-green-100 text-sm">Get instant farming advice</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="white" />
              </View>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Recent Activity */}
        <View className="px-6 mb-6">
          <Text className="text-xl font-bold text-gray-900 mb-4">Recent Activity</Text>
          <View className="space-y-3">
            <View className="card flex-row items-center">
              <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center mr-3">
                <Ionicons name="checkmark-circle" size={20} color="#059669" />
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-gray-900">Soil test completed</Text>
                <Text className="text-gray-600 text-sm">2 hours ago</Text>
              </View>
            </View>
            <View className="card flex-row items-center">
              <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-3">
                <Ionicons name="leaf" size={20} color="#3b82f6" />
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-gray-900">Crop recommendation updated</Text>
                <Text className="text-gray-600 text-sm">Yesterday</Text>
              </View>
            </View>
            <View className="card flex-row items-center">
              <View className="w-10 h-10 bg-yellow-100 rounded-full items-center justify-center mr-3">
                <Ionicons name="warning" size={20} color="#f59e0b" />
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-gray-900">Weather alert: Heavy rain expected</Text>
                <Text className="text-gray-600 text-sm">3 days ago</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}