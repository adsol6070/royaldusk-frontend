import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Tabs,
  Tab,
} from "react-bootstrap";
import "./Login.css";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FormInput, VerticalForm } from "../../components";
import { useAuthContext } from "../../common/context/AuthContext";

const schemaResolver = yupResolver(
  yup.object().shape({
    email: yup.string().required("Please enter Username"),
    password: yup.string().required("Please enter Password"),
  })
);

const SignupLoginForm = () => {
  const { loginUser } = useAuthContext();
  const [key, setKey] = useState("signup");

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col xs={12} md={4}>
          <Card className="p-4 shadow-lg">
            <Tabs
              id="controlled-tab-example"
              activeKey={key}
              onSelect={(k) => setKey(k)}
              className="mb-3"
            >
              <Tab eventKey="signup" title="Sign Up">
                <Form>
                  <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>
                      Tenant Id<span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      required
                      placeholder="Enter Tenant Id"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>
                      First Name<span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      required
                      placeholder="Enter First Name"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>
                      Last Name<span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      required
                      placeholder="Enter Last Name "
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>
                      Email Address<span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="email"
                      required
                      placeholder="Enter email"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label>
                      Password<span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="password"
                      required
                      placeholder="Password"
                    />
                  </Form.Group>
                  <Button
                    variant="primary"
                    type="submit"
                    style={{ width: "100%" }}
                  >
                    Get Started
                  </Button>
                </Form>
              </Tab>
              <Tab eventKey="login" title="Log In">
                <VerticalForm<any>
                  onSubmit={loginUser}
                  resolver={schemaResolver}
                  defaultValues={{
                    email: "velonic@techzaa.com",
                    password: "Velonic",
                  }}
                >
                  <FormInput
                    label="Email address"
                    type="text"
                    name="email"
                    placeholder="Enter your email"
                    containerClass="mb-3"
                    required
                  />
                  <FormInput
                    label="Password"
                    name="password"
                    type="password"
                    required
                    id="password"
                    placeholder="Enter your password"
                    containerClass="mb-3"
                  ></FormInput>
                  <FormInput
                    label="Remember me"
                    type="checkbox"
                    name="checkbox"
                    containerClass={"mb-3"}
                  />
                  <div className="mb-0 text-start">
                    <Button
                      variant="soft-primary"
                      className="w-100"
                      type="submit"
                    >
                      <i className="ri-login-circle-fill me-1" />{" "}
                      <span className="fw-bold">Log In</span>{" "}
                    </Button>
                  </div>
                </VerticalForm>
              </Tab>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SignupLoginForm;
