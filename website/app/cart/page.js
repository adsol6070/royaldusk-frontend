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
      name: "",
      email: "",
      mobile: { isdCode: "971", phoneNumber: "" },
      nationality: "",
      remarks: "",
    },
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const onSubmit = (data) => {
    console.log("Form Submitted:", data);
  };
  
  const nat = getNationalities();
  const nationalityOptions = nat.map((country) => ({
    label: country.name,
    value: country.name,
  }));

  return (
    <ReveloLayout>
      <Banner pageTitle="Cart" />
      <PageWrapper>
        <Section>
          <FormContainer>
            <Title>Lead Passenger Details</Title>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Row>
                <Column>
                  <FormInput
                    label="Name"
                    name="name"
                    register={register}
                    placeholder="First Name"
                    error={errors.name}
                  />
                </Column>
                <Column>
                  <FormInput
                    label="Email"
                    name="email"
                    type="email"
                    register={register}
                    placeholder="Email Address"
                    error={errors.email}
                  />
                </Column>
              </Row>
              <Row>
                <Column>
                  <PhoneInputField
                    label={"Mobile Number"}
                    name="mobile"
                    value={watch("mobile")}
                    setValue={setValue}
                    trigger={trigger}
                    error={errors.mobile}
                  />
                </Column>
                <Column>
                  <FormInput
                    label="Nationality"
                    name="nationality"
                    register={register}
                    placeholder="Select Nationality"
                    as="select"
                    options={nationalityOptions}
                    error={errors.nationality}
                  />
                </Column>
              </Row>
              <Row>
                <Column>
                  <FormInput
                    label="Rmearks"
                    name="remarks"
                    as="textarea"
                    register={register}
                    placeholder="Any remarks?"
                    error={errors.remarks}
                  />
                </Column>
              </Row>

              <SubmitButton type="submit">Submit Enquiry</SubmitButton>
            </form>
            <Divider />
            <PaymentSection>
              <Title>Choose a Payment Method</Title>
              <PaymentOptions>
                <label>
                  <input type="radio" name="payment" defaultChecked />
                  <div className="d-flex flex-column">
                    <span>Credit/Debit Card</span>
                    <small>
                      Note: You’ll be redirected to your bank’s site to complete
                      payment.
                    </small>
                  </div>
                </label>

                <label>
                  <input type="radio" name="payment" />
                  <span>Pointspay</span>
                </label>
              </PaymentOptions>

              <FinalBox>
                <h3>Final Amount</h3>
                <strong>AED 179.00</strong>
              </FinalBox>
            </PaymentSection>
          </FormContainer>

          <TicketSummaryGrid>
            {Array.from({ length: 10 }).map((_, idx) => (
              <TicketCard key={idx}>
                <SummaryTitle>Burj Khalifa At The Top Tickets</SummaryTitle>
                <SummaryBox>
                  <Detail>
                    <strong>Tour Option:</strong> 124th + 125th Floor Non-Prime
                    Hours
                  </Detail>
                  <Detail>
                    <strong>Date:</strong> 3/5/2025
                  </Detail>
                  <Detail>
                    <strong>Time:</strong> 14:00 GST
                  </Detail>
                  <Detail>
                    <strong>Transfer:</strong> Without Transfers
                  </Detail>
                  <Detail>
                    <strong>Pax:</strong> 1 Adult
                  </Detail>
                  <Detail>
                    <strong>Cancel Policy:</strong>
                    <PolicyBadge>Non Refundable</PolicyBadge>
                  </Detail>
                  <Total>
                    <strong>Total:</strong> AED 179.00
                  </Total>
                </SummaryBox>
              </TicketCard>
            ))}
          </TicketSummaryGrid>
        </Section>
      </PageWrapper>
    </ReveloLayout>
  );
};

// Styled Components

const PageWrapper = styled.div`
  padding: 3rem 1.5rem;
  max-width: 1280px;
  margin: auto;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: flex-start;
  }
`;

const FormContainer = styled.div`
  flex: 2;
  background: #ffffff;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.05);
`;

const TicketSummaryGrid = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-height: 100vh;
  overflow-y: auto;
`;

const TicketCard = styled.div`
  background: #fefefe;
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid #ececec;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-3px);
  }
`;

const SummaryBox = styled.div`
  background: #fff;
  padding: 1rem;
  border-radius: 10px;
  font-size: 0.95rem;
  line-height: 1.6;
`;

const Detail = styled.p`
  margin: 0.25rem 0;
`;

const PolicyBadge = styled.span`
  background: #ffe0e0;
  color: #c0392b;
  padding: 0.25rem 0.6rem;
  font-size: 0.75rem;
  border-radius: 4px;
  margin-left: 0.4rem;
`;

const Total = styled.p`
  font-weight: 600;
  font-size: 1.1rem;
  margin-top: 1rem;
`;

const SummaryTitle = styled.h3`
  font-size: 1.1rem;
  margin-bottom: 1rem;
  font-weight: 600;
  border-bottom: 1px solid #ddd;
  padding-bottom: 0.5rem;
`;

const Title = styled.h2`
  font-size: 1.4rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
`;

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const Column = styled.div`
  flex: 1;
  min-width: 240px;
`;

const Divider = styled.hr`
  margin: 3rem 0;
  border: none;
  border-top: 1px solid #eee;
`;

const PaymentSection = styled.div`
  background: #ffffff;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.04);
`;

const PaymentOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;

  label {
    display: flex;
    background: #f9f9f9;
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid #ddd;
    gap: 0.5rem;

    span {
      font-weight: 500;
    }

    small {
      color: #777;
    }
  }
`;

const FinalBox = styled.div`
  margin-top: 2rem;
  padding: 1.2rem;
  background: #fff4ea;
  border: 1px solid #f3d4bd;
  border-radius: 8px;
  font-size: 1.1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  strong {
    font-size: 1.3rem;
    color: #333;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  background: #ff7a29;
  color: white;
  padding: 0.9rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s ease;

  &:hover {
    background: #e56d1f;
  }
`;

export default Page;
