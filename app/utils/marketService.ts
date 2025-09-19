import { geocodingService } from './geocodingService';

export interface MarketPriceRecord {
  State: string;
  District: string;
  Market: string;
  Commodity: string;
  Variety: string;
  Grade: string;
  Arrival_Date: string;
  Min_Price: string;
  Max_Price: string;
  Modal_Price: string;
  Commodity_Code: string;
}

export interface MarketPriceResponse {
  total: number;
  count: number;
  records: MarketPriceRecord[];
}

export interface ProcessedMarketData {
  commodity: string;
  variety: string;
  grade: string;
  currentPrice: number;
  minPrice: number;
  maxPrice: number;
  averagePrice: number;
  priceChange: number;
  priceChangePercent: number;
  trend: 'up' | 'down' | 'stable';
  demand: 'Low' | 'Medium' | 'High' | 'Very High';
  supply: 'Low' | 'Medium' | 'High' | 'Very High';
  forecast: string;
  lastUpdated: string;
  marketCount: number;
  priceHistory: PriceHistoryPoint[];
}

export interface PriceHistoryPoint {
  date: string;
  price: number;
  month: string;
}

export interface MarketInsights {
  location: {
    state: string;
    district: string;
    displayName: string;
  };
  commodities: ProcessedMarketData[];
  marketNews: MarketNewsItem[];
  marketFactors: MarketFactor[];
  generalAdvice: string;
}

export interface MarketNewsItem {
  title: string;
  summary: string;
  impact: 'Positive' | 'Negative' | 'Neutral';
  time: string;
  source: string;
}

export interface MarketFactor {
  factor: string;
  impact: 'Positive' | 'Negative' | 'Neutral';
  description: string;
  icon: string;
}

class MarketService {
  private static instance: MarketService;
  private readonly API_KEY = '579b464db66ec23bdd0000015e1688471c84495a58a557976cd94c20';
  private readonly RESOURCE_ID = '9ef84268-d588-465a-a308-a864a43d0070';
  private readonly BASE_URL = 'https://api.data.gov.in/resource';

  static getInstance(): MarketService {
    if (!MarketService.instance) {
      MarketService.instance = new MarketService();
    }
    return MarketService.instance;
  }

  async getMarketInsights(): Promise<MarketInsights> {
    try {
      console.log('Getting market insights...');
      
      // Get current location
      const locationResult = await geocodingService.getLocationFromCurrentPosition();
      if (!locationResult.success || !locationResult.data) {
        throw new Error('Failed to get location data');
      }

      const location = locationResult.data;
      const { state, district } = geocodingService.getStateAndDistrict(location);

      console.log('Location data:', { state, district });

      // Get market data for the location
      const marketData = await this.getMarketData(state, district);
      
      // Process and analyze the data
      const processedCommodities = this.processMarketData(marketData);
      
      // Generate insights using LLM
      const { llmService } = await import('./llmService');
      const aiInsights = await llmService.generateMarketInsights(processedCommodities, location);

      return {
        location: {
          state,
          district,
          displayName: geocodingService.formatLocationForDisplay(location)
        },
        commodities: processedCommodities,
        marketNews: aiInsights.marketNews,
        marketFactors: aiInsights.marketFactors,
        generalAdvice: aiInsights.generalAdvice
      };
    } catch (error) {
      console.error('Error getting market insights:', error);
      // Return fallback data
      return this.getFallbackMarketInsights();
    }
  }

