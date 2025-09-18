import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function CropRecommendations() {
  const [selectedSeason, setSelectedSeason] = useState('kharif');
  const [selectedSoil, setSelectedSoil] = useState('loamy');
  const [selectedRegion, setSelectedRegion] = useState('pune');

  const seasons = [
    { id: 'kharif', name: 'Kharif', months: 'Jun-Oct' },
    { id: 'rabi', name: 'Rabi', months: 'Nov-Mar' },
    { id: 'zaid', name: 'Zaid', months: 'Mar-Jun' }
  ];

  const soilTypes = [
    { id: 'loamy', name: 'Loamy', description: 'Best for most crops' },
    { id: 'clay', name: 'Clay', description: 'Good water retention' },
    { id: 'sandy', name: 'Sandy', description: 'Good drainage' },
    { id: 'silt', name: 'Silt', description: 'Fertile soil' }
  ];

  const regions = [
    { id: 'pune', name: 'Pune, Maharashtra' },
    { id: 'delhi', name: 'Delhi, NCR' },
    { id: 'bangalore', name: 'Bangalore, Karnataka' },
    { id: 'kolkata', name: 'Kolkata, West Bengal' }
  ];

  const recommendations = [
    {
      id: 1,
      name: 'Rice',
      variety: 'Basmati 370',
      suitability: 95,
      yield: '4.5-5.5 tons/hectare',
      profit: '₹45,000-55,000',
      duration: '120-140 days',
      water: 'High',
      sustainability: 8.5,
      image: '🌾',
      benefits: ['High market demand', 'Good for export', 'Drought resistant variety'],
      requirements: ['Well-drained soil', 'Consistent irrigation', 'Fertile soil']
    },
    {
      id: 2,
      name: 'Wheat',
      variety: 'HD-2967',
      suitability: 88,
      yield: '3.5-4.2 tons/hectare',
      profit: '₹35,000-42,000',
      duration: '110-125 days',
      water: 'Medium',
      sustainability: 7.8,
      image: '🌾',
      benefits: ['High protein content', 'Good for domestic market', 'Easy to grow'],
      requirements: ['Well-drained soil', 'Cool climate', 'Adequate sunlight']
    },
    {
      id: 3,
      name: 'Sugarcane',
      variety: 'Co-86032',
      suitability: 92,
      yield: '80-100 tons/hectare',
      profit: '₹80,000-100,000',
      duration: '12-18 months',
      water: 'Very High',
      sustainability: 6.5,
      image: '🌾',
      benefits: ['High sugar content', 'Good for ethanol production', 'Long-term crop'],
      requirements: ['Deep soil', 'Consistent irrigation', 'Warm climate']
    }
  ];

  const handleGetRecommendations = () => {
    Alert.alert(
      'AI Analysis Complete',
      'Based on your soil conditions, weather, and market trends, we have generated personalized crop recommendations.',
      [{ text: 'View Results', style: 'default' }]
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* AI Analysis Card */}
        <View className="px-6 py-6">
          <View className="gradient-green rounded-2xl p-6 mb-6">
            <View className="flex-row items-center mb-4">
              <View className="w-12 h-12 bg-white/20 rounded-xl items-center justify-center mr-4">
                <Ionicons name="bulb" size={24} color="white" />
              </View>
              <View className="flex-1">
                <Text className="text-white text-lg font-semibold">AI-Powered Analysis</Text>
                <Text className="text-green-100 text-sm">Get personalized crop suggestions</Text>
              </View>
            </View>
            <TouchableOpacity
              className="bg-white/20 rounded-xl py-3 px-4"
              onPress={handleGetRecommendations}
            >
              <Text className="text-white font-semibold text-center">Analyze My Farm</Text>
            </TouchableOpacity>
          </View>

          {/* Filters */}
          <View className="space-y-4 mb-6">
            {/* Season Selection */}
            <View>
              <Text className="text-lg font-semibold text-gray-900 mb-3">Growing Season</Text>
              <View className="flex-row flex-wrap">
                {seasons.map((season) => (
                  <TouchableOpacity
                    key={season.id}
                    onPress={() => setSelectedSeason(season.id)}
                    className={`mr-3 mb-3 px-4 py-3 rounded-xl border ${
                      selectedSeason === season.id
                        ? 'bg-green-600 border-green-600'
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <Text className={`font-semibold ${
                      selectedSeason === season.id ? 'text-white' : 'text-gray-700'
                    }`}>
                      {season.name}
                    </Text>
                    <Text className={`text-xs ${
                      selectedSeason === season.id ? 'text-green-100' : 'text-gray-500'
                    }`}>
                      {season.months}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Soil Type Selection */}
            <View>
              <Text className="text-lg font-semibold text-gray-900 mb-3">Soil Type</Text>
              <View className="flex-row flex-wrap">
                {soilTypes.map((soil) => (
                  <TouchableOpacity
                    key={soil.id}
                    onPress={() => setSelectedSoil(soil.id)}
                    className={`mr-3 mb-3 px-4 py-3 rounded-xl border ${
                      selectedSoil === soil.id
                        ? 'bg-green-600 border-green-600'
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <Text className={`font-semibold ${
                      selectedSoil === soil.id ? 'text-white' : 'text-gray-700'
                    }`}>
                      {soil.name}
                    </Text>
                    <Text className={`text-xs ${
                      selectedSoil === soil.id ? 'text-green-100' : 'text-gray-500'
                    }`}>
                      {soil.description}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Region Selection */}
            <View>
              <Text className="text-lg font-semibold text-gray-900 mb-3">Region</Text>
              <View className="flex-row flex-wrap">
                {regions.map((region) => (
                  <TouchableOpacity
                    key={region.id}
                    onPress={() => setSelectedRegion(region.id)}
                    className={`mr-3 mb-3 px-4 py-3 rounded-xl border ${
                      selectedRegion === region.id
                        ? 'bg-green-600 border-green-600'
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <Text className={`font-semibold ${
                      selectedRegion === region.id ? 'text-white' : 'text-gray-700'
                    }`}>
                      {region.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Recommendations */}
          <View>
            <Text className="text-xl font-bold text-gray-900 mb-4">Recommended Crops</Text>
            <View className="space-y-4">
              {recommendations.map((crop) => (
                <View key={crop.id} className="card">
                  <View className="flex-row items-start justify-between mb-3">
                    <View className="flex-row items-center flex-1">
                      <Text className="text-3xl mr-3">{crop.image}</Text>
                      <View className="flex-1">
                        <Text className="text-lg font-bold text-gray-900">{crop.name}</Text>
                        <Text className="text-gray-600 text-sm">{crop.variety}</Text>
                      </View>
                    </View>
                    <View className="items-end">
                      <View className="bg-green-100 px-3 py-1 rounded-full">
                        <Text className="text-green-800 font-semibold text-sm">
                          {crop.suitability}% Match
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View className="flex-row justify-between mb-3">
                    <View className="flex-1">
                      <Text className="text-gray-600 text-sm">Expected Yield</Text>
                      <Text className="font-semibold text-gray-900">{crop.yield}</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-gray-600 text-sm">Profit Range</Text>
                      <Text className="font-semibold text-green-600">{crop.profit}</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-gray-600 text-sm">Duration</Text>
                      <Text className="font-semibold text-gray-900">{crop.duration}</Text>
                    </View>
                  </View>

                  <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center">
                      <Ionicons name="water" size={16} color="#6b7280" />
                      <Text className="text-gray-600 text-sm ml-1">{crop.water} Water</Text>
                    </View>
                    <View className="flex-row items-center">
                      <Ionicons name="leaf" size={16} color="#6b7280" />
                      <Text className="text-gray-600 text-sm ml-1">Sustainability: {crop.sustainability}/10</Text>
                    </View>
                  </View>

                  <View className="border-t border-gray-100 pt-3">
                    <Text className="text-gray-600 text-sm mb-2">Key Benefits:</Text>
                    <View className="flex-row flex-wrap">
                      {crop.benefits.map((benefit, index) => (
                        <View key={index} className="bg-green-50 px-2 py-1 rounded-full mr-2 mb-2">
                          <Text className="text-green-700 text-xs">{benefit}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  <TouchableOpacity className="btn-primary mt-4">
                    <Text className="text-white font-semibold text-center">View Details</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        </View>
        
        {/* Bottom padding for tab bar */}
        <View style={{ height: Platform.OS === 'ios' ? 88 : 64 }} />
      </ScrollView>
    </View>
  );
}