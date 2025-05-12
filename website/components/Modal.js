"use client";

import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormInput from "./ui/FormInput";
import { Col, Row } from "react-bootstrap";
import PhoneInputField from "./ui/PhoneInput";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  mobile: yup
  .object()
  .required("Mobile number is required")
  .test("is-filled", "Mobile number is required", (value) => {
    return !!value?.isdCode && !!value?.phoneNumber;
  }),
  dob: yup.string().required("DOB is required"),
  adults: yup.string().required("Adults is required"),
  children: yup.string().required("Childrens is required"),
  flightBooked: yup.string().required("Flight Booked is required"),
  remarks: yup.string().max(500, "Max 500 characters"),
});

const Modal = ({ isOpen, onClose }) => {
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
        phoneNumber: ""
      },
      dob: "",
      adults: "1 Adult",
      children: "0 Child",
      flightBooked: "No",
      remarks: "",
    },
  });

  const [show, setShow] = useState(isOpen);
  const today = new Date().toISOString().split("T")[0];
  const adultOptions = [
    { value: "1 Adult", label: "1 Adult" },
    { value: "2 Adult", label: "2 Adult" },
    { value: "3 Adult", label: "3 Adult" },
  ];
  const childOptions = [
    { value: "0 Child", label: "0 Child" },
    { value: "1 Child", label: "1 Child" },
    { value: "2 Child", label: "2 Child" },
    { value: "3 Child", label: "3 Child" },
  ];

  useEffect(() => {
    if (isOpen) {
      setShow(true);
      document.body.style.overflow = "hidden";
    } else {
      setTimeout(() => setShow(false), 300);
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const onSubmit = (data) => {
    console.log("Form Submitted:", data);
    reset();
  };

  if (!show) return null;

  return (
    <Backdrop isClosing={!isOpen}>
      <ModalContainer isClosing={!isOpen} onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>×</CloseButton>
        <Header>
          <h2>Arabian Summer Retreat</h2>
          <Ribbon>3N / 4D</Ribbon>
        </Header>
        <hr />

        <form onSubmit={handleSubmit(onSubmit)}>
          <FormSection>
            <div className="form-row">
              <div>
                <FormInput
                  name="name"
                  register={register}
                  placeholder="Enter your name"
                  error={errors.name}
                />
              </div>
              <div>
                <FormInput
                  name="email"
                  register={register}
                  type="email"
                  placeholder="Enter your email"
                  error={errors.email}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="mobile-input">
                <PhoneInputField
                  name="mobile"
                  value={watch("mobile")}
                  setValue={setValue}
                  trigger={trigger}
                  error={errors.mobile}
                />
              </div>
              <div>
                <FormInput
                  as="date"
                  name="dob"
                  maxDate={today}
                  register={register}
                  error={errors?.dob}
                />
              </div>
            </div>

            <div className="form-row">
              <div>
                <FormInput
                  label="Adults"
                  name="adults"
                  register={register}
                  as="select"
                  options={adultOptions}
                  error={errors.adults}
                />
              </div>

              <div>
                <FormInput
                  label="Children"
                  name="children"
                  register={register}
                  as="select"
                  options={childOptions}
                  error={errors.children}
                />
              </div>

              <div className="radio-group">
                <FormInput
                  label="Flight Booked"
                  name="flightBooked"
                  register={register}
                  as="radio"
                  options={["Yes", "No"]}
                  error={errors.flightBooked}
                />
              </div>
            </div>

            <div className="form-row">
              <div style={{ flex: 1 }}>
                <FormInput
                  label="Remarks"
                  name="remarks"
                  register={register}
                  as="textarea"
                  placeholder="Any remarks?"
                  error={errors.remarks}
                />
              </div>
            </div>
          </FormSection>

          <SubmitButton type="submit">Submit Enquiry</SubmitButton>
        </form>
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
  from { transform: translateY(-20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const slideOut = keyframes`
  from { transform: translateY(0); opacity: 1; }
  to { transform: translateY(-20px); opacity: 0; }
`;

// Styled Components
export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  animation: ${({ isClosing }) => (isClosing ? fadeOut : fadeIn)} 0.3s ease
    forwards;
`;

export const ModalContainer = styled.div`
  background: white;
  border-radius: 20px;
  max-width: 700px;
  padding: 2rem;
  position: relative;
  overflow-y: auto;
  max-height: 90vh;
  animation: ${({ isClosing }) => (isClosing ? slideOut : slideIn)} 0.3s ease
    forwards;

  @media (max-width: 600px) {
    padding: 1rem;
  }

  p {
    color: red;
    font-size: 0.75rem;
    margin-top: 0.3rem;
  }
`;

export const CloseButton = styled.button`
  position: absolute;
  padding: 6px;
  border-radius: 5%;
  top: 0px;
  right: 0px;
  background: red;
  font-size: 1.5rem;
  border: none;
  cursor: pointer;
  color: #fff;
  z-index: 1;

  @media (max-width: 600px) {
    font-size: 1.2rem;
  }
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;

  h2 {
    font-weight: 600;
    font-size: 1.5rem;
  }
`;

export const Ribbon = styled.div`
  background: #ee8b50;
  color: white;
  font-weight: bold;
  padding: 0.4rem 1rem;
  border-radius: 4px 4px 0 0;
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

export const FormSection = styled.div`
  .form-row {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1rem;

    .mobile-input {
      display: flex;
    }
  }
`;

export const SubmitButton = styled.button`
  width: 100%;
  background: #ee8b50;
  color: white;
  font-weight: 600;
  padding: 0.8rem;
  border: none;
  border-radius: 10px;
  margin-top: 1rem;
  cursor: pointer;
  font-size: 1rem;

  @media (max-width: 600px) {
    font-size: 0.9rem;
  }
`;
