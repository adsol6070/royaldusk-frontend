// FlightSearch.js - Complete Flight Search Component
"use client";
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { toast } from 'react-hot-toast';

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const FlightSearchContainer = styled.div`
  .flight-search-content {
    .search-form {
      display: grid;
      grid-template-columns: 1fr;
      gap: 20px;

      .trip-type-selector {
        display: flex;
        background: #f8fafc;
        border-radius: 12px;
        padding: 4px;
        margin-bottom: 16px;

        .trip-option {
          flex: 1;
          padding: 8px 16px;
          text-align: center;
          border-radius: 8px;
          font-weight: 500;
          color: #64748b;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          background: none;
          font-size: 14px;

          &.active {
            background: #f8853d;
            color: white;
            box-shadow: 0 2px 8px rgba(248, 133, 61, 0.3);
          }

          &:hover:not(.active) {
            background: rgba(248, 133, 61, 0.1);
            color: #f8853d;
          }
        }
      }

      .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;

        @media (max-width: 768px) {
          grid-template-columns: 1fr;
        }

        &.full-width {
          grid-template-columns: 1fr;
        }

        &.three-cols {
          grid-template-columns: 1fr 1fr 1fr;
          
          @media (max-width: 768px) {
            grid-template-columns: 1fr;
          }
        }
      }

      .form-group {
        position: relative;

        .label {
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          margin-bottom: 8px;
          display: block;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;

          .icon {
            position: absolute;
            left: 12px;
            color: #64748b;
            z-index: 2;
            font-size: 16px;
          }

          input, select {
            width: 100%;
            padding: 12px 16px 12px 40px;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            font-size: 14px;
            transition: border-color 0.3s ease;
            background: white;

            &:focus {
              outline: none;
              border-color: #f8853d;
            }

            &::placeholder {
              color: #9ca3af;
            }
          }

          .swap-button {
            position: absolute;
            right: -20px;
            top: 50%;
            transform: translateY(-50%);
            width: 40px;
            height: 40px;
            background: #f8853d;
            border: none;
            border-radius: 50%;
            color: white;
            cursor: pointer;
            transition: all 0.3s ease;
            z-index: 3;
            box-shadow: 0 2px 8px rgba(248, 133, 61, 0.3);

            &:hover {
              background: #e67428;
              transform: translateY(-50%) rotate(180deg);
            }

            i {
              font-size: 14px;
            }
          }
        }

        .suggestions {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          max-height: 300px;
          overflow-y: auto;

          .suggestion-item {
            padding: 12px 16px;
            border-bottom: 1px solid #f3f4f6;
            cursor: pointer;
            transition: background 0.2s ease;

            &:hover {
              background: #f9fafb;
            }

            &:last-child {
              border-bottom: none;
            }

            .airport-code {
              font-weight: 600;
              color: #1e293b;
              font-size: 14px;
            }

            .airport-name {
              color: #64748b;
              font-size: 12px;
              margin-top: 2px;
            }

            .city-country {
              color: #9ca3af;
              font-size: 11px;
            }
          }

          .no-suggestions {
            padding: 16px;
            text-align: center;
            color: #64748b;
            font-size: 14px;
          }
        }
      }

      .passengers-class-group {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;

        @media (max-width: 768px) {
          grid-template-columns: 1fr;
        }
      }

      .passenger-selector {
        .passenger-dropdown {
          position: relative;

          .dropdown-trigger {
            width: 100%;
            padding: 12px 16px 12px 40px;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            font-size: 14px;
            background: white;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: border-color 0.3s ease;

            &:focus, &.active {
              outline: none;
              border-color: #f8853d;
            }
          }

          .dropdown-content {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            padding: 16px;

            .passenger-row {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 12px 0;
              border-bottom: 1px solid #f3f4f6;

              &:last-child {
                border-bottom: none;
              }

              .passenger-info {
                .passenger-type {
                  font-weight: 500;
                  color: #1e293b;
                  font-size: 14px;
                }

                .passenger-desc {
                  color: #64748b;
                  font-size: 12px;
                }
              }

              .passenger-controls {
                display: flex;
                align-items: center;
                gap: 12px;

                button {
                  width: 32px;
                  height: 32px;
                  border: 1px solid #e5e7eb;
                  border-radius: 6px;
                  background: white;
                  color: #64748b;
                  cursor: pointer;
                  transition: all 0.2s ease;
                  display: flex;
                  align-items: center;
                  justify-content: center;

                  &:hover:not(:disabled) {
                    border-color: #f8853d;
                    color: #f8853d;
                  }

                  &:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                  }
                }

                .count {
                  font-weight: 500;
                  color: #1e293b;
                  min-width: 20px;
                  text-align: center;
                }
              }
            }
          }
        }
      }

      .search-button {
        padding: 16px 32px;
        background: linear-gradient(135deg, #f8853d 0%, #e67428 100%);
        color: white;
        border: none;
        border-radius: 12px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        font-size: 16px;
        margin-top: 8px;

        &:hover {
          background: linear-gradient(135deg, #e67428 0%, #d65e1f 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(248, 133, 61, 0.4);
        }

        &:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        i {
          font-size: 18px;
        }
      }
    }
  }
`;

