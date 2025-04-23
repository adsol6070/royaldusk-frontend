import {
  Container,
  Card,
  Table,
  Row,
  Col,
  Button,
  OverlayTrigger,
  Tooltip,
  Spinner,
  Alert,
} from "react-bootstrap";
import { FaDownload } from "react-icons/fa";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const InvoicePreview = () => {
  // Simulated invoice data from API
  const invoice = {
    id: "e40f56cd-2c2e-4f33-b244-8f2a37a6d0ef",
    user_id: "2c7fc5f8-5c9d-40c4-8f8c-93b9cb58c3af",
    booking_id: "adbcf39f-98a3-4a51-94b5-94a309e22b7e",
    invoice_number: "INV-2025-0102",
    currency: "INR",
    amount: 18000,
    tax_amount: 3240,
    discount_amount: 1240,
    final_amount: 20000,
    status: "paid",
    payment_method: "Credit Card",
    paid_at: "2025-04-16T10:15:00Z",
    created_at: "2025-04-15T08:00:00Z",
    updated_at: "2025-04-15T08:00:00Z",
    description: [
      {
        id: "91bb7583-90ae-43d2-81d3-2e4b9a5051be",
        invoice_id: "e40f56cd-2c2e-4f33-b244-8f2a37a6d0ef",
        package_name: "Luxury Stay - Manali",
        description: "3 nights in 5-star resort with breakfast",
        quantity: 1,
        unit_price: 12000,
        total_price: 12000,
      },
      {
        id: "1394ae3b-ef60-4696-9bde-bbe21f899bb3",
        invoice_id: "e40f56cd-2c2e-4f33-b244-8f2a37a6d0ef",
        package_name: "Sightseeing",
        description: "Includes Solang Valley, Hidimba Temple, Mall Road",
        quantity: 1,
        unit_price: 4000,
        total_price: 4000,
      },
      {
        id: "63e5f7d9-8b7e-4c8b-9b28-4ed3a73ed292",
        invoice_id: "e40f56cd-2c2e-4f33-b244-8f2a37a6d0ef",
        package_name: "Transfers",
        description: "Airport pickup and drop (AC SUV)",
        quantity: 1,
        unit_price: 2000,
        total_price: 2000,
      },
    ],
  };

  const subtotal = invoice.description.reduce((acc, item) => acc + item.total_price, 0);
  const total = invoice.final_amount;

  const downloadInvoice = async () => {
    const input = document.getElementById("invoice-content");
    if (!input) return;

    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${invoice.invoice_number}.pdf`);
  };

  return (
    <Container className="p-5 shadow-lg bg-white rounded">
      <h2 className="mb-4 text-center fw-bold">🧾 Invoice Preview</h2>
      <Card className="p-4 shadow-sm" id="invoice-content">
        <Row>
          <Col md={6}>
            <h5 className="fw-bold">From:</h5>
            <p>
              ROYAL DUSK TOURS - FZCO<br />
              go@royaldusk.com<br />
              +91 98763-49140
            </p>
          </Col>
          <Col md={6} className="text-md-end">
            <h5 className="fw-bold">To:</h5>
            <p>
              John Doe<br />
              johndoe@example.com<br />
              +91 9876543210
            </p>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col md={6}>
            <p><strong>Invoice No:</strong> {invoice.invoice_number}</p>
            <p><strong>Package:</strong> Manali Tour Package</p>
          </Col>
          <Col md={6} className="text-md-end">
            <p><strong>Issue Date:</strong> {new Date(invoice.created_at).toLocaleDateString()}</p>
            <p><strong>Status:</strong> {invoice.status}</p>
          </Col>
        </Row>

        <Table bordered className="mt-4">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Package</th>
              <th>Description</th>
              <th className="text-center">Qty</th>
              <th className="text-end">Unit Price (₹)</th>
              <th className="text-end">Total (₹)</th>
            </tr>
          </thead>
          <tbody>
            {invoice.description.map((item, idx) => (
              <tr key={item.id}>
                <td>{idx + 1}</td>
                <td>{item.package_name}</td>
                <td>{item.description}</td>
                <td className="text-center">{item.quantity}</td>
                <td className="text-end">{item.unit_price.toLocaleString()}</td>
                <td className="text-end">{item.total_price.toLocaleString()}</td>
              </tr>
            ))}
            <tr>
              <td colSpan={5} className="text-end fw-bold">Subtotal</td>
              <td className="text-end fw-bold">{subtotal.toLocaleString()}</td>
            </tr>
            <tr>
              <td colSpan={5} className="text-end">Tax</td>
              <td className="text-end">{invoice.tax_amount.toLocaleString()}</td>
            </tr>
            <tr>
              <td colSpan={5} className="text-end">Discount</td>
              <td className="text-end">- {invoice.discount_amount.toLocaleString()}</td>
            </tr>
            <tr>
              <td colSpan={5} className="text-end fw-bold text-success">Grand Total</td>
              <td className="text-end fw-bold text-success">{total.toLocaleString()}</td>
            </tr>
          </tbody>
        </Table>
      </Card>
      <div className="d-flex justify-content-end mt-4">
        <OverlayTrigger placement="top" overlay={<Tooltip>Download Invoice</Tooltip>}>
          <Button variant="outline-primary" className="me-2" onClick={downloadInvoice}>
            <FaDownload className="me-1" /> Download Invoice
          </Button>
        </OverlayTrigger>
      </div>
    </Container>
  );
};

export default InvoicePreview;

