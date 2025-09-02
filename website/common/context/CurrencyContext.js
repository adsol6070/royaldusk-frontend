"use client";
import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';

// Currency Context
const CurrencyContext = createContext();

// Currency Action Types
const CURRENCY_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_RATES: 'SET_RATES',
  SET_ERROR: 'SET_ERROR',
  SET_CURRENCY: 'SET_CURRENCY',
  SET_LAST_UPDATED: 'SET_LAST_UPDATED',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Initial State
const initialState = {
  selectedCurrency: 'AED', // Default currency
  exchangeRates: {}, // Rates relative to AED
  loading: false,
  error: null,
  lastUpdated: null,
  baseCurrency: 'AED' // Your platform's base currency
};

// Currency Reducer
const currencyReducer = (state, action) => {
  switch (action.type) {
    case CURRENCY_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case CURRENCY_ACTIONS.SET_RATES:
      return { 
        ...state, 
        exchangeRates: action.payload, 
        loading: false, 
        error: null 
      };
    
    case CURRENCY_ACTIONS.SET_ERROR:
      return { 
        ...state, 
        error: action.payload, 
        loading: false 
      };
    
    case CURRENCY_ACTIONS.SET_CURRENCY:
      return { 
        ...state, 
        selectedCurrency: action.payload 
      };
    
    case CURRENCY_ACTIONS.SET_LAST_UPDATED:
      return { 
        ...state, 
        lastUpdated: action.payload 
      };
    
    case CURRENCY_ACTIONS.CLEAR_ERROR:
      return { 
        ...state, 
        error: null 
      };
    
    default:
      return state;
  }
};

// Currency Service Class
class CurrencyService {
  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_EXCHANGE_RATE_API_KEY;
    this.baseUrl = 'https://v6.exchangerate-api.com/v6';
    this.fallbackUrl = 'https://api.fxratesapi.com/latest';
    this.cacheKey = 'currency_rates_cache';
    this.cacheTimeout = 30 * 60 * 1000; // 30 minutes
  }

  // Get cached rates
  getCachedRates() {
    try {
      const cached = localStorage.getItem(this.cacheKey);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        const now = new Date().getTime();
        
        // Check if cache is still valid
        if (now - timestamp < this.cacheTimeout) {
          return data;
        }
      }
    } catch (error) {
      console.warn('Failed to read currency cache:', error);
    }
    return null;
  }

  // Cache rates
  setCachedRates(rates) {
    try {
      const cacheData = {
        data: rates,
        timestamp: new Date().getTime()
      };
      localStorage.setItem(this.cacheKey, JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Failed to cache currency rates:', error);
    }
  }

  // Fetch exchange rates with primary API
  async fetchRatesFromPrimary(baseCurrency = 'AED') {
    if (!this.apiKey) {
      throw new Error('Exchange rate API key not configured');
    }

    const response = await fetch(
      `${this.baseUrl}/${this.apiKey}/latest/${baseCurrency}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Primary API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.result !== 'success') {
      throw new Error(`API returned error: ${data['error-type']}`);
    }

    return data.conversion_rates;
  }

  // Fetch exchange rates with fallback API
  async fetchRatesFromFallback(baseCurrency = 'AED') {
    const response = await fetch(
      `${this.fallbackUrl}?base=${baseCurrency}&symbols=USD,EUR,GBP,INR,SAR,AED`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Fallback API error: ${response.status}`);
    }

    const data = await response.json();
    return data.rates;
  }

  // Main method to fetch exchange rates
  async fetchExchangeRates(baseCurrency = 'AED') {
    // First, try to get cached rates
    const cachedRates = this.getCachedRates();
    if (cachedRates) {
      return cachedRates;
    }

    try {
      // Try primary API first
      const rates = await this.fetchRatesFromPrimary(baseCurrency);
      this.setCachedRates(rates);
      return rates;
    } catch (primaryError) {
      console.warn('Primary API failed, trying fallback:', primaryError.message);
      
      try {
        // Try fallback API
        const rates = await this.fetchRatesFromFallback(baseCurrency);
        this.setCachedRates(rates);
        return rates;
      } catch (fallbackError) {
        console.error('Both APIs failed:', fallbackError.message);
        
        // Return default rates if both APIs fail
        return this.getDefaultRates();
      }
    }
  }

  // Default exchange rates as fallback
  getDefaultRates() {
    return {
      AED: 1,
      USD: 0.27,
      EUR: 0.25,
      GBP: 0.22,
      INR: 22.75,
      SAR: 1.02
    };
  }
}

