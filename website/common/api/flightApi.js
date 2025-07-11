// flightApi.js - Modular Flight API Integration
// This module provides a clean interface for integrating with various flight APIs
// Currently supports: Amadeus, Skyscanner, Sabre, and custom APIs

import axios from 'axios';
import { toast } from 'react-hot-toast';

// API Configuration
const API_CONFIGS = {
  amadeus: {
    baseURL: 'https://api.amadeus.com/v2',
    authURL: 'https://api.amadeus.com/v1/security/oauth2/token',
    requiresAuth: true,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  skyscanner: {
    baseURL: 'https://partners.api.skyscanner.net/apiservices',
    requiresAuth: true,
    headers: {
      'Content-Type': 'application/json'
    }
  },
  sabre: {
    baseURL: 'https://api.sabre.com/v2',
    authURL: 'https://api.sabre.com/v2/auth/token',
    requiresAuth: true,
    headers: {
      'Content-Type': 'application/json'
    }
  },
  custom: {
    baseURL: process.env.NEXT_PUBLIC_CUSTOM_FLIGHT_API_URL || 'https://your-api.com/v1',
    requiresAuth: false,
    headers: {
      'Content-Type': 'application/json'
    }
  }
};

// Flight API Class
class FlightApiService {
  constructor(provider = 'custom') {
    this.provider = provider;
    this.config = API_CONFIGS[provider];
    this.accessToken = null;
    this.tokenExpiry = null;
    
    // Initialize axios instance
    this.apiClient = axios.create({
      baseURL: this.config.baseURL,
      headers: this.config.headers
    });

    // Set up request interceptors
    this.setupInterceptors();
  }

  setupInterceptors() {
    // Request interceptor for authentication
    this.apiClient.interceptors.request.use(
      async (config) => {
        if (this.config.requiresAuth) {
          await this.ensureValidToken();
          config.headers.Authorization = `Bearer ${this.accessToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.apiClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401 && this.config.requiresAuth) {
          // Token expired, refresh and retry
          await this.authenticate();
          const originalRequest = error.config;
          originalRequest.headers.Authorization = `Bearer ${this.accessToken}`;
          return this.apiClient.request(originalRequest);
        }
        return Promise.reject(error);
      }
    );
  }

  // Authentication method (varies by provider)
  async authenticate() {
    try {
      switch (this.provider) {
        case 'amadeus':
          return await this.authenticateAmadeus();
        case 'sabre':
          return await this.authenticateSabre();
        case 'skyscanner':
          return await this.authenticateSkyscanner();
        default:
          // Custom API might not need authentication
          return true;
      }
    } catch (error) {
      console.error('Authentication failed:', error);
      throw new Error('Failed to authenticate with flight API');
    }
  }

  async authenticateAmadeus() {
    const response = await axios.post(this.config.authURL, {
      grant_type: 'client_credentials',
      client_id: process.env.NEXT_PUBLIC_AMADEUS_CLIENT_ID,
      client_secret: process.env.AMADEUS_CLIENT_SECRET
    }, {
      headers: this.config.headers
    });

    this.accessToken = response.data.access_token;
    this.tokenExpiry = Date.now() + (response.data.expires_in * 1000);
    return true;
  }

  async authenticateSabre() {
    const credentials = btoa(`${process.env.NEXT_PUBLIC_SABRE_CLIENT_ID}:${process.env.SABRE_CLIENT_SECRET}`);
    
    const response = await axios.post(this.config.authURL, {
      grant_type: 'client_credentials'
    }, {
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    this.accessToken = response.data.access_token;
    this.tokenExpiry = Date.now() + (response.data.expires_in * 1000);
    return true;
  }

  async authenticateSkyscanner() {
    // Skyscanner uses API key authentication
    this.accessToken = process.env.NEXT_PUBLIC_SKYSCANNER_API_KEY;
    return true;
  }

  async ensureValidToken() {
    if (!this.accessToken || (this.tokenExpiry && Date.now() >= this.tokenExpiry)) {
      await this.authenticate();
    }
  }

  // Search airports/cities
  async searchAirports(query) {
    try {
      switch (this.provider) {
        case 'amadeus':
          return await this.searchAirportsAmadeus(query);
        case 'skyscanner':
          return await this.searchAirportsSkyscanner(query);
        case 'sabre':
          return await this.searchAirportsSabre(query);
        default:
          return await this.searchAirportsCustom(query);
      }
    } catch (error) {
      console.error('Airport search failed:', error);
      throw error;
    }
  }

  async searchAirportsAmadeus(query) {
    const response = await this.apiClient.get('/reference-data/locations', {
      params: {
        keyword: query,
        subType: 'AIRPORT,CITY'
      }
    });
    
    return response.data.data.map(item => ({
      code: item.iataCode,
      name: item.name,
      city: item.address?.cityName || '',
      country: item.address?.countryName || '',
      type: item.subType
    }));
  }

  async searchAirportsSkyscanner(query) {
    const response = await this.apiClient.get('/autosuggest/v1.0/UK/GBP/en-GB/', {
      params: {
        query: query
      },
      headers: {
        'X-RapidAPI-Key': this.accessToken
      }
    });
    
    return response.data.Places.map(place => ({
      code: place.PlaceId,
      name: place.PlaceName,
      city: place.CityName || '',
      country: place.CountryName || '',
      type: 'AIRPORT'
    }));
  }

  async searchAirportsSabre(query) {
    const response = await this.apiClient.get('/lists/utilities/airports', {
      params: {
        keyword: query
      }
    });
    
    return response.data.map(airport => ({
      code: airport.code,
      name: airport.name,
      city: airport.city || '',
      country: airport.country || '',
      type: 'AIRPORT'
    }));
  }

  async searchAirportsCustom(query) {
    const response = await this.apiClient.get('/airports/search', {
      params: { q: query }
    });
    
    return response.data.airports || [];
  }

  // Search flights
  async searchFlights(searchParams) {
    try {
      switch (this.provider) {
        case 'amadeus':
          return await this.searchFlightsAmadeus(searchParams);
        case 'skyscanner':
          return await this.searchFlightsSkyscanner(searchParams);
        case 'sabre':
          return await this.searchFlightsSabre(searchParams);
        default:
          return await this.searchFlightsCustom(searchParams);
      }
    } catch (error) {
      console.error('Flight search failed:', error);
      throw error;
    }
  }

  async searchFlightsAmadeus(searchParams) {
    const { from, to, departDate, returnDate, passengers, class: travelClass } = searchParams;
    
    const params = {
      originLocationCode: from.split(' - ')[0],
      destinationLocationCode: to.split(' - ')[0],
      departureDate: departDate,
      adults: passengers.adults,
      children: passengers.children,
      infants: passengers.infants,
      travelClass: travelClass.toUpperCase(),
      nonStop: false,
      max: 50
    };

    if (returnDate) {
      params.returnDate = returnDate;
    }

    const response = await this.apiClient.get('/shopping/flight-offers', { params });
    
    return this.transformAmadeusResponse(response.data);
  }

  async searchFlightsSkyscanner(searchParams) {
    const { from, to, departDate, returnDate, passengers } = searchParams;
    
    // Skyscanner requires a different approach with session creation
    const sessionParams = {
      country: 'US',
      currency: 'USD',
      locale: 'en-US',
      originPlace: from.split(' - ')[0],
      destinationPlace: to.split(' - ')[0],
      outboundDate: departDate,
      adults: passengers.adults,
      children: passengers.children,
      infants: passengers.infants
    };

    if (returnDate) {
      sessionParams.inboundDate = returnDate;
    }

    // Create session and poll for results
    const sessionResponse = await this.apiClient.post('/pricing/v1.0', sessionParams, {
      headers: {
        'X-RapidAPI-Key': this.accessToken
      }
    });

    // Poll for results (simplified for demo)
    const sessionKey = sessionResponse.headers.location.split('/').pop();
    const resultsResponse = await this.apiClient.get(`/pricing/uk2/v1.0/${sessionKey}`, {
      headers: {
        'X-RapidAPI-Key': this.accessToken
      }
    });

    return this.transformSkyscannerResponse(resultsResponse.data);
  }

  async searchFlightsSabre(searchParams) {
    const { from, to, departDate, returnDate, passengers, class: travelClass } = searchParams;
    
    const requestBody = {
      OTA_AirLowFareSearchRQ: {
        OriginDestinationInformation: [{
          DepartureDateTime: departDate,
          OriginLocation: { LocationCode: from.split(' - ')[0] },
          DestinationLocation: { LocationCode: to.split(' - ')[0] }
        }],
        TravelerInfoSummary: {
          AirTravelerAvail: [{
            PassengerTypeQuantity: [
              { Code: 'ADT', Quantity: passengers.adults },
              { Code: 'CHD', Quantity: passengers.children },
              { Code: 'INF', Quantity: passengers.infants }
            ]
          }]
        },
        TPA_Extensions: {
          IntelliSellTransaction: {
            RequestType: { Name: ' 200ITINS' }
          }
        }
      }
    };

    if (returnDate) {
      requestBody.OTA_AirLowFareSearchRQ.OriginDestinationInformation.push({
        DepartureDateTime: returnDate,
        OriginLocation: { LocationCode: to.split(' - ')[0] },
        DestinationLocation: { LocationCode: from.split(' - ')[0] }
      });
    }

    const response = await this.apiClient.post('/shop/flights', requestBody);
    
    return this.transformSabreResponse(response.data);
  }

  async searchFlightsCustom(searchParams) {
    const response = await this.apiClient.post('/flights/search', searchParams);
    return response.data.flights || [];
  }

  // Transform responses to unified format
  transformAmadeusResponse(data) {
    return data.data.map((offer, index) => {
      const itinerary = offer.itineraries[0];
      const segment = itinerary.segments[0];
      
      return {
        id: `amadeus_${index}`,
        airline: segment.carrierCode,
        flightNumber: `${segment.carrierCode} ${segment.aircraft.code}`,
        departure: {
          time: new Date(segment.departure.at).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
          }),
          airport: segment.departure.iataCode,
          date: segment.departure.at.split('T')[0]
        },
        arrival: {
          time: new Date(segment.arrival.at).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
          }),
          airport: segment.arrival.iataCode,
          date: segment.arrival.at.split('T')[0]
        },
        duration: itinerary.duration.replace('PT', '').toLowerCase(),
        stops: itinerary.segments.length - 1,
        price: parseFloat(offer.price.total),
        currency: offer.price.currency,
        class: 'Economy',
        baggage: '23kg',
        refundable: offer.pricingOptions?.refundableFare || false
      };
    });
  }

  transformSkyscannerResponse(data) {
    return data.Itineraries.map((itinerary, index) => {
      const outbound = itinerary.OutboundLegId;
      const leg = data.Legs.find(l => l.Id === outbound);
      const carrier = data.Carriers.find(c => c.Id === leg.Carriers[0]);
      
      return {
        id: `skyscanner_${index}`,
        airline: carrier.Name,
        flightNumber: `${carrier.Code} ${leg.FlightNumbers[0]}`,
        departure: {
          time: new Date(leg.Departure).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
          }),
          airport: leg.OriginStation,
          date: leg.Departure.split('T')[0]
        },
        arrival: {
          time: new Date(leg.Arrival).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
          }),
          airport: leg.DestinationStation,
          date: leg.Arrival.split('T')[0]
        },
        duration: `${Math.floor(leg.Duration / 60)}h ${leg.Duration % 60}m`,
        stops: leg.Stops.length,
        price: itinerary.PricingOptions[0].Price,
        currency: data.Currencies[0].Code,
        class: 'Economy',
        baggage: '20kg',
        refundable: false
      };
    });
  }

  transformSabreResponse(data) {
    const itineraries = data.OTA_AirLowFareSearchRS.PricedItineraries;
    
    return itineraries.map((itinerary, index) => {
      const flight = itinerary.AirItinerary.OriginDestinationOptions[0].FlightSegment[0];
      
      return {
        id: `sabre_${index}`,
        airline: flight.MarketingAirline.Code,
        flightNumber: `${flight.MarketingAirline.Code} ${flight.FlightNumber}`,
        departure: {
          time: flight.DepartureDateTime.split('T')[1],
          airport: flight.DepartureAirport.LocationCode,
          date: flight.DepartureDateTime.split('T')[0]
        },
        arrival: {
          time: flight.ArrivalDateTime.split('T')[1],
          airport: flight.ArrivalAirport.LocationCode,
          date: flight.ArrivalDateTime.split('T')[0]
        },
        duration: flight.ElapsedTime,
        stops: itinerary.AirItinerary.OriginDestinationOptions[0].FlightSegment.length - 1,
        price: parseFloat(itinerary.AirItineraryPricingInfo.ItinTotalFare.TotalFare.Amount),
        currency: itinerary.AirItineraryPricingInfo.ItinTotalFare.TotalFare.CurrencyCode,
        class: 'Economy',
        baggage: '23kg',
        refundable: false
      };
    });
  }

  // Get flight details
  async getFlightDetails(flightId) {
    try {
      switch (this.provider) {
        case 'amadeus':
          return await this.getFlightDetailsAmadeus(flightId);
        case 'skyscanner':
          return await this.getFlightDetailsSkyscanner(flightId);
        case 'sabre':
          return await this.getFlightDetailsSabre(flightId);
        default:
          return await this.getFlightDetailsCustom(flightId);
      }
    } catch (error) {
      console.error('Failed to get flight details:', error);
      throw error;
    }
  }

  async getFlightDetailsAmadeus(flightId) {
    const response = await this.apiClient.get(`/shopping/flight-offers/${flightId}`);
    return response.data;
  }

  async getFlightDetailsCustom(flightId) {
    const response = await this.apiClient.get(`/flights/${flightId}`);
    return response.data;
  }

  // Book flight (placeholder - requires payment integration)
  async bookFlight(flightData, passengerData, paymentData) {
    try {
      // This would integrate with your booking system
      const bookingData = {
        flight: flightData,
        passengers: passengerData,
        payment: paymentData,
        bookingId: `RDT-${Date.now()}`,
        status: 'confirmed'
      };

      // Call your booking API
      const response = await this.apiClient.post('/bookings', bookingData);
      
      return {
        success: true,
        bookingId: response.data.bookingId,
        confirmationCode: response.data.confirmationCode,
        data: response.data
      };
    } catch (error) {
      console.error('Booking failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Export singleton instances for different providers
export const amadeusApi = new FlightApiService('amadeus');
export const skyscannerApi = new FlightApiService('skyscanner');
export const sabreApi = new FlightApiService('sabre');
export const customFlightApi = new FlightApiService('custom');

// Default export
export default FlightApiService;

// Utility functions
export const flightApiUtils = {
  // Format duration
  formatDuration: (duration) => {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return `${hours}h ${minutes}m`;
  },

  // Calculate stops text
  getStopsText: (stops) => {
    if (stops === 0) return 'Non-stop';
    if (stops === 1) return '1 stop';
    return `${stops} stops`;
  },

  // Format price
  formatPrice: (price, currency = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  },

  // Validate search parameters
  validateSearchParams: (params) => {
    const { from, to, departDate, passengers } = params;
    
    if (!from || !to) {
      throw new Error('Origin and destination are required');
    }
    
    if (!departDate) {
      throw new Error('Departure date is required');
    }
    
    if (passengers.adults < 1) {
      throw new Error('At least one adult passenger is required');
    }
    
    if (new Date(departDate) < new Date()) {
      throw new Error('Departure date cannot be in the past');
    }
    
    return true;
  },

  // Get airline logo URL
  getAirlineLogo: (airlineCode) => {
    return `https://images.kiwi.com/airlines/64x64/${airlineCode.toLowerCase()}.png`;
  }
};

// Error handling wrapper
export const withErrorHandling = (apiCall) => {
  return async (...args) => {
    try {
      return await apiCall(...args);
    } catch (error) {
      console.error('API Error:', error);
      
      if (error.response) {
        // API responded with error status
        const message = error.response.data?.message || 'API request failed';
        toast.error(message);
        throw new Error(message);
      } else if (error.request) {
        // Network error
        toast.error('Network error. Please check your connection.');
        throw new Error('Network error');
      } else {
        // Other error
        toast.error('An unexpected error occurred');
        throw error;
      }
    }
  };
};