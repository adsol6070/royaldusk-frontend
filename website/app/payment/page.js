"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { bookingApi, paymentApi } from "@/common/api";
import styled from "styled-components";
import { useCart } from "@/common/context/CartContext";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

const CheckoutPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = searchParams.get("bookingId");
  const amount = Number(searchParams.get("amount"));
  const { clearCart } = useCart();

  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState(null);

  const fetchBookingData = async () => {
    try {
      const response = await bookingApi.getBookingById(bookingId);
      setBookingData(response.data);
    } catch (error) {
      console.error("Failed to fetch booking data:", error);
      alert("❌ Failed to load booking information");
    }
  };

  useEffect(() => {
    if (bookingId && amount) {
      fetchBookingData();
    }
  }, [bookingId, amount]);

  // 🆕 NEW: Use Checkout Session for Payment Sheet
  const handlePayWithStripeCheckout = async () => {
    setLoading(true);

    try {
      // Create checkout session using your backend API
      const response = await paymentApi.createCheckoutSession({
        bookingId,
        amount,
        currency: "AED",
        successUrl: `${window.location.origin}/booking-success/${bookingId}`,
        cancelUrl: `${window.location.origin}/payment?bookingId=${bookingId}&amount=${amount}`,
      });

      if (response.error) {
        throw new Error(response.error);
      }

      const stripe = await stripePromise;

      if (!stripe) {
        throw new Error("Stripe failed to load");
      }

      // Redirect to Stripe's hosted Payment Sheet
      const { error } = await stripe.redirectToCheckout({
        sessionId: response.sessionId,
      });

      if (error) {
        console.error("Stripe checkout error:", error);
        alert(`❌ ${error.message}`);
      } else {
        // Clear cart on successful redirect
        clearCart();
      }
    } catch (error) {
      console.error("Checkout session error:", error);
      alert("❌ Failed to initialize payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!bookingId || !amount) {
    return (
      <PageWrapper>
        <ErrorMessage>
          <h2>Invalid Booking Information</h2>
          <p>Please return to your cart and try again.</p>
          <BackButton onClick={() => router.push("/cart")}>
            Return to Cart
          </BackButton>
        </ErrorMessage>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <HeaderSection>
        <BackButton onClick={() => window.history.back()}>
          <i className="fal fa-arrow-left"></i> Back to Cart
        </BackButton>
        <h1>Complete Your Payment</h1>
        <p>Review your booking details and proceed to secure payment.</p>
      </HeaderSection>

      {bookingData && (
        <BookingSummaryCard>
          <h2>Booking Summary</h2>
          <SummaryDetails>
            <SummaryRow>
              <span>Booking ID:</span>
              <span>#{bookingId}</span>
            </SummaryRow>
            <SummaryRow>
              <span>Guest Name:</span>
              <span>{bookingData.guestName}</span>
            </SummaryRow>
            <SummaryRow>
              <span>Email:</span>
              <span>{bookingData.guestEmail}</span>
            </SummaryRow>
            <SummaryRow>
              <span>Mobile:</span>
              <span>{bookingData.guestMobile}</span>
            </SummaryRow>
            {bookingData.items && (
              <ItemsList>
                <h3>Package Details:</h3>
                {bookingData.items.map((item, index) => (
                  <PackageItem key={index}>
                    <span>Package #{item.packageId}</span>
                    <span>{item.travelers} travelers</span>
                    <span>{new Date(item.startDate).toLocaleDateString()}</span>
                  </PackageItem>
                ))}
              </ItemsList>
            )}
            <TotalAmount>
              <span>Total Amount:</span>
              <strong>AED {(amount / 100).toFixed(2)}</strong>
            </TotalAmount>
          </SummaryDetails>
        </BookingSummaryCard>
      )}

      <PaymentSection>
        <h2>Payment Method</h2>
        <p>
          Click below to open Stripe's secure payment form where you can enter
          your payment details.
        </p>

        <PaymentButton
          onClick={handlePayWithStripeCheckout}
          disabled={loading || !bookingData}
        >
          {loading ? (
            <>
              <ButtonSpinner />
              Processing...
            </>
          ) : (
            <>
              <i className="fal fa-credit-card"></i>
              Pay AED {(amount / 100).toFixed(2)} with Stripe
            </>
          )}
        </PaymentButton>

        <PaymentInfo>
          <InfoItem>
            <i className="fal fa-shield-check"></i>
            <span>Your payment information is encrypted and secure</span>
          </InfoItem>
          <InfoItem>
            <i className="fal fa-lock"></i>
            <span>256-bit SSL encryption</span>
          </InfoItem>
          <InfoItem>
            <i className="fab fa-stripe"></i>
            <span>Powered by Stripe - trusted by millions</span>
          </InfoItem>
        </PaymentInfo>
      </PaymentSection>

      <DisclaimerSection>
        <p>
          <strong>Note:</strong> You will be redirected to Stripe's secure
          payment page to complete your transaction. After successful payment,
          you will be redirected back to our site with your booking
          confirmation.
        </p>
      </DisclaimerSection>
    </PageWrapper>
  );
};

export default CheckoutPage;

// --- Styled Components ---
const PageWrapper = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  font-family: "Inter", system-ui, sans-serif;

  @media (max-width: 768px) {
    margin: 1rem;
    padding: 1rem;
  }
`;

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 2rem;

  h1 {
    font-size: 2rem;
    color: #1a1a1a;
    margin: 1rem 0 0.5rem 0;
    font-weight: 600;
  }

  p {
    color: #666;
    font-size: 1rem;
    line-height: 1.5;
  }
`;

const BackButton = styled.button`
  background: none;
  border: 1px solid #e0e6ed;
  color: #666;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  transition: all 0.2s ease;

  &:hover {
    background: #f8f9fa;
    color: #333;
    border-color: #ccc;
  }
`;

const BookingSummaryCard = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid #e9ecef;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  h2 {
    margin: 0 0 1.5rem 0;
    font-size: 1.4rem;
    color: #333;
    border-bottom: 1px solid #eee;
    padding-bottom: 1rem;
  }
`;

const SummaryDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;

  span:first-child {
    color: #666;
    font-weight: 500;
  }

  span:last-child {
    color: #333;
  }
`;

const ItemsList = styled.div`
  margin: 1rem 0;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;

  h3 {
    margin: 0 0 1rem 0;
    font-size: 1rem;
    color: #333;
  }
`;

const PackageItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  font-size: 0.9rem;
  color: #666;

  &:not(:last-child) {
    border-bottom: 1px solid #dee2e6;
  }
`;

const TotalAmount = styled(SummaryRow)`
  border-top: 2px solid #e9ecef;
  margin-top: 1rem;
  padding-top: 1rem;
  font-size: 1.2rem;

  span:last-child {
    color: #ff7a29;
    font-size: 1.3rem;
  }
`;

const PaymentSection = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid #e9ecef;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  text-align: center;

  h2 {
    margin: 0 0 1rem 0;
    font-size: 1.4rem;
    color: #333;
  }

  p {
    color: #666;
    margin-bottom: 2rem;
    line-height: 1.6;
  }
`;

const PaymentButton = styled.button`
  background: linear-gradient(135deg, #635bff 0%, #4f46e5 100%);
  color: white;
  font-weight: 600;
  padding: 1.2rem 2rem;
  border-radius: 8px;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  min-width: 280px;
  min-height: 56px;
  transition: all 0.3s ease;
  margin-bottom: 2rem;

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(99, 91, 255, 0.3);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  i {
    font-size: 1.2rem;
  }
`;

const ButtonSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top: 2px solid #ffffff;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const PaymentInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.9rem;

  i {
    color: #28a745;
    font-size: 1rem;
  }
`;

const DisclaimerSection = styled.div`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;

  p {
    margin: 0;
    color: #666;
    font-size: 0.9rem;
    line-height: 1.6;
  }

  strong {
    color: #333;
  }
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 3rem;
  background: #fff5f5;
  border: 1px solid #fed7d7;
  border-radius: 12px;

  h2 {
    color: #c53030;
    margin-bottom: 1rem;
  }

  p {
    color: #742a2a;
    margin-bottom: 2rem;
  }
`;
