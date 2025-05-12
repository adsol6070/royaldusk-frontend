import { useTourById } from "@/hooks/useTour";
import { formatTimestamp } from "@/utils/formatTimestamp";
import { Container, Row, Col, Image } from "react-bootstrap";
import { useParams } from "react-router-dom";

const TourDetails = () => {
  const { id } = useParams();
const { data: fetchedTour } = useTourById(String(id));

const demoTour = {
  id: 1,
  name: "Majestic Himalayas",
  location: "Manali, India",
  createdAt: "2025-04-01T10:30:00Z",
  description: `
    Embark on an unforgettable journey through the snow-capped peaks of the Himalayas.
    This tour offers breathtaking views, serene monasteries, and thrilling adventures 
    like river rafting, paragliding, and mountain trekking. Perfect for nature lovers 
    and adrenaline seekers!
  `,
  image:
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
};

const tour = fetchedTour || demoTour;

  return (
    <Container className="py-5 bg-white">
      <Row>
        <Col md={{ span: 10, offset: 1 }}>
          <h1 className="fw-bold text-dark">{tour?.name}</h1>
          <p className="text-muted">
            Created At
            {formatTimestamp(tour?.createdAt || "")}
          </p>
        </Col>
      </Row>

      <Row>
        <Col md={{ span: 10, offset: 1 }}>
          <Image
            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b"
            alt={tour?.name}
            fluid
            className="rounded shadow"
          />
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={{ span: 8, offset: 1 }}>
          <div
            className="fs-5 text-dark"
          >{tour?.description}</div>
        </Col>
      </Row>
    </Container>
  );
};

export default TourDetails;
