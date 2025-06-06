import { usePackageById } from "@/hooks/usePackage";
import { formatTimestamp } from "@/utils/formatTimestamp";
import {
  Container,
  Row,
  Col,
  Image,
  Badge,
  ListGroup,
  Card,
} from "react-bootstrap";
import { useParams } from "react-router-dom";

const PackageDetails = () => {
  const { id } = useParams();
  const { data: packageData } = usePackageById(String(id));

  return (
    <Container className="py-5 bg-white">
      <Row className="mb-4">
        <Col md={{ span: 10, offset: 1 }}>
          <h1 className="fw-bold text-dark">{packageData?.name}</h1>
          <p className="text-muted">
            Created At: {formatTimestamp(packageData?.createdAt || "")}
          </p>
          <Badge bg="secondary" className="me-2">
            Location: {packageData?.location.name}
          </Badge>
          <Badge bg="info" className="me-2">
            Duration: {packageData?.duration} days
          </Badge>
          <Badge bg="success" className="me-2">
            Price: {packageData?.currency} {packageData?.price}
          </Badge>
          <Badge bg="warning" text="dark">
            Availability: {packageData?.availability}
          </Badge>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={{ span: 10, offset: 1 }}>
          <Image
            src={`${packageData?.imageUrl}`}
            alt={packageData?.name}
            fluid
            className="rounded shadow"
          />
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={{ span: 10, offset: 1 }}>
          <h4>Description</h4>
          <p className="fs-5 text-dark">{packageData?.description}</p>

          <h5 className="mt-4">Important Info</h5>
          <p>{packageData?.importantInfo}</p>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={{ span: 5, offset: 1 }}>
          <Card className="mb-3">
            <Card.Header>Inclusions</Card.Header>
            <ListGroup variant="flush">
              {packageData?.inclusions?.map((inc) => (
                <ListGroup.Item key={inc.id}>{inc.name}</ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>
        <Col md={5}>
          <Card className="mb-3">
            <Card.Header>Exclusions</Card.Header>
            <ListGroup variant="flush">
              {packageData?.exclusions?.map((exc) => (
                <ListGroup.Item key={exc.id}>{exc.name}</ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={{ span: 10, offset: 1 }}>
          <h4>Features</h4>
          <div className="d-flex flex-wrap gap-2">
            {packageData?.features?.map((f) => (
              <Badge bg="primary" key={f.id}>
                {f.name}
              </Badge>
            ))}
          </div>

          <h4 className="mt-4">Itinerary</h4>
          <ListGroup>
            {packageData?.timeline?.map((dayItem: any, index: any) => (
              <ListGroup.Item key={index} className="mb-2">
                <div className="fw-bold mb-1">Day {dayItem.day}</div>
                {dayItem.entries.map((entry: any, i: any) => (
                  <div key={i} className="ms-3">
                    <strong>{entry.title}</strong>: {entry.description}
                  </div>
                ))}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={{ span: 10, offset: 1 }}>
          <h4>Policy</h4>
          <p>
            <strong>Booking:</strong> {packageData?.policy?.bookingPolicy}
          </p>
          <p>
            <strong>Cancellation:</strong>{" "}
            {packageData?.policy?.cancellationPolicy}
          </p>
          <p>
            <strong>Payment Terms:</strong> {packageData?.policy?.paymentTerms}
          </p>
          <p>
            <strong>Visa:</strong> {packageData?.policy?.visaDetail}
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default PackageDetails;
