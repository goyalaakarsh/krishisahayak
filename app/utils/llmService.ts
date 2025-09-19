import Constants from 'expo-constants';
import { MarketFactor, MarketNewsItem, ProcessedMarketData } from './marketService';
import { ProcessedWeatherData } from './weatherService';

export interface WeatherAlert {
  type: 'warning' | 'info' | 'success';
  title: string;
  message: string;
  time: string;
  priority: 'high' | 'medium' | 'low';
}

export interface FarmingTip {
  condition: string;
  tips: string[];
  priority: 'high' | 'medium' | 'low';
}

export interface WeatherInsights {
  alerts: WeatherAlert[];
  farmingTips: FarmingTip[];
  generalAdvice: string;
}

export interface MarketInsights {
  marketNews: MarketNewsItem[];
  marketFactors: MarketFactor[];
  generalAdvice: string;
}

class LLMService {
  private static instance: LLMService;
  private readonly EXPO_PUBLIC_GEMINI_API_KEY = Constants.expoConfig?.extra?.geminiApiKey || process.env.EXPO_PUBLIC_GEMINI_API_KEY || 'AIzaSyBrEHwOV0v6KMM7oqqOkhLYmugVSKhk9E4';
  private readonly GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

  static getInstance(): LLMService {
    if (!LLMService.instance) {
      LLMService.instance = new LLMService();
    }
    return LLMService.instance;
  }

  async generateWeatherInsights(weatherData: ProcessedWeatherData[]): Promise<WeatherInsights> {
    try {
      console.log('Generating weather insights with LLM...');
      console.log('API Key configured:', !!this.EXPO_PUBLIC_GEMINI_API_KEY);
      console.log('API Key length:', this.EXPO_PUBLIC_GEMINI_API_KEY?.length);
      
      // Check if API key is configured
      if (this.EXPO_PUBLIC_GEMINI_API_KEY === 'your_gemini_api_key_here' || !this.EXPO_PUBLIC_GEMINI_API_KEY) {
        console.log('Gemini API key not configured, using fallback insights');
        return this.getFallbackInsights(weatherData);
      }
      
      const prompt = this.createWeatherPrompt(weatherData);
      console.log('Prompt created, calling Gemini API...');
      const response = await this.callGeminiAPI(prompt);
      console.log('Gemini API response received');
      
      return this.parseLLMResponse(response);
    } catch (error) {
      console.error('Error generating weather insights:', error);
      console.log('Falling back to rule-based insights');
      return this.getFallbackInsights(weatherData);
    }
  }

  private createWeatherPrompt(weatherData: ProcessedWeatherData[]): string {
    const currentWeather = weatherData[0];
    const forecast = weatherData.slice(1, 5);

    return `You are an expert agricultural advisor. Based on the following weather data, provide farming recommendations and alerts.

CURRENT WEATHER:
- Temperature: ${currentWeather.temp.high}°C high, ${currentWeather.temp.low}°C low
- Condition: ${currentWeather.condition}
- Humidity: ${currentWeather.humidity}%
- Wind: ${currentWeather.wind} km/h (gusts up to ${currentWeather.gust} km/h)
- Precipitation: ${currentWeather.rain}mm
- UV Index: ${currentWeather.uv}
- Visibility: ${currentWeather.visibility}km
- Cloud Cover: ${currentWeather.cloudCover}%

5-DAY FORECAST:
${forecast.map((day, index) => `
Day ${index + 1} (${day.day}):
- Temperature: ${day.temp.high}°C high, ${day.temp.low}°C low
- Condition: ${day.condition}
- Humidity: ${day.humidity}%
- Wind: ${day.wind} km/h
- Precipitation: ${day.rain}mm
- UV Index: ${day.uv}
`).join('')}

Please provide:
1. WEATHER ALERTS (2-3 alerts): Critical weather conditions that farmers should be aware of
2. FARMING TIPS (3-4 categories): Specific advice for different weather conditions
3. GENERAL ADVICE: Overall farming recommendations for the week

Format your response as JSON:
{
  "alerts": [
    {
      "type": "warning|info|success",
      "title": "Alert title",
      "message": "Detailed alert message",
      "time": "Time ago (e.g., '2 hours ago')",
      "priority": "high|medium|low"
    }
  ],
  "farmingTips": [
    {
      "condition": "Weather condition name",
      "tips": ["Tip 1", "Tip 2", "Tip 3"],
      "priority": "high|medium|low"
    }
  ],
  "generalAdvice": "Overall farming advice for the week"
}

Focus on practical, actionable advice for farmers. Consider crop protection, irrigation, pest control, and field work timing.`;
  }

