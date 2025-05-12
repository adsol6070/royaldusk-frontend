"use client";

import React from "react";
import styled, { css } from "styled-components";

const FormInput = ({
  label,
  type = "text",
  placeholder,
  register,
  name,
  options = [],
  error,
  as = "input",
  value,
  multiple = false,
  border = "yes",
  minDate,
  maxDate,
  ...rest
}) => {
  let InputComponent;

  if (as === "textarea") {
    InputComponent = StyledTextarea;
  } else if (as === "select") {
    InputComponent = StyledSelect;
  } else if (as === "radio") {
    InputComponent = StyledRadio;
  } else if (as === "checkbox") {
    InputComponent = StyledCheckbox;
  } else if (as === "date") {
    InputComponent = StyledInput;
  } else {
    InputComponent = StyledInput;
  }

  const isMultiSelect = multiple ? { multiple: true } : {};
  const registerProps = register && name ? register(name) : {};

  return (
    <FieldWrapper>
      {label && <Label>{label}</Label>}
      {as === "select" || as === "multi-select" ? (
        <StyledSelect
          {...registerProps}
          className={error ? "error" : ""}
          border={border}
          {...isMultiSelect}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled selected={!value}>
              {placeholder}
            </option>
          )}
          {options.map((opt, i) => (
            <option key={i} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </StyledSelect>
      ) : as === "radio" ? (
        <GroupWrapper>
          {options.map((opt, i) => (
            <RadioWrapper key={i}>
              <label>
                <input
                  type="radio"
                  {...registerProps}
                  value={opt}
                  className={error ? "error" : ""}
                />{" "}
                {opt}
              </label>
            </RadioWrapper>
          ))}
        </GroupWrapper>
      ) : as === "checkbox" ? (
        <GroupWrapper>
          {options.map((opt, i) => (
            <CheckboxWrapper key={i}>
              <label>
                <input
                  type="checkbox"
                  {...registerProps}
                  value={opt}
                  className={error ? "error" : ""}
                />{" "}
                {opt}
              </label>
            </CheckboxWrapper>
          ))}
        </GroupWrapper>
      ) : (
        <InputComponent
          type={as === "date" ? "date" : type}
          placeholder={placeholder}
          value={value}
          {...registerProps}
          className={error ? "error" : ""}
          border={border}
          min={minDate}
          max={maxDate}
          {...rest}
        />
      )}

      {error && <ErrorText>{error.message}</ErrorText>}
    </FieldWrapper>
  );
};

// Styled components remain unchanged
const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 200px;
`;

const Label = styled.label`
  font-size: 0.95rem;
  margin-bottom: 0.4rem;
  font-weight: 500;
`;

const baseStyle = css`
  padding: 0.7rem;
  border-radius: 8px;
  border: ${({ border }) => (border === "none" ? "none !important" : "1px solid #ccc")};
  font-size: 1rem;
  width: 100%;

  &.error {
    border-color: red !important;
  }
`;

const StyledInput = styled.input`
  ${baseStyle}
`;

const StyledSelect = styled.select`
  ${baseStyle}
`;

const StyledTextarea = styled.textarea`
  ${baseStyle}
  resize: vertical;
`;

const StyledRadio = styled.input`
  margin-right: 0.5rem;
`;

const StyledCheckbox = styled.input`
  margin-right: 0.5rem;
`;

const RadioWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const CheckboxWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const ErrorText = styled.p`
  color: red;
  font-size: 0.75rem;
  margin-top: 0.3rem;
`;

const GroupWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

export default FormInput;