const FlightResults = styled.div`
  margin-top: 32px;
  animation: ${fadeInUp} 0.6s ease;

  .results-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding: 16px 0;
    border-bottom: 1px solid #e5e7eb;

    .results-info {
      h4 {
        font-size: 1.25rem;
        font-weight: 600;
        color: #1e293b;
        margin: 0 0 4px 0;
      }

      p {
        color: #64748b;
        margin: 0;
        font-size: 14px;
      }
    }

    .sort-filter {
      display: flex;
      gap: 12px;
      align-items: center;

      select {
        padding: 8px 12px;
        border: 1px solid #e5e7eb;
        border-radius: 6px;
        font-size: 14px;
        background: white;
        cursor: pointer;

        &:focus {
          outline: none;
          border-color: #f8853d;
        }
      }
    }
  }

  .flight-filters {
    background: white;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 24px;
    border: 1px solid #e5e7eb;

    .filter-row {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
      align-items: center;

      .filter-group {
        .filter-label {
          font-size: 12px;
          font-weight: 500;
          color: #64748b;
          margin-bottom: 8px;
          display: block;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .price-range {
          display: flex;
          align-items: center;
          gap: 8px;

          input[type="range"] {
            width: 120px;
          }

          .price-display {
            font-size: 14px;
            font-weight: 500;
            color: #f8853d;
            min-width: 80px;
          }
        }

        .airline-checkboxes {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;

          label {
            display: flex;
            align-items: center;
            gap: 6px;
            cursor: pointer;
            font-size: 14px;
            color: #374151;

            input[type="checkbox"] {
              margin: 0;
            }
          }
        }

        .stops-filter {
          display: flex;
          gap: 8px;

          .stop-option {
            padding: 6px 12px;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s ease;
            background: white;

            &.active {
              background: #f8853d;
              color: white;
              border-color: #f8853d;
            }

            &:hover:not(.active) {
              border-color: #f8853d;
              color: #f8853d;
            }
          }
        }
      }
    }
  }

  .flight-card {
    background: white;
    border-radius: 16px;
    border: 1px solid #e5e7eb;
    margin-bottom: 16px;
    overflow: hidden;
    transition: all 0.3s ease;

    &:hover {
      border-color: #f8853d;
      box-shadow: 0 8px 32px rgba(248, 133, 61, 0.12);
      transform: translateY(-2px);
    }

    .flight-header {
      padding: 20px 24px 16px;
      border-bottom: 1px solid #f3f4f6;

      .airline-info {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 16px;

        .airline-logo {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          background: #f8fafc;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          color: #64748b;
          font-size: 14px;
        }

        .airline-details {
          .airline-name {
            font-weight: 600;
            color: #1e293b;
            font-size: 16px;
            margin-bottom: 2px;
          }

          .flight-number {
            color: #64748b;
            font-size: 12px;
          }
        }

        .price-badge {
          margin-left: auto;
          text-align: right;

          .price {
            font-size: 24px;
            font-weight: 700;
            color: #f8853d;
            line-height: 1;
          }

          .per-person {
            font-size: 12px;
            color: #64748b;
          }
        }
      }

      .flight-route {
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        gap: 16px;
        align-items: center;

        .route-point {
          &.departure {
            text-align: left;
          }

          &.arrival {
            text-align: right;
          }

          .time {
            font-size: 20px;
            font-weight: 600;
            color: #1e293b;
            line-height: 1;
          }

          .airport {
            font-size: 14px;
            color: #64748b;
            margin-top: 4px;
          }

          .date {
            font-size: 12px;
            color: #9ca3af;
            margin-top: 2px;
          }
        }

        .route-middle {
          text-align: center;
          position: relative;

          .duration {
            font-size: 12px;
            color: #64748b;
            background: white;
            padding: 4px 8px;
            position: relative;
            z-index: 2;
          }

          .route-line {
            position: absolute;
            top: 50%;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(90deg, #f8853d, #e67428);
            transform: translateY(-50%);

            &::before, &::after {
              content: '';
              position: absolute;
              top: 50%;
              width: 8px;
              height: 8px;
              background: #f8853d;
              border-radius: 50%;
              transform: translateY(-50%);
            }

            &::before {
              left: 0;
            }

            &::after {
              right: 0;
            }
          }

          .stops-info {
            font-size: 11px;
            color: #f8853d;
            margin-top: 4px;
            font-weight: 500;
          }
        }
      }
    }

    .flight-footer {
      padding: 16px 24px;
      background: #f8fafc;

      .flight-details {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .details-left {
          display: flex;
          gap: 20px;
          align-items: center;

          .detail-item {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 12px;
            color: #64748b;

            i {
              color: #f8853d;
            }

            &.baggage {
              color: #059669;
            }

            &.refundable {
              color: #dc2626;
            }
          }
        }

        .details-right {
          display: flex;
          gap: 12px;
          align-items: center;

          .view-details {
            padding: 8px 16px;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            background: white;
            color: #64748b;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s ease;

            &:hover {
              border-color: #f8853d;
              color: #f8853d;
            }
          }

          .book-flight {
            padding: 12px 24px;
            background: #f8853d;
            color: white;
            border: none;
            border-radius: 8px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 14px;

            &:hover {
              background: #e67428;
              transform: translateY(-1px);
              box-shadow: 0 4px 12px rgba(248, 133, 61, 0.3);
            }
          }
        }
      }
    }
  }

  .loading-state {
    text-align: center;
    padding: 40px 20px;

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f4f6;
      border-top: 4px solid #f8853d;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 16px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    p {
      color: #64748b;
      margin: 0;
    }
  }

  .no-results {
    text-align: center;
    padding: 60px 20px;

    i {
      font-size: 4rem;
      color: #d1d5db;
      margin-bottom: 16px;
    }

    h4 {
      color: #374151;
      margin-bottom: 8px;
    }

    p {
      color: #64748b;
      margin: 0;
    }
  }
`;

