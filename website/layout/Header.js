"use client";
import useClickOutside from "@/utility/useClickOutside";
import Link from "next/link";
import { Fragment, useState } from "react";
import { useAuth } from "@/common/context/AuthContext";
import { useCurrency } from "@/common/context/CurrencyContext"; // Import currency context
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

const CartButton = styled(Link)`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: #fef7f0;
  border: 1px solid #fed7aa;
  border-radius: 8px;
  color: #f8853d;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    background: #f8853d;
    border-color: #f8853d;
    color: white;
    text-decoration: none;
    transform: translateY(-1px);
  }

  i {
    font-size: 16px;
  }
`;

const CartBadge = styled.span`
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ef4444;
  color: white;
  font-size: 11px;
  font-weight: 600;
  min-width: 18px;
  height: 18px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
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

// Updated Currency Selector with integrated currency context
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

  .flag {
    width: 16px;
    height: 12px;
    border-radius: 2px;
    background: #cbd5e1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
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
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(248, 133, 61, 0.15);
  min-width: 200px;
  overflow: hidden;
  z-index: 1000;
`;

const CurrencyOption = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  width: 100%;
  background: none;
  border: none;
  color: #374151;
  font-size: 14px;
  text-align: left;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #fef7f0;
    color: #f8853d;
  }

  &.active {
    background: #fef7f0;
    color: #f8853d;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .flag {
    width: 20px;
    height: 15px;
    border-radius: 2px;
    background: #cbd5e1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    flex-shrink: 0;
  }

  .currency-info {
    flex: 1;

    .code {
      font-weight: 500;
    }

    .name {
      font-size: 12px;
      color: #64748b;
    }

    .rate {
      font-size: 11px;
      color: #94a3b8;
      margin-top: 2px;
    }
  }
`;

const ErrorMessage = styled.div`
  padding: 8px 12px;
  background: #fef2f2;
  color: #dc2626;
  font-size: 12px;
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
    font-size: 12px;

    &:hover {
      color: #b91c1c;
    }
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

const CurrencyConverter = () => {
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
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

  const currencies = [
    { code: "AED", name: "UAE Dirham", flag: "🇦🇪" },
    { code: "USD", name: "US Dollar", flag: "🇺🇸" },
    { code: "EUR", name: "Euro", flag: "🇪🇺" },
    { code: "GBP", name: "British Pound", flag: "🇬🇧" },
    { code: "INR", name: "Indian Rupee", flag: "🇮🇳" },
    { code: "SAR", name: "Saudi Riyal", flag: "🇸🇦" },
  ];

  const handleCurrencyChange = (currency) => {
    changeCurrency(currency.code);
    setShowCurrencyDropdown(false);
  };

  const currentCurrency = getCurrencyInfo(selectedCurrency);

  const getExchangeRate = (currencyCode) => {
    if (!exchangeRates || currencyCode === 'AED') return null;
    const rate = exchangeRates[currencyCode];
    return rate ? `1 AED = ${rate.toFixed(4)} ${currencyCode}` : null;
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
            <span className="flag">{currentCurrency.flag}</span>
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
          {error && (
            <ErrorMessage>
              <i className="fal fa-exclamation-triangle" />
              <span>Failed to load rates</span>
              <button 
                className="retry-btn" 
                onClick={refreshRates}
                disabled={loading}
              >
                Retry
              </button>
            </ErrorMessage>
          )}
          
          {currencies.map((currency) => (
            <CurrencyOption
              key={currency.code}
              className={currency.code === selectedCurrency ? "active" : ""}
              onClick={() => handleCurrencyChange(currency)}
              disabled={loading}
            >
              <span className="flag">{currency.flag}</span>
              <div className="currency-info">
                <div className="code">{currency.code}</div>
                <div className="name">{currency.name}</div>
                {getExchangeRate(currency.code) && (
                  <div className="rate">{getExchangeRate(currency.code)}</div>
                )}
              </div>
            </CurrencyOption>
          ))}
          
          {lastUpdated && (
            <div style={{ 
              padding: '8px 16px', 
              fontSize: '11px', 
              color: '#94a3b8',
              borderTop: '1px solid #fef7f0',
              textAlign: 'center'
            }}>
              Updated: {new Date(lastUpdated).toLocaleTimeString()}
            </div>
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
  const {
    selectedCurrency,
    exchangeRates,
    loading,
    error,
    changeCurrency,
    getCurrencyInfo,
    refreshRates
  } = useCurrency();

  const currencies = [
    { code: "AED", name: "UAE Dirham", flag: "🇦🇪" },
    { code: "USD", name: "US Dollar", flag: "🇺🇸" },
    { code: "EUR", name: "Euro", flag: "🇪🇺" },
    { code: "GBP", name: "British Pound", flag: "🇬🇧" },
    { code: "INR", name: "Indian Rupee", flag: "🇮🇳" },
    { code: "SAR", name: "Saudi Riyal", flag: "🇸🇦" },
  ];

  const handleCurrencyChange = (currency) => {
    changeCurrency(currency.code);
    if (onCurrencyChange) {
      onCurrencyChange(currency);
    }
  };

  const getExchangeRate = (currencyCode) => {
    if (!exchangeRates || currencyCode === 'AED') return null;
    const rate = exchangeRates[currencyCode];
    return rate ? `1 AED = ${rate.toFixed(4)}` : null;
  };

  return (
    <MobileCurrencySection>
      <MobileCurrencyHeader>
        <i className="fal fa-money-bill-wave" />
        Currency
        {loading && <div className="loading-spinner" style={{ width: '16px', height: '16px' }} />}
      </MobileCurrencyHeader>
      
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
      
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}
      >
        {currencies.map((currency) => (
          <CurrencyOption
            key={currency.code}
            className={currency.code === selectedCurrency ? "active" : ""}
            onClick={() => handleCurrencyChange(currency)}
            style={{ borderRadius: "6px", border: "1px solid #fed7aa" }}
            disabled={loading}
          >
            <span className="flag">{currency.flag}</span>
            <div className="currency-info">
              <div className="code">{currency.code}</div>
              {getExchangeRate(currency.code) && (
                <div style={{ fontSize: '10px', color: '#94a3b8' }}>
                  {getExchangeRate(currency.code)}
                </div>
              )}
            </div>
          </CurrencyOption>
        ))}
      </div>
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
          <RegisterButton href="/signup">
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

            {/* <CartButton href="/cart">
              <i className="fal fa-shopping-cart" />
              {cartItems.length > 0 && (
                <CartBadge>{cartItems.length}</CartBadge>
              )}
            </CartButton> */}

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
          {/* <MobileNavItem>
            <MobileNavLink href="/cart" onClick={closeMobileMenu}>
              <i className="fal fa-shopping-cart" />
              Cart ({cartItems.length})
            </MobileNavLink>
          </MobileNavItem> */}
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