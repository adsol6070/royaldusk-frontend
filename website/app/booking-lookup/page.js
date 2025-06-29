"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-hot-toast";
import ReveloLayout from "@/layout/ReveloLayout";
import { bookingApi } from "@/common/api";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  bookingReference: yup
    .string()
    .min(6, "Booking reference must be at least 6 characters")
    .required("Booking reference is required"),
});

const PlatformContainer = styled.div`
  background: #f8fafc;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const LookupCard = styled.div`
  background: white;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  padding: 40px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);

  @media (max-width: 480px) {
    padding: 30px 24px;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 32px;

  .logo {
    margin-bottom: 24px;

    img {
      height: 48px;
      width: auto;
    }
  }

  h1 {
    font-size: 1.75rem;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 8px 0;
  }

  p {
    font-size: 14px;
    color: #64748b;
    margin: 0;
    line-height: 1.5;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #374151;
`;

const InputWrapper = styled.div`
  position: relative;

  .input-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
    font-size: 16px;
    pointer-events: none;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  padding-left: ${(props) => (props.hasIcon ? "44px" : "16px")};
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  background: #f9fafb;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    background: white;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }

  &.error {
    border-color: #ef4444;
    background: #fef2f2;
  }
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 6px;

  i {
    font-size: 12px;
  }
`;

const HelpText = styled.div`
  font-size: 13px;
  color: #64748b;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 6px;

  i {
    color: #667eea;
    font-size: 12px;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 14px 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
    transform: translateY(-1px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid transparent;
    border-top: 2px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 24px 0;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: #e2e8f0;
  }

  span {
    padding: 0 16px;
    color: #64748b;
    font-size: 13px;
    font-weight: 500;
  }
`;

const FooterLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-top: 24px;
  border-top: 1px solid #f1f5f9;
`;

const LoginPrompt = styled.div`
  text-align: center;
  font-size: 14px;
  color: #64748b;

  a {
    color: #667eea;
    text-decoration: none;
    font-weight: 600;
    margin-left: 4px;

    &:hover {
      color: #5a67d8;
      text-decoration: underline;
    }
  }
`;

const QuickLinks = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (max-width: 380px) {
    grid-template-columns: 1fr;
  }
`;

const QuickLink = styled.div`
  text-align: center;

  a {
    color: #64748b;
    text-decoration: none;
    font-size: 13px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 8px 12px;
    border-radius: 6px;
    transition: all 0.2s ease;
    width: 100%;

    &:hover {
      color: #667eea;
      background: #f8fafc;
      text-decoration: none;
    }

    i {
      font-size: 12px;
    }
  }
`;

const InfoBox = styled.div`
  background: #f0f9ff;
  border: 1px solid #e0f2fe;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;

  .info-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;

    i {
      color: #0ea5e9;
      font-size: 16px;
    }

    h3 {
      font-size: 14px;
      font-weight: 600;
      color: #0c4a6e;
      margin: 0;
    }
  }

  .info-content {
    font-size: 13px;
    color: #075985;
    line-height: 1.5;

    ul {
      margin: 8px 0 0 0;
      padding-left: 20px;

      li {
        margin: 4px 0;
      }
    }
  }
`;

// Booking Result Components
const BookingResult = styled.div`
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 12px;
  padding: 24px;
  margin-top: 24px;

  .result-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;

    i {
      color: #16a34a;
      font-size: 20px;
    }

    h3 {
      color: #15803d;
      font-size: 1.2rem;
      font-weight: 700;
      margin: 0;
    }
  }
`;

const BookingDetails = styled.div`
  display: grid;
  gap: 16px;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #dcfce7;

  &:last-child {
    border-bottom: none;
  }

  .label {
    font-size: 14px;
    color: #166534;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 8px;

    i {
      font-size: 14px;
      color: #16a34a;
    }
  }

  .value {
    font-size: 14px;
    font-weight: 600;
    color: #14532d;
  }
`;

const StatusBadge = styled.span`
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  background: ${(props) =>
    props.status === "Confirmed"
      ? "#dcfce7"
      : props.status === "Pending"
      ? "#fef3c7"
      : "#fee2e2"};
  color: ${(props) =>
    props.status === "Confirmed"
      ? "#166534"
      : props.status === "Pending"
      ? "#92400e"
      : "#dc2626"};
`;

export default function BookingLookupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Call your booking lookup API
      const response = await bookingApi.lookupBooking({
        email: data.email,
        bookingReference: data.bookingReference,
      });

      if (response.success && response.data) {
        setBookingResult(response.data);
        toast.success("Booking found successfully!");
      } else {
        toast.error("No booking found with these details.");
        setBookingResult(null);
      }
    } catch (error) {
      console.error("Booking lookup error:", error);
      toast.error("Error looking up booking. Please try again.");
      setBookingResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleNewLookup = () => {
    setBookingResult(null);
    reset();
  };

  return (
    <ReveloLayout>
      <PlatformContainer>
        <LookupCard>
          <Header>
            <div className="logo">
              <img
                src="/assets/images/logos/rdusk-logo.png"
                alt="Royal Dusk Tours"
              />
            </div>
            <h1>Booking Lookup</h1>
            <p>
              Enter your details below to find and view your booking information
            </p>
          </Header>

          {!bookingResult ? (
            <>
              <InfoBox>
                <div className="info-header">
                  <i className="fal fa-info-circle" />
                  <h3>What you'll need</h3>
                </div>
                <div className="info-content">
                  To look up your booking, please provide:
                  <ul>
                    <li>The email address used for booking</li>
                    <li>Your booking reference number</li>
                  </ul>
                </div>
              </InfoBox>

              <Form onSubmit={handleSubmit(onSubmit)}>
                <FormGroup>
                  <Label htmlFor="email">Email Address</Label>
                  <InputWrapper>
                    <i className="fal fa-envelope input-icon" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      hasIcon
                      className={errors.email ? "error" : ""}
                      {...register("email")}
                    />
                  </InputWrapper>
                  {errors.email && (
                    <ErrorMessage>
                      <i className="fal fa-exclamation-circle" />
                      {errors.email.message}
                    </ErrorMessage>
                  )}
                  <HelpText>
                    <i className="fal fa-info-circle" />
                    Use the same email address you used when making the booking
                  </HelpText>
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="bookingReference">Booking Reference</Label>
                  <InputWrapper>
                    <i className="fal fa-ticket-alt input-icon" />
                    <Input
                      id="bookingReference"
                      type="text"
                      placeholder="Enter your booking reference"
                      hasIcon
                      className={errors.bookingReference ? "error" : ""}
                      {...register("bookingReference")}
                      style={{ textTransform: "uppercase" }}
                    />
                  </InputWrapper>
                  {errors.bookingReference && (
                    <ErrorMessage>
                      <i className="fal fa-exclamation-circle" />
                      {errors.bookingReference.message}
                    </ErrorMessage>
                  )}
                  <HelpText>
                    <i className="fal fa-info-circle" />
                    Found in your booking confirmation email (e.g., RD123456)
                  </HelpText>
                </FormGroup>

                <SubmitButton type="submit" disabled={loading}>
                  {loading && <div className="spinner" />}
                  {loading ? "Looking up..." : "Find My Booking"}
                  {!loading && <i className="fal fa-search" />}
                </SubmitButton>
              </Form>
            </>
          ) : (
            <BookingResult>
              <div className="result-header">
                <i className="fal fa-check-circle" />
                <h3>Booking Found</h3>
              </div>

              <BookingDetails>
                <DetailRow>
                  <div className="label">
                    <i className="fal fa-map-marked-alt" />
                    Package
                  </div>
                  <div className="value">{bookingResult.packageName}</div>
                </DetailRow>

                <DetailRow>
                  <div className="label">
                    <i className="fal fa-ticket-alt" />
                    Reference
                  </div>
                  <div className="value">{bookingResult.bookingReference}</div>
                </DetailRow>

                <DetailRow>
                  <div className="label">
                    <i className="fal fa-calendar" />
                    Travel Date
                  </div>
                  <div className="value">
                    {new Date(bookingResult.travelDate).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </div>
                </DetailRow>

                <DetailRow>
                  <div className="label">
                    <i className="fal fa-users" />
                    Travelers
                  </div>
                  <div className="value">{bookingResult.travelers} People</div>
                </DetailRow>

                <DetailRow>
                  <div className="label">
                    <i className="fal fa-money-bill" />
                    Total Amount
                  </div>
                  <div className="value">
                    {bookingResult.currency?.toUpperCase()}{" "}
                    {bookingResult.totalAmountPaid / 100}
                  </div>
                </DetailRow>

                <DetailRow>
                  <div className="label">
                    <i className="fal fa-info-circle" />
                    Status
                  </div>
                  <StatusBadge status={bookingResult.status}>
                    {bookingResult.status}
                  </StatusBadge>
                </DetailRow>
              </BookingDetails>

              <SubmitButton
                type="button"
                onClick={handleNewLookup}
                style={{ marginTop: "20px" }}
              >
                <i className="fal fa-search" />
                Look Up Another Booking
              </SubmitButton>
            </BookingResult>
          )}

          <Divider>
            <span>or</span>
          </Divider>

          <FooterLinks>
            <LoginPrompt>
              Have an account?
              <Link href="/login">Sign In</Link>
            </LoginPrompt>

            <QuickLinks>
              <QuickLink>
                <Link href="/register">
                  <i className="fal fa-user-plus" />
                  Create Account
                </Link>
              </QuickLink>
              <QuickLink>
                <Link href="/holidays">
                  <i className="fal fa-compass" />
                  Browse Packages
                </Link>
              </QuickLink>
            </QuickLinks>
          </FooterLinks>
        </LookupCard>
      </PlatformContainer>
    </ReveloLayout>
  );
}
