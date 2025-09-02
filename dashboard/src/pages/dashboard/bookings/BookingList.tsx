import { useState } from "react";
import {
  Container,
  Button,
  Table,
  Pagination,
  OverlayTrigger,
  Tooltip,
  Form,
  Row,
  Col,
  Badge,
} from "react-bootstrap";
import { FaEye, FaExclamationCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/config/route-paths.config";
import { useBookings } from "@/hooks/useBookings";
import { resolveRoute } from "@/utils/resolveRoute";

const BookingList = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [serviceTypeFilter, setServiceTypeFilter] = useState("");
  const bookingsPerPage = 10;

  const { data: bookings = [] } = useBookings();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("");

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.guestName.toLowerCase().includes(search.toLowerCase()) ||
      b.guestEmail.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter ? b.status === statusFilter : true;
    const matchesPayment = paymentStatusFilter
      ? b.paymentStatus === paymentStatusFilter
      : true;

    const matchesServiceType = serviceTypeFilter
      ? b.serviceType === serviceTypeFilter
      : true;

    return (
      matchesSearch && matchesStatus && matchesPayment && matchesServiceType
    );
  });

  const indexOfLast = currentPage * bookingsPerPage;
  const indexOfFirst = indexOfLast - bookingsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);

  return (
    <Container className="p-5 shadow-lg rounded bg-light">
      <h2 className="mb-4 text-center fw-bold">📋 Booking List</h2>

      <Form className="mb-4">
        <Row>
          <Col md={3}>
            <Form.Control
              type="text"
              placeholder="Search by name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Col>
          <Col md={3}>
            <Form.Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Booking Status</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Cancelled">Cancelled</option>
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Select
              value={paymentStatusFilter}
              onChange={(e) => setPaymentStatusFilter(e.target.value)}
            >
              <option value="">All Payment Status</option>
              <option value="succeeded">Succeeded</option>
              <option value="pending">Pending</option>
              <option value="payment_failed">Failed</option>
              <option value="canceled">Canceled</option>
            </Form.Select>
          </Col>
          <Col md={2}>
            <Form.Select
              value={serviceTypeFilter}
              onChange={(e) => setServiceTypeFilter(e.target.value)}
            >
              <option value="">All Services</option>
              <option value="Tour">Tour</option>
              <option value="Package">Package</option>
            </Form.Select>
          </Col>
        </Row>
      </Form>

      {currentBookings.length > 0 ? (
        <>
          <Table
            striped
            bordered
            hover
            responsive
            className="shadow-sm rounded text-center"
          >
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Booking ID</th>
                <th>Guest Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Service</th>
                <th>Total Paid</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Created</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {currentBookings.map((booking, index) => (
                <tr key={booking.id}>
                  <td>{indexOfFirst + index + 1}</td>
                  <td>{booking.id.slice(0, 8)}...</td>
                  <td>{booking.guestName}</td>
                  <td>{booking.guestEmail}</td>
                  <td>{booking.guestMobile || "—"}</td>
                  <td>
                    <Badge
                      bg={
                        booking.serviceType === "Tour"
                          ? "primary"
                          : booking.serviceType === "Package"
                          ? "secondary"
                          : "info"
                      }
                      className="text-uppercase"
                    >
                      {booking.serviceType}
                    </Badge>
                  </td>
                  <td>
                    {booking.currency?.toUpperCase()}{" "}
                    {(booking.totalAmountPaid / 100).toFixed(2)}
                  </td>
                  <td>
                    <Badge
                      bg={
                        booking.paymentStatus === "succeeded"
                          ? "success"
                          : booking.paymentStatus === "pending"
                          ? "warning"
                          : "danger"
                      }
                    >
                      {booking.paymentStatus}
                    </Badge>
                  </td>
                  <td>
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
                  </td>
                  <td>{new Date(booking.createdAt).toLocaleDateString()}</td>
                  <td>
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>View Booking</Tooltip>}
                    >
                      <Button
                        variant="outline-info"
                        size="sm"
                        onClick={() =>
                          navigate(
                            resolveRoute(
                              ROUTES.PRIVATE.BOOKING_DETAILS,
                              booking.id
                            )
                          )
                        }
                      >
                        <FaEye />
                      </Button>
                    </OverlayTrigger>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Pagination */}
          <div className="d-flex justify-content-center mt-4">
            <Pagination>
              <Pagination.First
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              />
              <Pagination.Prev
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              />
              {[...Array(totalPages)].map((_, i) => (
                <Pagination.Item
                  key={i + 1}
                  active={i + 1 === currentPage}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              />
              <Pagination.Last
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              />
            </Pagination>
          </div>
        </>
      ) : (
        <div className="text-center text-muted p-4">
          <FaExclamationCircle size={50} className="mb-3 text-secondary" />
          <p className="fw-bold">No bookings found.</p>
        </div>
      )}
    </Container>
  );
};

export default BookingList;
