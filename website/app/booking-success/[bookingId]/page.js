"use client";

import React, { useEffect, useState } from "react";
import Banner from "@/components/Banner";
import ReveloLayout from "@/layout/ReveloLayout";
import { Card, Row, Col, Button, Spinner } from "react-bootstrap";
import { bookingApi } from "@/common/api";

const Page = ({ params }) => {
  const [booking, setBooking] = useState(null);
  const bookingId = params.bookingId;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        // wait 2 seconds before calling backend
        await new Promise((r) => setTimeout(r, 2000));
        const response = await bookingApi.getBookingById(bookingId);
        setBooking(response.data);
      } catch (err) {
        console.error("❌ Failed to load booking:", err);
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId]);

  if (loading) {
    return (
      <ReveloLayout>
        <div className="text-center mt-5">
          <Spinner animation="border" variant="primary" />
          <p>Loading booking details...</p>
        </div>
      </ReveloLayout>
    );
  }

  if (!booking) {
    return (
      <ReveloLayout>
        <div className="text-center mt-5 text-danger">
          <p>❌ Booking not found.</p>
        </div>
      </ReveloLayout>
    );
  }

  const successfulPayments = booking.payments?.filter(
    (p) => p.status === "succeeded"
  );

  return (
    <ReveloLayout>
      <Banner pageTitle="Booking Voucher" />
      <div className="container pt-4 pb-4">
        <Card className="m-5 p-4 shadow border-0">
          <div
            className="border-start border-5 border-success rounded-3 p-4"
            style={{
              background: "#f9f9f9",
              borderLeft: "8px dashed #198754",
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="fw-bold text-success mb-0">🎟️ Travel Ticket</h3>
              <span className="text-muted small">
                <strong>Booking ID:</strong>{" "}
                {booking.id?.slice(0, 8).toUpperCase()}
              </span>
            </div>

            <Row className="mb-3">
              <Col>
                <h5 className="fw-bold text-secondary">Passenger</h5>
                <p className="mb-1">
                  <strong>Name:</strong> {booking.guestName}
                </p>
                <p className="mb-1">
                  <strong>Email:</strong> {booking.guestEmail}
                </p>
                <p className="mb-1">
                  <strong>Phone:</strong> {booking.guestMobile}
                </p>
                <p className="mb-1">
                  <strong>Nationality:</strong> {booking.guestNationality}
                </p>
              </Col>
              <Col>
                <h5 className="fw-bold text-secondary">Booking Info</h5>
                <p className="mb-1">
                  <strong>Status:</strong> {booking.status}
                </p>
                <p className="mb-1">
                  <strong>Created:</strong>{" "}
                  {new Date(booking.createdAt).toLocaleString()}
                </p>
                <p className="mb-1">
                  <strong>Remarks:</strong> {booking.remarks || "N/A"}
                </p>
              </Col>
            </Row>

            <hr />

            <h5 className="fw-bold text-secondary">🧳 Travel Package</h5>
            {booking.items?.map((item) => (
              <Row key={item.id} className="mb-3">
                <Col md={4}>
                  <strong>Package:</strong> {item.packageName}
                </Col>
                <Col md={4}>
                  <strong>Travelers:</strong> {item.travelers}
                </Col>
                <Col md={4}>
                  <strong>Date:</strong>{" "}
                  {new Date(item.startDate).toLocaleDateString()}
                </Col>
              </Row>
            ))}

            <hr />

            <h5 className="fw-bold text-secondary">💳 Payment Summary</h5>
            {successfulPayments && successfulPayments.length > 0 ? (
              successfulPayments.map((payment, idx) => (
                <Row key={idx} className="mb-2">
                  <Col md={4}>
                    <strong>Amount:</strong> ${payment.amount}
                  </Col>
                  <Col md={4}>
                    <strong>Card:</strong> {payment.cardBrand?.toUpperCase()}{" "}
                    **** {payment.cardLast4}
                  </Col>
                  <Col md={4}>
                    <strong>Status:</strong> {payment.status}
                  </Col>
                </Row>
              ))
            ) : (
              <p className="text-muted">No successful payments yet.</p>
            )}

            <div className="d-flex justify-content-between align-items-center mt-4 border-top pt-3">
              <span className="text-muted small">
                Thank you for booking with <strong>Royal Dusk Tours</strong>
              </span>
              {successfulPayments?.length > 0 && (
                <Button
                  variant="outline-primary"
                  href={successfulPayments[0].receiptUrl}
                  target="_blank"
                >
                  🧾 Download Invoice
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </ReveloLayout>
  );
};

export default Page;
