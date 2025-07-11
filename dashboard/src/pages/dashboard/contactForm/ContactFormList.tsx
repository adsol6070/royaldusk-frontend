import { useState } from "react";
import {
  Container,
  Button,
  Table,
  Pagination,
  OverlayTrigger,
  Tooltip,
  Modal,
} from "react-bootstrap";
import {
  FaTrash,
  FaRegEye,
  FaExclamationCircle,
  FaEnvelopeOpenText,
} from "react-icons/fa";
import { useContactMessages, useDeleteContact, useContactById } from "@/hooks/useContactForm";

const ContactList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const messagesPerPage = 10;

  const { data: messages } = useContactMessages();
  const { mutate: deleteContact } = useDeleteContact();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const { data: selectedMessage } = useContactById(selectedId || "");

  const handleDelete = (id: string, name: string) => {
    const confirmed = window.confirm(`Are you sure you want to delete message from "${name}"?`);
    if (confirmed) {
      deleteContact(id);
    }
  };

  const handleView = (id: string) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const indexOfLast = currentPage * messagesPerPage;
  const indexOfFirst = indexOfLast - messagesPerPage;
  const currentMessages = messages?.slice(indexOfFirst, indexOfLast) || [];
  const totalPages = Math.ceil((messages?.length || 0) / messagesPerPage);

  return (
    <Container className="p-5 shadow rounded bg-light">
      <h2 className="mb-4 text-center fw-bold">
        <FaEnvelopeOpenText className="me-2" />
        Contact Messages
      </h2>

      {messages && messages.length > 0 ? (
        <>
          <Table striped bordered hover responsive className="shadow-sm rounded">
            <thead className="table-dark text-center">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Subject</th>
                <th>Received</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="text-center bg-white">
              {currentMessages.map((msg: any, index: number) => (
                <tr key={msg.id} className="align-middle">
                  <td>{indexOfFirst + index + 1}</td>
                  <td>{msg.fullName}</td>
                  <td>{msg.email}</td>
                  <td>{msg.subject}</td>
                  <td>
                    {new Intl.DateTimeFormat("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    }).format(new Date(msg.createdAt))}
                  </td>
                  <td className="d-flex justify-content-center gap-2">
                    <OverlayTrigger placement="top" overlay={<Tooltip>View</Tooltip>}>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleView(msg.id)}
                      >
                        <FaRegEye />
                      </Button>
                    </OverlayTrigger>

                    <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(msg.id, msg.fullName)}
                      >
                        <FaTrash />
                      </Button>
                    </OverlayTrigger>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div className="d-flex justify-content-center mt-4">
            <Pagination>
              <Pagination.First
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              />
              <Pagination.Prev
                onClick={() => setCurrentPage(currentPage - 1)}
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
                onClick={() => setCurrentPage(currentPage + 1)}
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
          <p className="fw-bold">No contact messages found.</p>
        </div>
      )}

      {/* Modal for message details */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Contact Message</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedMessage ? (
            <>
              <p><strong>Name:</strong> {selectedMessage.fullName}</p>
              <p><strong>Email:</strong> {selectedMessage.email}</p>
              <p><strong>Phone:</strong> {selectedMessage.phone}</p>
              <p><strong>Subject:</strong> {selectedMessage.subject}</p>
              <p><strong>Message:</strong></p>
              <div className="p-2 border rounded bg-light" style={{ whiteSpace: "pre-wrap" }}>
                {selectedMessage.message}
              </div>
              <p className="mt-3 text-muted small">
                Received on:{" "}
                {new Date(selectedMessage.createdAt).toLocaleString("en-GB")}
              </p>
            </>
          ) : (
            <p>Loading...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ContactList;
