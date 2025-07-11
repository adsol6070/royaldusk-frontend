"use client";

import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { packageApi } from "@/common/api";
import { toast } from "react-hot-toast";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  mobile: yup
    .object()
    .required("Mobile number is required")
    .test("is-filled", "Mobile number is required", (value) => {
      return !!value?.isdCode && !!value?.phoneNumber;
    }),
  dob: yup.string().required("Date of birth is required"),
  adults: yup.string().required("Number of adults is required"),
  children: yup.string().required("Number of children is required"),
  flightBooked: yup.string().required("Flight booking status is required"),
  remarks: yup.string().max(300, "Maximum 300 characters allowed"),
});

const Modal = ({ isOpen, onClose, packageId, packageDetail }) => {
  const {
    register,
    handleSubmit,
    reset,
    trigger,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      mobile: {
        isdCode: "971",
        phoneNumber: "",
      },
      dob: "",
      adults: "1",
      children: "0",
      flightBooked: "No",
      remarks: "",
    },
  });

  const [show, setShow] = useState(isOpen);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  
  const adultOptions = [
    { value: "1", label: "1 Adult" },
    { value: "2", label: "2 Adults" },
    { value: "3", label: "3 Adults" },
    { value: "4", label: "4 Adults" },
    { value: "5", label: "5+ Adults" },
  ];
  
  const childOptions = [
    { value: "0", label: "No Children" },
    { value: "1", label: "1 Child" },
    { value: "2", label: "2 Children" },
    { value: "3", label: "3 Children" },
    { value: "4", label: "4+ Children" },
  ];

  useEffect(() => {
    if (isOpen) {
      setShow(true);
      document.body.style.overflow = "hidden";
    } else {
      const timer = setTimeout(() => {
        setShow(false);
        document.body.style.overflow = "auto";
      }, 300);
      return () => clearTimeout(timer);
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    const payload = {
      ...data,
      isdCode: data.mobile.isdCode,
      mobile: data.mobile.phoneNumber,
      dob: new Date(data.dob).toISOString(),
      packageID: packageId,
    };

    try {
      const response = await packageApi.sendEnquiry(payload);
      toast.success("Inquiry sent successfully! We'll contact you soon.");
      reset();
      onClose();
    } catch (error) {
      toast.error("Failed to send inquiry. Please try again.");
      console.error("Error submitting enquiry:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!show) return null;

  return (
    <Backdrop isClosing={!isOpen} onClick={handleBackdropClick}>
      <ModalContainer isClosing={!isOpen} onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <HeaderContent>
            <div className="title-section">
              <h2>Send Travel Inquiry</h2>
              <p>Get personalized quotes and detailed information</p>
            </div>
            <CloseButton onClick={onClose}>
              <i className="fal fa-times" />
            </CloseButton>
          </HeaderContent>
          
          {packageDetail && (
            <PackageInfo>
              <div className="package-card">
                <div className="package-image">
                  <img 
                    src={packageDetail.imageUrl} 
                    alt={packageDetail.name}
                    onError={(e) => {
                      e.target.src = '/assets/images/destinations/default.jpg';
                    }}
                  />
                </div>
                <div className="package-details">
                  <h3>{packageDetail.name}</h3>
                  <div className="package-meta">
                    <div className="location">
                      <i className="fal fa-map-marker-alt" />
                      {packageDetail.location?.name}
                    </div>
                    <div className="duration">
                      <i className="fal fa-clock" />
                      {packageDetail.duration} Days
                    </div>
                    <div className="price">
                      <i className="fal fa-tag" />
                      {packageDetail.currency} {packageDetail.price}
                    </div>
                  </div>
                </div>
              </div>
            </PackageInfo>
          )}
        </ModalHeader>

        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormSection>
              <SectionTitle>Personal Information</SectionTitle>
              
              <FormGrid>
                <FormGroup>
                  <FieldLabel>Full Name *</FieldLabel>
                  <CustomInput
                    {...register("name")}
                    placeholder="Enter your full name"
                    hasError={!!errors.name}
                  />
                  {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
                </FormGroup>
                
                <FormGroup>
                  <FieldLabel>Email Address *</FieldLabel>
                  <CustomInput
                    type="email"
                    {...register("email")}
                    placeholder="your.email@example.com"
                    hasError={!!errors.email}
                  />
                  {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
                </FormGroup>
              </FormGrid>

              <FormGrid>
                <FormGroup>
                  <FieldLabel>Mobile Number *</FieldLabel>
                  <PhoneInputContainer>
                    <CountrySelect
                      {...register("mobile.isdCode")}
                      hasError={!!errors.mobile}
                    >
                      <option value="971">+971 (UAE)</option>
                      <option value="91">+91 (India)</option>
                      <option value="1">+1 (USA)</option>
                      <option value="44">+44 (UK)</option>
                    </CountrySelect>
                    <CustomInput
                      {...register("mobile.phoneNumber")}
                      placeholder="50 123 4567"
                      hasError={!!errors.mobile}
                    />
                  </PhoneInputContainer>
                  {errors.mobile && <ErrorMessage>{errors.mobile.message}</ErrorMessage>}
                </FormGroup>
                
                <FormGroup>
                  <FieldLabel>Date of Birth *</FieldLabel>
                  <CustomInput
                    type="date"
                    {...register("dob")}
                    max={today}
                    hasError={!!errors.dob}
                  />
                  {errors.dob && <ErrorMessage>{errors.dob.message}</ErrorMessage>}
                </FormGroup>
              </FormGrid>
            </FormSection>

            <FormSection>
              <SectionTitle>Travel Details</SectionTitle>
              
              <FormGrid>
                <FormGroup>
                  <FieldLabel>Number of Adults *</FieldLabel>
                  <CustomSelect
                    {...register("adults")}
                    hasError={!!errors.adults}
                  >
                    {adultOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </CustomSelect>
                  {errors.adults && <ErrorMessage>{errors.adults.message}</ErrorMessage>}
                </FormGroup>

                <FormGroup>
                  <FieldLabel>Number of Children *</FieldLabel>
                  <CustomSelect
                    {...register("children")}
                    hasError={!!errors.children}
                  >
                    {childOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </CustomSelect>
                  {errors.children && <ErrorMessage>{errors.children.message}</ErrorMessage>}
                </FormGroup>
              </FormGrid>

              <FormGroup>
                <FieldLabel>Flight Booking Status *</FieldLabel>
                <RadioGroup>
                  <RadioOption>
                    <input
                      type="radio"
                      id="flight-yes"
                      value="Yes"
                      {...register("flightBooked")}
                    />
                    <label htmlFor="flight-yes">
                      <span className="radio-custom"></span>
                      Flight already booked
                    </label>
                  </RadioOption>
                  <RadioOption>
                    <input
                      type="radio"
                      id="flight-no"
                      value="No"
                      {...register("flightBooked")}
                    />
                    <label htmlFor="flight-no">
                      <span className="radio-custom"></span>
                      Need flight booking assistance
                    </label>
                  </RadioOption>
                </RadioGroup>
                {errors.flightBooked && (
                  <ErrorMessage>{errors.flightBooked.message}</ErrorMessage>
                )}
              </FormGroup>

              <FormGroup>
                <FieldLabel>Special Requests (Optional)</FieldLabel>
                <CustomTextarea
                  {...register("remarks")}
                  placeholder="Any special requirements, dietary restrictions, or additional information..."
                  hasError={!!errors.remarks}
                  rows={3}
                />
                <CharacterCount>
                  {watch("remarks")?.length || 0}/300 characters
                </CharacterCount>
                {errors.remarks && <ErrorMessage>{errors.remarks.message}</ErrorMessage>}
              </FormGroup>
            </FormSection>

            <ModalFooter>
              <ActionButtons>
                <SecondaryButton type="button" onClick={onClose}>
                  <i className="fal fa-times" />
                  Cancel
                </SecondaryButton>
                <PrimaryButton type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Spinner />
                      Sending...
                    </>
                  ) : (
                    <>
                      <i className="fal fa-paper-plane" />
                      Send Inquiry
                    </>
                  )}
                </PrimaryButton>
              </ActionButtons>
              
              <FooterNote>
                <i className="fal fa-shield-check" />
                Your information is secure and will only be used to process your inquiry
              </FooterNote>
            </ModalFooter>
          </form>
        </ModalBody>
      </ModalContainer>
    </Backdrop>
  );
};

export default Modal;

// Animations
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const slideIn = keyframes`
  from { 
    transform: translateY(-30px) scale(0.95); 
    opacity: 0; 
  }
  to { 
    transform: translateY(0) scale(1); 
    opacity: 1; 
  }
`;

const slideOut = keyframes`
  from { 
    transform: translateY(0) scale(1); 
    opacity: 1; 
  }
  to { 
    transform: translateY(-30px) scale(0.95); 
    opacity: 0; 
  }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// Styled Components
const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  padding: 20px;
  animation: ${({ isClosing }) => (isClosing ? fadeOut : fadeIn)} 0.3s ease forwards;
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: 12px;
  max-width: 480px;
  width: 100%;
  max-height: 85vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: ${({ isClosing }) => (isClosing ? slideOut : slideIn)} 0.3s ease forwards;
  display: flex;
  flex-direction: column;

  @media (max-width: 640px) {
    max-width: 95vw;
    margin: 10px;
  }
`;

const ModalHeader = styled.div`
  background: linear-gradient(135deg, #f8853d 0%, #e67428 100%);
  color: white;
  position: relative;
  flex-shrink: 0;
`;

const HeaderContent = styled.div`
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  .title-section {
    h2 {
      font-size: 1.1rem;
      font-weight: 600;
      margin: 0 0 2px 0;
      color: white;
    }

    p {
      font-size: 0.75rem;
      margin: 0;
      opacity: 0.9;
      color: white;
    }
  }
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: white;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }

  i {
    font-size: 12px;
  }
`;

const PackageInfo = styled.div`
  padding: 0 20px 16px;

  .package-card {
    display: flex;
    gap: 12px;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 8px;
    padding: 12px;
    backdrop-filter: blur(10px);

    .package-image {
      width: 60px;
      height: 60px;
      border-radius: 6px;
      overflow: hidden;
      flex-shrink: 0;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .package-details {
      flex: 1;
      min-width: 0;

      h3 {
        font-size: 0.85rem;
        font-weight: 600;
        margin: 0 0 6px 0;
        color: white;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .package-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        font-size: 0.7rem;
        color: rgba(255, 255, 255, 0.9);

        > div {
          display: flex;
          align-items: center;
          gap: 3px;

          i {
            font-size: 10px;
          }
        }
      }
    }
  }
`;

const ModalBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f5f9;
  }

  &::-webkit-scrollbar-thumb {
    background: #fed7aa;
    border-radius: 2px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #f8853d;
  }
`;

const FormSection = styled.div`
  margin-bottom: 18px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h4`
  font-size: 0.8rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 12px 0;
  padding-bottom: 6px;
  border-bottom: 1px solid #fed7aa;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 30px;
    height: 1px;
    background: #f8853d;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 12px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 10px;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const FieldLabel = styled.label`
  font-size: 0.7rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 4px;
  display: block;
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const RadioOption = styled.div`
  label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.75rem;
    color: #374151;
    cursor: pointer;
    padding: 6px 0;

    .radio-custom {
      width: 14px;
      height: 14px;
      border: 2px solid #fed7aa;
      border-radius: 50%;
      position: relative;
      transition: all 0.2s ease;
      flex-shrink: 0;

      &::after {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0);
        width: 6px;
        height: 6px;
        background: #f8853d;
        border-radius: 50%;
        transition: transform 0.2s ease;
      }
    }

    &:hover .radio-custom {
      border-color: #f8853d;
    }
  }

  input[type="radio"] {
    display: none;

    &:checked + label .radio-custom {
      border-color: #f8853d;
      background: rgba(248, 133, 61, 0.1);

      &::after {
        transform: translate(-50%, -50%) scale(1);
      }
    }
  }
`;

const ErrorMessage = styled.span`
  color: #dc2626;
  font-size: 0.65rem;
  margin-top: 3px;
  display: block;
`;

const CharacterCount = styled.span`
  font-size: 0.65rem;
  color: #64748b;
  margin-top: 3px;
  text-align: right;
`;

const ModalFooter = styled.div`
  border-top: 1px solid #fed7aa;
  padding: 16px 20px;
  margin-top: 0;
  flex-shrink: 0;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 12px;

  @media (max-width: 640px) {
    flex-direction: column-reverse;
    gap: 8px;
  }
`;

const SecondaryButton = styled.button`
  flex: 1;
  background: #fef7f0;
  color: #f8853d;
  border: 1px solid #fed7aa;
  padding: 10px 14px;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  &:hover {
    background: #f8853d;
    color: white;
  }

  i {
    font-size: 11px;
  }
`;

const PrimaryButton = styled.button`
  flex: 2;
  background: linear-gradient(135deg, #f8853d 0%, #e67428 100%);
  color: white;
  border: none;
  padding: 10px 14px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #e67428 0%, #d65e1f 100%);
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(248, 133, 61, 0.3);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  i {
    font-size: 11px;
  }
`;

const Spinner = styled.div`
  width: 12px;
  height: 12px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

// Custom Form Components
const CustomInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${props => props.hasError ? '#dc2626' : '#fed7aa'};
  border-radius: 6px;
  font-size: 0.8rem;
  background: white;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#dc2626' : '#f8853d'};
    box-shadow: 0 0 0 3px ${props => props.hasError ? 'rgba(220, 38, 38, 0.1)' : 'rgba(248, 133, 61, 0.1)'};
  }

  &::placeholder {
    color: #9ca3af;
    font-size: 0.75rem;
  }
`;

const CustomSelect = styled.select`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${props => props.hasError ? '#dc2626' : '#fed7aa'};
  border-radius: 6px;
  font-size: 0.8rem;
  background: white;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#dc2626' : '#f8853d'};
    box-shadow: 0 0 0 3px ${props => props.hasError ? 'rgba(220, 38, 38, 0.1)' : 'rgba(248, 133, 61, 0.1)'};
  }
`;

const CustomTextarea = styled.textarea`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${props => props.hasError ? '#dc2626' : '#fed7aa'};
  border-radius: 6px;
  font-size: 0.8rem;
  background: white;
  resize: vertical;
  min-height: 70px;
  font-family: inherit;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#dc2626' : '#f8853d'};
    box-shadow: 0 0 0 3px ${props => props.hasError ? 'rgba(220, 38, 38, 0.1)' : 'rgba(248, 133, 61, 0.1)'};
  }

  &::placeholder {
    color: #9ca3af;
    font-size: 0.75rem;
  }
`;

const PhoneInputContainer = styled.div`
  display: flex;
  gap: 8px;
`;

const FooterNote = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 0.65rem;
  color: #64748b;
  text-align: center;

  i {
    color: #10b981;
    font-size: 10px;
  }
`;
const CountrySelect = styled.select`
  width: 100px;
  padding: 8px 6px;
  border: 1px solid ${props => props.hasError ? '#dc2626' : '#fed7aa'};
  border-radius: 6px;
  font-size: 0.75rem;
  background: white;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#dc2626' : '#f8853d'};
    box-shadow: 0 0 0 3px ${props => props.hasError ? 'rgba(220, 38, 38, 0.1)' : 'rgba(248, 133, 61, 0.1)'};
  }
`;