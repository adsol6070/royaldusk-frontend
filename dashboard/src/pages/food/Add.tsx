import { useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { theme } from "../../constants/theme";
import useAddMenu from "./useFood";

const ProductForm = () => {
  const { addMenuItem, loading, error } = useAddMenu();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    availability: "",
    nonVeg: false,
    veg: false,
    deliveryCharge: "",
    gst: "",
  });
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      image: file,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formToSubmit = new FormData();
    formToSubmit.append("name", formData.name);
    formToSubmit.append("description", formData.description);
    formToSubmit.append("price", formData.price);
    formToSubmit.append("availability", formData.availability);
    formToSubmit.append("nonVeg", formData.nonVeg);
    formToSubmit.append("veg", formData.veg);
    formToSubmit.append("deliveryCharge", formData.deliveryCharge);
    formToSubmit.append("gst", formData.gst);

    const image: any = formData.image;

    if (image) {
      formToSubmit.append("menuImage", image, image.name);
    }

    await addMenuItem(formToSubmit);
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Row className="d-flex flex-column flex-xl-row">
          <Col xl={6} className="mb-3">
            <Card>
              <Card.Body>
                <Form.Group controlId="name">
                  <Form.Label>Product Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Product Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="description" className="mt-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter Description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="price" className="mt-3">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter Price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="availability" className="mt-3">
                  <Form.Label>Availability</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Availability Status"
                    name="availability"
                    value={formData.availability}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>

          <Col xl={6} className="mb-3">
            <Card>
              <Card.Body>
                <Form.Group controlId="nonVeg" className="mt-3">
                  <Form.Check
                    type="checkbox"
                    label="Non-Veg"
                    name="nonVeg"
                    checked={formData.nonVeg}
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group controlId="veg" className="mt-3">
                  <Form.Check
                    type="checkbox"
                    label="Veg"
                    name="veg"
                    checked={formData.veg}
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group controlId="deliveryCharge" className="mt-3">
                  <Form.Label>Delivery Charge</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter Delivery Charge"
                    name="deliveryCharge"
                    value={formData.deliveryCharge}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="gst" className="mt-3">
                  <Form.Label>GST (%)</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter GST"
                    name="gst"
                    value={formData.gst}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="fileUpload" className="mt-3">
                  <Form.Label>Upload Image</Form.Label>
                  <Form.Control
                    type="file"
                    name="image"
                    onChange={handleFileUpload}
                    required
                  />
                  <Form.Text className="text-muted">
                    * Recommended resolution is 640*640 with file size up to
                    2MB.
                  </Form.Text>
                </Form.Group>

                <div className="mt-3">
                  <Button
                    type="button"
                    style={{ backgroundColor: "transparent", color: "black" }}
                    className="me-2"
                    onClick={() => setFormData({})}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    style={{
                      backgroundColor: theme.colors.orangeYellow,
                      border: "none",
                    }}
                  >
                    {loading ? "Adding..." : "Add Product"}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {error && <p style={{ color: "red" }}>Error: {error}</p>}
      </Form>
    </Container>
  );
};

export default ProductForm;
