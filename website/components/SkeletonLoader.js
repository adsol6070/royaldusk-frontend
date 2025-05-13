"use client";
import React from "react";
import styled, { keyframes } from "styled-components";

const shimmer = keyframes`
  0% {
    background-position: -100%;
  }
  100% {
    background-position: 200%;
  }
`;

const SkeletonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SkeletonItem = styled.div`
  width: ${({ width }) => width || "100%"};
  height: ${({ height }) => height || "100px"};
  background-color: #e0e0e0;
  background-image: linear-gradient(
    to right,
    #e0e0e0 0%,
    #f0f0f0 50%,
    #e0e0e0 100%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite linear;
  border-radius: 8px;
`;

const SkeletonLoader = ({ count = 1, width, height }) => {
  return (
    <SkeletonWrapper>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonItem key={index} width={width} height={height} />
      ))}
    </SkeletonWrapper>
  );
};

export default SkeletonLoader;
