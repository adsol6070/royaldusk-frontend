"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ReveloLayout from "@/layout/ReveloLayout";
import FormInput from "@/components/ui/FormInput";
import PhoneInputField from "@/components/ui/PhoneInput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import styled from "styled-components";
import { getNationalities } from "@/utility/getNationalities";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { useAuth } from "@/common/context/AuthContext";
import { useCurrency } from "@/common/context/CurrencyContext";
import { paymentApi, packageApi, tourApi } from "@/common/api";
import { loadStripe } from "@stripe/stripe-js";
import { activityIcons } from "@/utility/activityIcons";
import capitalizeFirstLetter from "@/utility/capitalizeFirstLetter";

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
  travelDate: yup.string().required("Travel date is required"),
  travelers: yup
    .number()
    .min(1, "At least 1 traveler required")
    .required("Number of travelers is required"),
});

const BookingPage = () => {
  const { userInfo } = useAuth();
  const { selectedCurrency, convertPrice, formatPrice } = useCurrency();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [item, setItem] = useState(null);
  const [itemType, setItemType] = useState(null); // 'package' or 'tour'
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [convertedTotalAmount, setConvertedTotalAmount] = useState(0);

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
      travelDate: "",
      travelers: 1,
    },
  });

  const watchedValues = watch();

  // Fetch item details on mount
  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const itemId = searchParams.get("id");
        const type = searchParams.get("type");

        if (!itemId || !type) {
          router.push("/holidays");
          return;
        }

        setItemType(type);
        let response;

        if (type === "package") {
          response = await packageApi.getPackageById(itemId);
        } else if (type === "tour") {
          response = await tourApi.getTourById(itemId);
        } else {
          throw new Error("Invalid item type");
        }

        setItem(response.data);
      } catch (error) {
        console.error("Error fetching item details:", error);
        toast.error("Failed to load item details");
        router.push("/holidays");
      } finally {
        setLoading(false);
      }
    };

    fetchItemDetails();
  }, [searchParams, router]);

  // Update total amount when travelers, item, or currency changes
  useEffect(() => {
    if (item && watchedValues.travelers) {
      const basePrice = parseFloat(item.price) || 0;
      const baseCurrency = itemType === 'package' ? (item.currency || 'AED') : 'AED';
      
      // Calculate total in original currency
      const totalInOriginalCurrency = basePrice * watchedValues.travelers;
      setTotalAmount(totalInOriginalCurrency);
      
      // Convert to selected currency for display
      const convertedTotal = convertPrice(totalInOriginalCurrency, baseCurrency);
      setConvertedTotalAmount(convertedTotal);
    }
  }, [item, watchedValues.travelers, selectedCurrency, convertPrice, itemType]);

  // Set user info when available
  useEffect(() => {
    if (userInfo) {
      setValue("name", userInfo.name);
      setValue("email", userInfo.email);
    }
  }, [userInfo, setValue]);

  const onSubmit = async (data) => {
    if (!item) {
      toast.error("Item details not found!");
      return;
    }

    setIsProcessing(true);

    try {
      const fullMobile = `${data.mobile.isdCode}${data.mobile.phoneNumber}`;
      
      // Always charge in AED for Stripe (convert back if needed)
      const baseCurrency = itemType === 'package' ? (item.currency || 'AED') : 'AED';
      let chargeAmount;
      
      if (baseCurrency === 'AED') {
        chargeAmount = totalAmount * 100; // Convert to cents
      } else {
        // Convert from original currency to AED for charging
        const aedAmount = convertPrice(totalAmount, baseCurrency, 'AED');
        chargeAmount = aedAmount * 100;
      }

      const checkoutPayload = {
        amount: Math.round(chargeAmount), // Ensure it's an integer
        currency: "AED", // Always charge in AED
        successUrl: `${window.location.origin}/booking-success`,
        cancelUrl: `${window.location.origin}/booking?id=${item.id}&type=${itemType}`,
        metadata: {
          guestName: data.name,
          guestEmail: data.email,
          guestMobile: fullMobile,
          guestNationality: data.nationality,
          remarks: data.remarks,
          paymentMethod: "Credit Card",
          serviceType: capitalizeFirstLetter(itemType), 
          serviceId: item.id.toString(), 
          displayCurrency: selectedCurrency,
          originalAmount: totalAmount.toString(),
          originalCurrency: baseCurrency,
          convertedAmount: convertedTotalAmount.toString(),
          serviceData: {
            itemName: item.name,
            travelers: data.travelers,
            travelDate: data.travelDate,
            price: item.price,
            totalAmount,
            displayCurrency: selectedCurrency,
            convertedTotalAmount
          },
        },
      };

      const checkoutResponse = await paymentApi.createCheckoutSession(
        checkoutPayload
      );

      if (checkoutResponse.error) {
        throw new Error(checkoutResponse.error);
      }

      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Stripe failed to load");
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId: checkoutResponse.sessionId,
      });

      if (error) {
        console.error("Stripe checkout error:", error);
        toast.error(`Payment failed: ${error.message}`);
      }
    } catch (err) {
      console.error("❌ Checkout failed:", err);
      toast.error("Failed to process booking. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const nat = getNationalities();
  const nationalityOptions = nat.map((country) => ({
    label: country.name,
    value: country.name,
  }));

  const getLocationDisplay = (location) => {
    if (!location) return "";
    if (typeof location === "string") return capitalizeFirstLetter(location);
    if (typeof location === "object" && location.name)
      return capitalizeFirstLetter(location.name);
    return String(location);
  };

  // Helper functions for price display
  const getItemPrice = () => {
    if (!item) return { original: 0, converted: 0, currency: 'AED' };
    
    const originalPrice = parseFloat(item.price);
    const originalCurrency = itemType === 'package' ? (item.currency || 'AED') : 'AED';
    const convertedPrice = convertPrice(originalPrice, originalCurrency);
    
    return {
      original: originalPrice,
      converted: convertedPrice,
      currency: originalCurrency
    };
  };

  const formatDisplayPrice = (amount) => {
    return formatPrice(amount);
  };

  if (loading) {
    return (
      <ReveloLayout>
        <PlatformContainer>
          <LoadingContainer>
            <Spinner />
            <p>Loading booking details...</p>
          </LoadingContainer>
        </PlatformContainer>
      </ReveloLayout>
    );
  }

  if (!item) {
    return (
      <ReveloLayout>
        <PlatformContainer>
          <ErrorContainer>
            <h2>Item not found</h2>
            <p>The requested item could not be found.</p>
            <Link href="/holidays" className="primary-btn">
              Back to Packages
            </Link>
          </ErrorContainer>
        </PlatformContainer>
      </ReveloLayout>
    );
  }

  const priceInfo = getItemPrice();

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
              <h1>Book Your {itemType === "package" ? "Package" : "Tour"}</h1>
              <BookingCounter>
                Complete your booking • {formatDisplayPrice(convertedTotalAmount)}
                {selectedCurrency !== priceInfo.currency && (
                  <span style={{ fontSize: '12px', color: '#64748b', marginLeft: '8px' }}>
                    (Originally {priceInfo.currency} {(priceInfo.original * watchedValues.travelers).toFixed(2)})
                  </span>
                )}
              </BookingCounter>
            </HeaderTitle>
            <CurrencyBadge>
              <i className="fas fa-coins" />
              <span>Pricing in {selectedCurrency}</span>
            </CurrencyBadge>
          </div>
        </HeaderBar>

        <ContentWrapper className="container">
          <MainContent>
            {/* Progress Steps */}
            <ProgressSteps>
              <Step className="active">
                <StepIcon>
                  <i className="fal fa-info-circle" />
                </StepIcon>
                <StepInfo>
                  <StepTitle>Item Details</StepTitle>
                  <StepDescription>Review selected item</StepDescription>
                </StepInfo>
              </Step>
              <StepConnector />
              <Step className="active">
                <StepIcon>
                  <i className="fal fa-user" />
                </StepIcon>
                <StepInfo>
                  <StepTitle>Booking Details</StepTitle>
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

            {/* Booking Content */}
            <BookingContent>
              {/* Item Details Section */}
              <ItemSection>
                <SectionTitle>
                  <h2>
                    Selected {itemType === "package" ? "Package" : "Tour"}
                  </h2>
                  <p>Review your selection before booking</p>
                </SectionTitle>

                <ItemCard>
                  <ItemImage>
                    <img
                      src={
                        item.imageUrl ||
                        "/assets/images/destinations/default.jpg"
                      }
                      alt={item.name}
                      onError={(e) => {
                        e.target.src =
                          "/assets/images/destinations/default.jpg";
                      }}
                    />
                    {selectedCurrency !== priceInfo.currency && (
                      <CurrencyConversionBadge>
                        <i className="fas fa-exchange-alt" />
                        <span>Converted from {priceInfo.currency}</span>
                      </CurrencyConversionBadge>
                    )}
                  </ItemImage>

                  <ItemContent>
                    <ItemHeader>
                      <div>
                        <LocationInfo>
                          <i className="fal fa-map-marker-alt" />
                          <span>{getLocationDisplay(item.location)}</span>
                        </LocationInfo>
                        <h3>{item.name}</h3>
                        {item.description && (
                          <ItemDescription>{item.description}</ItemDescription>
                        )}
                      </div>
                      <PriceTag>
                        <div className="converted-price">
                          {formatDisplayPrice(priceInfo.converted)}
                          <small>/person</small>
                        </div>
                        {selectedCurrency !== priceInfo.currency && (
                          <div className="original-price">
                            Originally {priceInfo.currency} {priceInfo.original.toFixed(2)}
                          </div>
                        )}
                      </PriceTag>
                    </ItemHeader>

                    <ItemMeta>
                      {itemType === "package" && (
                        <>
                          <MetaItem>
                            <i className="fal fa-tag" />
                            <span>{item.category?.name}</span>
                          </MetaItem>
                          <MetaItem>
                            <i className="fal fa-hotel" />
                            <span>{item.hotels} Hotels</span>
                          </MetaItem>
                          <MetaItem>
                            <i className="fal fa-clock" />
                            <span>{item.duration} Days</span>
                          </MetaItem>
                        </>
                      )}

                      {itemType === "tour" && (
                        <>
                          {item.tag && (
                            <MetaItem>
                              <i className="fal fa-tag" />
                              <span>{item.tag}</span>
                            </MetaItem>
                          )}
                          <MetaItem>
                            <i className="fal fa-check-circle" />
                            <span>{item.tourAvailability}</span>
                          </MetaItem>
                        </>
                      )}
                    </ItemMeta>

                    {/* Features for packages */}
                    {itemType === "package" &&
                      item.features &&
                      item.features.length > 0 && (
                        <FeaturesList>
                          {item.features.slice(0, 5).map((feature) => {
                            const iconClass =
                              activityIcons[feature.name?.toLowerCase()] ||
                              "fas fa-check";
                            return (
                              <FeatureTag key={feature.id}>
                                <i className={iconClass} />
                                <span>{feature.name}</span>
                              </FeatureTag>
                            );
                          })}
                          {item.features.length > 5 && (
                            <FeatureTag>
                              <span>+{item.features.length - 5} more</span>
                            </FeatureTag>
                          )}
                        </FeaturesList>
                      )}
                  </ItemContent>
                </ItemCard>
              </ItemSection>

              {/* Booking Form */}
              <BookingFormSection>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <SectionTitle>
                    <h2>Booking Details</h2>
                    <p>Please provide traveler information</p>
                  </SectionTitle>

                  <FormCard>
                    {/* Travel Details */}
                    <FormSection>
                      <FormSectionTitle>Travel Information</FormSectionTitle>
                      <FormGrid>
                        <FormInput
                          label="Travel Date"
                          name="travelDate"
                          type="date"
                          register={register}
                          error={errors.travelDate}
                          min={new Date().toISOString().split("T")[0]}
                        />
                        <FormInput
                          label="Number of Travelers"
                          name="travelers"
                          type="number"
                          register={register}
                          error={errors.travelers}
                          min="1"
                        />
                      </FormGrid>
                    </FormSection>

                    {/* Lead Traveler Details */}
                    <FormSection>
                      <FormSectionTitle>Lead Traveler Details</FormSectionTitle>
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
                    </FormSection>
                  </FormCard>

                  {/* Booking Summary */}
                  <BookingSummary>
                    <SummaryContent>
                      <SummaryRow>
                        <span>
                          Base Price ({watchedValues.travelers}{" "}
                          {watchedValues.travelers === 1 ? "person" : "people"})
                        </span>
                        <span>
                          {formatDisplayPrice(priceInfo.converted * watchedValues.travelers)}
                        </span>
                      </SummaryRow>
                      
                      {selectedCurrency !== priceInfo.currency && (
                        <SummaryRow className="conversion-info">
                          <span>
                            <i className="fas fa-exchange-alt" style={{ marginRight: '6px', color: '#f8853d' }} />
                            Original Price ({priceInfo.currency})
                          </span>
                          <span>
                            {priceInfo.currency} {(priceInfo.original * watchedValues.travelers).toFixed(2)}
                          </span>
                        </SummaryRow>
                      )}
                      
                      <SummaryRow>
                        <span>Taxes & Fees</span>
                        <span>Included</span>
                      </SummaryRow>
                      <TotalRow>
                        <span>Total Amount</span>
                        <strong>{formatDisplayPrice(convertedTotalAmount)}</strong>
                      </TotalRow>
                      
                      {selectedCurrency !== 'AED' && (
                        <PaymentNote>
                          <i className="fas fa-info-circle" />
                          <span>Payment will be processed in AED. Your bank may apply conversion fees.</span>
                        </PaymentNote>
                      )}
                    </SummaryContent>

                    <ActionButtons>
                      <SecondaryButton
                        type="button"
                        onClick={() => router.back()}
                      >
                        <i className="fal fa-arrow-left" />
                        Back to Selection
                      </SecondaryButton>
                      <PrimaryButton type="submit" disabled={isProcessing}>
                        {isProcessing ? (
                          <>
                            <Spinner />
                            Processing...
                          </>
                        ) : (
                          <>
                            <i className="fal fa-credit-card" />
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
              </BookingFormSection>
            </BookingContent>
          </MainContent>
        </ContentWrapper>
      </PlatformContainer>
    </ReveloLayout>
  );
};

// Styled Components
const PlatformContainer = styled.div`
  background: #f8fafc;
  min-height: 100vh;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;

  p {
    margin-top: 16px;
    color: #64748b;
  }
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 16px;
  max-width: 500px;
  margin: 40px auto;
  border: 1px solid #fed7aa;

  h2 {
    font-size: 1.5rem;
    color: #1e293b;
    margin: 0 0 16px 0;
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
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
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

const BookingCounter = styled.span`
  font-size: 14px;
  color: #f8853d;
  font-weight: 500;
`;

const CurrencyBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background: #fef7f0;
  border: 1px solid #fed7aa;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  color: #f8853d;
  white-space: nowrap;

  i {
    color: #f8853d;
  }
`;

const ContentWrapper = styled.div`
  padding: 30px 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const MainContent = styled.div`
  max-width: 900px;
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

const ItemSection = styled.div``;

const BookingFormSection = styled.div``;

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

const ItemCard = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #fed7aa;
  display: grid;
  grid-template-columns: 250px 1fr;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ItemImage = styled.div`
  height: 200px;
  position: relative;

  @media (max-width: 768px) {
    height: 250px;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const CurrencyConversionBadge = styled.div`
  position: absolute;
  bottom: 12px;
  left: 12px;
  background: rgba(248, 133, 61, 0.9);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ItemContent = styled.div`
  padding: 24px;
`;

const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;

  h3 {
    font-size: 1.2rem;
    font-weight: 600;
    color: #1e293b;
    margin: 8px 0;
  }
`;

const LocationInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #64748b;

  i {
    color: #f8853d;
  }
`;

const ItemDescription = styled.p`
  color: #64748b;
  font-size: 14px;
  line-height: 1.5;
  margin: 8px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const PriceTag = styled.div`
  text-align: right;
  white-space: nowrap;

  .converted-price {
    font-weight: 600;
    color: #f8853d;
    font-size: 1.3rem;

    small {
      font-weight: 400;
      color: #64748b;
      display: block;
      font-size: 12px;
    }
  }

  .original-price {
    font-size: 11px;
    color: #94a3b8;
    margin-top: 4px;
  }
`;

const ItemMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 16px;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #64748b;

  i {
    color: #f8853d;
    width: 14px;
  }
`;

const FeaturesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const FeatureTag = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background: #fef7f0;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: #475569;
  border: 1px solid #fed7aa;

  i {
    color: #f8853d;
    font-size: 11px;
  }
`;

const FormCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #fed7aa;
`;

const FormSection = styled.div`
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const FormSectionTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #fef7f0;
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

  &.conversion-info {
    background: #fef7f0;
    margin: 8px -12px;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 13px;
  }
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

const PaymentNote = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  padding: 8px 12px;
  background: #fffbeb;
  border: 1px solid #fed7aa;
  border-radius: 6px;
  font-size: 12px;
  color: #92400e;

  i {
    color: #d97706;
    flex-shrink: 0;
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

export default BookingPage;