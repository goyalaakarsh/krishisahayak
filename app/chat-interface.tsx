import { Ionicons } from '@expo/vector-icons';
import { Link, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'text' | 'suggestion' | 'action' | 'image';
  imageUri?: string;
}

export default function ChatInterface() {
  const params = useLocalSearchParams();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI farming assistant. How can I help you today?',
      isUser: false,
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Handle incoming image from crop scanner
  useEffect(() => {
    if (params.imageUri && params.analyzeMessage) {
      // Add image message
      const imageMessage: Message = {
        id: Date.now().toString(),
        text: '',
        isUser: true,
        timestamp: new Date(),
        type: 'image',
        imageUri: params.imageUri as string
      };

      // Add analyze message
      const analyzeMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: params.analyzeMessage as string,
        isUser: true,
        timestamp: new Date(),
        type: 'text'
      };

      setMessages(prev => [...prev, imageMessage, analyzeMessage]);
      
      // Auto-send analysis request
      setTimeout(() => {
        handleImageAnalysis(params.imageUri as string);
      }, 1000);
    }
  }, [params.imageUri, params.analyzeMessage]);

  const quickQuestions = [
    'What crops should I plant this season?',
    'How to treat leaf blight?',
    'Weather forecast for next week',
    'Best time to harvest rice',
    'Soil testing recommendations',
    'Pest control for tomatoes'
  ];

  const suggestions = [
    {
      title: 'Crop Planning',
      description: 'Get personalized crop recommendations',
      icon: 'leaf-outline',
      action: 'crop_planning'
    },
    {
      title: 'Disease Diagnosis',
      description: 'Upload photo for disease identification',
      icon: 'camera-outline',
      action: 'disease_diagnosis'
    },
    {
      title: 'Weather Alert',
      description: 'Check weather conditions',
      icon: 'partly-sunny-outline',
      action: 'weather_check'
    },
    {
      title: 'Market Prices',
      description: 'View current crop prices',
      icon: 'trending-up-outline',
      action: 'market_prices'
    }
  ];

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(inputText),
        isUser: false,
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleImageAnalysis = (imageUri: string) => {
    setIsTyping(true);
    
    // Simulate AI image analysis
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateImageAnalysisResponse(),
        isUser: false,
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 3000);
  };

  const generateImageAnalysisResponse = (): string => {
    return `🔍 **Image Analysis Complete**

I've analyzed your plant image and here's what I found:

**🌿 Plant Health Assessment:**
• Overall condition: Good with minor concerns
• Leaf color: Healthy green with some yellowing
• Growth pattern: Normal development

**⚠️ Potential Issues Detected:**
• **Leaf Spot Disease** (Confidence: 85%)
• **Nutrient Deficiency** (Confidence: 70%)
• **Minor Pest Activity** (Confidence: 60%)

**💡 Recommended Actions:**
1. Apply fungicide for leaf spot treatment
2. Check soil pH and add appropriate nutrients
3. Monitor for pest activity and treat if needed
4. Ensure proper watering schedule

**📋 Prevention Tips:**
• Maintain good air circulation
• Avoid overhead watering
• Regular soil testing
• Proper spacing between plants

Would you like more specific treatment recommendations or have questions about any of these findings?`;
  };

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('crop') && input.includes('plant')) {
      return 'Based on your location and current season, I recommend rice, wheat, or sugarcane. Consider your soil type and water availability. Would you like specific variety recommendations?';
    } else if (input.includes('disease') || input.includes('pest')) {
      return 'I can help you identify crop diseases and pests. Please describe the symptoms or upload a photo for better diagnosis. Common issues include leaf blight, powdery mildew, and aphid infestations.';
    } else if (input.includes('weather')) {
      return 'The weather forecast shows partly cloudy conditions with 20% chance of rain. Temperature will range from 18°C to 28°C. This is good for most farming activities. Avoid spraying pesticides if rain is expected.';
    } else if (input.includes('harvest')) {
      return 'For rice harvesting, the best time is when 80-85% of the grains are mature. Check for golden color and firm texture. Harvest in the morning when moisture content is optimal.';
    } else if (input.includes('soil')) {
      return 'I recommend testing your soil for pH, nutrients, and organic matter. Ideal pH for most crops is 6.0-7.5. You can get soil testing done at your nearest agricultural extension office.';
    } else {
      return 'I understand your question about farming. Could you provide more specific details so I can give you the most accurate advice? I can help with crop planning, disease diagnosis, weather information, and market insights.';
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInputText(question);
    handleSendMessage();
  };

  const handleSuggestion = (action: string) => {
    let response = '';
    switch (action) {
      case 'crop_planning':
        response = 'I\'ll help you with crop planning. Please tell me about your farm size, soil type, and preferred growing season.';
        break;
      case 'disease_diagnosis':
        response = 'For disease diagnosis, please describe the symptoms you\'re seeing or upload a clear photo of the affected plant.';
        break;
      case 'weather_check':
        response = 'Current weather: 28°C, partly cloudy, 65% humidity. 7-day forecast shows good conditions for farming with light rain expected on Wednesday.';
        break;
      case 'market_prices':
        response = 'Current market prices: Rice ₹2,850/quintal, Wheat ₹2,150/quintal, Sugarcane ₹3,200/quintal. Prices are trending upward for rice and sugarcane.';
        break;
    }

    const suggestionMessage: Message = {
      id: Date.now().toString(),
      text: response,
      isUser: false,
      timestamp: new Date(),
      type: 'suggestion'
    };

    setMessages(prev => [...prev, suggestionMessage]);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = (message: Message) => {
    if (message.type === 'image') {
      return (
        <View key={message.id} className="mb-4 items-end">
          <View className="max-w-[80%] bg-green-600 rounded-2xl rounded-br-md p-2">
            <Image 
              source={{ uri: message.imageUri }} 
              className="w-48 h-48 rounded-xl"
              resizeMode="cover"
            />
            <Text className="text-green-100 text-xs mt-1 text-right">
              {formatTime(message.timestamp)}
            </Text>
          </View>
        </View>
      );
    }

    return (
      <View key={message.id} className={`mb-4 ${message.isUser ? 'items-end' : 'items-start'}`}>
        <View className={`max-w-[80%] ${
          message.isUser 
            ? 'bg-green-600 rounded-2xl rounded-br-md' 
            : 'bg-white rounded-2xl rounded-bl-md shadow-sm'
        } p-4`}>
          <Text className={`text-sm ${
            message.isUser ? 'text-white' : 'text-gray-900'
          }`}>
            {message.text}
          </Text>
          <Text className={`text-xs mt-1 ${
            message.isUser ? 'text-green-100' : 'text-gray-500'
          }`}>
            {formatTime(message.timestamp)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView 
        className="flex-1" 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Messages */}
        <ScrollView 
          ref={scrollViewRef}
          className="flex-1 px-6 py-4"
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((message) => renderMessage(message))}

          {isTyping && (
            <View className="mb-4 items-start">
              <View className="bg-white rounded-2xl rounded-bl-md shadow-sm p-4">
                <View className="flex-row space-x-1">
                  <View className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
                  <View className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                  <View className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                </View>
              </View>
            </View>
          )}

          {/* Quick Questions - only show if no image analysis */}
          {messages.length === 1 && !params.imageUri && (
            <View className="mb-6">
              <Text className="text-gray-600 text-sm mb-3">Quick Questions:</Text>
              <View className="space-y-2">
                {quickQuestions.map((question, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleQuickQuestion(question)}
                    className="bg-white rounded-xl p-3 border border-gray-200"
                  >
                    <Text className="text-gray-700 text-sm">{question}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Suggestions */}
          <View className="mb-6">
            <Text className="text-gray-600 text-sm mb-3">Quick Actions:</Text>
            <View className="grid grid-cols-2 gap-3">
              {suggestions.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleSuggestion(suggestion.action)}
                  className="bg-white rounded-xl p-4 border border-gray-200 items-center"
                >
                  <Ionicons name={suggestion.icon as any} size={24} color="#059669" />
                  <Text className="font-semibold text-gray-900 text-sm mt-2 text-center">
                    {suggestion.title}
                  </Text>
                  <Text className="text-gray-600 text-xs text-center mt-1">
                    {suggestion.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Input Area */}
        <View className="px-6 py-4 bg-white border-t border-gray-100">
          <View className="flex-row items-end space-x-3">
            <View className="flex-1 bg-gray-100 rounded-2xl px-4 py-3">
              <TextInput
                value={inputText}
                onChangeText={setInputText}
                placeholder="Ask me anything about farming..."
                placeholderTextColor="#9ca3af"
                multiline
                className="text-gray-900 text-base max-h-20"
                onSubmitEditing={handleSendMessage}
              />
            </View>
            <TouchableOpacity
              onPress={handleSendMessage}
              disabled={inputText.trim() === ''}
              className={`w-12 h-12 rounded-full items-center justify-center ${
                inputText.trim() === '' ? 'bg-gray-200' : 'bg-green-600'
              }`}
            >
              <Ionicons 
                name="send" 
                size={20} 
                color={inputText.trim() === '' ? '#9ca3af' : 'white'} 
              />
            </TouchableOpacity>
          </View>
          
          {/* Voice Input */}
          <View className="flex-row justify-center mt-3">
            <TouchableOpacity className="flex-row items-center bg-green-50 px-4 py-2 rounded-full">
              <Ionicons name="mic" size={16} color="#059669" />
              <Text className="text-green-700 text-sm ml-2">Hold to speak</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}