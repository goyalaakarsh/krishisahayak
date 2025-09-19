import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    Vibration,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Disease {
  id: string;
  name: string;
  image: string;
  description: string;
  symptoms: string[];
  causes: string[];
  solutions: string[];
  prevention: string[];
  severity: 'low' | 'medium' | 'high';
}

interface Crop {
  name: string;
  diseases: Disease[];
}

export default function DiseaseDetection() {
  const [selectedCrop, setSelectedCrop] = useState<string>('');
  const [cropInput, setCropInput] = useState('');
  const [showDiseases, setShowDiseases] = useState(false);
  const [selectedDisease, setSelectedDisease] = useState<Disease | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Sample crop and disease data
  const cropData: Crop[] = useMemo(() => [
    {
      name: 'tomato',
      diseases: [
        {
          id: '1',
          name: 'Early Blight',
          image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=300&h=200&fit=crop',
          description: 'A common fungal disease affecting tomato leaves and stems',
          symptoms: ['Dark spots on leaves', 'Yellowing around spots', 'Concentric rings on lesions', 'Stem cankers'],
          causes: ['Fungal spores', 'High humidity', 'Poor air circulation', 'Overhead watering'],
          solutions: ['Remove affected leaves', 'Apply copper fungicide', 'Improve air circulation', 'Water at soil level'],
          prevention: ['Crop rotation', 'Proper spacing', 'Avoid overhead watering', 'Regular pruning'],
          severity: 'medium'
        },
        {
          id: '2',
          name: 'Late Blight',
          image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=300&h=200&fit=crop',
          description: 'A devastating fungal disease that can destroy entire crops',
          symptoms: ['Water-soaked lesions', 'White mold on underside', 'Rapid spread', 'Plant death'],
          causes: ['Phytophthora infestans', 'Cool, wet conditions', 'Poor drainage', 'Infected seed'],
          solutions: ['Immediate fungicide treatment', 'Remove infected plants', 'Improve drainage', 'Apply preventive spray'],
          prevention: ['Use disease-free seed', 'Proper spacing', 'Good drainage', 'Regular monitoring'],
          severity: 'high'
        },
        {
          id: '3',
          name: 'Powdery Mildew',
          image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=300&h=200&fit=crop',
          description: 'White powdery coating on leaves and stems',
          symptoms: ['White powdery coating', 'Stunted growth', 'Leaf curling', 'Reduced yield'],
          causes: ['Fungal spores', 'High humidity', 'Poor air circulation', 'Dense foliage'],
          solutions: ['Apply sulfur fungicide', 'Improve air circulation', 'Remove affected leaves', 'Reduce humidity'],
          prevention: ['Proper spacing', 'Good air circulation', 'Avoid overhead watering', 'Regular pruning'],
          severity: 'low'
        }
      ]
    },
    {
      name: 'rice',
      diseases: [
        {
          id: '4',
          name: 'Rice Blast',
          image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=300&h=200&fit=crop',
          description: 'One of the most destructive rice diseases worldwide',
          symptoms: ['Diamond-shaped lesions', 'Gray centers', 'Yellow halos', 'Spikelet sterility'],
          causes: ['Magnaporthe oryzae', 'High humidity', 'Cool temperatures', 'Excessive nitrogen'],
          solutions: ['Apply tricyclazole', 'Use resistant varieties', 'Proper nitrogen management', 'Field sanitation'],
          prevention: ['Resistant varieties', 'Balanced fertilization', 'Proper water management', 'Crop rotation'],
          severity: 'high'
        },
        {
          id: '5',
          name: 'Brown Spot',
          image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=300&h=200&fit=crop',
          description: 'Common fungal disease affecting rice leaves and grains',
          symptoms: ['Brown circular spots', 'Yellow halos', 'Grain discoloration', 'Reduced yield'],
          causes: ['Bipolaris oryzae', 'High humidity', 'Poor soil fertility', 'Infected seed'],
          solutions: ['Apply fungicide', 'Improve soil fertility', 'Use clean seed', 'Proper water management'],
          prevention: ['Seed treatment', 'Balanced fertilization', 'Good drainage', 'Crop rotation'],
          severity: 'medium'
        }
      ]
    },
    {
      name: 'wheat',
      diseases: [
        {
          id: '6',
          name: 'Rust',
          image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=300&h=200&fit=crop',
          description: 'Fungal disease causing orange or brown pustules on leaves',
          symptoms: ['Orange/brown pustules', 'Yellowing leaves', 'Reduced photosynthesis', 'Stunted growth'],
          causes: ['Puccinia species', 'High humidity', 'Warm temperatures', 'Dense planting'],
          solutions: ['Apply fungicide', 'Use resistant varieties', 'Improve air circulation', 'Early detection'],
          prevention: ['Resistant varieties', 'Proper spacing', 'Crop rotation', 'Field monitoring'],
          severity: 'high'
        },
        {
          id: '7',
          name: 'Fusarium Head Blight',
          image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=300&h=200&fit=crop',
          description: 'Fungal disease affecting wheat heads and grains',
          symptoms: ['Bleached spikelets', 'Pink/orange mold', 'Shriveled grains', 'Reduced quality'],
          causes: ['Fusarium species', 'Wet conditions', 'Infected crop residue', 'Warm temperatures'],
          solutions: ['Apply fungicide', 'Remove infected residue', 'Use resistant varieties', 'Proper timing'],
          prevention: ['Crop rotation', 'Resistant varieties', 'Field sanitation', 'Proper timing'],
          severity: 'medium'
        }
      ]
    }
  ], []);

  // Animation effects
  useEffect(() => {
    if (isProcessing) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isProcessing]);

  const handleCropSubmit = useCallback(() => {
    if (cropInput.trim() === '') return;

    const cropName = cropInput.toLowerCase().trim();
    const crop = cropData.find(c => c.name.toLowerCase() === cropName);
    
    if (!crop) {
      Alert.alert(
        'Crop Not Found',
        'Sorry, we don\'t have disease information for this crop yet. Please try: Tomato, Rice, or Wheat.',
        [{ text: 'OK' }]
      );
      return;
    }

    setSelectedCrop(cropName);
    setIsProcessing(true);
    
    // Simulate processing delay
    setTimeout(() => {
      setShowDiseases(true);
      setIsProcessing(false);
      Vibration.vibrate(50);
    }, 1500);
  }, [cropInput, cropData]);

  const handleDiseaseSelect = useCallback((disease: Disease) => {
    setSelectedDisease(disease);
    Vibration.vibrate(50);
  }, []);

  const handleBackToDiseases = useCallback(() => {
    setSelectedDisease(null);
  }, []);

  const handleNewCrop = useCallback(() => {
    setSelectedCrop('');
    setCropInput('');
    setShowDiseases(false);
    setSelectedDisease(null);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'high': return 'High Risk';
      case 'medium': return 'Medium Risk';
      case 'low': return 'Low Risk';
      default: return 'Unknown';
    }
  };

  const currentCrop = cropData.find(c => c.name === selectedCrop);

  if (selectedDisease) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <KeyboardAvoidingView 
          className="flex-1" 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {/* Header */}
          <View className="px-6 py-4 bg-white border-b border-gray-100">
            <View className="flex-row items-center justify-between">
              <TouchableOpacity
                onPress={handleBackToDiseases}
                className="flex-row items-center"
              >
                <Ionicons name="arrow-back" size={24} color="#059669" />
                <Text className="text-green-600 font-semibold ml-2">Back to Diseases</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleNewCrop}
                className="px-4 py-2 bg-gray-100 rounded-lg"
              >
                <Text className="text-gray-700 font-medium">New Crop</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Disease Solution */}
          <ScrollView className="flex-1 px-6 py-4">
            <View className="bg-white rounded-2xl p-6 shadow-sm mb-4">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-2xl font-bold text-gray-900">{selectedDisease.name}</Text>
                <View className={`px-3 py-1 rounded-full ${getSeverityColor(selectedDisease.severity)}`}>
                  <Text className="text-xs font-semibold">{getSeverityText(selectedDisease.severity)}</Text>
                </View>
              </View>
              
              <Image 
                source={{ uri: selectedDisease.image }} 
                className="w-full h-48 rounded-xl mb-4"
                resizeMode="cover"
              />
              
              <Text className="text-gray-700 text-base mb-4">{selectedDisease.description}</Text>
            </View>

            {/* Symptoms */}
            <View className="bg-white rounded-2xl p-6 shadow-sm mb-4">
              <Text className="text-xl font-bold text-gray-900 mb-3">🔍 Symptoms</Text>
              {selectedDisease.symptoms.map((symptom, index) => (
                <View key={index} className="flex-row items-start mb-2">
                  <Text className="text-red-500 mr-2">•</Text>
                  <Text className="text-gray-700 flex-1">{symptom}</Text>
                </View>
              ))}
            </View>

            {/* Causes */}
            <View className="bg-white rounded-2xl p-6 shadow-sm mb-4">
              <Text className="text-xl font-bold text-gray-900 mb-3">⚠️ Causes</Text>
              {selectedDisease.causes.map((cause, index) => (
                <View key={index} className="flex-row items-start mb-2">
                  <Text className="text-orange-500 mr-2">•</Text>
                  <Text className="text-gray-700 flex-1">{cause}</Text>
                </View>
              ))}
            </View>

            {/* Solutions */}
            <View className="bg-white rounded-2xl p-6 shadow-sm mb-4">
              <Text className="text-xl font-bold text-gray-900 mb-3">💡 Solutions</Text>
              {selectedDisease.solutions.map((solution, index) => (
                <View key={index} className="flex-row items-start mb-2">
                  <Text className="text-green-500 mr-2">•</Text>
                  <Text className="text-gray-700 flex-1">{solution}</Text>
                </View>
              ))}
            </View>

            {/* Prevention */}
            <View className="bg-white rounded-2xl p-6 shadow-sm mb-6">
              <Text className="text-xl font-bold text-gray-900 mb-3">🛡️ Prevention</Text>
              {selectedDisease.prevention.map((prevention, index) => (
                <View key={index} className="flex-row items-start mb-2">
                  <Text className="text-blue-500 mr-2">•</Text>
                  <Text className="text-gray-700 flex-1">{prevention}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  if (showDiseases && currentCrop) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <KeyboardAvoidingView 
          className="flex-1" 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {/* Header */}
          <View className="px-6 py-4 bg-white border-b border-gray-100">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-lg font-bold text-gray-900 capitalize">{selectedCrop} Diseases</Text>
                <Text className="text-gray-600 text-sm">Select a disease to see solutions</Text>
              </View>
              <TouchableOpacity
                onPress={handleNewCrop}
                className="px-4 py-2 bg-gray-100 rounded-lg"
              >
                <Text className="text-gray-700 font-medium">New Crop</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Diseases List */}
          <ScrollView className="flex-1 px-6 py-4">
            {currentCrop.diseases.map((disease) => (
              <TouchableOpacity
                key={disease.id}
                onPress={() => handleDiseaseSelect(disease)}
                className="bg-white rounded-2xl p-4 shadow-sm mb-4"
              >
                <View className="flex-row items-center mb-3">
                  <Image 
                    source={{ uri: disease.image }} 
                    className="w-16 h-16 rounded-xl mr-4"
                    resizeMode="cover"
                  />
                  <View className="flex-1">
                    <Text className="text-lg font-bold text-gray-900 mb-1">{disease.name}</Text>
                    <Text className="text-gray-600 text-sm mb-2">{disease.description}</Text>
                    <View className={`px-2 py-1 rounded-full self-start ${getSeverityColor(disease.severity)}`}>
                      <Text className="text-xs font-semibold">{getSeverityText(disease.severity)}</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView 
        className="flex-1" 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View className="px-6 py-4 bg-white border-b border-gray-100">
          <Text className="text-2xl font-bold text-gray-900">Disease Detection</Text>
          <Text className="text-gray-600 text-sm mt-1">Enter crop name to identify diseases and get solutions</Text>
        </View>

        {/* Main Content */}
        <ScrollView className="flex-1 px-6 py-4">
          {/* Input Section */}
          <View className="bg-white rounded-2xl p-6 shadow-sm mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-4">Enter Crop Name</Text>
            <View className="flex-row items-end space-x-3">
              <View className="flex-1 bg-gray-50 rounded-2xl px-4 py-3 border border-gray-200">
                <TextInput
                  value={cropInput}
                  onChangeText={setCropInput}
                  placeholder="e.g., Tomato, Rice, Wheat..."
                  placeholderTextColor="#9ca3af"
                  className="text-gray-900 text-base"
                  onSubmitEditing={handleCropSubmit}
                  returnKeyType="search"
                />
              </View>
              <TouchableOpacity
                onPress={handleCropSubmit}
                disabled={cropInput.trim() === ''}
                className={`w-12 h-12 rounded-full items-center justify-center shadow-sm ${
                  cropInput.trim() === '' 
                    ? 'bg-gray-200' 
                    : 'bg-green-600 shadow-green-200'
                }`}
              >
                <Ionicons 
                  name="search" 
                  size={20} 
                  color={cropInput.trim() === '' ? '#9ca3af' : 'white'} 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Processing Indicator */}
          {isProcessing && (
            <View className="bg-white rounded-2xl p-6 shadow-sm mb-6">
              <View className="flex-row items-center justify-center">
                <Animated.View 
                  className="w-8 h-8 bg-green-100 rounded-full items-center justify-center mr-3"
                  style={{
                    transform: [{ scale: pulseAnim }],
                  }}
                >
                  <Ionicons name="leaf" size={16} color="#059669" />
                </Animated.View>
                <Text className="text-gray-600 font-medium">Analyzing crop diseases...</Text>
              </View>
            </View>
          )}

          {/* Available Crops */}
          <View className="bg-white rounded-2xl p-6 shadow-sm mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-4">Available Crops</Text>
            <Text className="text-gray-600 text-sm mb-4">We currently have disease information for these crops:</Text>
            <View className="space-y-3">
              {cropData.map((crop, index) => (
                <View key={index} className="flex-row items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <View className="flex-row items-center">
                    <Ionicons name="leaf" size={20} color="#059669" />
                    <Text className="text-gray-900 font-medium ml-3 capitalize">{crop.name}</Text>
                  </View>
                  <Text className="text-gray-500 text-sm">{crop.diseases.length} diseases</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Features */}
          <View className="bg-white rounded-2xl p-6 shadow-sm">
            <Text className="text-lg font-semibold text-gray-900 mb-4">How It Works</Text>
            <View className="space-y-4">
              <View className="flex-row items-start">
                <View className="w-8 h-8 bg-green-100 rounded-full items-center justify-center mr-3 mt-1">
                  <Text className="text-green-600 font-bold text-sm">1</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-gray-900 font-medium">Enter Crop Name</Text>
                  <Text className="text-gray-600 text-sm">Type the name of your crop to get started</Text>
                </View>
              </View>
              
              <View className="flex-row items-start">
                <View className="w-8 h-8 bg-green-100 rounded-full items-center justify-center mr-3 mt-1">
                  <Text className="text-green-600 font-bold text-sm">2</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-gray-900 font-medium">View Diseases</Text>
                  <Text className="text-gray-600 text-sm">See all common diseases for your crop with images</Text>
                </View>
              </View>
              
              <View className="flex-row items-start">
                <View className="w-8 h-8 bg-green-100 rounded-full items-center justify-center mr-3 mt-1">
                  <Text className="text-green-600 font-bold text-sm">3</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-gray-900 font-medium">Select Disease</Text>
                  <Text className="text-gray-600 text-sm">Choose the disease that matches your crop's symptoms</Text>
                </View>
              </View>
              
              <View className="flex-row items-start">
                <View className="w-8 h-8 bg-green-100 rounded-full items-center justify-center mr-3 mt-1">
                  <Text className="text-green-600 font-bold text-sm">4</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-gray-900 font-medium">Get Solutions</Text>
                  <Text className="text-gray-600 text-sm">Receive detailed treatment and prevention advice</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
