import { useTourById } from "@/hooks/useTour";
import { formatTimestamp } from "@/utils/formatTimestamp";
import { Container, Row, Col, Image, Badge } from "react-bootstrap";
import { useParams } from "react-router-dom";

const TourDetails = () => {
  const { id } = useParams();
  const { data: fetchedTour } = useTourById(String(id));

  // Fallback demo data with corrected structure
  const demoTour = {
    id: "1",
    name: "Majestic Himalayas",
    description:
      "Embark on an unforgettable journey through the snow-capped peaks of the Himalayas. This tour offers breathtaking views, serene monasteries, and thrilling adventures like river rafting, paragliding, and mountain trekking.",
    createdAt: "2025-04-01T10:30:00Z",
    price: "1999.99",
    tag: "Top",
    tourAvailability: "Available",
    imageUrl:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    location: {
      id: "demo-location",
      name: "Manali",
    },
    category: {
      id: "demo-category",
      name: "Nature",
    },
  };

  const tour = fetchedTour || demoTour;

  const {
    name,
    description,
    createdAt,
    price,
    tag,
    tourAvailability,
    imageUrl,
    location,
    category,
  } = tour;

  const displayImage =
    imageUrl?.trim() ||
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80";

  return (
    <Container className="py-5 bg-white">
      <Row>
        <Col md={{ span: 10, offset: 1 }}>
          <h1 className="fw-bold text-dark">{name}</h1>
          <p className="text-muted mb-1">
            Created At: <strong>{formatTimestamp(createdAt || "")}</strong>
          </p>
          <p className="text-muted mb-1">
            Category: <strong>{category?.name || "N/A"}</strong>
          </p>
          <p className="text-muted mb-1">
            Location: <strong>{location?.name || "N/A"}</strong>
          </p>
          <p className="text-muted mb-1">
            Price: <strong>AED {Number(price).toFixed(2)}</strong>
          </p>
          <p className="text-muted mb-3">
            Tag: <Badge bg="info" className="text-dark">{tag}</Badge>{" "}
            | Status:{" "}
            <Badge
              bg={
                tourAvailability === "Available"
                  ? "success"
                  : tourAvailability === "SoldOut"
                  ? "danger"
                  : "warning"
              }
              className="text-dark"
            >
              {tourAvailability}
            </Badge>
          </p>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={{ span: 10, offset: 1 }}>
          <Image
            src={displayImage}
            alt={name}
            fluid
            className="rounded shadow"
          />
        </Col>
      </Row>

      <Row>
        <Col md={{ span: 8, offset: 1 }}>
          <p className="fs-5 text-dark">{description}</p>
        </Col>
      </Row>
    </Container>
  );
};

export default TourDetails;
