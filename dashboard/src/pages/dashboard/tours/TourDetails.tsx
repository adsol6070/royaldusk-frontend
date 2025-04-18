import { useTourById } from "@/hooks/useTour";
import { formatTimestamp } from "@/utils/formatTimestamp";
import { Container, Row, Col, Image } from "react-bootstrap";
import { useParams } from "react-router-dom";

const TourDetails = () => {
  const { id } = useParams();
  const { data: tour } = useTourById(String(id));

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