// Currency Provider Component
export const CurrencyProvider = ({ children }) => {
  const [state, dispatch] = useReducer(currencyReducer, initialState);
  const currencyService = new CurrencyService();

  // Load exchange rates
  const loadExchangeRates = useCallback(async (baseCurrency = 'AED') => {
    dispatch({ type: CURRENCY_ACTIONS.SET_LOADING, payload: true });
    dispatch({ type: CURRENCY_ACTIONS.CLEAR_ERROR });

    try {
      const rates = await currencyService.fetchExchangeRates(baseCurrency);
      dispatch({ type: CURRENCY_ACTIONS.SET_RATES, payload: rates });
      dispatch({ 
        type: CURRENCY_ACTIONS.SET_LAST_UPDATED, 
        payload: new Date().toISOString() 
      });
    } catch (error) {
      dispatch({ 
        type: CURRENCY_ACTIONS.SET_ERROR, 
        payload: error.message 
      });
      
      // Load default rates on error
      const defaultRates = currencyService.getDefaultRates();
      dispatch({ type: CURRENCY_ACTIONS.SET_RATES, payload: defaultRates });
    }
  }, []);

  // Change currency
  const changeCurrency = useCallback((newCurrency) => {
    dispatch({ type: CURRENCY_ACTIONS.SET_CURRENCY, payload: newCurrency });
    
    // Store in localStorage for persistence
    try {
      localStorage.setItem('selected_currency', newCurrency);
    } catch (error) {
      console.warn('Failed to save currency preference:', error);
    }
  }, []);

  // Convert price from base currency to selected currency
  const convertPrice = useCallback((price, fromCurrency = 'AED', toCurrency = null) => {
    const targetCurrency = toCurrency || state.selectedCurrency;
    
    if (!price || !state.exchangeRates) {
      return price;
    }

    // If same currency, return as is
    if (fromCurrency === targetCurrency) {
      return price;
    }

    try {
      let convertedPrice = price;

      // Convert from base currency to AED first if needed
      if (fromCurrency !== 'AED') {
        const fromRate = state.exchangeRates[fromCurrency];
        if (fromRate) {
          convertedPrice = price / fromRate;
        }
      }

      // Convert from AED to target currency
      if (targetCurrency !== 'AED') {
        const toRate = state.exchangeRates[targetCurrency];
        if (toRate) {
          convertedPrice = convertedPrice * toRate;
        }
      }

      return Math.round(convertedPrice * 100) / 100; // Round to 2 decimal places
    } catch (error) {
      console.warn('Currency conversion failed:', error);
      return price;
    }
  }, [state.exchangeRates, state.selectedCurrency]);

  // Format price with currency symbol
  const formatPrice = useCallback((price, currency = null, showCode = true) => {
    const targetCurrency = currency || state.selectedCurrency;
    
    if (!price && price !== 0) {
      return '';
    }

    const currencySymbols = {
      AED: 'د.إ',
      USD: '$',
      EUR: '€',
      GBP: '£',
      INR: '₹',
      SAR: 'ر.س'
    };

    const symbol = currencySymbols[targetCurrency] || targetCurrency;
    const formattedPrice = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(price);

    return showCode && targetCurrency !== 'USD' && targetCurrency !== 'EUR' && targetCurrency !== 'GBP'
      ? `${symbol} ${formattedPrice}`
      : `${symbol}${formattedPrice}`;
  }, [state.selectedCurrency]);

  // Get currency info
  const getCurrencyInfo = useCallback((currencyCode = null) => {
    const code = currencyCode || state.selectedCurrency;
    
    const currencyData = {
      AED: { name: 'UAE Dirham', flag: '🇦🇪', symbol: 'د.إ' },
      USD: { name: 'US Dollar', flag: '🇺🇸', symbol: '$' },
      EUR: { name: 'Euro', flag: '🇪🇺', symbol: '€' },
      GBP: { name: 'British Pound', flag: '🇬🇧', symbol: '£' },
      INR: { name: 'Indian Rupee', flag: '🇮🇳', symbol: '₹' },
      SAR: { name: 'Saudi Riyal', flag: '🇸🇦', symbol: 'ر.س' }
    };

    return currencyData[code] || { name: code, flag: '💱', symbol: code };
  }, [state.selectedCurrency]);

  // Refresh rates manually
  const refreshRates = useCallback(() => {
    // Clear cache and reload
    try {
      localStorage.removeItem('currency_rates_cache');
    } catch (error) {
      console.warn('Failed to clear currency cache:', error);
    }
    loadExchangeRates(state.baseCurrency);
  }, [loadExchangeRates, state.baseCurrency]);

  // Initialize on mount
  useEffect(() => {
    // Load saved currency preference
    try {
      const savedCurrency = localStorage.getItem('selected_currency');
      if (savedCurrency) {
        dispatch({ type: CURRENCY_ACTIONS.SET_CURRENCY, payload: savedCurrency });
      }
    } catch (error) {
      console.warn('Failed to load currency preference:', error);
    }

    // Load exchange rates
    loadExchangeRates();
  }, [loadExchangeRates]);

  // Auto-refresh rates every 30 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      loadExchangeRates(state.baseCurrency);
    }, 30 * 60 * 1000); // 30 minutes

    return () => clearInterval(interval);
  }, [loadExchangeRates, state.baseCurrency]);

  const value = {
    // State
    selectedCurrency: state.selectedCurrency,
    exchangeRates: state.exchangeRates,
    loading: state.loading,
    error: state.error,
    lastUpdated: state.lastUpdated,
    baseCurrency: state.baseCurrency,
    
    // Actions
    changeCurrency,
    convertPrice,
    formatPrice,
    getCurrencyInfo,
    refreshRates,
    loadExchangeRates
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

// Custom hook to use currency context
export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};