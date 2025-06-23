"use client";

import React, { useEffect, useState } from "react";
import ReveloLayout from "@/layout/ReveloLayout";
import FormInput from "@/components/ui/FormInput";
import PhoneInputField from "@/components/ui/PhoneInput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import styled from "styled-components";
import { getNationalities } from "@/utility/getNationalities";
import { useCart } from "@/common/context/CartContext";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { useAuth } from "@/common/context/AuthContext";
import { useRouter } from "next/navigation";
import { bookingApi, paymentApi } from "@/common/api";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  mobile: yup
    .object()
    .required("Mobile number is required")
    .test("is-filled", "Mobile number is required", (value) => {
      return !!value?.isdCode && !!value?.phoneNumber;
    }),
  nationality: yup.string().required("Nationality is required"),
  remarks: yup.string().max(500, "Max 500 characters"),
});

const Page = () => {
  const { cartItems, removeFromCart, updateCartItem, clearCart } = useCart();
  const { userInfo } = useAuth();
  const router = useRouter();
  const [totalAmount, setTotalAmount] = useState(0);
  const [hasDateValidation, setHasDateValidation] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: userInfo?.name || "",
      email: userInfo?.email || "",
      mobile: { isdCode: "971", phoneNumber: "" },
      nationality: "",
      remarks: "",
    },
  });

  useEffect(() => {
    if (userInfo) {
      setValue("name", userInfo.name);
      setValue("email", userInfo.email);
    }
  }, [userInfo, setValue]);

  useEffect(() => {
    const total = cartItems.reduce((sum, item) => {
      return sum + item.price * item.travelers;
    }, 0);
    setTotalAmount(total);

    const hasMissingDates = cartItems.some((item) => !item.startDate);
    setHasDateValidation(hasMissingDates);
  }, [cartItems]);

  const handleDateChange = (packageId, date) => {
    updateCartItem(packageId, { startDate: date });
  };

  const handleTravelersChange = (packageId, travelers) => {
    if (travelers >= 1) {
      updateCartItem(packageId, { travelers: parseInt(travelers) });
    }
  };

  const onSubmit = async (data) => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    if (cartItems.some((item) => !item.startDate)) {
      toast.error("Please select start date for all packages!");
      return;
    }

    setIsProcessing(true);

    try {
      const fullMobile = `${data.mobile.isdCode}${data.mobile.phoneNumber}`;
      const selectedPayment = "Credit Card";

      const bookingPayload = {
        guestName: data.name,
        guestEmail: data.email,
        guestMobile: fullMobile,
        guestNationality: data.nationality,
        remarks: data.remarks,
        paymentMethod: selectedPayment,
        agreedToTerms: true,
        items: cartItems.map((item) => ({
          packageId: item.id,
          travelers: item.travelers,
          startDate: new Date(item.startDate).toISOString(),
        })),
      };

      console.log("📝 Creating booking...");
      const bookingResponse = await bookingApi.createBooking(bookingPayload);
      const bookingId = bookingResponse.data.id;
      const amount = totalAmount * 100;

      console.log("✅ Booking created:", bookingId);

      const checkoutResponse = await paymentApi.createCheckoutSession({
        bookingId,
        amount,
        currency: "AED",
        successUrl: `${window.location.origin}/booking-success/${bookingId}`,
        cancelUrl: `${window.location.origin}/cart`,
      });

      if (checkoutResponse.error) {
        throw new Error(checkoutResponse.error);
      }

      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Stripe failed to load");
      }

      console.log("🚀 Redirecting to Stripe checkout...");
      const { error } = await stripe.redirectToCheckout({
        sessionId: checkoutResponse.sessionId,
      });

      if (error) {
        console.error("Stripe checkout error:", error);
        toast.error(`Payment failed: ${error.message}`);
      } else {
        clearCart();
      }
    } catch (err) {
      console.error("❌ Checkout failed:", err);
      toast.error("Failed to process checkout. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const nat = getNationalities();
  const nationalityOptions = nat.map((country) => ({
    label: country.name,
    value: country.name,
  }));

  return (
    <ReveloLayout>
      <PlatformContainer>
        {/* Header Bar */}
        <HeaderBar>
          <div className="container">
            <BackButton onClick={() => router.back()}>
              <i className="fal fa-arrow-left" />
              <span>Back</span>
            </BackButton>
            <HeaderTitle>
              <h1>Your Booking</h1>
              <CartCounter>
                {cartItems.length}{" "}
                {cartItems.length === 1 ? "package" : "packages"} • AED{" "}
                {totalAmount.toFixed(2)}
              </CartCounter>
            </HeaderTitle>
            <div></div>
          </div>
        </HeaderBar>

        <ContentWrapper className="container">
          {cartItems.length === 0 ? (
            <EmptyState>
              <EmptyIcon>
                <i className="fal fa-shopping-cart" />
              </EmptyIcon>
              <h2>Your cart is empty</h2>
              <p>Start by browsing our available packages</p>
              <Link href="/holidays" className="primary-btn">
                <i className="fal fa-search" />
                Browse Packages
              </Link>
            </EmptyState>
          ) : (
            <MainContent>
              {/* Progress Steps */}
              <ProgressSteps>
                <Step className="active">
                  <StepIcon>
                    <i className="fal fa-shopping-cart" />
                  </StepIcon>
                  <StepInfo>
                    <StepTitle>Review Booking</StepTitle>
                    <StepDescription>Verify packages & dates</StepDescription>
                  </StepInfo>
                </Step>
                <StepConnector />
                <Step>
                  <StepIcon>
                    <i className="fal fa-user" />
                  </StepIcon>
                  <StepInfo>
                    <StepTitle>Guest Details</StepTitle>
                    <StepDescription>Traveler information</StepDescription>
                  </StepInfo>
                </Step>
                <StepConnector />
                <Step>
                  <StepIcon>
                    <i className="fal fa-credit-card" />
                  </StepIcon>
                  <StepInfo>
                    <StepTitle>Payment</StepTitle>
                    <StepDescription>Secure checkout</StepDescription>
                  </StepInfo>
                </Step>
              </ProgressSteps>

              {/* Cart Items Section */}
              <BookingContent>
                <CartSection>
                  <SectionTitle>
                    <h2>Selected Packages</h2>
                    <p>Review your selected travel packages and dates</p>
                  </SectionTitle>

                  {hasDateValidation && (
                    <ValidationAlert>
                      <i className="fal fa-exclamation-triangle" />
                      <span>
                        Please select travel dates for all packages to proceed
                      </span>
                    </ValidationAlert>
                  )}

                  <ItemsList>
                    {cartItems.map((packageItem) => (
                      <CartItemCard key={packageItem.id}>
                        <ItemImage>
                          <img
                            src={packageItem.imageUrl}
                            alt={packageItem.name}
                          />
                          <RemoveBtn
                            onClick={() => removeFromCart(packageItem.id)}
                          >
                            <i className="fal fa-times" />
                          </RemoveBtn>
                        </ItemImage>

                        <ItemContent>
                          <ItemHeader>
                            <div>
                              <h3>{packageItem.name}</h3>
                              <ItemMeta>
                                <MetaItem>
                                  <i className="fal fa-map-marker-alt" />
                                  <span>{packageItem.location?.name}</span>
                                </MetaItem>
                                <MetaItem>
                                  <i className="fal fa-clock" />
                                  <span>{packageItem.duration} Days</span>
                                </MetaItem>
                              </ItemMeta>
                            </div>
                            <PriceTag>
                              AED {packageItem.price}
                              <small>/person</small>
                            </PriceTag>
                          </ItemHeader>

                          <ItemControls>
                            <ControlGroup>
                              <ControlLabel>Travel Date</ControlLabel>
                              <DateInput
                                type="date"
                                value={packageItem.startDate || ""}
                                onChange={(e) =>
                                  handleDateChange(
                                    packageItem.id,
                                    e.target.value
                                  )
                                }
                                min={new Date().toISOString().split("T")[0]}
                                required
                              />
                            </ControlGroup>

                            <ControlGroup>
                              <ControlLabel>Travelers</ControlLabel>
                              <TravelersInput>
                                <input
                                  type="number"
                                  value={packageItem.travelers}
                                  onChange={(e) =>
                                    handleTravelersChange(
                                      packageItem.id,
                                      e.target.value
                                    )
                                  }
                                  min="1"
                                />
                              </TravelersInput>
                            </ControlGroup>

                            <ItemTotal>
                              <span>Total:</span>
                              <strong>
                                AED{" "}
                                {(
                                  packageItem.price * packageItem.travelers
                                ).toFixed(2)}
                              </strong>
                            </ItemTotal>
                          </ItemControls>
                        </ItemContent>
                      </CartItemCard>
                    ))}
                  </ItemsList>
                </CartSection>

                {/* Guest Details Form */}
                <GuestDetailsSection>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <SectionTitle>
                      <h2>Lead Traveler Details</h2>
                      <p>Primary contact information for this booking</p>
                    </SectionTitle>

                    <FormCard>
                      <FormGrid>
                        <FormInput
                          label="Full Name"
                          name="name"
                          register={register}
                          error={errors.name}
                        />
                        <FormInput
                          label="Email Address"
                          name="email"
                          type="email"
                          register={register}
                          error={errors.email}
                        />
                        <PhoneInputField
                          label="Mobile Number"
                          name="mobile"
                          value={watch("mobile")}
                          setValue={setValue}
                          trigger={trigger}
                          error={errors.mobile}
                        />
                        <FormInput
                          label="Nationality"
                          name="nationality"
                          register={register}
                          as="select"
                          options={nationalityOptions}
                          error={errors.nationality}
                        />
                      </FormGrid>

                      <FormInput
                        label="Special Requests (Optional)"
                        name="remarks"
                        as="textarea"
                        register={register}
                        error={errors.remarks}
                        placeholder="Any special requirements, dietary restrictions, or requests..."
                      />
                    </FormCard>

                    {/* Summary Footer */}
                    <BookingSummary>
                      <SummaryContent>
                        <SummaryRow>
                          <span>
                            {cartItems.length} Package
                            {cartItems.length !== 1 ? "s" : ""}
                          </span>
                          <span>AED {totalAmount.toFixed(2)}</span>
                        </SummaryRow>
                        <SummaryRow>
                          <span>Taxes & Fees</span>
                          <span>Included</span>
                        </SummaryRow>
                        <TotalRow>
                          <span>Total Amount</span>
                          <strong>AED {totalAmount.toFixed(2)}</strong>
                        </TotalRow>
                      </SummaryContent>

                      <ActionButtons>
                        <SecondaryButton
                          type="button"
                          onClick={() => router.push("/holidays")}
                        >
                          <i className="fal fa-plus" />
                          Add More Packages
                        </SecondaryButton>
                        <PrimaryButton
                          type="submit"
                          disabled={hasDateValidation || isProcessing}
                        >
                          {isProcessing ? (
                            <>
                              <Spinner />
                              Processing...
                            </>
                          ) : hasDateValidation ? (
                            "Complete Required Fields"
                          ) : (
                            <>
                              <i className="fal fa-arrow-right" />
                              Proceed to Payment
                            </>
                          )}
                        </PrimaryButton>
                      </ActionButtons>

                      <SecurityNote>
                        <i className="fal fa-shield-check" />
                        <span>
                          Secure booking • Free cancellation • Instant
                          confirmation
                        </span>
                      </SecurityNote>
                    </BookingSummary>
                  </form>
                </GuestDetailsSection>
              </BookingContent>
            </MainContent>
          )}
        </ContentWrapper>
      </PlatformContainer>
    </ReveloLayout>
  );
};

// Platform-style Styled Components
const PlatformContainer = styled.div`
  background: #f8fafc;
  min-height: 100vh;
`;

const HeaderBar = styled.div`
  background: white;
  border-bottom: 1px solid #fed7aa;
  padding: 16px 0;
  position: sticky;
  top: 0;
  z-index: 100;

  .container {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 20px;
  }
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: #64748b;
  font-size: 14px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: #fef7f0;
    color: #f8853d;
  }

  i {
    font-size: 16px;
  }
`;

const HeaderTitle = styled.div`
  text-align: center;

  h1 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 4px 0;
  }
`;

const CartCounter = styled.span`
  font-size: 14px;
  color: #f8853d;
  font-weight: 500;
`;

const ContentWrapper = styled.div`
  padding: 30px 20px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 16px;
  max-width: 500px;
  margin: 0 auto;
  border: 1px solid #fed7aa;

  h2 {
    font-size: 1.5rem;
    color: #1e293b;
    margin: 20px 0 8px 0;
    font-weight: 600;
  }

  p {
    color: #64748b;
    margin-bottom: 32px;
  }

  .primary-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #f8853d;
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.2s ease;

    &:hover {
      background: #e67428;
      transform: translateY(-1px);
      text-decoration: none;
      color: white;
    }
  }
`;

const EmptyIcon = styled.div`
  i {
    font-size: 4rem;
    color: #fed7aa;
  }
`;

const MainContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const ProgressSteps = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;
  background: white;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid #fed7aa;
`;

const Step = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  opacity: 0.5;

  &.active {
    opacity: 1;
  }
`;

const StepIcon = styled.div`
  width: 40px;
  height: 40px;
  background: #fef7f0;
  color: #f8853d;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;

  .active & {
    background: #f8853d;
    color: white;
  }
`;

const StepInfo = styled.div``;

const StepTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #374151;
`;

const StepDescription = styled.div`
  font-size: 12px;
  color: #64748b;
`;

const StepConnector = styled.div`
  width: 60px;
  height: 2px;
  background: #e2e8f0;
  margin: 0 20px;
`;

const BookingContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const CartSection = styled.div``;

const GuestDetailsSection = styled.div``;

const SectionTitle = styled.div`
  margin-bottom: 24px;

  h2 {
    font-size: 1.3rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 8px 0;
  }

  p {
    font-size: 14px;
    color: #64748b;
    margin: 0;
  }
`;

const ValidationAlert = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: #fef3c7;
  border: 1px solid #f59e0b;
  color: #92400e;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 20px;

  i {
    font-size: 16px;
  }
`;

const ItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const CartItemCard = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #fed7aa;
  transition: all 0.2s ease;
  display: grid;
  grid-template-columns: 180px 1fr;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }

  &:hover {
    border-color: #f8853d;
    box-shadow: 0 4px 12px rgba(248, 133, 61, 0.15);
  }
