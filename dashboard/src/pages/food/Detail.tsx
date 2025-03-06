import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { theme } from "../../constants/theme";
import { useParams } from "react-router-dom";
import useAddMenu from "./useFood";
import { useEffect } from "react";
import Burger from "../../assets/images/burger.png";

const Edit = () => {
  const { id } = useParams();
  const { selectedItem, loading, error, fetchMenuItemById } = useAddMenu();

  useEffect(() => {
    fetchMenuItemById(id);
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data: {error}</p>;

  if (!selectedItem) return <p>No menu item found</p>;

  return (
    <Container className="mt-4">
      <Row>
        {/* Left Column - Image and Thumbnails */}
        <Col md={5}>
          <Card className="p-3">
            <Card.Img
              variant="top"
              src={selectedItem.imageUrl || Burger} // Use dynamic image or default
              alt="Product Image"
              className="mb-3"
              style={{ maxHeight: "300px", objectFit: "cover" }}
            />
          </Card>
        </Col>

        {/* Right Column - Product Details */}
        <Col md={7}>
          <Card className="p-3">
            <Card.Body>
              <Card.Subtitle className="text-warning mb-2">
                {selectedItem.category || "Food"}
              </Card.Subtitle>
              <Card.Title className="mb-3">
                {selectedItem.name || "Baklava"}
              </Card.Title>

              <Card.Text>
                <strong>Stock:</strong> {selectedItem.stock || "15kg"}
              </Card.Text>

              <Card.Text>
                <strong>Description:</strong>{" "}
                {selectedItem.description || "Lorem ipsum dolor sit amet..."}
              </Card.Text>

              <Card.Text>
                <strong>Price:</strong> ${selectedItem.price || "120"}
              </Card.Text>

              {/* Edit and Delete Buttons */}
              <Button
                style={{
                  padding: "5px 10px",
                  backgroundColor: theme.colors.whiteSmoke,
                  border: "none",
                  color: theme.colors.orangeYellow,
                }}
                variant="warning"
                className="me-2"
              >
                Edit Detail
              </Button>
              <Button
                style={{
                  backgroundColor: theme.colors.lightPink,
                  border: "none",
                  color: theme.colors.terraCotta,
                  fontWeight: "bold",
                  padding: "5px 10px",
                }}
              >
                Delete Detail
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Edit;