  private async callGeminiAPI(prompt: string): Promise<string> {
    const url = `${this.GEMINI_API_URL}?key=${this.EXPO_PUBLIC_GEMINI_API_KEY}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error details:', errorText);
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      console.error('Invalid Gemini API response:', data);
      throw new Error('Invalid response from Gemini API');
    }
    
    return data.candidates[0].content.parts[0].text;
  }

  private parseLLMResponse(response: string): WeatherInsights {
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      return {
        alerts: parsed.alerts || [],
        farmingTips: parsed.farmingTips || [],
        generalAdvice: parsed.generalAdvice || 'Monitor weather conditions and adjust farming practices accordingly.'
      };
    } catch (error) {
      console.error('Error parsing LLM response:', error);
      throw error;
    }
  }

  async testApiConnection(): Promise<boolean> {
    try {
      const testPrompt = "Say 'API connection successful' in JSON format: {\"status\": \"success\"}";
      const response = await this.callGeminiAPI(testPrompt);
      const parsed = JSON.parse(response);
      return parsed.status === 'success';
    } catch (error) {
      console.error('API connection test failed:', error);
      return false;
    }
  }

  async generateMarketInsights(marketData: ProcessedMarketData[], location: { countryName: string; principalSubdivision: string; locality: string }): Promise<MarketInsights> {
    try {
      console.log('Generating market insights with LLM...');
      console.log('API Key configured:', !!this.EXPO_PUBLIC_GEMINI_API_KEY);
      
      // Check if API key is configured
      if (this.EXPO_PUBLIC_GEMINI_API_KEY === 'your_gemini_api_key_here' || !this.EXPO_PUBLIC_GEMINI_API_KEY) {
        console.log('Gemini API key not configured, using fallback market insights');
        return this.getFallbackMarketInsights(marketData, location);
      }
      
      const prompt = this.createMarketPrompt(marketData, location);
      console.log('Market prompt created, calling Gemini API...');
      const response = await this.callGeminiAPI(prompt);
      console.log('Gemini API response received for market insights');
      
      return this.parseMarketResponse(response);
    } catch (error) {
      console.error('Error generating market insights:', error);
      console.log('Falling back to rule-based market insights');
      return this.getFallbackMarketInsights(marketData, location);
    }
  }

  private createMarketPrompt(marketData: ProcessedMarketData[], location: { countryName: string; principalSubdivision: string; locality: string }): string {
    const topCommodities = marketData.slice(0, 5);
    
    return `You are an expert agricultural market analyst. Based on the following market data from ${location.locality}, ${location.principalSubdivision}, provide market insights and analysis.

LOCATION: ${location.locality}, ${location.principalSubdivision}, ${location.countryName}

MARKET DATA:
${topCommodities.map((commodity, index) => `
${index + 1}. ${commodity.commodity} (${commodity.variety} - ${commodity.grade}):
   - Current Price: ₹${commodity.currentPrice}/quintal
   - Price Change: ${commodity.priceChangePercent > 0 ? '+' : ''}${commodity.priceChangePercent}% (${commodity.trend} trend)
   - Price Range: ₹${commodity.minPrice} - ₹${commodity.maxPrice}
   - Average Price: ₹${commodity.averagePrice}
   - Demand: ${commodity.demand} | Supply: ${commodity.supply}
   - Forecast: ${commodity.forecast}
   - Markets: ${commodity.marketCount} markets
   - Last Updated: ${commodity.lastUpdated}
`).join('')}

Please provide:
1. MARKET NEWS (3-4 news items): Recent developments affecting agricultural markets
2. MARKET FACTORS (4-5 factors): Key factors influencing prices and market conditions
3. GENERAL ADVICE: Overall market recommendations for farmers

Format your response as JSON:
{
  "marketNews": [
    {
      "title": "News headline",
      "summary": "Brief summary of the news",
      "impact": "Positive|Negative|Neutral",
      "time": "Time ago (e.g., '2 hours ago', '1 day ago')",
      "source": "News source"
    }
  ],
  "marketFactors": [
    {
      "factor": "Factor name",
      "impact": "Positive|Negative|Neutral",
      "description": "Detailed description of the factor",
      "icon": "icon-name"
    }
  ],
  "generalAdvice": "Overall market advice for farmers in this region"
}

Focus on practical, actionable market intelligence for farmers. Consider price trends, demand-supply dynamics, seasonal factors, government policies, and export-import scenarios.`;
  }

  private parseMarketResponse(response: string): MarketInsights {
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      return {
        marketNews: parsed.marketNews || [],
        marketFactors: parsed.marketFactors || [],
        generalAdvice: parsed.generalAdvice || 'Monitor market trends and adjust selling strategies accordingly.'
      };
    } catch (error) {
      console.error('Error parsing market LLM response:', error);
      throw error;
    }
  }

  private getFallbackMarketInsights(marketData: ProcessedMarketData[], location: { countryName: string; principalSubdivision: string; locality: string }): MarketInsights {
    const topCommodity = marketData[0];
    
    const marketNews: MarketNewsItem[] = [
      {
        title: 'Market Data Analysis Complete',
        summary: `Price trends analyzed for ${marketData.length} commodities in ${location.locality}`,
        impact: 'Positive',
        time: 'Just now',
        source: 'Farmula AI'
      }
    ];

    if (topCommodity) {
      if (topCommodity.trend === 'up') {
        marketNews.push({
          title: `${topCommodity.commodity} Prices Rising`,
          summary: `Strong upward trend with ${topCommodity.priceChangePercent}% increase`,
          impact: 'Positive',
          time: '1 hour ago',
          source: 'Market Analysis'
        });
      } else if (topCommodity.trend === 'down') {
        marketNews.push({
          title: `${topCommodity.commodity} Prices Declining`,
          summary: `Prices down by ${Math.abs(topCommodity.priceChangePercent)}% due to market conditions`,
          impact: 'Negative',
          time: '2 hours ago',
          source: 'Market Analysis'
        });
      }
    }

    const marketFactors: MarketFactor[] = [
      {
        factor: 'Seasonal Demand',
        impact: 'Positive',
        description: 'Festival season typically increases demand for agricultural products',
        icon: 'calendar'
      },
      {
        factor: 'Government MSP',
        impact: 'Positive',
        description: 'Minimum Support Price provides price stability for farmers',
        icon: 'shield-checkmark'
      },
      {
        factor: 'Export Opportunities',
        impact: 'Positive',
        description: 'International demand can boost local prices',
        icon: 'globe'
      },
      {
        factor: 'Weather Conditions',
        impact: 'Neutral',
        description: 'Weather patterns affect crop production and pricing',
        icon: 'cloud'
      }
    ];

    let generalAdvice = `Based on current market data for ${location.locality}, `;
    if (topCommodity) {
      generalAdvice += `${topCommodity.commodity} shows a ${topCommodity.trend} trend with ${topCommodity.demand} demand. `;
      if (topCommodity.trend === 'up') {
        generalAdvice += 'Consider selling during peak prices. ';
      } else if (topCommodity.trend === 'down') {
        generalAdvice += 'Monitor for price recovery before selling. ';
      }
    }
    generalAdvice += 'Stay updated with market trends and government policies for better decision making.';

    return {
      marketNews,
      marketFactors,
      generalAdvice
    };
  }

  getFallbackInsights(weatherData: ProcessedWeatherData[]): WeatherInsights {
    const currentWeather = weatherData[0];
    const alerts: WeatherAlert[] = [];
    const farmingTips: FarmingTip[] = [];

    // Generate alerts based on weather conditions
    if (currentWeather.rain > 20) {
      alerts.push({
        type: 'warning',
        title: 'Heavy Rain Alert',
        message: `Heavy rainfall expected (${currentWeather.rain}mm). Avoid field work and check drainage systems.`,
        time: 'Just now',
        priority: 'high'
      });
    }

    if (currentWeather.temp.low < 5) {
      alerts.push({
        type: 'info',
        title: 'Temperature Drop',
        message: `Temperature will drop to ${currentWeather.temp.low}°C. Protect sensitive crops.`,
        time: '1 hour ago',
        priority: 'medium'
      });
    }

    if (currentWeather.wind > 20) {
      alerts.push({
        type: 'warning',
        title: 'High Wind Warning',
        message: `Strong winds expected (${currentWeather.wind} km/h). Avoid spraying and check for crop damage.`,
        time: '30 minutes ago',
        priority: 'high'
      });
    }

    // Generate farming tips based on weather conditions
    if (currentWeather.rain > 10) {
      farmingTips.push({
        condition: 'Rainy Weather',
        tips: [
          'Avoid spraying pesticides during rain',
          'Check and clear drainage systems',
          'Monitor for waterlogging',
          'Postpone harvesting activities'
        ],
        priority: 'high'
      });
    }

    if (currentWeather.temp.high > 30) {
      farmingTips.push({
        condition: 'Hot Weather',
        tips: [
          'Increase irrigation frequency',
          'Provide shade for sensitive crops',
          'Water early morning or evening',
          'Monitor soil moisture levels'
        ],
        priority: 'high'
      });
    }

    if (currentWeather.wind > 15) {
      farmingTips.push({
        condition: 'Windy Weather',
        tips: [
          'Avoid spraying in strong winds',
          'Check for crop damage',
          'Secure greenhouse structures',
          'Monitor for pest spread'
        ],
        priority: 'medium'
      });
    }

    // Default tips if no specific conditions
    if (farmingTips.length === 0) {
      farmingTips.push({
        condition: 'General Farming',
        tips: [
          'Monitor soil moisture levels',
          'Check for pest and disease signs',
          'Plan irrigation schedule',
          'Prepare for upcoming weather changes'
        ],
        priority: 'low'
      });
    }

    return {
      alerts,
      farmingTips,
      generalAdvice: `Current conditions are ${currentWeather.condition.toLowerCase()} with temperatures ranging from ${currentWeather.temp.low}°C to ${currentWeather.temp.high}°C. ${currentWeather.description}`
    };
  }
}

export const llmService = LLMService.getInstance();