`;

const ItemImage = styled.div`
  position: relative;
  height: 140px;

  @media (max-width: 768px) {
    height: 180px;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const RemoveBtn = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  background: rgba(220, 53, 69, 0.9);
  color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #dc3545;
    transform: scale(1.1);
  }
`;

const ItemContent = styled.div`
  padding: 16px;
`;

const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;

  h3 {
    font-size: 1rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 8px 0;
  }
`;

const PriceTag = styled.div`
  font-weight: 600;
  color: #f8853d;
  white-space: nowrap;
  text-align: right;

  small {
    font-weight: 400;
    color: #64748b;
    display: block;
  }
`;

const ItemMeta = styled.div`
  display: flex;
  gap: 16px;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #64748b;

  i {
    color: #f8853d;
  }
`;

const ItemControls = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 16px;
  align-items: end;
`;

const ControlGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const ControlLabel = styled.label`
  font-size: 12px;
  font-weight: 500;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const DateInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #fed7aa;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #f8853d;
    box-shadow: 0 0 0 3px rgba(248, 133, 61, 0.1);
  }
`;

const TravelersInput = styled.div`
  input {
    width: 70px;
    padding: 8px 12px;
    border: 1px solid #fed7aa;
    border-radius: 6px;
    font-size: 14px;
    text-align: center;

    &:focus {
      outline: none;
      border-color: #f8853d;
      box-shadow: 0 0 0 3px rgba(248, 133, 61, 0.1);
    }
  }
