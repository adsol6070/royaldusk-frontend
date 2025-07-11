import { useState } from "react";
import {
  Container,
  Button,
  Table,
  Pagination,
  OverlayTrigger,
  Tooltip,
  Badge,
} from "react-bootstrap";
import { FaTrash, FaEnvelopeOpenText, FaExclamationCircle } from "react-icons/fa";
import { useNewsletterSubscribers, useDeleteSubscriber } from "@/hooks/useNewsletter";

const NewsletterList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const subscribersPerPage = 10;

  const { data: subscribers } = useNewsletterSubscribers();
  const { mutate: deleteSubscriber } = useDeleteSubscriber();

  const indexOfLast = currentPage * subscribersPerPage;
  const indexOfFirst = indexOfLast - subscribersPerPage;
  const currentSubscribers = subscribers?.slice(indexOfFirst, indexOfLast) || [];
  const totalPages = Math.ceil((subscribers?.length || 0) / subscribersPerPage);

  const handleDelete = (id: string, email: string) => {
    const confirmed = window.confirm(`Are you sure you want to delete "${email}"?`);
    if (confirmed) {
      deleteSubscriber(id);
    }
  };

  return (
    <Container className="p-5 shadow rounded bg-light">
      <h2 className="mb-4 text-center fw-bold">
        <FaEnvelopeOpenText className="me-2" />
        Newsletter Subscribers
      </h2>

      {subscribers && subscribers.length > 0 ? (
        <>
          <Table striped bordered hover responsive className="shadow-sm rounded">
            <thead className="table-dark text-center">
              <tr>
                <th>#</th>
                <th>Email</th>
                <th>Status</th>
                <th>Subscribed On</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="text-center bg-white">
              {currentSubscribers.map((subscriber, index) => (
                <tr key={subscriber.id} className="align-middle">
                  <td>{indexOfFirst + index + 1}</td>
                  <td>{subscriber.email}</td>
                  <td>
                    <Badge bg={subscriber.isActive ? "success" : "secondary"}>
                      {subscriber.isActive ? "Subscribed" : "Unsubscribed"}
                    </Badge>
                  </td>
                  <td>
                    {new Intl.DateTimeFormat("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    }).format(new Date(subscriber.createdAt))}
                  </td>
                  <td>
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Delete Subscriber</Tooltip>}
                    >
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(subscriber.id, subscriber.email)}
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
          <p className="fw-bold">No newsletter subscribers found.</p>
        </div>
      )}
    </Container>
  );
};

export default NewsletterList;