// Sample airport data (replace with actual API data)
const sampleAirports = [
  { code: 'DEL', name: 'Indira Gandhi International Airport', city: 'New Delhi', country: 'India' },
  { code: 'BOM', name: 'Chhatrapati Shivaji International Airport', city: 'Mumbai', country: 'India' },
  { code: 'BLR', name: 'Kempegowda International Airport', city: 'Bangalore', country: 'India' },
  { code: 'MAA', name: 'Chennai International Airport', city: 'Chennai', country: 'India' },
  { code: 'CCU', name: 'Netaji Subhas Chandra Bose International Airport', city: 'Kolkata', country: 'India' },
  { code: 'HYD', name: 'Rajiv Gandhi International Airport', city: 'Hyderabad', country: 'India' },
  { code: 'AMD', name: 'Sardar Vallabhbhai Patel International Airport', city: 'Ahmedabad', country: 'India' },
  { code: 'PNQ', name: 'Pune Airport', city: 'Pune', country: 'India' },
  { code: 'GOI', name: 'Goa International Airport', city: 'Goa', country: 'India' },
  { code: 'JAI', name: 'Jaipur International Airport', city: 'Jaipur', country: 'India' },
  { code: 'DXB', name: 'Dubai International Airport', city: 'Dubai', country: 'UAE' },
  { code: 'AUH', name: 'Abu Dhabi International Airport', city: 'Abu Dhabi', country: 'UAE' },
  { code: 'DOH', name: 'Hamad International Airport', city: 'Doha', country: 'Qatar' },
  { code: 'KWI', name: 'Kuwait International Airport', city: 'Kuwait City', country: 'Kuwait' },
  { code: 'SIN', name: 'Singapore Changi Airport', city: 'Singapore', country: 'Singapore' },
  { code: 'KUL', name: 'Kuala Lumpur International Airport', city: 'Kuala Lumpur', country: 'Malaysia' },
  { code: 'BKK', name: 'Suvarnabhumi Airport', city: 'Bangkok', country: 'Thailand' },
  { code: 'HKG', name: 'Hong Kong International Airport', city: 'Hong Kong', country: 'Hong Kong' },
  { code: 'LHR', name: 'London Heathrow Airport', city: 'London', country: 'United Kingdom' },
  { code: 'CDG', name: 'Charles de Gaulle Airport', city: 'Paris', country: 'France' },
  { code: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany' },
  { code: 'AMS', name: 'Amsterdam Airport Schiphol', city: 'Amsterdam', country: 'Netherlands' },
  { code: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York', country: 'United States' },
  { code: 'LAX', name: 'Los Angeles International Airport', city: 'Los Angeles', country: 'United States' },
  { code: 'SFO', name: 'San Francisco International Airport', city: 'San Francisco', country: 'United States' },
  { code: 'YYZ', name: 'Toronto Pearson International Airport', city: 'Toronto', country: 'Canada' },
  { code: 'SYD', name: 'Sydney Kingsford Smith Airport', city: 'Sydney', country: 'Australia' },
  { code: 'MEL', name: 'Melbourne Airport', city: 'Melbourne', country: 'Australia' },
  { code: 'NRT', name: 'Narita International Airport', city: 'Tokyo', country: 'Japan' },
  { code: 'ICN', name: 'Incheon International Airport', city: 'Seoul', country: 'South Korea' }
];

// Sample flight data (replace with actual API data)
const sampleFlights = [
  {
    id: 1,
    airline: 'Emirates',
    flightNumber: 'EK 512',
    departure: { time: '14:30', airport: 'DEL', date: '2025-07-15' },
    arrival: { time: '17:45', airport: 'DXB', date: '2025-07-15' },
    duration: '3h 15m',
    stops: 0,
    price: 45000,
    currency: 'INR',
    class: 'Economy',
    baggage: '30kg',
    refundable: false
  },
  {
    id: 2,
    airline: 'Air India',
    flightNumber: 'AI 131',
    departure: { time: '09:15', airport: 'DEL', date: '2025-07-15' },
    arrival: { time: '12:30', airport: 'DXB', date: '2025-07-15' },
    duration: '3h 15m',
    stops: 0,
    price: 38000,
    currency: 'INR',
    class: 'Economy',
    baggage: '25kg',
    refundable: true
  },
  {
    id: 3,
    airline: 'IndiGo',
    flightNumber: '6E 1406',
    departure: { time: '06:45', airport: 'DEL', date: '2025-07-15' },
    arrival: { time: '14:20', airport: 'DXB', date: '2025-07-15' },
    duration: '6h 35m',
    stops: 1,
    price: 32000,
    currency: 'INR',
    class: 'Economy',
    baggage: '15kg',
    refundable: false
  }
];

const FlightSearch = ({ onClose }) => {
  const [tripType, setTripType] = useState('round-trip');
  const [searchData, setSearchData] = useState({
    from: '',
    to: '',
    departDate: '',
    returnDate: '',
    passengers: {
      adults: 1,
      children: 0,
      infants: 0
    },
    class: 'economy'
  });
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: [0, 100000],
    stops: 'all',
    airlines: [],
    sortBy: 'price'
  });

  const fromInputRef = useRef(null);
  const toInputRef = useRef(null);
  const passengerDropdownRef = useRef(null);

  // Handle airport search
  const searchAirports = (query, type) => {
    if (query.length < 2) {
      if (type === 'from') {
        setFromSuggestions([]);
        setShowFromSuggestions(false);
      } else {
        setToSuggestions([]);
        setShowToSuggestions(false);
      }
      return;
    }

    const filtered = sampleAirports.filter(airport =>
      airport.code.toLowerCase().includes(query.toLowerCase()) ||
      airport.name.toLowerCase().includes(query.toLowerCase()) ||
      airport.city.toLowerCase().includes(query.toLowerCase()) ||
      airport.country.toLowerCase().includes(query.toLowerCase())
    );

    if (type === 'from') {
      setFromSuggestions(filtered);
      setShowFromSuggestions(true);
    } else {
      setToSuggestions(filtered);
      setShowToSuggestions(true);
    }
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setSearchData(prev => ({
      ...prev,
      [field]: value
    }));

    if (field === 'from') {
      searchAirports(value, 'from');
    } else if (field === 'to') {
      searchAirports(value, 'to');
    }
  };

  // Handle airport selection
  const selectAirport = (airport, type) => {
    const airportString = `${airport.code} - ${airport.city}`;
    setSearchData(prev => ({
      ...prev,
      [type]: airportString
    }));
    
    if (type === 'from') {
      setShowFromSuggestions(false);
      setFromSuggestions([]);
    } else {
      setShowToSuggestions(false);
      setToSuggestions([]);
    }
  };

  // Swap airports
  const swapAirports = () => {
    setSearchData(prev => ({
      ...prev,
      from: prev.to,
      to: prev.from
    }));
  };

  // Handle passenger count changes
  const updatePassengerCount = (type, increment) => {
    setSearchData(prev => ({
      ...prev,
      passengers: {
        ...prev.passengers,
        [type]: Math.max(0, prev.passengers[type] + (increment ? 1 : -1))
      }
    }));
  };

  // Get passenger display text
  const getPassengerText = () => {
    const { adults, children, infants } = searchData.passengers;
    const total = adults + children + infants;
    return `${total} Passenger${total !== 1 ? 's' : ''}, ${searchData.class}`;
  };

  // Handle flight search
  const handleFlightSearch = async () => {
    if (!searchData.from || !searchData.to || !searchData.departDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSearching(true);
    setHasSearched(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, use sample data
      setSearchResults(sampleFlights);
      toast.success(`Found ${sampleFlights.length} flights`);
    } catch (error) {
      console.error('Flight search error:', error);
      toast.error('Failed to search flights. Please try again.');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle flight booking
  const handleFlightBooking = (flight) => {
    toast.success('Redirecting to flight booking...');
    // Here you would integrate with your booking system
    console.log('Booking flight:', flight);
  };

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (fromInputRef.current && !fromInputRef.current.contains(event.target)) {
        setShowFromSuggestions(false);
      }
      if (toInputRef.current && !toInputRef.current.contains(event.target)) {
        setShowToSuggestions(false);
      }
      if (passengerDropdownRef.current && !passengerDropdownRef.current.contains(event.target)) {
        setShowPassengerDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter and sort flights
  const getFilteredFlights = () => {
    let filtered = searchResults.filter(flight => {
      // Price filter
      if (flight.price < filters.priceRange[0] || flight.price > filters.priceRange[1]) {
        return false;
      }
      
      // Stops filter
      if (filters.stops !== 'all') {
        if (filters.stops === 'nonstop' && flight.stops > 0) return false;
        if (filters.stops === '1stop' && flight.stops !== 1) return false;
        if (filters.stops === '2+stops' && flight.stops < 2) return false;
      }
      
      // Airlines filter
      if (filters.airlines.length > 0 && !filters.airlines.includes(flight.airline)) {
        return false;
      }
      
      return true;
    });

    // Sort flights
    switch (filters.sortBy) {
      case 'price':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'duration':
        filtered.sort((a, b) => a.duration.localeCompare(b.duration));
        break;
      case 'departure':
        filtered.sort((a, b) => a.departure.time.localeCompare(b.departure.time));
        break;
      case 'arrival':
        filtered.sort((a, b) => a.arrival.time.localeCompare(b.arrival.time));
        break;
      default:
        break;
    }

    return filtered;
  };

  return (
    <FlightSearchContainer>
      <div className="flight-search-content">
        <div className="search-form">
          {/* Trip Type Selector */}
          <div className="trip-type-selector">
            <button
              className={`trip-option ${tripType === 'round-trip' ? 'active' : ''}`}
              onClick={() => setTripType('round-trip')}
            >
              <i className="fal fa-exchange-alt" />
              Round Trip
            </button>
            <button
              className={`trip-option ${tripType === 'one-way' ? 'active' : ''}`}
              onClick={() => setTripType('one-way')}
            >
              <i className="fal fa-arrow-right" />
              One Way
            </button>
            <button
              className={`trip-option ${tripType === 'multi-city' ? 'active' : ''}`}
              onClick={() => setTripType('multi-city')}
            >
              <i className="fal fa-map-marked" />
              Multi City
            </button>
          </div>

          {/* From and To Airports */}
          <div className="form-row">
            <div className="form-group" ref={fromInputRef}>
              <label className="label">From</label>
              <div className="input-wrapper">
                <i className="icon fal fa-plane-departure" />
                <input
                  type="text"
                  placeholder="Departure city or airport"
                  value={searchData.from}
                  onChange={(e) => handleInputChange('from', e.target.value)}
                  onFocus={() => searchAirports(searchData.from, 'from')}
                />
                {showFromSuggestions && (
                  <div className="suggestions">
                    {fromSuggestions.length > 0 ? (
                      fromSuggestions.map((airport) => (
                        <div
                          key={airport.code}
                          className="suggestion-item"
                          onClick={() => selectAirport(airport, 'from')}
                        >
                          <div className="airport-code">{airport.code}</div>
                          <div className="airport-name">{airport.name}</div>
                          <div className="city-country">{airport.city}, {airport.country}</div>
                        </div>
                      ))
                    ) : (
                      <div className="no-suggestions">No airports found</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="form-group" ref={toInputRef}>
              <label className="label">To</label>
              <div className="input-wrapper">
                <i className="icon fal fa-plane-arrival" />
                <input
                  type="text"
                  placeholder="Arrival city or airport"
                  value={searchData.to}
                  onChange={(e) => handleInputChange('to', e.target.value)}
                  onFocus={() => searchAirports(searchData.to, 'to')}
                />
                <button className="swap-button" onClick={swapAirports}>
                  <i className="fal fa-exchange-alt" />
                </button>
                {showToSuggestions && (
                  <div className="suggestions">
                    {toSuggestions.length > 0 ? (
                      toSuggestions.map((airport) => (
                        <div
                          key={airport.code}
                          className="suggestion-item"
                          onClick={() => selectAirport(airport, 'to')}
                        >
                          <div className="airport-code">{airport.code}</div>
                          <div className="airport-name">{airport.name}</div>
                          <div className="city-country">{airport.city}, {airport.country}</div>
                        </div>
                      ))
                    ) : (
                      <div className="no-suggestions">No airports found</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="form-row">
            <div className="form-group">
              <label className="label">Departure Date</label>
              <div className="input-wrapper">
                <i className="icon fal fa-calendar-alt" />
                <input
                  type="date"
                  value={searchData.departDate}
                  onChange={(e) => handleInputChange('departDate', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            {tripType === 'round-trip' && (
              <div className="form-group">
                <label className="label">Return Date</label>
                <div className="input-wrapper">
                  <i className="icon fal fa-calendar-alt" />
                  <input
                    type="date"
                    value={searchData.returnDate}
                    onChange={(e) => handleInputChange('returnDate', e.target.value)}
                    min={searchData.departDate || new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Passengers and Class */}
          <div className="passengers-class-group">
            <div className="form-group passenger-selector" ref={passengerDropdownRef}>
              <label className="label">Passengers & Class</label>
              <div className="passenger-dropdown">
                <div
                  className={`dropdown-trigger ${showPassengerDropdown ? 'active' : ''}`}
                  onClick={() => setShowPassengerDropdown(!showPassengerDropdown)}
                >
                  <span>
                    <i className="fal fa-users" style={{ marginRight: '8px' }} />
                    {getPassengerText()}
                  </span>
                  <i className={`fal fa-chevron-${showPassengerDropdown ? 'up' : 'down'}`} />
                </div>

                {showPassengerDropdown && (
                  <div className="dropdown-content">
                    <div className="passenger-row">
                      <div className="passenger-info">
                        <div className="passenger-type">Adults</div>
                        <div className="passenger-desc">12+ years</div>
                      </div>
                      <div className="passenger-controls">
                        <button
                          onClick={() => updatePassengerCount('adults', false)}
                          disabled={searchData.passengers.adults <= 1}
                        >
                          <i className="fal fa-minus" />
                        </button>
                        <span className="count">{searchData.passengers.adults}</span>
                        <button onClick={() => updatePassengerCount('adults', true)}>
                          <i className="fal fa-plus" />
                        </button>
                      </div>
                    </div>

                    <div className="passenger-row">
                      <div className="passenger-info">
                        <div className="passenger-type">Children</div>
                        <div className="passenger-desc">2-11 years</div>
                      </div>
                      <div className="passenger-controls">
                        <button
                          onClick={() => updatePassengerCount('children', false)}
                          disabled={searchData.passengers.children <= 0}
                        >
                          <i className="fal fa-minus" />
                        </button>
                        <span className="count">{searchData.passengers.children}</span>
                        <button onClick={() => updatePassengerCount('children', true)}>
                          <i className="fal fa-plus" />
                        </button>
                      </div>
                    </div>

                    <div className="passenger-row">
                      <div className="passenger-info">
                        <div className="passenger-type">Infants</div>
                        <div className="passenger-desc">Under 2 years</div>
                      </div>
                      <div className="passenger-controls">
                        <button
                          onClick={() => updatePassengerCount('infants', false)}
                          disabled={searchData.passengers.infants <= 0}
                        >
                          <i className="fal fa-minus" />
                        </button>
                        <span className="count">{searchData.passengers.infants}</span>
                        <button onClick={() => updatePassengerCount('infants', true)}>
                          <i className="fal fa-plus" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="label">Class</label>
              <div className="input-wrapper">
                <i className="icon fal fa-couch" />
                <select
                  value={searchData.class}
                  onChange={(e) => handleInputChange('class', e.target.value)}
                >
                  <option value="economy">Economy</option>
                  <option value="premium-economy">Premium Economy</option>
                  <option value="business">Business</option>
                  <option value="first">First Class</option>
                </select>
              </div>
            </div>
          </div>

          {/* Search Button */}
          <button
            className="search-button"
            onClick={handleFlightSearch}
            disabled={isSearching}
          >
            {isSearching ? (
              <>
                <div className="spinner" style={{ width: '18px', height: '18px', border: '2px solid transparent', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                Searching Flights...
              </>
            ) : (
              <>
                <i className="fal fa-search" />
                Search Flights
              </>
            )}
          </button>
        </div>
      </div>

      {/* Flight Results */}
      {hasSearched && (
        <FlightResults>
          {isSearching ? (
            <div className="loading-state">
              <div className="spinner" />
              <p>Searching for the best flight deals...</p>
            </div>
          ) : searchResults.length > 0 ? (
            <>
              {/* Results Header */}
              <div className="results-header">
                <div className="results-info">
                  <h4>{getFilteredFlights().length} flights found</h4>
                  <p>
                    {searchData.from.split(' - ')[0]} → {searchData.to.split(' - ')[0]} • {searchData.departDate}
                    {tripType === 'round-trip' && searchData.returnDate && ` → ${searchData.returnDate}`}
                  </p>
                </div>
                <div className="sort-filter">
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                  >
                    <option value="price">Sort by Price</option>
                    <option value="duration">Sort by Duration</option>
                    <option value="departure">Sort by Departure</option>
                    <option value="arrival">Sort by Arrival</option>
                  </select>
                </div>
              </div>

              {/* Filters */}
              <div className="flight-filters">
                <div className="filter-row">
                  <div className="filter-group">
                    <label className="filter-label">Price Range</label>
                    <div className="price-range">
                      <input
                        type="range"
                        min="0"
                        max="100000"
                        step="1000"
                        value={filters.priceRange[1]}
                        onChange={(e) => setFilters(prev => ({
                          ...prev,
                          priceRange: [0, parseInt(e.target.value)]
                        }))}
                      />
                      <span className="price-display">
                        ₹{filters.priceRange[1].toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="filter-group">
                    <label className="filter-label">Stops</label>
                    <div className="stops-filter">
                      <button
                        className={`stop-option ${filters.stops === 'all' ? 'active' : ''}`}
                        onClick={() => setFilters(prev => ({ ...prev, stops: 'all' }))}
                      >
                        All
                      </button>
                      <button
                        className={`stop-option ${filters.stops === 'nonstop' ? 'active' : ''}`}
                        onClick={() => setFilters(prev => ({ ...prev, stops: 'nonstop' }))}
                      >
                        Non-stop
                      </button>
                      <button
                        className={`stop-option ${filters.stops === '1stop' ? 'active' : ''}`}
                        onClick={() => setFilters(prev => ({ ...prev, stops: '1stop' }))}
                      >
                        1 Stop
                      </button>
                      <button
                        className={`stop-option ${filters.stops === '2+stops' ? 'active' : ''}`}
                        onClick={() => setFilters(prev => ({ ...prev, stops: '2+stops' }))}
                      >
                        2+ Stops
                      </button>
                    </div>
                  </div>

                  <div className="filter-group">
                    <label className="filter-label">Airlines</label>
                    <div className="airline-checkboxes">
                      {[...new Set(searchResults.map(f => f.airline))].map(airline => (
                        <label key={airline}>
                          <input
                            type="checkbox"
                            checked={filters.airlines.includes(airline)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFilters(prev => ({
                                  ...prev,
                                  airlines: [...prev.airlines, airline]
                                }));
                              } else {
                                setFilters(prev => ({
                                  ...prev,
                                  airlines: prev.airlines.filter(a => a !== airline)
                                }));
                              }
                            }}
                          />
                          {airline}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Flight Cards */}
              {getFilteredFlights().length > 0 ? (
                getFilteredFlights().map((flight) => (
                  <div key={flight.id} className="flight-card">
                    <div className="flight-header">
                      <div className="airline-info">
                        <div className="airline-logo">
                          {flight.airline.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="airline-details">
                          <div className="airline-name">{flight.airline}</div>
                          <div className="flight-number">{flight.flightNumber}</div>
                        </div>
                        <div className="price-badge">
                          <div className="price">₹{flight.price.toLocaleString()}</div>
                          <div className="per-person">per person</div>
                        </div>
                      </div>

                      <div className="flight-route">
                        <div className="route-point departure">
                          <div className="time">{flight.departure.time}</div>
                          <div className="airport">{flight.departure.airport}</div>
                          <div className="date">{new Date(flight.departure.date).toLocaleDateString()}</div>
                        </div>

                        <div className="route-middle">
                          <div className="duration">{flight.duration}</div>
                          <div className="route-line" />
                          <div className="stops-info">
                            {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                          </div>
                        </div>

                        <div className="route-point arrival">
                          <div className="time">{flight.arrival.time}</div>
                          <div className="airport">{flight.arrival.airport}</div>
                          <div className="date">{new Date(flight.arrival.date).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flight-footer">
                      <div className="flight-details">
                        <div className="details-left">
                          <div className="detail-item baggage">
                            <i className="fal fa-suitcase" />
                            {flight.baggage} included
                          </div>
                          <div className={`detail-item ${flight.refundable ? 'baggage' : 'refundable'}`}>
                            <i className={`fal fa-${flight.refundable ? 'check-circle' : 'times-circle'}`} />
                            {flight.refundable ? 'Refundable' : 'Non-refundable'}
                          </div>
                          <div className="detail-item">
                            <i className="fal fa-couch" />
                            {flight.class}
                          </div>
                        </div>

                        <div className="details-right">
                          <button className="view-details">
                            View Details
                          </button>
                          <button
                            className="book-flight"
                            onClick={() => handleFlightBooking(flight)}
                          >
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-results">
                  <i className="fal fa-plane-slash" />
                  <h4>No flights match your filters</h4>
                  <p>Try adjusting your filters to see more results</p>
                </div>
              )}
            </>
          ) : (
            <div className="no-results">
              <i className="fal fa-plane-slash" />
              <h4>No flights found</h4>
              <p>Try different airports or dates to find available flights</p>
            </div>
          )}
        </FlightResults>
      )}
    </FlightSearchContainer>
  );
};

export default FlightSearch;