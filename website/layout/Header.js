"use client";
import useClickOutside from "@/utility/useClickOutside";
import Link from "next/link";
import { Fragment, useState, useEffect } from "react";
import { useAuth } from "@/common/context/AuthContext";
import { useCurrency } from "@/common/context/CurrencyContext";
import styled from "styled-components";

const PlatformHeader = styled.header`
  background: #ffffff;
  border-bottom: 1px solid #fed7aa;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 1px 3px rgba(248, 133, 61, 0.08);
`;

const HeaderContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;

  .logo {
    img {
      height: 40px;
      width: auto;
    }
  }
`;

const NavSection = styled.nav`
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 1024px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  padding: 8px 16px;
  color: #64748b;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    color: #f8853d;
    background: #fef7f0;
    text-decoration: none;
  }

  &.active {
    color: #f8853d;
    background: #fef7f0;
  }
`;

const ActionsSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 1024px) {
    gap: 8px;

    /* Hide desktop actions on mobile except mobile menu button */
    > *:not(:last-child) {
      display: none;
    }
  }
`;

const AuthSection = styled.div`
  position: relative;
`;

const LoginButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #f8853d;
  color: white;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: #e67428;
    color: white;
    text-decoration: none;
    transform: translateY(-1px);
  }

  i {
    font-size: 14px;
  }
`;

const UserButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #fef7f0;
  border: 1px solid #fed7aa;
  color: #334155;
  font-size: 14px;
  font-weight: 500;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 100px;
  justify-content: space-between;

  &:hover {
    background: #f8853d;
    border-color: #f8853d;
    color: white;
  }

  .user-avatar {
    width: 24px;
    height: 24px;
    background: #f8853d;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 600;
  }

  .chevron {
    color: #94a3b8;
    font-size: 12px;
  }

  &:hover .chevron {
    color: white;
  }
`;

const UserDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: white;
  border: 1px solid #fed7aa;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(248, 133, 61, 0.15);
  min-width: 200px;
  overflow: hidden;
  z-index: 1000;
`;

const DropdownItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: #374151;
  text-decoration: none;
  font-size: 14px;
  transition: background 0.2s ease;

  &:hover {
    background: #fef7f0;
    text-decoration: none;
    color: #f8853d;
  }

  i {
    width: 16px;
    color: #9ca3af;
  }

  &:hover i {
    color: #f8853d;
  }
`;

