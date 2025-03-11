'use client';
import React from "react";
import styled, { keyframes } from "styled-components";

// Keyframes for animation
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Styled components
const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
//   align-items: center;
  height: 100vh;
`;

const Spinner = styled.div`
  width: 64px;
  height: 64px;
  border: 6px solid #3498db;
  border-top-color: transparent;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const Loader = () => {
  return (
    <LoaderWrapper>
      <Spinner />
    </LoaderWrapper>
  );
};

export default Loader;
