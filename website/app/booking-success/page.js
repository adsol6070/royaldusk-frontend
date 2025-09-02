"use client";

import React, { useEffect, useState } from "react";
import ReveloLayout from "@/layout/ReveloLayout";
import { bookingApi } from "@/common/api";
import styled from "styled-components";
import { useRouter } from "next/navigation";

const PlatformContainer = styled.div`
  background: #f8fafc;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const SuccessCard = styled.div`
  background: white;
  border-radius: 20px;
  border: 1px solid #fed7aa;
  padding: 60px 40px;
  text-align: center;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);

  @media (max-width: 768px) {
    padding: 40px 30px;
    margin: 20px;
  }
`;

const SuccessIcon = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #10b981, #059669);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 30px;
  color: white;
  font-size: 40px;
  animation: successPulse 2s ease-in-out infinite;

  @keyframes successPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
`;

const SuccessTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 16px;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const SuccessSubtitle = styled.p`
  font-size: 18px;
  color: #64748b;
  margin-bottom: 30px;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const BookingIdBadge = styled.div`
  display: inline-block;
  background: linear-gradient(135deg, #f8853d 0%, #e67428 50%, #d65e1f 100%);
  color: white;
  padding: 12px 24px;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 40px;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 4px 15px rgba(248, 133, 61, 0.3);
`;

const EmailMessage = styled.div`
  background: #fef7f0;
  border: 1px solid #fed7aa;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 30px;

  .email-icon {
    font-size: 24px;
    color: #f8853d;
    margin-bottom: 12px;
  }

  .email-title {
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 8px;
  }

  .email-text {
    font-size: 14px;
    color: #64748b;
    line-height: 1.5;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
  min-width: 140px;
  justify-content: center;

  &.primary {
    background: linear-gradient(135deg, #f8853d, #e67428);
    color: white;

    &:hover {
      background: linear-gradient(135deg, #e67428, #d65e1f);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(248, 133, 61, 0.3);
    }
  }

  &.secondary {
    background: white;
    color: #64748b;
    border: 2px solid #e5e7eb;

    &:hover {
      background: #f8fafc;
      border-color: #d1d5db;
      transform: translateY(-1px);
    }
  }
`;

const LoadingCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 60px 40px;
  text-align: center;
  border: 1px solid #fed7aa;
  max-width: 500px;
  width: 100%;

  .loading-spinner {
    width: 50px;
    height: 50px;
    border: 3px solid #fef7f0;
    border-top: 3px solid #f8853d;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 20px;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  h3 {
    font-size: 18px;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 8px;
  }

  p {
    color: #64748b;
    margin: 0;
    font-size: 14px;
  }
`;

const ErrorCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 60px 40px;
  text-align: center;
  border: 1px solid #fed7aa;
  max-width: 500px;
  width: 100%;

  .error-icon {
    width: 60px;
    height: 60px;
    background: #fef2f2;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
    color: #ef4444;
    font-size: 24px;
  }

  h3 {
    font-size: 18px;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 8px;
  }

  p {
    color: #64748b;
    margin-bottom: 20px;
    font-size: 14px;
  }
`;

const Page = () => {
  const router = useRouter();

  const handleBackHome = () => {
    router.push('/');
  };

  const handleEmailSupport = () => {
    window.location.href = 'mailto:go@royaldusk.com';
  };

  return (
    <ReveloLayout>
      <PlatformContainer>
        <SuccessCard>
          <SuccessIcon>
            <i className="fal fa-check"></i>
          </SuccessIcon>
          
          <SuccessTitle>Booking Confirmed!</SuccessTitle>
          
          <SuccessSubtitle>
            Thank you for choosing Royal Dusk Tours. Your booking has been successfully confirmed.
          </SuccessSubtitle>

          <EmailMessage>
            <div className="email-icon">
              <i className="fal fa-envelope"></i>
            </div>
            <div className="email-title">Check Your Email</div>
            <div className="email-text">
              A detailed confirmation email with your booking information, travel itinerary, and payment receipt has been sent to your email. Please check your inbox and spam folder.
            </div>
          </EmailMessage>

          <ActionButtons>
            <Button className="primary" onClick={handleBackHome}>
              <i className="fal fa-home"></i>
              Back to Home
            </Button>
            <Button className="secondary" onClick={handleEmailSupport}>
              <i className="fal fa-envelope"></i>
              Email Support
            </Button>
          </ActionButtons>
        </SuccessCard>
      </PlatformContainer>
    </ReveloLayout>
  );
};

export default Page;