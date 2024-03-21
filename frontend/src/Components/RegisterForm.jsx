import React, { useState } from "react";
import { Form, Button, Alert, Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../redux/slice/userSlice";

import { useNavigate, Link } from "react-router-dom";

function RegisterForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const registering = useSelector((state) => state.user.registering);
  const error = useSelector((state) => state.user.error);
  const successMessage = useSelector((state) => state.user.successMessage);

  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      dispatch({
        type: "user/register/rejected",
        payload: {
          message:
            "Input username or password is missing, please fill in all fields.",
        },
      });
      return;
    }
    await dispatch(register({ username, password }));
    setTimeout(() => {
      navigate("/login");
    }, 3000);
  };

  return (
    <div className="mt-3">
      <Row className="justify-content-center">
        <Col md={6}>
          <div className="text-center">
            <h2>Register</h2>
          </div>
          {error && <Alert variant="danger">{error}</Alert>}
          {successMessage && <Alert variant="success">{successMessage}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicUsername">
              <Form.Label>Username:</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                bssize="sm"
              />
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password:</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                bssize="sm"
              />
            </Form.Group>
            <div className="text-center mt-3">
              <Link to="/login">Already have an account? Log in now.</Link>
            </div>
            <div className="text-center">
              <Button
                variant="primary"
                type="submit"
                className="mt-3"
                disabled={registering}
              >
                {registering ? "Registering..." : "Register"}
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </div>
  );
}

export default RegisterForm;
