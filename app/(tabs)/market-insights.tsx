import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function MarketInsights() {
  const [selectedCrop, setSelectedCrop] = useState('rice');

  const crops = [
    { id: 'rice', name: 'Rice', icon: '🌾' },
    { id: 'wheat', name: 'Wheat', icon: '🌾' },
    { id: 'sugarcane', name: 'Sugarcane', icon: '🌾' },
    { id: 'cotton', name: 'Cotton', icon: '🌾' },
    { id: 'tomato', name: 'Tomato', icon: '🍅' },
    { id: 'potato', name: 'Potato', icon: '🥔' }
  ];

  const marketData = [
    {
      crop: 'Rice',
      currentPrice: '₹2,850',
      change: '+5.2%',
      trend: 'up',
      demand: 'High',
      supply: 'Medium',
      forecast: 'Prices expected to rise 8-12% in next month',
      factors: ['Export demand increasing', 'Monsoon concerns', 'Government MSP support']
    },
    {
      crop: 'Wheat',
      currentPrice: '₹2,200',
      change: '-2.1%',
      trend: 'down',
      demand: 'Medium',
      supply: 'High',
      forecast: 'Prices may stabilize with good harvest',
      factors: ['Good production this year', 'Storage capacity issues', 'Export restrictions']
    },
    {
      crop: 'Sugarcane',
      currentPrice: '₹3,200',
      change: '+8.5%',
      trend: 'up',
      demand: 'Very High',
      supply: 'Low',
      forecast: 'Strong upward trend expected',
      factors: ['Ethanol demand rising', 'Sugar shortage', 'Export opportunities']
    }
  ];

  const priceHistory = [
    { month: 'Jan', price: 2650 },
    { month: 'Feb', price: 2720 },
    { month: 'Mar', price: 2780 },
    { month: 'Apr', price: 2750 },
    { month: 'May', price: 2820 },
    { month: 'Jun', price: 2850 }
  ];

  const newsItems = [
    {
      title: 'Rice Export Ban Lifted',
      summary: 'Government allows rice exports with new regulations',
      impact: 'Positive',
      time: '2 hours ago'
    },
    {
      title: 'Monsoon Arrives Early',
      summary: 'Good rainfall expected to boost crop production',
      impact: 'Positive',
      time: '1 day ago'
    },
    {
      title: 'Fertilizer Prices Rise',
      summary: 'Input costs increase by 15% affecting profit margins',
      impact: 'Negative',
      time: '3 days ago'
    }
  ];

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 py-6">
          <View className="gradient-purple rounded-2xl p-6 mb-6">
            <View className="flex-row items-center mb-4">
              <View className="w-12 h-12 bg-white/20 rounded-xl items-center justify-center mr-4">
                <Ionicons name="trending-up" size={24} color="white" />
              </View>
              <View className="flex-1">
                <Text className="text-white text-lg font-semibold">Market Intelligence</Text>
                <Text className="text-purple-100 text-sm">Real-time price trends & insights</Text>
              </View>
            </View>
          </View>

          {/* Crop Selection */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-3">Select Crop</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
              {crops.map((crop) => (
                <TouchableOpacity
                  key={crop.id}
                  onPress={() => setSelectedCrop(crop.id)}
                  className={`mr-3 px-4 py-3 rounded-xl border ${
                    selectedCrop === crop.id
                      ? 'bg-purple-600 border-purple-600'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <Text className="text-2xl mb-1">{crop.icon}</Text>
                  <Text className={`font-semibold text-sm ${
                    selectedCrop === crop.id ? 'text-white' : 'text-gray-700'
                  }`}>
                    {crop.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Market Overview */}
          <View className="mb-6">
            <Text className="text-xl font-bold text-gray-900 mb-4">Market Overview</Text>
            {marketData.map((data, index) => (
              <View key={index} className="card mb-4">
                <View className="flex-row items-center justify-between mb-3">
                  <View className="flex-row items-center">
                    <Text className="text-2xl mr-3">🌾</Text>
                    <View>
                      <Text className="text-lg font-bold text-gray-900">{data.crop}</Text>
                      <Text className="text-gray-600 text-sm">Current Market Price</Text>
                    </View>
                  </View>
                  <View className="items-end">
                    <Text className="text-2xl font-bold text-gray-900">{data.currentPrice}</Text>
                    <View className={`flex-row items-center ${
                      data.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <Ionicons 
                        name={data.trend === 'up' ? 'trending-up' : 'trending-down'} 
                        size={16} 
                        color={data.trend === 'up' ? '#10b981' : '#ef4444'} 
                      />
                      <Text className="font-semibold ml-1">{data.change}</Text>
                    </View>
                  </View>
                </View>

                <View className="flex-row justify-between mb-3">
                  <View className="flex-1">
                    <Text className="text-gray-600 text-sm">Demand</Text>
                    <View className={`px-2 py-1 rounded-full ${
                      data.demand === 'High' ? 'bg-green-100' :
                      data.demand === 'Very High' ? 'bg-green-200' : 'bg-yellow-100'
                    }`}>
                      <Text className={`text-xs font-semibold ${
                        data.demand === 'High' || data.demand === 'Very High' ? 'text-green-800' : 'text-yellow-800'
                      }`}>
                        {data.demand}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-600 text-sm">Supply</Text>
                    <View className={`px-2 py-1 rounded-full ${
                      data.supply === 'High' ? 'bg-blue-100' : 'bg-orange-100'
                    }`}>
                      <Text className={`text-xs font-semibold ${
                        data.supply === 'High' ? 'text-blue-800' : 'text-orange-800'
                      }`}>
                        {data.supply}
                      </Text>
                    </View>
                  </View>
                </View>

                <View className="border-t border-gray-100 pt-3">
                  <Text className="text-gray-600 text-sm mb-2">Forecast:</Text>
                  <Text className="font-semibold text-gray-900 text-sm">{data.forecast}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Price Trends */}
          <View className="mb-6">
            <Text className="text-xl font-bold text-gray-900 mb-4">Price Trends (6 Months)</Text>
            <View className="card">
              <View className="flex-row justify-between items-end h-32 mb-4">
                {priceHistory.map((item, index) => (
                  <View key={index} className="flex-1 items-center">
                    <View 
                      className="bg-purple-500 rounded-t w-6 mb-2"
                      style={{ height: (item.price - 2600) / 3 }}
                    />
                    <Text className="text-xs text-gray-600">{item.month}</Text>
                    <Text className="text-xs font-semibold text-gray-900">₹{item.price}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Market News */}
          <View className="mb-6">
            <Text className="text-xl font-bold text-gray-900 mb-4">Market News</Text>
            <View className="space-y-3">
              {newsItems.map((news, index) => (
                <View key={index} className="card">
                  <View className="flex-row items-start justify-between mb-2">
                    <Text className="font-semibold text-gray-900 flex-1 mr-2">{news.title}</Text>
                    <View className={`px-2 py-1 rounded-full ${
                      news.impact === 'Positive' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      <Text className={`text-xs font-semibold ${
                        news.impact === 'Positive' ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {news.impact}
                      </Text>
                    </View>
                  </View>
                  <Text className="text-gray-600 text-sm mb-2">{news.summary}</Text>
                  <Text className="text-gray-500 text-xs">{news.time}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Key Factors */}
          <View className="mb-8">
            <Text className="text-xl font-bold text-gray-900 mb-4">Key Market Factors</Text>
            <View className="card">
              <View className="space-y-3">
                <View className="flex-row items-center">
                  <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                  <Text className="text-gray-700 ml-3 flex-1">Export demand increasing for rice and wheat</Text>
                </View>
                <View className="flex-row items-center">
                  <Ionicons name="warning" size={20} color="#f59e0b" />
                  <Text className="text-gray-700 ml-3 flex-1">Monsoon uncertainty affecting crop planning</Text>
                </View>
                <View className="flex-row items-center">
                  <Ionicons name="trending-up" size={20} color="#3b82f6" />
                  <Text className="text-gray-700 ml-3 flex-1">Government MSP support for major crops</Text>
                </View>
                <View className="flex-row items-center">
                  <Ionicons name="leaf" size={20} color="#059669" />
                  <Text className="text-gray-700 ml-3 flex-1">Organic farming trends increasing demand</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        
        {/* Bottom padding for tab bar */}
        <View style={{ height: Platform.OS === 'ios' ? 88 : 64 }} />
      </ScrollView>
    </View>
  );
}