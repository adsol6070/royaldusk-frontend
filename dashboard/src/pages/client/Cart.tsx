import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert,
  Modal,
  Form,
} from "react-bootstrap";
import styled from "styled-components";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import { cartApi } from "../../common";
import useAddMenu from "./useClient";
import { useAuthContext } from "../../common/context/AuthContext";

const USER_ID = "66b5b294f91390a5ad5d4662";
const TABLE_ID = "66b716b0f4c9e041873df89e";

const calculateTotal = (items: any[]): number =>
  items.reduce((acc, item) => {
    const price = item.menuItem?.price ? parseFloat(item.menuItem.price) : 0;
    return acc + item.quantity * price;
  }, 0);

const CartPage = () => {
  const { user } = useAuthContext();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const { submitOrder, loading, error: orderError } = useAddMenu();
  const [showCheckout, setShowCheckout] = useState(false); // State to control modal visibility
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
  });

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const response = await cartApi.getCartItems(user.sub, user.tableID);
      const items = response.data.items;
      setCartItems(items);
      setTotal(calculateTotal(items));
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setError("Failed to load cart items.");
    }
  };

  const updateCart = async (
    productID: string,
    action: "increment" | "decrement"
  ) => {
    try {
      const cartData = {
        userId: user.sub,
        tableId: user.tableID,
        items: [{ menuItem: productID, quantity: 1 }],
        action,
      };
      await cartApi.addToCart(cartData);
      fetchCartItems();
    } catch (error) {
      console.error(
        `Error ${
          action === "increment" ? "incrementing" : "decrementing"
        } item:`,
        error
      );
      setError(
        `Failed to ${
          action === "increment" ? "increment" : "decrement"
        } item quantity.`
      );
    }
  };

  const deleteCartItem = async (itemId: string) => {
    try {
      await cartApi.deleteCartItem(itemId);
      fetchCartItems();
    } catch (error) {
      console.error("Error deleting cart item:", error);
      setError("Failed to delete cart item.");
    }
  };

  const incrementQuantity = (productID: string) =>
    updateCart(productID, "increment");
  const decrementQuantity = (productID: string) =>
    updateCart(productID, "decrement");

  // Handle form input changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit the form (you can handle form submission here)
  const handleFormSubmit = async () => {
    const orderData = {
      userId: user.sub,
      tableId: user.tableID,
      ...form,
      items: cartItems.map((item) => ({
        menuItem: item.menuItem._id,
        quantity: item.quantity,
      })),
      total,
    };

    try {
      const response = await submitOrder(orderData);
      toast.success(response.message);
      setShowCheckout(false);
      setCartItems([]);
    } catch (err) {
      console.error("Failed to submit order:", err);
    }
  };

  return (
    <>
      <ToastContainer />
      <StyledContainer>
        <Row>
          <Col md={8}>
            {error && <Alert variant="danger">{error}</Alert>}
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <CartItemComponent
                  key={item._id}
                  item={item}
                  onIncrement={incrementQuantity}
                  onDecrement={decrementQuantity}
                  onDelete={() => deleteCartItem(item._id)}
                />
              ))
            ) : (
              <p>No items in cart</p>
            )}
          </Col>
          <Col md={4}>
            <CartSummary
              total={total}
              onCheckout={() => setShowCheckout(true)}
            />
          </Col>
        </Row>

        {/* Checkout Modal */}
        <Modal show={showCheckout} onHide={() => setShowCheckout(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Checkout</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formFirstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleFormChange}
                  placeholder="Enter your first name"
                />
              </Form.Group>
              <Form.Group controlId="formLastName" className="mt-3">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleFormChange}
                  placeholder="Enter your last name"
                />
              </Form.Group>
              <Form.Group controlId="formPhone" className="mt-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="text"
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleFormChange}
                  placeholder="Enter your phone number"
                />
              </Form.Group>
              <Form.Group controlId="formEmail" className="mt-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleFormChange}
                  placeholder="Enter your email"
                />
              </Form.Group>
              <Button
                variant="primary"
                className="mt-3 w-100"
                onClick={handleFormSubmit}
              >
                Submit
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </StyledContainer>
    </>
  );
};

const CartItemComponent = ({
  item,
  onIncrement,
  onDecrement,
  onDelete,
}: {
  item: any;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  onDelete: (id: string) => void;
}) => {
  const { menuItem, quantity } = item;
  const itemTotal =
    quantity * (menuItem?.price ? parseFloat(menuItem.price) : 0);

  return (
    <StyledCartItem>
      <Row>
        <Col md={2}>
          <img
            src={menuItem?.imageUrl}
            alt={menuItem?.name}
            width="50"
            height="50"
            style={{ objectFit: "cover", borderRadius: "50%" }}
          />
        </Col>
        <Col md={4}>
          <h5>{menuItem?.name}</h5>
          <p>Price: Rs.{menuItem?.price}</p>
        </Col>
        <Col md={3} className="text-center">
          <Button
            variant="outline-danger"
            onClick={() => onDecrement(menuItem._id)}
          >
            -
          </Button>
          <span> {quantity} </span>
          <Button
            variant="outline-success"
            onClick={() => onIncrement(menuItem._id)}
          >
            +
          </Button>
        </Col>
        <Col md={2} className="text-right">
          <p>Sub Total: Rs.{itemTotal}</p>
        </Col>
        <Col md={1} className="text-right">
          <Button variant="danger" onClick={() => onDelete(item._id)}>
            🗑️
          </Button>
        </Col>
      </Row>
    </StyledCartItem>
  );
};

const CartSummary = ({
  total,
  onCheckout,
}: {
  total: number;
  onCheckout: () => void;
}) => (
  <Card>
    <Card.Body>
      <Card.Title>Cart Total</Card.Title>
      <SummaryRow>
        <span>Sub-total</span>
        <span>Rs.{total.toFixed(2)}</span>
      </SummaryRow>
      <SummaryRow>
        <span>Delivery</span>
        <span>Free</span>
      </SummaryRow>
      <SummaryRow>
        <span>Discount</span>
        <span>Rs.20</span>
      </SummaryRow>
      <SummaryRow>
        <span>Order Total</span>
        <span>Rs.{total - 20}</span>
      </SummaryRow>
      <Button
        variant="primary"
        className="mt-3 w-100"
        onClick={onCheckout}
        disabled={total === 0}
      >
        Checkout
      </Button>
    </Card.Body>
  </Card>
);

const StyledContainer = styled(Container)`
  margin-top: 2rem;
`;

const StyledCartItem = styled(Card)`
  margin-bottom: 1rem;
  padding: 1rem;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
`;

export default CartPage;
