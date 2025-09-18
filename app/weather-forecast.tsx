import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WeatherForecast() {
  const [selectedDay, setSelectedDay] = useState(0);

  const weatherData = [
    {
      day: 'Today',
      date: 'Dec 15',
      temp: { high: 28, low: 18 },
      condition: 'Partly Cloudy',
      icon: 'partly-sunny',
      humidity: 65,
      wind: 12,
      rain: 20,
      uv: 6,
      description: 'Good conditions for crop growth'
    },
    {
      day: 'Tomorrow',
      date: 'Dec 16',
      temp: { high: 26, low: 16 },
      condition: 'Light Rain',
      icon: 'rainy',
      humidity: 78,
      wind: 15,
      rain: 60,
      uv: 4,
      description: 'Ideal for irrigation, avoid spraying'
    },
    {
      day: 'Wed',
      date: 'Dec 17',
      temp: { high: 24, low: 14 },
      condition: 'Heavy Rain',
      icon: 'thunderstorm',
      humidity: 85,
      wind: 20,
      rain: 90,
      uv: 2,
      description: 'Avoid field work, check drainage'
    },
    {
      day: 'Thu',
      date: 'Dec 18',
      temp: { high: 22, low: 12 },
      condition: 'Cloudy',
      icon: 'cloudy',
      humidity: 70,
      wind: 10,
      rain: 30,
      uv: 3,
      description: 'Good for planting activities'
    },
    {
      day: 'Fri',
      date: 'Dec 19',
      temp: { high: 25, low: 15 },
      condition: 'Sunny',
      icon: 'sunny',
      humidity: 55,
      wind: 8,
      rain: 5,
      uv: 8,
      description: 'Perfect for harvesting'
    },
    {
      day: 'Sat',
      date: 'Dec 20',
      temp: { high: 27, low: 17 },
      condition: 'Partly Cloudy',
      icon: 'partly-sunny',
      humidity: 60,
      wind: 12,
      rain: 15,
      uv: 6,
      description: 'Good for general farming'
    },
    {
      day: 'Sun',
      date: 'Dec 21',
      temp: { high: 29, low: 19 },
      condition: 'Sunny',
      icon: 'sunny',
      humidity: 50,
      wind: 6,
      rain: 0,
      uv: 9,
      description: 'Hot day, increase irrigation'
    }
  ];

  const alerts = [
    {
      type: 'warning',
      title: 'Heavy Rain Alert',
      message: 'Heavy rainfall expected on Wednesday. Avoid field work and check drainage systems.',
      time: '2 hours ago'
    },
    {
      type: 'info',
      title: 'Temperature Drop',
      message: 'Temperature will drop to 12°C on Thursday. Protect sensitive crops.',
      time: '1 day ago'
    }
  ];

  const farmingTips = [
    {
      condition: 'Rainy Weather',
      tips: [
        'Avoid spraying pesticides during rain',
        'Check and clear drainage systems',
        'Monitor for waterlogging',
        'Postpone harvesting activities'
      ]
    },
    {
      condition: 'Hot Weather',
      tips: [
        'Increase irrigation frequency',
        'Provide shade for sensitive crops',
        'Water early morning or evening',
        'Monitor soil moisture levels'
      ]
    },
    {
      condition: 'Windy Weather',
      tips: [
        'Avoid spraying in strong winds',
        'Check for crop damage',
        'Secure greenhouse structures',
        'Monitor for pest spread'
      ]
    }
  ];

  const getWeatherIcon = (iconName: string) => {
    const iconMap: { [key: string]: string } = {
      'sunny': 'sunny',
      'partly-sunny': 'partly-sunny',
      'cloudy': 'cloudy',
      'rainy': 'rainy',
      'thunderstorm': 'thunderstorm'
    };
    return iconMap[iconName] || 'partly-sunny';
  };

  const getWeatherColor = (condition: string) => {
    if (condition.includes('Rain') || condition.includes('Thunderstorm')) return 'bg-blue-500';
    if (condition.includes('Sunny')) return 'bg-yellow-500';
    if (condition.includes('Cloudy')) return 'bg-gray-500';
    return 'bg-blue-500';
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 pt-4 pb-6 bg-white border-b border-gray-100">
          <View className="flex-row items-center justify-between">
            <Link href="/dashboard" asChild>
              <TouchableOpacity className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center">
                <Ionicons name="arrow-back" size={20} color="#374151" />
              </TouchableOpacity>
            </Link>
            <Text className="text-xl font-bold text-gray-900">Weather Forecast</Text>
            <TouchableOpacity className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center">
              <Ionicons name="refresh" size={20} color="#3b82f6" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Current Weather */}
        <View className="px-6 py-6">
          <View className={`${getWeatherColor(weatherData[0].condition)} rounded-2xl p-6 mb-6`}>
            <View className="flex-row items-center justify-between mb-4">
              <View>
                <Text className="text-white text-lg font-semibold">Current Weather</Text>
                <Text className="text-white/80">Pune, Maharashtra</Text>
              </View>
              <Ionicons name={getWeatherIcon(weatherData[0].icon) as any} size={40} color="white" />
            </View>
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-white text-4xl font-bold">{weatherData[0].temp.high}°C</Text>
                <Text className="text-white/80">{weatherData[0].condition}</Text>
              </View>
              <View className="items-end">
                <Text className="text-white text-sm">Humidity: {weatherData[0].humidity}%</Text>
                <Text className="text-white text-sm">Wind: {weatherData[0].wind} km/h</Text>
                <Text className="text-white text-sm">UV Index: {weatherData[0].uv}</Text>
              </View>
            </View>
            <Text className="text-white/90 text-sm mt-3">{weatherData[0].description}</Text>
          </View>

          {/* 7-Day Forecast */}
          <View className="mb-6">
            <Text className="text-xl font-bold text-gray-900 mb-4">7-Day Forecast</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
              <View className="flex-row space-x-3">
                {weatherData.map((day, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setSelectedDay(index)}
                    className={`card items-center py-4 px-3 min-w-[80px] ${
                      selectedDay === index ? 'bg-green-50 border-green-200' : ''
                    }`}
                  >
                    <Text className="text-gray-600 text-sm mb-1">{day.day}</Text>
                    <Text className="text-gray-500 text-xs mb-2">{day.date}</Text>
                    <Ionicons 
                      name={getWeatherIcon(day.icon) as any} 
                      size={24} 
                      color={selectedDay === index ? '#059669' : '#6b7280'} 
                    />
                    <Text className="font-bold text-gray-900 text-sm mt-1">{day.temp.high}°</Text>
                    <Text className="text-gray-500 text-xs">{day.temp.low}°</Text>
                    <Text className="text-gray-600 text-xs mt-1 text-center">{day.rain}%</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            {/* Selected Day Details */}
            <View className="card">
              <Text className="text-lg font-bold text-gray-900 mb-3">
                {weatherData[selectedDay].day} - {weatherData[selectedDay].date}
              </Text>
              <Text className="text-gray-600 mb-4">{weatherData[selectedDay].description}</Text>
              
              <View className="grid grid-cols-2 gap-4">
                <View className="flex-row items-center">
                  <Ionicons name="thermometer" size={20} color="#6b7280" />
                  <View className="ml-3">
                    <Text className="text-gray-600 text-sm">Temperature</Text>
                    <Text className="font-semibold text-gray-900">
                      {weatherData[selectedDay].temp.high}° / {weatherData[selectedDay].temp.low}°
                    </Text>
                  </View>
                </View>
                
                <View className="flex-row items-center">
                  <Ionicons name="water" size={20} color="#6b7280" />
                  <View className="ml-3">
                    <Text className="text-gray-600 text-sm">Humidity</Text>
                    <Text className="font-semibold text-gray-900">{weatherData[selectedDay].humidity}%</Text>
                  </View>
                </View>
                
                <View className="flex-row items-center">
                  <Ionicons name="leaf" size={20} color="#6b7280" />
                  <View className="ml-3">
                    <Text className="text-gray-600 text-sm">Wind Speed</Text>
                    <Text className="font-semibold text-gray-900">{weatherData[selectedDay].wind} km/h</Text>
                  </View>
                </View>
                
                <View className="flex-row items-center">
                  <Ionicons name="rainy" size={20} color="#6b7280" />
                  <View className="ml-3">
                    <Text className="text-gray-600 text-sm">Rain Chance</Text>
                    <Text className="font-semibold text-gray-900">{weatherData[selectedDay].rain}%</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Weather Alerts */}
          <View className="mb-6">
            <Text className="text-xl font-bold text-gray-900 mb-4">Weather Alerts</Text>
            <View className="space-y-3">
              {alerts.map((alert, index) => (
                <View key={index} className={`card border-l-4 ${
                  alert.type === 'warning' ? 'border-yellow-400 bg-yellow-50' : 'border-blue-400 bg-blue-50'
                }`}>
                  <View className="flex-row items-start">
                    <Ionicons 
                      name={alert.type === 'warning' ? 'warning' : 'information-circle'} 
                      size={20} 
                      color={alert.type === 'warning' ? '#f59e0b' : '#3b82f6'} 
                    />
                    <View className="flex-1 ml-3">
                      <Text className="font-semibold text-gray-900 mb-1">{alert.title}</Text>
                      <Text className="text-gray-600 text-sm mb-2">{alert.message}</Text>
                      <Text className="text-gray-500 text-xs">{alert.time}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Farming Tips */}
          <View className="mb-6">
            <Text className="text-xl font-bold text-gray-900 mb-4">Farming Tips</Text>
            <View className="space-y-4">
              {farmingTips.map((tip, index) => (
                <View key={index} className="card">
                  <Text className="font-bold text-gray-900 text-lg mb-3">{tip.condition}</Text>
                  <View className="space-y-2">
                    {tip.tips.map((tipText, tipIndex) => (
                      <View key={tipIndex} className="flex-row items-start">
                        <Text className="text-green-600 mr-2">•</Text>
                        <Text className="text-gray-600 text-sm flex-1">{tipText}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
