"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import styled from "styled-components";
import ReveloLayout from "@/layout/ReveloLayout";
import { toast } from "react-hot-toast";
import Modal from "@/components/Modal";
import BookingModal from "@/components/BookingModal";
import { bookingApi } from "@/common/api";

const BookingLookupSection = styled.section`
  padding: 80px 0;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  min-height: calc(100vh - 100px);
  display: flex;
  align-items: center;
`;

const BookingLookupContainer = styled.div`
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 1.8rem;
  color: #333;
  text-align: center;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  text-align: center;
  color: #666;
  margin-bottom: 2rem;
  font-size: 0.95rem;
`;

const DemoInfo = styled.div`
  background: #fff3e0;
  border: 1px solid #ffcc80;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 2rem;
  font-size: 0.9rem;
  color: #e65100;

  code {
    background: rgba(255, 255, 255, 0.5);
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    font-family: monospace;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.9rem;
  color: #555;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 0.8rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #ee8b50;
  }
`;

const ErrorText = styled.small`
  color: #e63946;
  font-size: 0.85rem;
`;

const SubmitButton = styled.button`
  background: #ee8b50;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 1rem;

  &:hover {
    background: #e56d1f;
  }

  &:disabled {
    background: #ffd5b8;
    cursor: not-allowed;
  }
`;

const BookingDetails = styled.div`
  padding: 2rem;
  background: white;
  border-radius: 12px;
  max-width: 800px;
  margin: 0 auto;
`;

const BookingTitle = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const Section = styled.div`
  margin-bottom: 2rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #ee8b50;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }
`;

const DetailLabel = styled.span`
  color: #666;
  font-weight: 500;
`;

const DetailValue = styled.span`
  color: #333;
  font-weight: 600;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 600;
  background-color: ${(props) => {
    switch (props.status?.toLowerCase()) {
      case "confirmed":
        return "#dcfce7";
      case "pending":
        return "#fff3e0";
      case "cancelled":
        return "#fee2e2";
      default:
        return "#f3f4f6";
    }
  }};
  color: ${(props) => {
    switch (props.status?.toLowerCase()) {
      case "confirmed":
        return "#166534";
      case "pending":
        return "#9a3412";
      case "cancelled":
        return "#991b1b";
      default:
        return "#374151";
    }
  }};
`;

const ItineraryCard = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const ItineraryDay = styled.div`
  font-weight: 600;
  color: #ee8b50;
  margin-bottom: 0.5rem;
`;

const ItineraryTitle = styled.div`
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
`;

const ItineraryDescription = styled.div`
  color: #666;
  font-size: 0.9rem;
`;

const schema = yup.object().shape({
  bookingReference: yup.string().required("Booking reference is required")  .matches(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
      "Invalid booking reference format"
    ),
});

export default function BookingLookupPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [bookingData, setBookingData] = useState(null);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await bookingApi.getBookingById(data.bookingReference);
      if (!response.success) {
        toast.error(response.message || "Failed to find booking");
      }
      const bookingDetails = response.data;
      setBookingData(bookingDetails);
      reset();
      setShowModal(true);
    } catch (error) {
      toast.error(error.message || "Failed to find booking");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <ReveloLayout>
      <BookingLookupSection>
        <div className="container">
          <BookingLookupContainer>
            <Title>Booking Lookup</Title>
            <Subtitle>
              Enter your booking reference to view your booking details
            </Subtitle>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <FormGroup>
                <Label htmlFor="bookingReference">Booking Reference</Label>
                <Input
                  id="bookingReference"
                  type="text"
                  placeholder="Enter booking reference"
                  {...register("bookingReference")}
                />
                {errors.bookingReference && (
                  <ErrorText>{errors.bookingReference.message}</ErrorText>
                )}
              </FormGroup>

              <SubmitButton type="submit" disabled={loading}>
                {loading ? "Searching..." : "View Booking"}
              </SubmitButton>
            </Form>
          </BookingLookupContainer>
        </div>
      </BookingLookupSection>

      <BookingModal isOpen={showModal} onClose={() => setShowModal(false)}>
        {bookingData && (
          <BookingDetails>
            <BookingTitle>Booking Details</BookingTitle>

            <Section>
              <SectionTitle>Guest Information</SectionTitle>
              <DetailRow>
                <DetailLabel>Guest Name:</DetailLabel>
                <DetailValue>{bookingData.guestName}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Email:</DetailLabel>
                <DetailValue>{bookingData.guestEmail}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Mobile:</DetailLabel>
                <DetailValue>{bookingData.guestMobile}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Nationality:</DetailLabel>
                <DetailValue>{bookingData.guestNationality}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Status:</DetailLabel>
                <DetailValue>
                  <StatusBadge status={bookingData.status}>
                    {bookingData.status}
                  </StatusBadge>
                </DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Remarks:</DetailLabel>
                <DetailValue>{bookingData.remarks || "N/A"}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Confirmation PDF:</DetailLabel>
                <DetailValue>
                  <a
                    href={bookingData.confirmationPdfPath}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View PDF
                  </a>
                </DetailValue>
              </DetailRow>
            </Section>

            <Section>
              <SectionTitle>Package Information</SectionTitle>
              {bookingData.items.map((item, index) => (
                <div key={item.id}>
                  <DetailRow>
                    <DetailLabel>Package Name:</DetailLabel>
                    <DetailValue>{item.packageName}</DetailValue>
                  </DetailRow>
                  <DetailRow>
                    <DetailLabel>Travelers:</DetailLabel>
                    <DetailValue>{item.travelers}</DetailValue>
                  </DetailRow>
                  <DetailRow>
                    <DetailLabel>Start Date:</DetailLabel>
                    <DetailValue>{formatDate(item.startDate)}</DetailValue>
                  </DetailRow>
                  {index !== bookingData.items.length - 1 && <hr />}
                </div>
              ))}
            </Section>

            <Section>
              <SectionTitle>Payments</SectionTitle>
              {bookingData.payments.map((payment, index) => (
                <div key={payment.providerRefId}>
                  <DetailRow>
                    <DetailLabel>Status:</DetailLabel>
                    <DetailValue>
                      <StatusBadge status={payment.status}>
                        {payment.status}
                      </StatusBadge>
                    </DetailValue>
                  </DetailRow>
                  <DetailRow>
                    <DetailLabel>Amount:</DetailLabel>
                    <DetailValue>
                      ${payment.amount / 100} {payment.currency.toUpperCase()}
                    </DetailValue>
                  </DetailRow>
                  <DetailRow>
                    <DetailLabel>Provider:</DetailLabel>
                    <DetailValue>{payment.provider}</DetailValue>
                  </DetailRow>
                  <DetailRow>
                    <DetailLabel>Card:</DetailLabel>
                    <DetailValue>
                      {payment.cardBrand
                        ? `${payment.cardBrand.toUpperCase()} •••• ${
                            payment.cardLast4
                          }`
                        : "N/A"}
                    </DetailValue>
                  </DetailRow>
                  {payment.receiptUrl && (
                    <DetailRow>
                      <DetailLabel>Receipt:</DetailLabel>
                      <DetailValue>
                        <a
                          href={payment.receiptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Receipt
                        </a>
                      </DetailValue>
                    </DetailRow>
                  )}
                  {index !== bookingData.payments.length - 1 && <hr />}
                </div>
              ))}
            </Section>
          </BookingDetails>
        )}
      </BookingModal>
    </ReveloLayout>
  );
}
