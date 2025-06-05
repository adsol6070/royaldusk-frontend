"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { bookingApi, paymentApi } from "@/common/api";
import styled from "styled-components";
import { useCart } from "@/common/context/CartContext";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ bookingId, amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [billingInfo, setBillingInfo] = useState({});
  const { clearCart } = useCart();

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const bookingRes = await bookingApi.getBookingById(bookingId);
        const guest = bookingRes.data;
        console.log("Booking details:", guest);
        setBillingInfo({
          name: guest.guestName,
          email: guest.guestEmail,
          phone: guest.guestMobile,
          address: { country: "AE" },
        });

        const payload = {
          bookingId,
          amount,
          currency: "aed",
          provider: "Stripe",
          method: "Card",
        };
        const res = await paymentApi.createPayment(payload);
        setClientSecret(res.clientSecret);
      } catch (err) {
        alert("❌ Failed to load booking or payment info");
        console.error(err);
      }
    };

    if (bookingId && amount) fetchBooking();
  }, [bookingId, amount]);

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    setLoading(true);
    const cardElement = elements.getElement(CardElement);
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: billingInfo,
      },
    });

    if (result.error) {
      alert(`❌ ${result.error.message}`);
      setLoading(false);
    } else if (result.paymentIntent.status === "succeeded") {
      router.push(`/booking-success/${bookingId}`);
      clearCart();
    } else {
      alert("⚠️ Payment not completed.");
      setLoading(false);
    }
  };

  return (
    <FormWrapper onSubmit={handlePayment}>
      <h2 className="form-title">Secure Payment</h2>
      <CardElementContainer>
        <CardElement options={{ hidePostalCode: true }} />
      </CardElementContainer>
      <PayButton type="submit" disabled={!stripe || !clientSecret || loading}>
        {loading ? "Processing..." : `Pay AED ${(amount / 100).toFixed(2)}`}
      </PayButton>
    </FormWrapper>
  );
};

const CheckoutPage = () => {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const amount = Number(searchParams.get("amount"));

  if (!bookingId || !amount) return <p className="error-msg">Invalid booking information</p>;

  return (
    <PageWrapper>
      <HeaderSection>
        <h1>Complete Your Payment</h1>
        <p>Use your card to securely complete your booking.</p>
      </HeaderSection>
      <Elements stripe={stripePromise}>
        <CheckoutForm bookingId={bookingId} amount={amount} />
      </Elements>
    </PageWrapper>
  );
};

export default CheckoutPage;

// --- Styled Components ---
const PageWrapper = styled.div`
  max-width: 500px;
  margin: 4rem auto;
  padding: 2rem;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  font-family: "Inter", sans-serif;
`;

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 2rem;

  h1 {
    font-size: 1.75rem;
    margin-bottom: 0.5rem;
  }

  p {
    color: #666;
    font-size: 0.95rem;
  }
`;

const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const CardElementContainer = styled.div`
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  background-color: #f9f9f9;
`;

const PayButton = styled.button`
  background-color: #0a66c2;
  color: white;
  font-weight: bold;
  padding: 1rem;
  border-radius: 10px;
  border: none;
  font-size: 1rem;
  transition: background-color 0.3s ease;
  cursor: pointer;

  &:hover {
    background-color: #084b93;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;
