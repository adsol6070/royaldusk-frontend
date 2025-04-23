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
  // Dummy data for preview
  const invoice = {
    invoiceNumber: "INV-2024-0021",
    issueDate: "2025-04-15",
    dueDate: "2025-04-20",
    clientName: "John Doe",
    clientEmail: "johndoe@example.com",
    clientPhone: "+91 9876543210",
    destination: "Manali Tour Package",
    taxRate: 0.18,
    items: [
      { description: "3 Nights Stay at Resort", quantity: 1, price: 12000 },
      { description: "Local Sightseeing", quantity: 1, price: 4000 },
      { description: "Airport Transfers", quantity: 1, price: 2000 },
    ],
  };

  const subtotal = invoice.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const tax = subtotal * invoice.taxRate;
  const total = subtotal + tax;

  const downloadInvoice = async () => {
    const input = document.getElementById("invoice-content");
    if (!input) return;
  
    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
  
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${invoice.invoiceNumber}.pdf`);
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
              {invoice.clientName}<br />
              {invoice.clientEmail}<br />
              {invoice.clientPhone}
            </p>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col md={6}>
            <p><strong>Invoice No:</strong> {invoice.invoiceNumber}</p>
            <p><strong>Package:</strong> {invoice.destination}</p>
          </Col>
          <Col md={6} className="text-md-end">
            <p><strong>Issue Date:</strong> {invoice.issueDate}</p>
            <p><strong>Due Date:</strong> {invoice.dueDate}</p>
          </Col>
        </Row>

        <Table bordered className="mt-4">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Description</th>
              <th className="text-center">Quantity</th>
              <th className="text-end">Price (₹)</th>
              <th className="text-end">Total (₹)</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{item.description}</td>
                <td className="text-center">{item.quantity}</td>
                <td className="text-end">{item.price.toLocaleString()}</td>
                <td className="text-end">
                  {(item.price * item.quantity).toLocaleString()}
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan={4} className="text-end fw-bold">Subtotal</td>
              <td className="text-end fw-bold">{subtotal.toLocaleString()}</td>
            </tr>
            <tr>
              <td colSpan={4} className="text-end">Tax ({(invoice.taxRate * 100).toFixed(0)}%)</td>
              <td className="text-end">{tax.toLocaleString()}</td>
            </tr>
            <tr>
              <td colSpan={4} className="text-end fw-bold text-success">Grand Total</td>
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
