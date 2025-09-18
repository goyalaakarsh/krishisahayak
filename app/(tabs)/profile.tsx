import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function Profile() {
  const [user] = useState({
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@email.com',
    phone: '+91 98765 43210',
    location: 'Pune, Maharashtra',
    farmSize: '5.2 hectares',
    experience: '8 years',
    crops: ['Rice', 'Wheat', 'Sugarcane'],
    joinDate: 'January 2023'
  });

  const [notifications, setNotifications] = useState({
    weather: true,
    market: true,
    diseases: true,
    recommendations: false
  });

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const menuItems = [
    {
      title: 'Farm Settings',
      subtitle: 'Manage farm details and preferences',
      icon: 'settings-outline',
      color: 'bg-blue-500',
      onPress: () => Alert.alert('Farm Settings', 'Farm settings feature coming soon!')
    },
    {
      title: 'Weather Alerts',
      subtitle: 'Configure weather notifications',
      icon: 'partly-sunny-outline',
      color: 'bg-yellow-500',
      onPress: () => Alert.alert('Weather Alerts', 'Weather alerts feature coming soon!')
    },
    {
      title: 'Market Watch',
      subtitle: 'Track crop prices and trends',
      icon: 'trending-up-outline',
      color: 'bg-purple-500',
      onPress: () => Alert.alert('Market Watch', 'Market watch feature coming soon!')
    },
    {
      title: 'Help & Support',
      subtitle: 'Get help and contact support',
      icon: 'help-circle-outline',
      color: 'bg-green-500',
      onPress: () => Alert.alert('Help & Support', 'Help & support feature coming soon!')
    },
    {
      title: 'About Farmula',
      subtitle: 'App version and information',
      icon: 'information-circle-outline',
      color: 'bg-gray-500',
      onPress: () => Alert.alert('About Farmula', 'Farmula v1.0.0\nAI-powered farming assistant')
    }
  ];

  const stats = [
    { label: 'Crops Scanned', value: '24', icon: 'camera' },
    { label: 'Diseases Detected', value: '3', icon: 'bug' },
    { label: 'Recommendations', value: '12', icon: 'bulb' },
    { label: 'Days Active', value: '45', icon: 'calendar' }
  ];

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View className="px-6 py-6">
          <View className="gradient-green rounded-2xl p-6 mb-6">
            <View className="flex-row items-center mb-4">
              <View className="w-16 h-16 bg-white/20 rounded-full items-center justify-center mr-4">
                <Ionicons name="person" size={32} color="white" />
              </View>
              <View className="flex-1">
                <Text className="text-white text-xl font-bold">{user.name}</Text>
                <Text className="text-green-100 text-sm">{user.location}</Text>
                <Text className="text-green-100 text-xs">Member since {user.joinDate}</Text>
              </View>
              <TouchableOpacity className="w-10 h-10 bg-white/20 rounded-full items-center justify-center">
                <Ionicons name="create-outline" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Farm Stats */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-4">Farm Overview</Text>
            <View className="flex-row flex-wrap justify-between">
              {stats.map((stat, index) => (
                <View key={index} className="card w-[48%] mb-3 items-center py-4">
                  <View className="w-12 h-12 bg-green-100 rounded-xl items-center justify-center mb-3">
                    <Ionicons name={stat.icon as any} size={24} color="#059669" />
                  </View>
                  <Text className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</Text>
                  <Text className="text-gray-600 text-sm text-center">{stat.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Farm Details */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-4">Farm Details</Text>
            <View className="card">
              <View className="space-y-4">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <Ionicons name="location" size={20} color="#6b7280" />
                    <Text className="text-gray-700 ml-3">Location</Text>
                  </View>
                  <Text className="font-semibold text-gray-900">{user.location}</Text>
                </View>
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <Ionicons name="resize" size={20} color="#6b7280" />
                    <Text className="text-gray-700 ml-3">Farm Size</Text>
                  </View>
                  <Text className="font-semibold text-gray-900">{user.farmSize}</Text>
                </View>
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <Ionicons name="time" size={20} color="#6b7280" />
                    <Text className="text-gray-700 ml-3">Experience</Text>
                  </View>
                  <Text className="font-semibold text-gray-900">{user.experience}</Text>
                </View>
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <Ionicons name="leaf" size={20} color="#6b7280" />
                    <Text className="text-gray-700 ml-3">Main Crops</Text>
                  </View>
                  <Text className="font-semibold text-gray-900">{user.crops.join(', ')}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Notification Settings */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-4">Notification Settings</Text>
            <View className="card">
              <View className="space-y-4">
                {Object.entries(notifications).map(([key, value]) => (
                  <View key={key} className="flex-row items-center justify-between">
                    <View>
                      <Text className="font-semibold text-gray-900 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </Text>
                      <Text className="text-gray-600 text-sm">
                        {key === 'weather' && 'Weather alerts and forecasts'}
                        {key === 'market' && 'Market price updates and trends'}
                        {key === 'diseases' && 'Disease detection and prevention tips'}
                        {key === 'recommendations' && 'Crop recommendations and advice'}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => toggleNotification(key as keyof typeof notifications)}
                      className={`w-12 h-6 rounded-full ${
                        value ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      <View className={`w-5 h-5 bg-white rounded-full mt-0.5 ${
                        value ? 'ml-6' : 'ml-0.5'
                      }`} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Menu Items */}
          <View className="mb-8">
            <Text className="text-lg font-semibold text-gray-900 mb-4">Settings & More</Text>
            <View className="space-y-3">
              {menuItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  className="card flex-row items-center"
                  onPress={item.onPress}
                >
                  <View className={`w-12 h-12 ${item.color} rounded-xl items-center justify-center mr-4`}>
                    <Ionicons name={item.icon as any} size={24} color="white" />
                  </View>
                  <View className="flex-1">
                    <Text className="font-semibold text-gray-900">{item.title}</Text>
                    <Text className="text-gray-600 text-sm">{item.subtitle}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            className="bg-red-500 rounded-xl py-4 items-center mb-8"
            onPress={() => Alert.alert('Logout', 'Are you sure you want to logout?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Logout', style: 'destructive' }
            ])}
          >
            <Text className="text-white font-semibold text-lg">Logout</Text>
          </TouchableOpacity>
        </View>
        
        {/* Bottom padding for tab bar */}
        <View style={{ height: Platform.OS === 'ios' ? 88 : 64 }} />
      </ScrollView>
    </View>
  );
}