const DropdownButton = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  width: 100%;
  background: none;
  border: none;
  color: #dc2626;
  text-decoration: none;
  font-size: 14px;
  text-align: left;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #fef2f2;
  }

  i {
    width: 16px;
    color: #dc2626;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: #fef7f0;
  border: 1px solid #fed7aa;
  border-radius: 6px;
  color: #f8853d;
  cursor: pointer;

  @media (max-width: 1024px) {
    display: flex;
  }

  &:hover {
    background: #f8853d;
    border-color: #f8853d;
    color: white;
  }

  .menu-icon {
    display: flex;
    flex-direction: column;
    gap: 3px;

    span {
      width: 16px;
      height: 2px;
      background: currentColor;
      border-radius: 1px;
    }
  }
`;

const MobileMenu = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 320px;
  height: 100vh;
  background: white;
  border-left: 1px solid #fed7aa;
  box-shadow: -10px 0 25px rgba(248, 133, 61, 0.15);
  transform: translateX(${(props) => (props.isOpen ? "0" : "100%")});
  transition: transform 0.3s ease;
  z-index: 1001;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const MobileMenuHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid #fed7aa;

  .logo img {
    height: 32px;
  }
`;

const CloseButton = styled.button`
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #fef7f0;
    color: #f8853d;
  }
`;

const MobileNavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;
`;

const MobileNavItem = styled.li`
  border-bottom: 1px solid #fef7f0;
`;

const MobileNavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  color: #374151;
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;

  &:hover {
    background: #fef7f0;
    text-decoration: none;
    color: #f8853d;
  }

  i {
    width: 20px;
    color: #9ca3af;
  }

  &:hover i {
    color: #f8853d;
  }
`;

const MobileActions = styled.div`
  padding: 20px;
  border-top: 1px solid #fed7aa;
  margin-top: auto;
`;

const MobileCurrencySection = styled.div`
  padding: 20px;
  border-bottom: 1px solid #fef7f0;
`;

const MobileCurrencyHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  color: #374151;
  font-size: 15px;
  font-weight: 500;
`;

const MobileAuthSection = styled.div`
  padding: 20px;
  border-bottom: 1px solid #fef7f0;
`;

const MobileAuthButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const MobileButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  background: ${(props) => (props.primary ? "#f8853d" : "transparent")};
  color: ${(props) => (props.primary ? "white" : "#f8853d")};
  border: 1px solid ${(props) => (props.primary ? "#f8853d" : "#fed7aa")};
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  border-radius: 6px;
  transition: all 0.2s ease;
  text-align: center;

  &:hover {
    background: ${(props) => (props.primary ? "#e67428" : "#fef7f0")};
    color: ${(props) => (props.primary ? "white" : "#e67428")};
    border-color: #f8853d;
    text-decoration: none;
  }

  i {
    font-size: 14px;
  }
`;

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: ${(props) => (props.isOpen ? "block" : "none")};
`;

// Enhanced Currency Selector with API-based currencies
const CurrencySelector = styled.div`
  position: relative;
`;

const CurrencyButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: #fef7f0;
  border: 1px solid #fed7aa;
  color: #f8853d;
  font-size: 13px;
  font-weight: 500;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 80px;
  justify-content: center;
  position: relative;

  &:hover {
    background: #f8853d;
    border-color: #f8853d;
    color: white;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .chevron {
    color: #94a3b8;
    font-size: 10px;
  }

  &:hover .chevron {
    color: white;
  }

  .loading-spinner {
    width: 12px;
    height: 12px;
    border: 2px solid #fed7aa;
    border-top: 2px solid #f8853d;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const CurrencyDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: white;
  border: 1px solid #fed7aa;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(248, 133, 61, 0.15);
  width: 480px;
  max-height: 70vh;
  overflow: hidden;
  z-index: 1000;

  @media (max-width: 768px) {
    width: 320px;
    right: -20px;
  }
`;

const CurrencyDropdownHeader = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #fef7f0;
  background: #fef7f0;

  .title {
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 4px;
  }

  .subtitle {
    font-size: 12px;
    color: #64748b;
  }
`;

const SearchBox = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #fef7f0;

  input {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #fed7aa;
    border-radius: 6px;
    font-size: 14px;
    outline: none;

    &:focus {
      border-color: #f8853d;
      box-shadow: 0 0 0 2px rgba(248, 133, 61, 0.1);
    }

    &::placeholder {
      color: #94a3b8;
    }
  }
`;

const CurrencyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: #fef7f0;
  max-height: 400px;
  overflow-y: auto;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const CurrencyOption = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px 8px;
  background: white;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    background: #fef7f0;
  }

  &.active {
    background: #f8853d;
    color: white;

    .currency-code {
      color: white;
    }

    .currency-name {
      color: rgba(255, 255, 255, 0.9);
    }

    .exchange-rate {
      color: rgba(255, 255, 255, 0.7);
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .currency-code {
    font-size: 13px;
    font-weight: 600;
    color: #1e293b;
  }

  .currency-name {
    font-size: 10px;
    color: #64748b;
    text-align: center;
    line-height: 1.2;
  }

  .exchange-rate {
    font-size: 9px;
    color: #94a3b8;
    text-align: center;
  }
`;

const ErrorMessage = styled.div`
  padding: 12px 20px;
  background: #fef2f2;
  color: #dc2626;
  font-size: 13px;
  border-bottom: 1px solid #fed7aa;
  display: flex;
  align-items: center;
  gap: 8px;

  .retry-btn {
    background: none;
    border: none;
    color: #dc2626;
    cursor: pointer;
    text-decoration: underline;
    font-size: 13px;

    &:hover {
      color: #b91c1c;
    }
  }
`;

const LastUpdated = styled.div`
  padding: 8px 20px;
  font-size: 11px;
  color: #94a3b8;
  text-align: center;
  border-top: 1px solid #fef7f0;
  background: #fafafa;
`;

const LoadingState = styled.div`
  padding: 40px 20px;
  text-align: center;
  color: #64748b;
  
  .loading-spinner {
    width: 24px;
    height: 24px;
    border: 2px solid #fed7aa;
    border-top: 2px solid #f8853d;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 12px;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const Menu = () => {
  return (
    <NavSection>
      <NavLink href="/">Home</NavLink>
      <NavLink href="/holidays">Packages</NavLink>
      <NavLink href="/tours">Tours</NavLink>
      <NavLink href="/about">About</NavLink>
      <NavLink href="/blog">Blog</NavLink>
      <NavLink href="/contact">Contact</NavLink>
    </NavSection>
  );
};

// Currency name mapping for better display names
const getCurrencyDisplayName = (code) => {
  const currencyNames = {
    AED: "UAE Dirham",
    USD: "US Dollar",
    EUR: "Euro",
    GBP: "British Pound",
    INR: "Indian Rupee",
    SAR: "Saudi Riyal",
    JPY: "Japanese Yen",
    CNY: "Chinese Yuan",
    CAD: "Canadian Dollar",
    AUD: "Australian Dollar",
    CHF: "Swiss Franc",
    SEK: "Swedish Krona",
    NOK: "Norwegian Krone",
    DKK: "Danish Krone",
    PLN: "Polish Zloty",
    CZK: "Czech Koruna",
    HUF: "Hungarian Forint",
    RON: "Romanian Leu",
    BGN: "Bulgarian Lev",
    HRK: "Croatian Kuna",
    RUB: "Russian Ruble",
    TRY: "Turkish Lira",
    ZAR: "South African Rand",
    BRL: "Brazilian Real",
    MXN: "Mexican Peso",
    ARS: "Argentine Peso",
    CLP: "Chilean Peso",
    COP: "Colombian Peso",
    PEN: "Peruvian Sol",
    KRW: "South Korean Won",
    SGD: "Singapore Dollar",
    HKD: "Hong Kong Dollar",
    TWD: "Taiwan Dollar",
    THB: "Thai Baht",
    MYR: "Malaysian Ringgit",
    IDR: "Indonesian Rupiah",
    PHP: "Philippine Peso",
    VND: "Vietnamese Dong",
    PKR: "Pakistani Rupee",
    LKR: "Sri Lankan Rupee",
    BDT: "Bangladeshi Taka",
    NPR: "Nepalese Rupee",
    EGP: "Egyptian Pound",
    MAD: "Moroccan Dirham",
    TND: "Tunisian Dinar",
    JOD: "Jordanian Dinar",
    KWD: "Kuwaiti Dinar",
    BHD: "Bahraini Dinar",
    QAR: "Qatari Riyal",
    OMR: "Omani Rial",
    ILS: "Israeli Shekel",
    LBP: "Lebanese Pound",
    NGN: "Nigerian Naira",
    GHS: "Ghanaian Cedi",
    KES: "Kenyan Shilling",
    UGX: "Ugandan Shilling",
    ETB: "Ethiopian Birr",
    XOF: "West African Franc",
    XAF: "Central African Franc",
    NZD: "New Zealand Dollar",
    FJD: "Fijian Dollar",
    TOP: "Tongan Paʻanga",
    WST: "Samoan Tala",
    VUV: "Vanuatu Vatu",
    SBD: "Solomon Islands Dollar",
    PGK: "Papua New Guinea Kina",
    NCL: "New Caledonian Franc",
    XPF: "CFP Franc",
    IRR: "Iranian Rial",
    IQD: "Iraqi Dinar",
    AFN: "Afghan Afghani",
    ALL: "Albanian Lek",
    AMD: "Armenian Dram",
    AZN: "Azerbaijani Manat",
    BAM: "Bosnia-Herzegovina Mark",
    BYN: "Belarusian Ruble",
    GEL: "Georgian Lari",
    KZT: "Kazakhstani Tenge",
    KGS: "Kyrgystani Som",
    MKD: "Macedonian Denar",
    MDL: "Moldovan Leu",
    RSD: "Serbian Dinar",
    TJS: "Tajikistani Somoni",
    TMT: "Turkmenistani Manat",
    UAH: "Ukrainian Hryvnia",
    UZS: "Uzbekistani Som",
    XDR: "Special Drawing Rights",
    ISK: "Icelandic Krona",
    LYD: "Libyan Dinar",
    DZD: "Algerian Dinar",
    AOA: "Angolan Kwanza",
    BWP: "Botswanan Pula",
    BIF: "Burundian Franc",
    XOF: "West African CFA Franc",
    CVE: "Cape Verdean Escudo",
    KMF: "Comorian Franc",
    CDF: "Congolese Franc",
    DJF: "Djiboutian Franc",
    ERN: "Eritrean Nakfa",
    SZL: "Swazi Lilangeni",
    GMD: "Gambian Dalasi",
    GNF: "Guinean Franc",
    LSL: "Lesotho Loti",
    LRD: "Liberian Dollar",
    MGA: "Malagasy Ariary",
    MWK: "Malawian Kwacha",
    MRU: "Mauritanian Ouguiya",
    MUR: "Mauritian Rupee",
    MZN: "Mozambican Metical",
    NAD: "Namibian Dollar",
    NIO: "Nicaraguan Córdoba",
    RWF: "Rwandan Franc",
    STN: "São Tomé and Príncipe Dobra",
    SCR: "Seychellois Rupee",
    SLL: "Sierra Leonean Leone",
    SOS: "Somali Shilling",
    SSP: "South Sudanese Pound",
    SDG: "Sudanese Pound",
    TZS: "Tanzanian Shilling",
    ZMW: "Zambian Kwacha",
    ZWL: "Zimbabwean Dollar",
    // Add more as needed from your API
  };
  
  return currencyNames[code] || code;
};

const CurrencyConverter = () => {
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [availableCurrencies, setAvailableCurrencies] = useState([]);
  const dropdownRef = useClickOutside(() => setShowCurrencyDropdown(false));
  
  const {
    selectedCurrency,
    exchangeRates,
    loading,
    error,
    changeCurrency,
    getCurrencyInfo,
    refreshRates,
    lastUpdated
  } = useCurrency();

  // Extract available currencies from exchange rates API
  useEffect(() => {
    if (exchangeRates && Object.keys(exchangeRates).length > 0) {
      const currencies = Object.keys(exchangeRates).map(code => ({
        code,
        name: getCurrencyDisplayName(code),
        rate: exchangeRates[code]
      }));
      setAvailableCurrencies(currencies);
    }
  }, [exchangeRates]);

  // Filter currencies based on search term
  const filteredCurrencies = availableCurrencies.filter(currency =>
    currency.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    currency.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort currencies - popular ones first, then selected currency, then alphabetically
  const popularCurrencies = ["USD", "EUR", "GBP", "AED", "SAR", "INR", "JPY", "CNY"];
  const sortedCurrencies = filteredCurrencies.sort((a, b) => {
    if (a.code === selectedCurrency) return -1;
    if (b.code === selectedCurrency) return 1;
    
    const aIsPopular = popularCurrencies.includes(a.code);
    const bIsPopular = popularCurrencies.includes(b.code);
    
    if (aIsPopular && !bIsPopular) return -1;
    if (!aIsPopular && bIsPopular) return 1;
    
    if (aIsPopular && bIsPopular) {
      return popularCurrencies.indexOf(a.code) - popularCurrencies.indexOf(b.code);
    }
    
    return a.code.localeCompare(b.code);
  });

  const handleCurrencyChange = (currency) => {
    changeCurrency(currency.code);
    setShowCurrencyDropdown(false);
    setSearchTerm("");
  };

  const currentCurrency = getCurrencyInfo(selectedCurrency);

  const getExchangeRate = (currencyCode, rate) => {
    if (!rate || currencyCode === 'AED') return null;
    
    if (rate < 0.01) {
      return `1 AED = ${rate.toFixed(6)} ${currencyCode}`;
    } else if (rate < 1) {
      return `1 AED = ${rate.toFixed(4)} ${currencyCode}`;
    } else {
      return `1 AED = ${rate.toFixed(2)} ${currencyCode}`;
    }
  };

  return (
    <CurrencySelector ref={dropdownRef}>
      <CurrencyButton
        onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
        disabled={loading}
      >
        {loading ? (
          <div className="loading-spinner" />
        ) : (
          <>
            <span>{selectedCurrency}</span>
            <i
              className={`fal fa-chevron-${
                showCurrencyDropdown ? "up" : "down"
              } chevron`}
            />
          </>
        )}
      </CurrencyButton>

      {showCurrencyDropdown && (
        <CurrencyDropdown>
          <CurrencyDropdownHeader>
            <div className="title">Select Currency</div>
            <div className="subtitle">
              {availableCurrencies.length} currencies available
            </div>
          </CurrencyDropdownHeader>

          <SearchBox>
            <input
              type="text"
              placeholder="Search currencies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchBox>

          {error && (
            <ErrorMessage>
              <i className="fal fa-exclamation-triangle" />
              <span>Failed to load exchange rates</span>
              <button 
                className="retry-btn" 
                onClick={refreshRates}
                disabled={loading}
              >
                Retry
              </button>
            </ErrorMessage>
          )}

          {loading ? (
            <LoadingState>
              <div className="loading-spinner" />
              <div>Loading currencies...</div>
            </LoadingState>
          ) : sortedCurrencies.length === 0 ? (
            <LoadingState>
              <div>No currencies found</div>
            </LoadingState>
          ) : (
            <CurrencyGrid>
              {sortedCurrencies.map((currency) => (
                <CurrencyOption
                  key={currency.code}
                  className={currency.code === selectedCurrency ? "active" : ""}
                  onClick={() => handleCurrencyChange(currency)}
                  disabled={loading}
                >
                  <div className="currency-code">{currency.code}</div>
                  <div className="currency-name">{currency.name}</div>
                  {getExchangeRate(currency.code, currency.rate) && (
                    <div className="exchange-rate">
                      {getExchangeRate(currency.code, currency.rate)}
                    </div>
                  )}
                </CurrencyOption>
              ))}
            </CurrencyGrid>
          )}
          
          {lastUpdated && (
            <LastUpdated>
              Last updated: {new Date(lastUpdated).toLocaleTimeString()}
            </LastUpdated>
          )}
        </CurrencyDropdown>
      )}
    </CurrencySelector>
  );
};

const AuthButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const RegisterButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: transparent;
  color: #f8853d;
  border: 1px solid #fed7aa;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: #fef7f0;
    color: #e67428;
    border-color: #f8853d;
    text-decoration: none;
    transform: translateY(-1px);
  }

  i {
    font-size: 14px;
  }
`;

const MobileCurrencyConverter = ({ onCurrencyChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [availableCurrencies, setAvailableCurrencies] = useState([]);
  
  const {
    selectedCurrency,
    exchangeRates,
    loading,
    error,
    changeCurrency,
    getCurrencyInfo,
    refreshRates
  } = useCurrency();

  // Extract available currencies from exchange rates API
  useEffect(() => {
    if (exchangeRates && Object.keys(exchangeRates).length > 0) {
      const currencies = Object.keys(exchangeRates).map(code => ({
        code,
        name: getCurrencyDisplayName(code),
        rate: exchangeRates[code]
      }));
      setAvailableCurrencies(currencies);
    }
  }, [exchangeRates]);

  // Filter and sort currencies
  const filteredCurrencies = availableCurrencies.filter(currency =>
    currency.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    currency.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const popularCurrencies = ["USD", "EUR", "GBP", "AED", "SAR", "INR"];
  const sortedCurrencies = filteredCurrencies.sort((a, b) => {
    if (a.code === selectedCurrency) return -1;
    if (b.code === selectedCurrency) return 1;
    
    const aIsPopular = popularCurrencies.includes(a.code);
    const bIsPopular = popularCurrencies.includes(b.code);
    
    if (aIsPopular && !bIsPopular) return -1;
    if (!aIsPopular && bIsPopular) return 1;
    
    return a.code.localeCompare(b.code);
  });

  const handleCurrencyChange = (currency) => {
    changeCurrency(currency.code);
    if (onCurrencyChange) {
      onCurrencyChange(currency);
    }
  };

  const getExchangeRate = (currencyCode, rate) => {
    if (!rate || currencyCode === 'AED') return null;
    
    if (rate < 0.01) {
      return `1 AED = ${rate.toFixed(6)}`;
    } else if (rate < 1) {
      return `1 AED = ${rate.toFixed(4)}`;
    } else {
      return `1 AED = ${rate.toFixed(2)}`;
    }
  };

  return (
    <MobileCurrencySection>
      <MobileCurrencyHeader>
        <i className="fal fa-money-bill-wave" />
        Currency ({availableCurrencies.length} available)
        {loading && <div className="loading-spinner" style={{ width: '16px', height: '16px' }} />}
      </MobileCurrencyHeader>
      
      <div style={{ marginBottom: '12px' }}>
        <input
          type="text"
          placeholder="Search currencies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #fed7aa',
            borderRadius: '6px',
            fontSize: '14px',
            outline: 'none'
          }}
        />
      </div>
      
      {error && (
        <div style={{ 
          background: '#fef2f2', 
          color: '#dc2626', 
          padding: '8px 12px', 
          borderRadius: '6px',
          fontSize: '12px',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <span>Failed to load rates</span>
          <button 
            onClick={refreshRates}
            style={{
              background: 'none',
              border: 'none',
              color: '#dc2626',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontSize: '12px'
            }}
          >
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div style={{
          textAlign: 'center',
          padding: '20px',
          color: '#64748b'
        }}>
          <div className="loading-spinner" style={{ 
            width: '20px', 
            height: '20px',
            margin: '0 auto 8px'
          }} />
          <div>Loading currencies...</div>
        </div>
      ) : sortedCurrencies.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '20px',
          color: '#64748b'
        }}>
          No currencies found
        </div>
      ) : (
        <div
          style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(2, 1fr)", 
            gap: "8px",
            maxHeight: "300px",
            overflowY: "auto"
          }}
        >
          {sortedCurrencies.slice(0, 50).map((currency) => (
            <CurrencyOption
              key={currency.code}
              className={currency.code === selectedCurrency ? "active" : ""}
              onClick={() => handleCurrencyChange(currency)}
              style={{ 
                borderRadius: "6px", 
                border: "1px solid #fed7aa",
                padding: "10px 8px"
              }}
              disabled={loading}
            >
              <div className="currency-info">
                <div className="code" style={{ fontSize: '12px', fontWeight: '600' }}>
                  {currency.code}
                </div>
                <div style={{ fontSize: '9px', color: '#64748b', lineHeight: '1.2' }}>
                  {currency.name.length > 15 ? currency.name.substring(0, 15) + '...' : currency.name}
                </div>
                {getExchangeRate(currency.code, currency.rate) && (
                  <div style={{ fontSize: '8px', color: '#94a3b8' }}>
                    {getExchangeRate(currency.code, currency.rate)}
                  </div>
                )}
              </div>
            </CurrencyOption>
          ))}
        </div>
      )}
      
      {sortedCurrencies.length > 50 && (
        <div style={{
          textAlign: 'center',
          padding: '8px',
          fontSize: '11px',
          color: '#94a3b8'
        }}>
          Showing 50 of {sortedCurrencies.length} currencies
        </div>
      )}
    </MobileCurrencySection>
  );
};

const AuthMenu = () => {
  const { userInfo, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useClickOutside(() => setShowDropdown(false));

  if (!userInfo) {
    return (
      <AuthSection>
        <AuthButtons>
          <RegisterButton href="/login">
            <i className="fal fa-user-plus" />
            Sign Up
          </RegisterButton>
          <LoginButton href="/login">
            <i className="fal fa-user" />
            Login
          </LoginButton>
        </AuthButtons>
      </AuthSection>
    );
  }

  const getInitials = (name) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase() || "U"
    );
  };

  return (
    <AuthSection ref={dropdownRef}>
      <UserButton onClick={() => setShowDropdown(!showDropdown)}>
        <div className="user-avatar">{getInitials(userInfo.name)}</div>
        <span>{userInfo.name?.split(" ")[0] || "User"}</span>
        <i
          className={`fal fa-chevron-${showDropdown ? "up" : "down"} chevron`}
        />
      </UserButton>

      {showDropdown && (
        <UserDropdown>
          <DropdownItem href="/dashboard">
            <i className="fal fa-tachometer-alt" />
            Dashboard
          </DropdownItem>
          <DropdownItem href="/dashboard?tab=bookings">
            <i className="fal fa-calendar-check" />
            My Bookings
          </DropdownItem>
          <DropdownItem href="/dashboard?tab=profile">
            <i className="fal fa-user-cog" />
            Profile Settings
          </DropdownItem>
          <DropdownButton onClick={logout}>
            <i className="fal fa-sign-out" />
            Sign Out
          </DropdownButton>
        </UserDropdown>
      )}
    </AuthSection>
  );
};

const Header = ({ header }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { userInfo, logout } = useAuth();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleMobileCurrencyChange = (currency) => {
    console.log("Mobile currency changed to:", currency.code);
  };

  return (
    <Fragment>
      <PlatformHeader>
        <HeaderContainer>
          <LogoSection>
            <div className="logo">
              <Link href="/">
                <img
                  src="/assets/images/logos/rdusk-logo.png"
                  alt="Royal Dusk Tours"
                  title="Royal Dusk Tours"
                />
              </Link>
            </div>
          </LogoSection>

          <Menu />

          <ActionsSection>
            <CurrencyConverter />

            <AuthMenu />

            <MobileMenuButton onClick={toggleMobileMenu}>
              <div className="menu-icon">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </MobileMenuButton>
          </ActionsSection>
        </HeaderContainer>
      </PlatformHeader>

      {/* Mobile Menu */}
      <Backdrop isOpen={mobileMenuOpen} onClick={closeMobileMenu} />
      <MobileMenu isOpen={mobileMenuOpen}>
        <MobileMenuHeader>
          <div className="logo">
            <Link href="/" onClick={closeMobileMenu}>
              <img
                src="/assets/images/logos/rdusk-logo.png"
                alt="Royal Dusk Tours"
              />
            </Link>
          </div>
          <CloseButton onClick={closeMobileMenu}>
            <i className="fal fa-times" />
          </CloseButton>
        </MobileMenuHeader>

        {/* Currency Section in Mobile Menu */}
        <MobileCurrencyConverter
          onCurrencyChange={handleMobileCurrencyChange}
        />

        {/* Auth Section in Mobile Menu */}
        {!userInfo && (
          <MobileAuthSection>
            <MobileAuthButtons>
              <MobileButton href="/signup" onClick={closeMobileMenu}>
                <i className="fal fa-user-plus" />
                Sign Up
              </MobileButton>
              <MobileButton href="/login" onClick={closeMobileMenu} primary>
                <i className="fal fa-user" />
                Login
              </MobileButton>
            </MobileAuthButtons>
          </MobileAuthSection>
        )}

        <MobileNavList>
          <MobileNavItem>
            <MobileNavLink href="/" onClick={closeMobileMenu}>
              <i className="fal fa-home" />
              Home
            </MobileNavLink>
          </MobileNavItem>
          <MobileNavItem>
            <MobileNavLink href="/holidays" onClick={closeMobileMenu}>
              <i className="fal fa-map" />
              Packages
            </MobileNavLink>
          </MobileNavItem>
          <MobileNavItem>
            <MobileNavLink href="/tours" onClick={closeMobileMenu}>
              <i className="fal fa-map" />
              Tours
            </MobileNavLink>
          </MobileNavItem>
          {userInfo && (
            <>
              <MobileNavItem>
                <MobileNavLink href="/dashboard" onClick={closeMobileMenu}>
                  <i className="fal fa-tachometer-alt" />
                  Dashboard
                </MobileNavLink>
              </MobileNavItem>
              <MobileNavItem>
                <MobileNavLink
                  href="/dashboard?tab=bookings"
                  onClick={closeMobileMenu}
                >
                  <i className="fal fa-calendar-check" />
                  My Bookings
                </MobileNavLink>
              </MobileNavItem>
              <MobileNavItem>
                <MobileNavLink
                  href="/dashboard?tab=profile"
                  onClick={closeMobileMenu}
                >
                  <i className="fal fa-user-cog" />
                  Profile Settings
                </MobileNavLink>
              </MobileNavItem>
            </>
          )}
          <MobileNavItem>
            <MobileNavLink href="/about" onClick={closeMobileMenu}>
              <i className="fal fa-info-circle" />
              About
            </MobileNavLink>
          </MobileNavItem>
          <MobileNavItem>
            <MobileNavLink href="/blog" onClick={closeMobileMenu}>
              <i className="fal fa-blog" />
              Blog
            </MobileNavLink>
          </MobileNavItem>
          <MobileNavItem>
            <MobileNavLink href="/contact" onClick={closeMobileMenu}>
              <i className="fal fa-phone" />
              Contact
            </MobileNavLink>
          </MobileNavItem>
        </MobileNavList>

        {userInfo && (
          <MobileActions>
            <DropdownButton
              onClick={() => {
                logout();
                closeMobileMenu();
              }}
            >
              <i className="fal fa-sign-out" />
              Sign Out
            </DropdownButton>
          </MobileActions>
        )}
      </MobileMenu>
    </Fragment>
  );
};

export default Header;