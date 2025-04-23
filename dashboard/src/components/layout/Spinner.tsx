// Spinner.tsx
import React from "react";
import styled, { keyframes } from "styled-components";

interface SpinnerProps {
  size?: number;
  color?: string;
  thickness?: number;
}

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const SpinnerWrapper = styled.div<{
  size: number;
  color: string;
  thickness: number;
}>`
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  border: ${(props) => props.thickness}px solid ${(props) => props.color}33;
  border-top-color: ${(props) => props.color};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

const Spinner: React.FC<SpinnerProps> = ({
  size = 40,
  color = "#2563EB", 
  thickness = 4,
}) => {
  return <SpinnerWrapper size={size} color={color} thickness={thickness} />;
};

export default Spinner;