  private async getMarketData(state: string, district: string): Promise<MarketPriceRecord[]> {
    try {
      console.log('Fetching market data for:', { state, district });
      
      const url = `${this.BASE_URL}/${this.RESOURCE_ID}`;
      const params = new URLSearchParams({
        'api-key': this.API_KEY,
        'format': 'json',
        'limit': '1000',
        'offset': '0',
        'filters[State]': state,
        'filters[District]': district,
        'sort[Arrival_Date]': 'desc'
      });

      const response = await fetch(`${url}?${params}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Market API error: ${response.status}`);
      }

      const data: MarketPriceResponse = await response.json();
      console.log('Market data received:', data.count, 'records');

      return data.records || [];
    } catch (error) {
      console.error('Error fetching market data:', error);
      return [];
    }
  }

  private processMarketData(records: MarketPriceRecord[]): ProcessedMarketData[] {
    if (records.length === 0) {
      return this.getMockMarketData();
    }

    // Group by commodity and variety
    const groupedData = new Map<string, MarketPriceRecord[]>();
    
    records.forEach(record => {
      const key = `${record.Commodity}-${record.Variety}-${record.Grade}`;
      if (!groupedData.has(key)) {
        groupedData.set(key, []);
      }
      groupedData.get(key)?.push(record);
    });

    const processedCommodities: ProcessedMarketData[] = [];

    groupedData.forEach((records, key) => {
      if (records.length === 0) return;

      // Sort by date (newest first)
      const sortedRecords = records.sort((a, b) => {
        const dateA = new Date(a.Arrival_Date.split('/').reverse().join('-'));
        const dateB = new Date(b.Arrival_Date.split('/').reverse().join('-'));
        return dateB.getTime() - dateA.getTime();
      });

      const latestRecord = sortedRecords[0];
      const prices = sortedRecords.map(r => parseInt(r.Modal_Price) || 0).filter(p => p > 0);
      
      if (prices.length === 0) return;

      const currentPrice = prices[0];
      const averagePrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);

      // Calculate price change (compare with 30 days ago if available)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const oldRecords = sortedRecords.filter(r => {
        const recordDate = new Date(r.Arrival_Date.split('/').reverse().join('-'));
        return recordDate <= thirtyDaysAgo;
      });

      let priceChange = 0;
      let priceChangePercent = 0;
      
      if (oldRecords.length > 0) {
        const oldPrice = parseInt(oldRecords[0].Modal_Price) || currentPrice;
        priceChange = currentPrice - oldPrice;
        priceChangePercent = (priceChange / oldPrice) * 100;
      }

      // Determine trend
      let trend: 'up' | 'down' | 'stable' = 'stable';
      if (priceChangePercent > 5) trend = 'up';
      else if (priceChangePercent < -5) trend = 'down';

      // Generate price history (last 6 months)
      const priceHistory = this.generatePriceHistory(sortedRecords);

      // Determine demand and supply based on price trends and volatility
      const priceVolatility = this.calculatePriceVolatility(prices);
      const demand = this.determineDemand(priceChangePercent, priceVolatility);
      const supply = this.determineSupply(priceChangePercent, priceVolatility);

      // Generate forecast
      const forecast = this.generateForecast(trend, priceChangePercent, demand, supply);

      processedCommodities.push({
        commodity: latestRecord.Commodity,
        variety: latestRecord.Variety,
        grade: latestRecord.Grade,
        currentPrice,
        minPrice,
        maxPrice,
        averagePrice: Math.round(averagePrice),
        priceChange: Math.round(priceChange),
        priceChangePercent: Math.round(priceChangePercent * 100) / 100,
        trend,
        demand,
        supply,
        forecast,
        lastUpdated: latestRecord.Arrival_Date,
        marketCount: new Set(records.map(r => r.Market)).size,
        priceHistory
      });
    });

    // Sort by current price (highest first)
    return processedCommodities.sort((a, b) => b.currentPrice - a.currentPrice);
  }

  private generatePriceHistory(records: MarketPriceRecord[]): PriceHistoryPoint[] {
    const history: PriceHistoryPoint[] = [];
    const monthlyData = new Map<string, number[]>();

    // Group by month
    records.forEach(record => {
      const date = new Date(record.Arrival_Date.split('/').reverse().join('-'));
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, []);
      }
      monthlyData.get(monthKey)?.push(parseInt(record.Modal_Price) || 0);
    });

    // Calculate average price for each month
    monthlyData.forEach((prices, monthKey) => {
      const validPrices = prices.filter(p => p > 0);
      if (validPrices.length > 0) {
        const avgPrice = validPrices.reduce((sum, price) => sum + price, 0) / validPrices.length;
        const [year, month] = monthKey.split('-');
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        history.push({
          date: monthKey,
          price: Math.round(avgPrice),
          month: monthNames[parseInt(month) - 1]
        });
      }
    });

    // Sort by date and return last 6 months
    return history.sort((a, b) => a.date.localeCompare(b.date)).slice(-6);
  }

  private calculatePriceVolatility(prices: number[]): number {
    if (prices.length < 2) return 0;
    
    const mean = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    const variance = prices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / prices.length;
    return Math.sqrt(variance) / mean * 100; // Coefficient of variation
  }

  private determineDemand(priceChangePercent: number, volatility: number): 'Low' | 'Medium' | 'High' | 'Very High' {
    if (priceChangePercent > 15 && volatility < 20) return 'Very High';
    if (priceChangePercent > 5 || volatility > 30) return 'High';
    if (priceChangePercent > -5) return 'Medium';
    return 'Low';
  }

  private determineSupply(priceChangePercent: number, volatility: number): 'Low' | 'Medium' | 'High' | 'Very High' {
    if (priceChangePercent < -15 && volatility < 20) return 'Very High';
    if (priceChangePercent < -5 || volatility > 30) return 'High';
    if (priceChangePercent < 5) return 'Medium';
    return 'Low';
  }

  private generateForecast(trend: 'up' | 'down' | 'stable', priceChangePercent: number, demand: string, supply: string): string {
    if (trend === 'up' && demand === 'Very High') {
      return 'Strong upward trend expected due to high demand';
    }
    if (trend === 'down' && supply === 'Very High') {
      return 'Prices may continue declining due to oversupply';
    }
    if (trend === 'up') {
      return 'Prices expected to rise 5-10% in next month';
    }
    if (trend === 'down') {
      return 'Prices may stabilize or decline slightly';
    }
    return 'Prices expected to remain stable with minor fluctuations';
  }

  private getMockMarketData(): ProcessedMarketData[] {
    return [
      {
        commodity: 'Rice',
        variety: 'Basmati',
        grade: 'FAQ',
        currentPrice: 2850,
        minPrice: 2650,
        maxPrice: 3050,
        averagePrice: 2750,
        priceChange: 150,
        priceChangePercent: 5.56,
        trend: 'up',
        demand: 'High',
        supply: 'Medium',
        forecast: 'Prices expected to rise 8-12% in next month',
        lastUpdated: '15/12/2024',
        marketCount: 5,
        priceHistory: [
          { date: '2024-07', price: 2650, month: 'Jul' },
          { date: '2024-08', price: 2720, month: 'Aug' },
          { date: '2024-09', price: 2780, month: 'Sep' },
          { date: '2024-10', price: 2750, month: 'Oct' },
          { date: '2024-11', price: 2820, month: 'Nov' },
          { date: '2024-12', price: 2850, month: 'Dec' }
        ]
      },
      {
        commodity: 'Wheat',
        variety: 'Lokwan',
        grade: 'FAQ',
        currentPrice: 2200,
        minPrice: 2100,
        maxPrice: 2300,
        averagePrice: 2180,
        priceChange: -50,
        priceChangePercent: -2.22,
        trend: 'down',
        demand: 'Medium',
        supply: 'High',
        forecast: 'Prices may stabilize with good harvest',
        lastUpdated: '15/12/2024',
        marketCount: 3,
        priceHistory: [
          { date: '2024-07', price: 2250, month: 'Jul' },
          { date: '2024-08', price: 2230, month: 'Aug' },
          { date: '2024-09', price: 2210, month: 'Sep' },
          { date: '2024-10', price: 2200, month: 'Oct' },
          { date: '2024-11', price: 2190, month: 'Nov' },
          { date: '2024-12', price: 2200, month: 'Dec' }
        ]
      }
    ];
  }

  private getFallbackMarketInsights(): MarketInsights {
    return {
      location: {
        state: 'Unknown State',
        district: 'Unknown District',
        displayName: 'Location not available'
      },
      commodities: this.getMockMarketData(),
      marketNews: [
        {
          title: 'Market Data Unavailable',
          summary: 'Unable to fetch real-time market data. Using sample data.',
          impact: 'Neutral',
          time: 'Just now',
          source: 'System'
        }
      ],
      marketFactors: [
        {
          factor: 'Data Connection',
          impact: 'Neutral',
          description: 'Real-time market data is currently unavailable',
          icon: 'warning'
        }
      ],
      generalAdvice: 'Please check your internet connection and try again for real-time market insights.'
    };
  }
}

export const marketService = MarketService.getInstance();
