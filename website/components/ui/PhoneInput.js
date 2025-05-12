"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 200px;

  .react-tel-input {
    width: 100%;
    height: 48px;
    border-radius: 12px;
    border: 1px solid #ccc;
    display: flex;
    align-items: center;
    padding-left: 12px;

    &.error {
      border-color: red !important;
    }
  }

  .react-tel-input .form-control {
    border: none;
    width: 100%;
    height: 100%;
    font-size: 14px;
    border-radius: 12px;
    outline: none;
    box-shadow: none;
  }

  .react-tel-input .flag-dropdown {
    border: none;
    background-color: transparent;
  }

  .react-tel-input .country-list {
    border-radius: 8px;
    max-height: 200px;
    overflow-y: auto;
  }
`;

const Label = styled.label`
  font-size: 0.95rem;
  margin-bottom: 0.4rem;
  font-weight: 500;
`;

const ErrorText = styled.p`
  color: red;
  font-size: 0.75rem;
  margin-top: 0.3rem;
`;

const PhoneInputField = ({
  label,
  name,
  value,
  setValue,
  trigger,
  placeholder = "Enter your mobile number",
  country = "971",
  error,
}) => {
  const [internalValue, setInternalValue] = useState("");
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const handleChange = (fullValue, countryData) => {
    const dialCode = countryData?.dialCode || "";
    const number = fullValue.startsWith(dialCode)
      ? fullValue.slice(dialCode.length)
      : fullValue.replace(`+${dialCode}`, "");

    const finalValue = {
      isdCode: `+${dialCode}`,
      phoneNumber: number,
    };

    setInternalValue(fullValue);
    setValue(name, finalValue); 
    trigger(name);
  };

  useEffect(() => {
    if (!value?.phoneNumber && !value?.isdCode) {
      setInternalValue("");
    } else {
      setInternalValue(value.isdCode + value.phoneNumber);
    }
  }, [value]);

  if (!hasMounted) return null;

  return (
    <StyledContainer>
      {label && <Label htmlFor={name}>{label}</Label>}
      <PhoneInput
        country={country}
        value={internalValue}
        onChange={handleChange}
        placeholder={placeholder}
        inputProps={{
          name,
        }}
        containerClass={error ? "react-tel-input error" : "react-tel-input"}
      />
      {error && <ErrorText>{error.message}</ErrorText>}
    </StyledContainer>
  );
};

export default PhoneInputField;
