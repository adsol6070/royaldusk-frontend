import {
  useBookingById,
  useDownloadBookingConfirmation,
} from "@/hooks/useBookings";
import {
  Container,
  Card,
  Row,
  Col,
  Spinner,
  Table,
  Badge,
  Button,
} from "react-bootstrap";
import { useParams } from "react-router-dom";

const BookingDetailPage = () => {
  const { id } = useParams();
  const { data: booking, isLoading, isError } = useBookingById(id as string);
  const { mutate: downloadPdf, isPending } = useDownloadBookingConfirmation();

  if (isLoading) {
    return (
      <Container className="text-center p-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (isError || !booking) {
    return (
      <Container className="text-center p-5">
        <h4>Booking not found or failed to load.</h4>
      </Container>
    );
  }

  const serviceInfo =
    typeof booking.serviceData === "string"
      ? JSON.parse(booking.serviceData)
      : booking.serviceData;

  return (
    <Container className="p-5 shadow-lg rounded bg-light">
      <Row className="align-items-center justify-content-between mb-4">
        <Col>
          <h2 className="fw-bold">
            📌 Booking Details ({booking.id.slice(0, 8)}...)
          </h2>
        </Col>
        <Col className="text-end">
          <Button
            variant="primary"
            onClick={() =>
              downloadPdf(booking.id, {
                onSuccess: (blob) => {
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.href = url;
                  link.download = `booking-${booking.id}.pdf`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  URL.revokeObjectURL(url);
                },
                onError: (err) => {
                  alert("❌ Failed to download PDF.");
                  console.error(err);
                },
              })
            }
            disabled={isPending}
          >
            {isPending ? "Downloading..." : "📄 Download PDF"}
          </Button>
        </Col>
      </Row>

      {/* Booking Overview */}
      <Card className="mb-4 shadow-sm">
        <Card.Header className="bg-dark text-white fw-bold">
          🧾 Booking Overview
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <strong>Name:</strong> {booking.guestName}
            </Col>
            <Col md={6}>
              <strong>Email:</strong> {booking.guestEmail}
            </Col>
            <Col md={6}>
              <strong>Mobile:</strong> {booking.guestMobile}
            </Col>
            <Col md={6}>
              <strong>Nationality:</strong> {booking.guestNationality}
            </Col>
            <Col md={6}>
              <strong>Status:</strong>{" "}
              <Badge
                bg={
                  booking.status === "Confirmed"
                    ? "success"
                    : booking.status === "Pending"
                    ? "warning"
                    : "secondary"
                }
              >
                {booking.status}
              </Badge>
            </Col>
            <Col md={6}>
              <strong>Agreed to Terms:</strong>{" "}
              {booking.agreedToTerms ? "Yes" : "No"}
            </Col>
            <Col md={12}>
              <strong>Remarks:</strong>{" "}
              {booking.remarks || <span className="text-muted">N/A</span>}
            </Col>
            <Col md={12}>
              <strong>Booked On:</strong>{" "}
              {new Date(booking.createdAt).toLocaleString()}
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Service Info */}
      <Card className="mb-4 shadow-sm">
        <Card.Header className="bg-primary text-white fw-bold">
          🎒 Service Information
        </Card.Header>
        <Card.Body>
          <Table responsive bordered className="text-center">
            <thead className="table-light">
              <tr>
                <th>Service Type</th>
                <th>Item Name</th>
                <th>Travelers</th>
                <th>Travel Date</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{booking.serviceType}</td>
                <td>{serviceInfo?.itemName || "N/A"}</td>
                <td>{serviceInfo?.travelers ?? "N/A"}</td>
                <td>
                  {serviceInfo?.travelDate
                    ? new Date(serviceInfo.travelDate).toLocaleDateString()
                    : "N/A"}
                </td>
                <td>
                  {serviceInfo?.price
                    ? `${booking.payments?.[0]?.currency?.toUpperCase() || "AED"} ${serviceInfo.price}`
                    : "N/A"}
                </td>
                <td>
                  {serviceInfo?.totalAmount
                    ? `${booking.payments?.[0]?.currency?.toUpperCase() || "AED"} ${serviceInfo.totalAmount}`
                    : "N/A"}
                </td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Payment Info */}
      <Card className="mb-4 shadow-sm">
        <Card.Header className="bg-success text-white fw-bold">
          💳 Payment Details
        </Card.Header>
        <Card.Body>
          {booking.payments.length > 0 ? (
            <Table responsive bordered className="text-center">
              <thead className="table-light">
                <tr>
                  <th>Provider</th>
                  <th>Reference</th>
                  <th>Status</th>
                  <th>Amount</th>
                  <th>Card</th>
                  <th>Receipt</th>
                  <th>Paid At</th>
                </tr>
              </thead>
              <tbody>
                {booking.payments.map((p, i) => (
                  <tr key={i}>
                    <td>{p.provider}</td>
                    <td>{p.providerRefId}</td>
                    <td>
                      <Badge
                        bg={
                          p.status === "succeeded"
                            ? "success"
                            : p.status === "pending"
                            ? "warning"
                            : "danger"
                        }
                      >
                        {p.status}
                      </Badge>
                    </td>
                    <td>
                      {p.currency.toUpperCase()} {(p.amount / 100).toFixed(2)}
                    </td>
                    <td>
                      {p.cardBrand
                        ? `${p.cardBrand} •••• ${p.cardLast4}`
                        : "—"}
                    </td>
                    <td>
                      {p.receiptUrl ? (
                        <a
                          href={p.receiptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>{new Date(p.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className="text-muted">No payment records found.</p>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default BookingDetailPage;
