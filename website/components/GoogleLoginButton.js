"use client";

import { useAuth } from "@/common/context/AuthContext";
import styled from "styled-components";

const GoogleLoginButton = ({text}) => {
  const { googleLogin } = useAuth();

  return (
    <StyledGoogleButton onClick={googleLogin}>
      <img
        src="https://developers.google.com/identity/images/g-logo.png"
        alt="Google"
      />
      <span>{text}</span>
    </StyledGoogleButton>
  );
};

const StyledGoogleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 12px 16px;
  width: 100%;
  font-size: 0.95rem;
  font-weight: 500;
  color: #5f6368;
  background-color: #ffffff;
  border: 1px solid #dadce0;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  img {
    width: 18px;
    height: 18px;
  }

  &:hover {
    background-color: #f7f7f7;
  }

  &:active {
    background-color: #eee;
  }
`;

export default GoogleLoginButton;
