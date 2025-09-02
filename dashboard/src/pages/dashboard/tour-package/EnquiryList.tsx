import { useState } from "react";
import {
  Container,
  Table,
  Button,
  Pagination,
  OverlayTrigger,
  Tooltip,
  Modal,
  Row,
  Col,
  Badge,
} from "react-bootstrap";
import {
  FaTrash,
  FaExclamationCircle,
  FaEye,
  FaPlaneDeparture,
} from "react-icons/fa";
import {
  usePackageEnquiries,
  useDeletePackageEnquiry,
} from "@/hooks/usePackage";
import type { Enquiry } from "@/api/tourPackage/enquires/packageEnquiryTypes";

const EnquiryList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const enquiriesPerPage = 10;
  const { data: enquiries = [] } = usePackageEnquiries();
  const { mutate: deleteEnquiry } = useDeletePackageEnquiry();
  const [showModal, setShowModal] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this enquiry?")) {
      deleteEnquiry(id);
    }
  };

  const indexOfLast = currentPage * enquiriesPerPage;
  const indexOfFirst = indexOfLast - enquiriesPerPage;
  const currentEnquiries = enquiries.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(enquiries.length / enquiriesPerPage);

  return (
    <Container className="p-5 shadow rounded bg-light">
      <h2 className="mb-4 text-center fw-bold">📬 Enquiry List</h2>

      {enquiries.length > 0 ? (
        <>
          <Table responsive striped bordered hover className="shadow-sm">
            <thead className="table-dark text-center">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Adults</th>
                <th>Children</th>
                <th>Remarks</th>
                <th>DOB</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="text-center bg-white">
              {currentEnquiries.map((item, index) => (
                <tr key={item.id}>
                  <td>{indexOfFirst + index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>
                    <span className="text-muted">+{item.isdCode}</span>{" "}
                    {item.mobile}
                  </td>
                  <td>{item.adults}</td>
                  <td>{item.children}</td>
                  <td>{item.remarks || "—"}</td>
                  <td>{new Date(item.dob).toLocaleDateString("en-GB")}</td>
                  <td>{new Date(item.createdAt).toLocaleDateString("en-GB")}</td>
                  <td>
                    <div className="d-flex gap-2 justify-content-center">
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>View Details</Tooltip>}
                      >
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => {
                            setSelectedEnquiry(item);
                            setShowModal(true);
                          }}
                        >
                          <FaEye />
                        </Button>
                      </OverlayTrigger>

                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>Delete Enquiry</Tooltip>}
                      >
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                        >
                          <FaTrash />
                        </Button>
                      </OverlayTrigger>
                    </div>
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

          {/* View Modal */}
          <Modal
            show={showModal}
            onHide={() => setShowModal(false)}
            size="lg"
            centered
          >
            <Modal.Header closeButton className="bg-dark text-white">
              <Modal.Title>
                📝 Enquiry Details —{" "}
                <span className="text-warning">{selectedEnquiry?.name}</span>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="px-4 py-3">
              {selectedEnquiry && (
                <Row className="gy-3">
                  <Col md={6}>
                    <strong>Name:</strong> {selectedEnquiry.name}
                  </Col>
                  <Col md={6}>
                    <strong>Email:</strong> {selectedEnquiry.email}
                  </Col>
                  <Col md={6}>
                    <strong>Mobile:</strong> +{selectedEnquiry.isdCode}{" "}
                    {selectedEnquiry.mobile}
                  </Col>
                  <Col md={6}>
                    <strong>Date of Birth:</strong>{" "}
                    {new Date(selectedEnquiry.dob).toLocaleDateString("en-GB")}
                  </Col>
                  <Col md={6}>
                    <strong>Adults:</strong> {selectedEnquiry.adults}
                  </Col>
                  <Col md={6}>
                    <strong>Children:</strong> {selectedEnquiry.children}
                  </Col>
                  <Col md={6}>
                    <strong>Flight Booked:</strong>{" "}
                    <Badge
                      bg={
                        selectedEnquiry.flightBooked === "Yes"
                          ? "success"
                          : "secondary"
                      }
                    >
                      <FaPlaneDeparture className="me-1" />
                      {selectedEnquiry.flightBooked}
                    </Badge>
                  </Col>
                  <Col md={6}>
                    <strong>Remarks:</strong>{" "}
                    {selectedEnquiry.remarks || <em className="text-muted">None</em>}
                  </Col>
                  <Col md={12}>
                    <strong>Package:</strong>{" "}
                    <span className="fw-semibold text-primary">
                      {selectedEnquiry.package?.name}
                    </span>{" "}
                    – AED {selectedEnquiry.package?.price}
                  </Col>
                  <Col md={12}>
                    <strong>Submitted On:</strong>{" "}
                    {new Date(selectedEnquiry.createdAt).toLocaleString("en-GB")}
                  </Col>
                </Row>
              )}
            </Modal.Body>
          </Modal>
        </>
      ) : (
        <div className="text-center text-muted p-5">
          <FaExclamationCircle size={48} className="mb-3 text-secondary" />
          <h5>No enquiries found yet!</h5>
        </div>
      )}
    </Container>
  );
};

export default EnquiryList;
