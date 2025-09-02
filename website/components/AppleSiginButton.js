"use client";

import { useAuth } from "@/common/context/AuthContext";
import styled from "styled-components";

const AppleLoginButton = ({ text = "Sign in with Apple" }) => {
  const { appleLogin } = useAuth();

  return (
    <StyledAppleButton onClick={appleLogin}>
      <AppleIcon />
      <span>{text}</span>
    </StyledAppleButton>
  );
};

// Apple Logo SVG Component
const AppleIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
);

const StyledAppleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 12px 16px;
  width: 100%;
  font-size: 0.95rem;
  font-weight: 500;
  color: #ffffff;
  background-color: #000000;
  border: 1px solid #000000;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;

  svg {
    width: 18px;
    height: 18px;
    color: #ffffff;
  }

  &:hover {
    background-color: #1a1a1a;
    border-color: #1a1a1a;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    background-color: #333333;
    transform: translateY(0);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  /* Loading state */
  &.loading {
    position: relative;
    color: transparent;

    &::after {
      content: "";
      position: absolute;
      width: 16px;
      height: 16px;
      border: 2px solid #ffffff;
      border-top: 2px solid transparent;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Alternative Apple button with white background (for light themes)
export const AppleLoginButtonLight = ({ text = "Sign in with Apple" }) => {
  const { appleLogin } = useAuth();

  return (
    <StyledAppleButtonLight onClick={appleLogin}>
      <AppleIconDark />
      <span>{text}</span>
    </StyledAppleButtonLight>
  );
};

// Dark Apple Logo for light button
const AppleIconDark = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
);

const StyledAppleButtonLight = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 12px 16px;
  width: 100%;
  font-size: 0.95rem;
  font-weight: 500;
  color: #000000;
  background-color: #ffffff;
  border: 1px solid #dadce0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;

  svg {
    width: 18px;
    height: 18px;
    color: #000000;
  }

  &:hover {
    background-color: #f7f7f7;
    border-color: #c0c0c0;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &:active {
    background-color: #eee;
    transform: translateY(0);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

// Enhanced Apple button with loading state
export const AppleLoginButtonWithLoading = ({ 
  text = "Sign in with Apple", 
  loading = false 
}) => {
  const { appleLogin } = useAuth();

  const handleClick = async () => {
    if (!loading) {
      await appleLogin();
    }
  };

  return (
    <StyledAppleButton 
      onClick={handleClick} 
      disabled={loading}
      className={loading ? 'loading' : ''}
    >
      {!loading && <AppleIcon />}
      <span>{loading ? 'Signing in...' : text}</span>
    </StyledAppleButton>
  );
};

export default AppleLoginButton;