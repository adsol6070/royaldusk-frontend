import { useState } from "react";
import {
  Container,
  Button,
  Table,
  Pagination,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { FaEye, FaTrash, FaExclamationCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/config/route-paths.config";
import { useDeleteInvoice } from "@/hooks/useInvoice";
import { resolveRoute } from "@/utils/resolveRoute";

const InvoiceList = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const invoicesPerPage = 10;

  // Dummy data for invoices
  const invoices = [
    {
      id: "1",
      invoiceNumber: "INV-2024-001",
      customerName: "John Doe",
      packageName: "Goa Holiday Package",
      amount: 25000,
      date: "2025-04-10",
    },
    {
      id: "2",
      invoiceNumber: "INV-2024-002",
      customerName: "Jane Smith",
      packageName: "Manali Honeymoon Package",
      amount: 18000,
      date: "2025-04-12",
    },
    {
      id: "3",
      invoiceNumber: "INV-2024-003",
      customerName: "Robert Brown",
      packageName: "Kerala Backwater Tour",
      amount: 22000,
      date: "2025-04-14",
    },
    // Add more dummy data as needed
  ];

  const { mutate: deleteInvoice } = useDeleteInvoice();

  const handleDelete = (id: string) => {
    deleteInvoice(id); // Simulating delete, if you want real delete functionality, update it with the API call.
  };

  const indexOfLastInvoice = currentPage * invoicesPerPage;
  const indexOfFirstInvoice = indexOfLastInvoice - invoicesPerPage;
  const currentInvoices = invoices.slice(
    indexOfFirstInvoice,
    indexOfLastInvoice
  );
  const totalPages = Math.ceil(invoices.length / invoicesPerPage);

  return (
    <Container className="p-5 shadow-lg rounded bg-light">
      <h2 className="mb-4 text-center fw-bold">🧾 Tour Package Invoices</h2>
      {invoices.length > 0 ? (
        <>
          <Table
            striped
            bordered
            hover
            responsive
            className="shadow-sm rounded"
          >
            <thead className="table-dark text-center">
              <tr>
                <th>#</th>
                <th>Invoice No</th>
                <th>Customer</th>
                <th>Package</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="text-center bg-white">
              {currentInvoices.map((invoice, index) => (
                <tr key={invoice.id} className="align-middle">
                  <td>{indexOfFirstInvoice + index + 1}</td>
                  <td>{invoice.invoiceNumber}</td>
                  <td>{invoice.customerName}</td>
                  <td>{invoice.packageName}</td>
                  <td>₹{invoice.amount.toLocaleString()}</td>
                  <td>
                    {new Intl.DateTimeFormat("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    }).format(new Date(invoice.date))}
                  </td>
                  <td>
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>View Invoice</Tooltip>}
                    >
                      <Button
                        variant="outline-success"
                        size="sm"
                        className="me-2"
                        onClick={() =>
                          navigate(
                            `${resolveRoute(
                              ROUTES.PRIVATE.INVOICE_PREVIEW,
                              invoice.id
                            )}`
                          )
                        }
                      >
                        <FaEye />
                      </Button>
                    </OverlayTrigger>
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Delete Invoice</Tooltip>}
                    >
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(invoice.id)}
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
          <p className="fw-bold">No invoices found.</p>
        </div>
      )}
    </Container>
  );
};

export default InvoiceList;
