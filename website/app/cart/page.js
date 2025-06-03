"use client";

import React, { useEffect, useState } from "react";
import Banner from "@/components/Banner";
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
  const { userInfo, addBooking } = useAuth();
  const router = useRouter();
  const [totalAmount, setTotalAmount] = useState(0);
  const [hasDateValidation, setHasDateValidation] = useState(false);

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
    // Update form with user data when available
    if (userInfo) {
      setValue('name', userInfo.name);
      setValue('email', userInfo.email);
    }
  }, [userInfo, setValue]);

  useEffect(() => {
    // Calculate total amount whenever cart items change
    const total = cartItems.reduce((sum, item) => {
      return sum + (item.price * item.travelers);
    }, 0);
    setTotalAmount(total);

    // Check if any items are missing dates
    const hasMissingDates = cartItems.some(item => !item.startDate);
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
      toast.error('Your cart is empty!');
      return;
    }

    if (cartItems.some(item => !item.startDate)) {
      toast.error('Please select start date for all packages!');
      return;
    }

    // Add each cart item as a booking
    cartItems.forEach(item => {
      addBooking({
        packageName: item.name,
        date: item.startDate,
        price: item.price * item.travelers,
        travelers: item.travelers,
        bookingDate: new Date().toISOString().split('T')[0]
      });
    });

    // Clear the cart after successful booking
    clearCart();
    toast.success('Booking submitted successfully!');
  };

  const nat = getNationalities();
  const nationalityOptions = nat.map((country) => ({
    label: country.name,
    value: country.name,
  }));

  return (
    <ReveloLayout>
      <Banner pageTitle="Shopping Cart" />
      <PageWrapper>
        {cartItems.length === 0 ? (
          <EmptyCartSection>
            <div className="text-center">
              <i className="fal fa-shopping-cart fa-4x mb-4 text-muted"></i>
              <h2>Your Cart is Empty</h2>
              <p className="text-muted mb-4">Looks like you haven't added any holiday packages to your cart yet.</p>
              <Link href="/holidays" className="theme-btn style-two">
                Browse Holiday Packages <i className="fal fa-arrow-right"></i>
              </Link>
            </div>
          </EmptyCartSection>
        ) : (
          <Section>
            <CartSection>
              <CartHeader>
                <h2>Your Selected Packages</h2>
                <span>{cartItems.length} {cartItems.length === 1 ? 'Package' : 'Packages'}</span>
              </CartHeader>

              {hasDateValidation && (
                <ValidationWarning>
                  <i className="fal fa-exclamation-triangle"></i>
                  Please select travel dates for all packages to proceed with booking.
                </ValidationWarning>
              )}

              <CartItems>
                {cartItems.map((packageItem) => (
                  <CartItem key={packageItem.id}>
                    <CartItemImage>
                      <img src={packageItem.imageUrl} alt={packageItem.name} />
                    </CartItemImage>
                    <CartItemContent>
                      <CartItemHeader>
                        <h3>{packageItem.name}</h3>
                        <RemoveButton onClick={() => removeFromCart(packageItem.id)}>
                          <i className="fal fa-times"></i>
                        </RemoveButton>
                      </CartItemHeader>
                      <CartItemDetails>
                        <DetailGroup>
                          <DetailLabel>Location</DetailLabel>
                          <DetailValue>{packageItem.location.name}</DetailValue>
                        </DetailGroup>
                        <DetailGroup>
                          <DetailLabel>Duration</DetailLabel>
                          <DetailValue>{packageItem.duration}</DetailValue>
                        </DetailGroup>
                        <DetailGroup>
                          <DetailLabel>Start Date</DetailLabel>
                          <DateInput
                            type="date"
                            value={packageItem.startDate || ''}
                            onChange={(e) => handleDateChange(packageItem.id, e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className="form-control"
                            required
                          />
                          <ErrorMessage className="error-message">
                            Please select a start date
                          </ErrorMessage>
                        </DetailGroup>
                        <DetailGroup>
                          <DetailLabel>Travelers</DetailLabel>
                          <input
                            type="number"
                            value={packageItem.travelers}
                            onChange={(e) => handleTravelersChange(packageItem.id, e.target.value)}
                            min="1"
                            className="form-control"
                          />
                        </DetailGroup>
                      </CartItemDetails>
                      <CartItemFooter>
                        <PricePerPerson>AED {packageItem.price} per person</PricePerPerson>
                        <TotalPrice>Total: AED {(packageItem.price * packageItem.travelers).toFixed(2)}</TotalPrice>
                      </CartItemFooter>
                    </CartItemContent>
                  </CartItem>
                ))}
              </CartItems>
            </CartSection>

            <CheckoutSection>
              <form onSubmit={handleSubmit(onSubmit)}>
                <CheckoutBlock>
                  <h3>Lead Passenger Details</h3>
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
                    <FormInput
                      label="Special Requests"
                      name="remarks"
                      as="textarea"
                      register={register}
                      error={errors.remarks}
                    />
                  </FormGrid>
                </CheckoutBlock>

                <CheckoutBlock>
                  <h3>Payment Method</h3>
                  <PaymentOptions>
                    <PaymentOption>
                      <input type="radio" name="payment" id="card" defaultChecked />
                      <label htmlFor="card">
                        <span>Credit/Debit Card</span>
                        <small>Secure payment via bank</small>
                      </label>
                    </PaymentOption>
                    <PaymentOption>
                      <input type="radio" name="payment" id="points" />
                      <label htmlFor="points">
                        <span>Pointspay</span>
                        <small>Pay with your reward points</small>
                      </label>
                    </PaymentOption>
                  </PaymentOptions>
                </CheckoutBlock>

                <OrderSummary>
                  <h3>Order Summary</h3>
                  <SummaryRow>
                    <span>Subtotal</span>
                    <span>AED {totalAmount.toFixed(2)}</span>
                  </SummaryRow>
                  <SummaryRow>
                    <span>Tax</span>
                    <span>AED 0.00</span>
                  </SummaryRow>
                  <SummaryTotal>
                    <span>Total Amount</span>
                    <span>AED {totalAmount.toFixed(2)}</span>
                  </SummaryTotal>
                  <CheckoutButton 
                    type="submit"
                    disabled={hasDateValidation}
                    style={{
                      opacity: hasDateValidation ? 0.7 : 1,
                      cursor: hasDateValidation ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {hasDateValidation ? 'Select All Dates to Proceed' : 'Proceed to Payment'}
                  </CheckoutButton>
                </OrderSummary>
              </form>
            </CheckoutSection>
          </Section>
        )}
      </PageWrapper>
    </ReveloLayout>
  );
};

// Styled Components
const PageWrapper = styled.div`
  padding: 3rem 1.5rem;
  max-width: 1440px;
  margin: auto;
`;

const EmptyCartSection = styled.div`
  padding: 4rem 2rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  text-align: center;

  h2 {
    margin-bottom: 1rem;
    color: #333;
  }
`;

const Section = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2rem;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const CartSection = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

const CartHeader = styled.div`
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    font-size: 1.5rem;
    margin: 0;
  }

  span {
    color: #666;
  }
`;

const CartItems = styled.div`
  padding: 2rem;
`;

const CartItem = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 1.5rem;
  padding: 1.5rem;
  background: #f9f9f9;
  border-radius: 8px;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CartItemImage = styled.div`
  img {
    width: 100%;
    height: 150px;
    object-fit: cover;
    border-radius: 8px;
  }
`;

const CartItemContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CartItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  h3 {
    font-size: 1.2rem;
    margin: 0;
  }
`;

const CartItemDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const DetailGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const DetailLabel = styled.span`
  font-size: 0.9rem;
  color: #666;
`;

const DetailValue = styled.span`
  font-weight: 500;
`;

const CartItemFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid #eee;
`;

const PricePerPerson = styled.span`
  color: #666;
`;

const TotalPrice = styled.span`
  font-size: 1.1rem;
  font-weight: 600;
  color: #ff7a29;
`;

const CheckoutSection = styled.div`
  position: sticky;
  top: 2rem;
`;

const CheckoutBlock = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);

  h3 {
    font-size: 1.2rem;
    margin-bottom: 1.5rem;
  }
`;

const FormGrid = styled.div`
  display: grid;
  gap: 1rem;
`;

const PaymentOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const PaymentOption = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: #f9f9f9;
  }

  label {
    flex: 1;
    display: flex;
    flex-direction: column;
    cursor: pointer;

    span {
      font-weight: 500;
    }

    small {
      color: #666;
    }
  }
`;

const OrderSummary = styled(CheckoutBlock)`
  background: #fff;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  color: #666;
`;

const SummaryTotal = styled(SummaryRow)`
  border-top: 2px solid #eee;
  margin-top: 0.5rem;
  padding-top: 1rem;
  font-weight: 600;
  color: #333;
  font-size: 1.1rem;
`;

const CheckoutButton = styled.button`
  width: 100%;
  background: #ff7a29;
  color: white;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  margin-top: 1.5rem;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #e56d1f;
  }
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.2s ease;

  &:hover {
    background: #fff;
    color: #dc3545;
  }
`;

const DateInput = styled.input`
  &:required:invalid {
    border-color: #dc3545;
    background-color: #fff8f8;
  }

  &:required:invalid + .error-message {
    display: block;
  }
`;

const ErrorMessage = styled.span`
  color: #dc3545;
  font-size: 0.8rem;
  margin-top: 0.25rem;
  display: none;
`;

const ValidationWarning = styled.div`
  color: #856404;
  background-color: #fff3cd;
  border: 1px solid #ffeeba;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  i {
    font-size: 1.2rem;
  }
`;

export default Page;
