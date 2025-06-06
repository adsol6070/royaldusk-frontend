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
  const id = useParams()?.id;
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

  return (
    <Container className="p-5 shadow-lg rounded bg-light">
      <Row className="align-items-center justify-content-between mb-4">
        <Col>
          <h2 className="fw-bold">
            📌 Booking Details ({booking.id.slice(0, 8)}...)
          </h2>
        </Col>

        {booking.confirmationPdfPath && (
          <Col className="text-end">
            <Button
              variant="primary"
              onClick={() =>
                downloadPdf(booking.id, {
                  onSuccess: (blob) => {
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = `booking-${booking.id}.pdf`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);
                  },
                  onError: (error) => {
                    alert("❌ Failed to download the PDF.");
                    console.error("Download error:", error);
                  },
                })
              }
              disabled={isPending}
            >
              {isPending ? "Downloading..." : "📄 Download Full Booking PDF"}
            </Button>
          </Col>
        )}
      </Row>

      <Card className="mb-4 shadow-sm">
        <Card.Header className="fw-bold bg-dark text-white">
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

      <Card className="mb-4 shadow-sm">
        <Card.Header className="fw-bold bg-primary text-white">
          🎒 Package Information
        </Card.Header>
        <Card.Body>
          <Table responsive bordered className="text-center">
            <thead className="table-light">
              <tr>
                <th>Package Name</th>
                <th>Travelers</th>
                <th>Travel Date</th>
              </tr>
            </thead>
            <tbody>
              {booking.items.map((item) => (
                <tr key={item.id}>
                  <td>{item.packageName}</td>
                  <td>{item.travelers}</td>
                  <td>{new Date(item.startDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Card className="mb-4 shadow-sm">
        <Card.Header className="fw-bold bg-success text-white">
          💳 Payment Details
        </Card.Header>
        <Card.Body>
          {booking.payments.length > 0 ? (
            <Table responsive bordered className="text-center">
              <thead className="table-light">
                <tr>
                  <th>Provider</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Amount</th>
                  <th>Card</th>
                  <th>Receipt</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {booking.payments.map((p, index) => (
                  <tr key={index}>
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
                      {p.cardBrand ? `${p.cardBrand} •••• ${p.cardLast4}` : "—"}
                    </td>
                    <td>
                      {p.receiptUrl ? (
                        <a href={p.receiptUrl} target="_blank" rel="noreferrer">
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
            <p className="text-muted">No payment records available.</p>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default BookingDetailPage;
