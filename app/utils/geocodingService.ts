export interface LocationData {
  countryName: string;
  principalSubdivision: string; // State
  locality: string; // District/City
  city: string;
  postcode: string;
}

export interface GeocodingResult {
  success: boolean;
  data?: LocationData;
  error?: string;
}

class GeocodingService {
  private static instance: GeocodingService;
  private readonly GEOCODING_API_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client';

  static getInstance(): GeocodingService {
    if (!GeocodingService.instance) {
      GeocodingService.instance = new GeocodingService();
    }
    return GeocodingService.instance;
  }

  async getLocationFromCoordinates(latitude: number, longitude: number): Promise<GeocodingResult> {
    try {
      console.log('Getting location from coordinates:', { latitude, longitude });
      
      const url = `${this.GEOCODING_API_URL}?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Geocoding API error: ${response.status}`);
      }

      const data: LocationData = await response.json();
      console.log('Geocoding response:', data);

      return {
        success: true,
        data: {
          countryName: data.countryName || 'Unknown',
          principalSubdivision: data.principalSubdivision || 'Unknown State',
          locality: data.locality || 'Unknown District',
          city: data.city || data.locality || 'Unknown City',
          postcode: data.postcode || 'Unknown',
        }
      };
    } catch (error) {
      console.error('Error getting location from coordinates:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async getLocationFromCurrentPosition(): Promise<GeocodingResult> {
    try {
      // Get current location using the permission manager
      const { permissionManager } = await import('./permissions');
      const location = await permissionManager.getCurrentLocation();
      
      if (!location) {
        return {
          success: false,
          error: 'Location not available'
        };
      }

      return await this.getLocationFromCoordinates(location.latitude, location.longitude);
    } catch (error) {
      console.error('Error getting current location:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get current location'
      };
    }
  }

  // Helper method to format location for display
  formatLocationForDisplay(locationData: LocationData): string {
    return `${locationData.locality}, ${locationData.principalSubdivision}`;
  }

  // Helper method to get state and district for API calls
  getStateAndDistrict(locationData: LocationData): { state: string; district: string } {
    return {
      state: locationData.principalSubdivision,
      district: locationData.locality
    };
  }
}

export const geocodingService = GeocodingService.getInstance();
