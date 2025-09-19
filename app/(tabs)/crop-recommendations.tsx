import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { geocodingService, LocationData } from '../utils/geocodingService';
import { CropRecommendation, CropRecommendationRequest, llmService } from '../utils/llmService';
import { permissionManager } from '../utils/permissions';

export default function CropRecommendations() {
  const [selectedSeason, setSelectedSeason] = useState('kharif');
  const [selectedSoil, setSelectedSoil] = useState('loamy');
  const [locationType, setLocationType] = useState<'current' | 'manual'>('current');
  const [manualLocation, setManualLocation] = useState('');
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [recommendations, setRecommendations] = useState<CropRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [locationPermission, setLocationPermission] = useState(false);
  const [farmerPreferences, setFarmerPreferences] = useState({
    waterAvailability: 'Medium' as 'High' | 'Medium' | 'Low',
    budget: 'Medium' as 'Low' | 'Medium' | 'High',
    experience: 'Intermediate' as 'Beginner' | 'Intermediate' | 'Expert',
    farmSize: 'Small' as 'Small' | 'Medium' | 'Large'
  });
  const [lastAnalysisTime, setLastAnalysisTime] = useState<Date | null>(null);

  const seasons = [
    { id: 'kharif', name: 'Kharif', months: 'Jun-Oct' },
    { id: 'rabi', name: 'Rabi', months: 'Nov-Mar' },
    { id: 'zaid', name: 'Zaid', months: 'Mar-Jun' }
  ];

  const soilTypes = [
    { id: 'loamy', name: 'Loamy', description: 'Best for most crops', color: '#8B4513' },
    { id: 'clay', name: 'Clay', description: 'Good water retention', color: '#A0522D' },
    { id: 'sandy', name: 'Sandy', description: 'Good drainage', color: '#F4A460' },
    { id: 'silt', name: 'Silt', description: 'Fertile soil', color: '#D2B48C' },
    { id: 'black', name: 'Black Soil', description: 'Rich in nutrients', color: '#2F2F2F' },
    { id: 'red', name: 'Red Soil', description: 'Iron-rich soil', color: '#CD5C5C' },
    { id: 'alluvial', name: 'Alluvial', description: 'River-deposited soil', color: '#DEB887' }
  ];

  // Initialize location permission check
  useEffect(() => {
    checkLocationPermission();
  }, []);

  const checkLocationPermission = async () => {
    const permission = await permissionManager.checkLocationPermission();
    setLocationPermission(permission.granted);
    
    if (permission.granted) {
      await getCurrentLocation();
    }
  };

  const getCurrentLocation = async () => {
    try {
      setIsLoading(true);
      const locationResult = await geocodingService.getLocationFromCurrentPosition();
      
      if (locationResult.success && locationResult.data) {
        setCurrentLocation(locationResult.data);
        console.log('Current location:', locationResult.data);
      } else {
        console.log('Failed to get current location:', locationResult.error);
      }
    } catch (error) {
      console.error('Error getting current location:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getLocationFromManualInput = async (locationName: string) => {
    try {
      setIsLoading(true);
      const coordinates = await geocodingService.getCoordinatesFromLocation(locationName);
      
      if (coordinates) {
        const locationData = await geocodingService.getLocationFromCoordinatesNominatim(
          coordinates.latitude, 
          coordinates.longitude
        );
        
        if (locationData) {
          setCurrentLocation(locationData);
          console.log('Manual location:', locationData);
          return locationData;
        }
      }
      
      Alert.alert('Location Not Found', 'Could not find the specified location. Please try a different location name.');
      return null;
    } catch (error) {
      console.error('Error getting location from manual input:', error);
      Alert.alert('Error', 'Failed to get location information. Please try again.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const generateRecommendations = async () => {
    try {
      setIsAnalyzing(true);
      
      // Validate inputs
      if (!selectedSeason || !selectedSoil) {
        Alert.alert('Missing Information', 'Please select both season and soil type.');
        setIsAnalyzing(false);
        return;
      }
      
      let locationData = currentLocation;
      
      // If manual location is selected and we have input, get location data
      if (locationType === 'manual' && manualLocation.trim()) {
        locationData = await getLocationFromManualInput(manualLocation.trim());
        if (!locationData) {
          setIsAnalyzing(false);
          return;
        }
      }
      
      // If no location data available, show error
      if (!locationData) {
        Alert.alert(
          'Location Required', 
          'Please select current location or enter a manual location to get crop recommendations.'
        );
        setIsAnalyzing(false);
        return;
      }

      // Prepare request for LLM service
      const request: CropRecommendationRequest = {
        season: selectedSeason,
        soilType: selectedSoil,
        location: {
          name: geocodingService.formatLocationForDisplay(locationData),
          state: locationData.principalSubdivision,
          district: locationData.locality,
          coordinates: (await getCurrentCoordinates()) || undefined
        },
        preferences: farmerPreferences
      };

      console.log('Generating recommendations with request:', request);
      
      // Generate recommendations using LLM service
      const cropRecommendations = await llmService.generateCropRecommendations(request);
      
      console.log('Generated recommendations:', cropRecommendations);
      setRecommendations(cropRecommendations);
      setLastAnalysisTime(new Date());
      
    } catch (error) {
      console.error('Error generating recommendations:', error);
      Alert.alert('Error', 'Failed to generate crop recommendations. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getCurrentCoordinates = async () => {
    try {
      const location = await permissionManager.getCurrentLocation();
      return location;
    } catch (error) {
      console.error('Error getting current coordinates:', error);
      return undefined;
    }
  };

  const handleGetRecommendations = () => {
    generateRecommendations();
  };

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* AI Analysis Card */}
        <View className="px-6 py-6">
         

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

            {/* Location Selection */}
            <View>
              <Text className="text-lg font-semibold text-gray-900 mb-3">Location</Text>
              
              {/* Location Type Selection */}
              <View className="flex-row mb-4">
                <TouchableOpacity
                  onPress={() => setLocationType('current')}
                  className={`flex-1 mr-2 px-4 py-3 rounded-xl border ${
                    locationType === 'current'
                      ? 'bg-green-600 border-green-600'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <Text className={`font-semibold text-center ${
                    locationType === 'current' ? 'text-white' : 'text-gray-700'
                  }`}>
                    Current Location
                  </Text>
                </TouchableOpacity>
                  <TouchableOpacity
                  onPress={() => setLocationType('manual')}
                  className={`flex-1 ml-2 px-4 py-3 rounded-xl border ${
                    locationType === 'manual'
                        ? 'bg-green-600 border-green-600'
                        : 'bg-white border-gray-200'
                    }`}
                  >
                  <Text className={`font-semibold text-center ${
                    locationType === 'manual' ? 'text-white' : 'text-gray-700'
                  }`}>
                    Enter Location
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Current Location Display */}
              {locationType === 'current' && (
                <View className="bg-white rounded-xl p-4 border border-gray-200">
                  {isLoading ? (
                    <View className="flex-row items-center">
                      <ActivityIndicator size="small" color="#059669" />
                      <Text className="text-gray-600 ml-2">Getting your location...</Text>
                    </View>
                  ) : currentLocation ? (
                    <View>
                      <Text className="text-gray-900 font-semibold">
                        {geocodingService.formatLocationForDisplay(currentLocation)}
                      </Text>
                      <Text className="text-gray-600 text-sm">
                        {currentLocation.countryName}
                      </Text>
                    </View>
                  ) : !locationPermission ? (
                    <View>
                      <Text className="text-gray-600">Location permission required</Text>
                      <TouchableOpacity
                        onPress={checkLocationPermission}
                        className="mt-2"
                      >
                        <Text className="text-green-600 font-semibold">Grant Permission</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View>
                      <Text className="text-gray-600">Location not available</Text>
                      <TouchableOpacity
                        onPress={getCurrentLocation}
                        className="mt-2"
                      >
                        <Text className="text-green-600 font-semibold">Retry</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}

              {/* Manual Location Input */}
              {locationType === 'manual' && (
                <View className="bg-white rounded-xl p-4 border border-gray-200">
                  <TextInput
                    value={manualLocation}
                    onChangeText={setManualLocation}
                    placeholder="Enter city, state, or district (e.g., Pune, Maharashtra)"
                    placeholderTextColor="#9ca3af"
                    className="text-gray-900 text-base border-b border-gray-200 pb-2"
                  />
                  <Text className="text-gray-500 text-xs mt-2">
                    Enter a location name to get location-specific recommendations
                  </Text>
                </View>
              )}
            </View>

            {/* Farmer Preferences */}
            <View>
              <Text className="text-lg font-semibold text-gray-900 mb-3">Your Farming Profile</Text>
              
              {/* Water Availability */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">Water Availability</Text>
                <View className="flex-row flex-wrap">
                  {['High', 'Medium', 'Low'].map((level) => (
                    <TouchableOpacity
                      key={level}
                      onPress={() => setFarmerPreferences(prev => ({ ...prev, waterAvailability: level as any }))}
                      className={`mr-2 mb-2 px-3 py-2 rounded-lg border ${
                        farmerPreferences.waterAvailability === level
                          ? 'bg-blue-100 border-blue-500'
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <Text className={`text-sm font-medium ${
                        farmerPreferences.waterAvailability === level ? 'text-blue-700' : 'text-gray-600'
                      }`}>
                        {level}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Budget Level */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">Budget Level</Text>
                <View className="flex-row flex-wrap">
                  {['Low', 'Medium', 'High'].map((level) => (
                    <TouchableOpacity
                      key={level}
                      onPress={() => setFarmerPreferences(prev => ({ ...prev, budget: level as any }))}
                      className={`mr-2 mb-2 px-3 py-2 rounded-lg border ${
                        farmerPreferences.budget === level
                          ? 'bg-green-100 border-green-500'
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <Text className={`text-sm font-medium ${
                        farmerPreferences.budget === level ? 'text-green-700' : 'text-gray-600'
                      }`}>
                        {level}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Experience Level */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">Experience Level</Text>
                <View className="flex-row flex-wrap">
                  {['Beginner', 'Intermediate', 'Expert'].map((level) => (
                    <TouchableOpacity
                      key={level}
                      onPress={() => setFarmerPreferences(prev => ({ ...prev, experience: level as any }))}
                      className={`mr-2 mb-2 px-3 py-2 rounded-lg border ${
                        farmerPreferences.experience === level
                          ? 'bg-purple-100 border-purple-500'
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <Text className={`text-sm font-medium ${
                        farmerPreferences.experience === level ? 'text-purple-700' : 'text-gray-600'
                      }`}>
                        {level}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Farm Size */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">Farm Size</Text>
                <View className="flex-row flex-wrap">
                  {['Small', 'Medium', 'Large'].map((size) => (
                    <TouchableOpacity
                      key={size}
                      onPress={() => setFarmerPreferences(prev => ({ ...prev, farmSize: size as any }))}
                      className={`mr-2 mb-2 px-3 py-2 rounded-lg border ${
                        farmerPreferences.farmSize === size
                          ? 'bg-orange-100 border-orange-500'
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <Text className={`text-sm font-medium ${
                        farmerPreferences.farmSize === size ? 'text-orange-700' : 'text-gray-600'
                      }`}>
                        {size}
                    </Text>
                  </TouchableOpacity>
                ))}
                </View>
              </View>
            </View>
          </View>

          {/* <View className="gradient-green rounded-2xl p-6 mb-6"> */}
          <TouchableOpacity
              className="gradient-green rounded-xl py-3 mb-6 px-3"
              onPress={handleGetRecommendations}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <View className="flex-row items-center justify-center">
                  <ActivityIndicator size="small" color="white" />
                  <Text className="text-white font-semibold ml-2">Analyzing...</Text>
                </View>
              ) : (
                <Text className="text-white font-semibold text-center">Recommend</Text>
              )}
            </TouchableOpacity>
        
          {/* </View> */}

          {/* Recommendations */}
          <View>
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-xl font-bold text-gray-900">
                {recommendations.length > 0 ? 'Recommended Crops' : 'Get Your Crop Recommendations'}
              </Text>
              {recommendations.length > 0 && (
                <TouchableOpacity
                  onPress={handleGetRecommendations}
                  disabled={isAnalyzing}
                  className="flex-row items-center bg-green-100 px-3 py-2 rounded-lg"
                >
                  <Ionicons name="refresh" size={16} color="#059669" />
                  <Text className="text-green-700 font-medium ml-1 text-sm">
                    {isAnalyzing ? 'Updating...' : 'Refresh'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            
            {recommendations.length === 0 ? (
              <View className="bg-white rounded-xl p-6 border border-gray-200">
                <View className="items-center">
                  <Ionicons name="leaf" size={48} color="#9ca3af" />
                  <Text className="text-gray-600 text-center mt-4 mb-2">
                    No recommendations yet
                  </Text>
                  <Text className="text-gray-500 text-center text-sm mb-4">
                    Select your preferences and click "Recommend" to get personalized crop recommendations
                  </Text>
                  <TouchableOpacity
                    onPress={handleGetRecommendations}
                    disabled={isAnalyzing}
                    className="bg-green-600 px-6 py-3 rounded-lg"
                  >
                    <Text className="text-white font-semibold">Get Recommendations</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
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

                  <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center">
                      <Ionicons name="trending-up" size={16} color="#6b7280" />
                      <Text className="text-gray-600 text-sm ml-1">ROI: {crop.expectedROI}</Text>
                    </View>
                    <View className="flex-row items-center">
                      <Ionicons name="time" size={16} color="#6b7280" />
                      <Text className="text-gray-600 text-sm ml-1">Plant: {crop.bestPlantingTime}</Text>
                    </View>
                  </View>

                  <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center">
                      <Ionicons name="storefront" size={16} color="#6b7280" />
                      <Text className="text-gray-600 text-sm ml-1">Demand: {crop.marketDemand}</Text>
                    </View>
                    <View className="flex-row items-center">
                      <Ionicons name="warning" size={16} color="#6b7280" />
                      <Text className="text-gray-600 text-sm ml-1">Risk: {crop.riskLevel}</Text>
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

                  <View className="border-t border-gray-100 pt-3 mt-3">
                    <Text className="text-gray-600 text-sm mb-2">Requirements:</Text>
                    <View className="flex-row flex-wrap">
                      {crop.requirements.map((requirement, index) => (
                        <View key={index} className="bg-blue-50 px-2 py-1 rounded-full mr-2 mb-2">
                          <Text className="text-blue-700 text-xs">{requirement}</Text>
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
            )}
          </View>
        </View>
        
        {/* Bottom padding for tab bar */}
        <View style={{ height: Platform.OS === 'ios' ? 88 : 64 }} />
      </ScrollView>
    </View>
  );
}