`;

const ItemTotal = styled.div`
  text-align: right;
  font-size: 14px;
  color: #1e293b;

  span {
    display: block;
    font-size: 12px;
    color: #64748b;
    margin-bottom: 2px;
  }

  strong {
    font-weight: 600;
    color: #f8853d;
  }
`;

const FormCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #fed7aa;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const BookingSummary = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #fed7aa;
  margin-top: 24px;
`;

const SummaryContent = styled.div`
  margin-bottom: 20px;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  font-size: 14px;
  color: #64748b;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-top: 2px solid #fed7aa;
  margin-top: 8px;
  font-weight: 600;
  color: #1e293b;
  font-size: 16px;

  strong {
    color: #f8853d;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

const SecondaryButton = styled.button`
  flex: 1;
  background: #fef7f0;
  color: #f8853d;
  border: 1px solid #fed7aa;
  padding: 14px 16px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    background: #f8853d;
    color: white;
    border-color: #f8853d;
  }
`;

const PrimaryButton = styled.button`
  flex: 2;
  background: linear-gradient(135deg, #f8853d 0%, #e67428 100%);
  color: white;
  padding: 14px 16px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #e67428 0%, #d65e1f 100%);
    transform: translateY(-1px);
    box-shadow: 0 8px 25px rgba(248, 133, 61, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const Spinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const SecurityNote = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 13px;
  color: #64748b;
  text-align: center;

  i {
    color: #10b981;
  }
`;

export default Page;
