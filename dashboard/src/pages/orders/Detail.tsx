import { Row, Col, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { theme } from "../../constants/theme";

const OrderDetails = () => {
  const products = [
    {
      id: 1,
      name: "Baklava",
      price: "$20.00",
      quantity: "1x",
      image: "https://path-to-image/baklava.png",
    },
    {
      id: 2,
      name: "Barbecue",
      price: "$10.00",
      quantity: "2x",
      image: "https://path-to-image/barbecue.png",
    },
    {
      id: 3,
      name: "Burger",
      price: "$15.00",
      quantity: "1x",
      image: "https://path-to-image/burger.png",
    },
  ];

  return (
    <div className="container my-4">
      <Row>
        <Col md={9}>
          <Row
            style={{
              backgroundColor: theme.colors.almostWhite,
              padding: "20px",
              height: "300px",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: "2px",
            }}
          >
            <Row
              className="text-center fw-normal"
              style={{ borderBottom: "1px solid grey" }}
            >
              <Col>Products</Col>
              <Col>Price</Col>
              <Col>Quantity</Col>
            </Row>
            {products.map((product) => (
              <Card
                key={product.id}
                className="my-2"
                style={{ border: "none" }}
              >
                <Row
                  className="align-items-center text-center"
                  style={{ borderBottom: "1px solid grey", padding: "10px" }}
                >
                  <Col
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignContent: "center",
                    }}
                  >
                    {/* <img
                      src={product.image}
                      // alt={product.name}
                      style={{ width: "50px", height: "50px" }}
                    /> */}
                    <div>{product.name}</div>
                  </Col>
                  <Col>{product.price}</Col>
                  <Col>{product.quantity}</Col>
                </Row>
              </Card>
            ))}
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default OrderDetails;
