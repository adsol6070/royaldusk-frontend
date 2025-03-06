import { useEffect, useState } from "react";
import { QRCodeService } from "../../common";
import PageBreadcrumb from "../../components/PageBreadcrumb";
import { Row, Col, Card, Spinner, Alert, Button } from "react-bootstrap";
import { theme } from "../../constants/theme";

interface QrCode {
  tableId: string;
  tableNumber: number;
  capacity: number;
  barcode: string;
}

const Barcodes = () => {
  const [qrCodes, setQrCodes] = useState<QrCode[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBarcodes = async () => {
    try {
      const response = await QRCodeService.createQRCode();
      setQrCodes(response.data.barcodes);
    } catch (error) {
      console.error("Error while fetching barcodes:", error);
      setError("Failed to fetch barcodes. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBarcodes();
  }, []);

  const downloadBarcode = (barcode: string, tableNumber: number) => {
    const link = document.createElement("a");
    link.href = `data:image/png;base64,${barcode}`;
    link.download = `Table_${tableNumber}_Barcode.png`;
    link.click(); // Trigger the download
  };

  return (
    <>
      <PageBreadcrumb title="Barcodes List" subName="Barcodes" />
      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Row className="justify-content-left">
          {qrCodes?.map((qrCode) => (
            <Col md={4} sm={6} key={qrCode.tableId} className="mb-4">
              <Card
                style={{
                  width: "80%",
                  margin: "0 auto",
                  border: "none",
                  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Card.Header
                  style={{
                    background: `${theme.colors.orangeYellow}`,
                    color: `${theme.colors.white}`,
                    ...theme.fonts.bold,
                  }}
                >
                  Table {qrCode.tableNumber} (Capacity: {qrCode.capacity})
                </Card.Header>
                <Card.Body
                  className="text-center"
                  style={{ background: `${theme.colors.almostWhite}` }}
                >
                  <img
                    src={`data:image/png;base64,${qrCode.barcode}`}
                    alt={`Barcode for table ${qrCode.tableNumber}`}
                    style={{ width: "70%", height: "auto" }}
                  />
                  <div className="mt-3">
                    <Button
                      style={{
                        background: `${theme.colors.black}`,
                        ...theme.fonts.regular,
                      }}
                      onClick={() =>
                        downloadBarcode(qrCode.barcode, qrCode.tableNumber)
                      }
                    >
                      Download Barcode
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </>
  );
};

export default Barcodes;
