import React, { useState } from "react";
import { Form, Button, Alert, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../redux/slice/userSlice";
import { useNavigate, Link } from "react-router-dom";

function RegisterForm() {
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const registering = useSelector((state) => state.user.registering);
  const error = useSelector((state) => state.user.error);
  const successMessage = useSelector((state) => state.user.successMessage);

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
    <Container>
      <div className="d-flex justify-content-center align-items-center mt-3">
        <Form onSubmit={handleSubmit} className="w-50">
          <h2 className="text-center mb-4">Register</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {successMessage && <Alert variant="success">{successMessage}</Alert>}
          <Form.Group controlId="formBasicUsername">
            <Form.Label>Username:</Form.Label>
            <Form.Control
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              size="sm"
            />
          </Form.Group>
          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password:</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              size="sm"
            />
          </Form.Group>
          <div className="text-center mt-3">
            <Link to="/login">Already have an account? Log in now.</Link>
          </div>
          <div className="text-center mt-3">
            <Button variant="primary" type="submit" disabled={registering}>
              {registering ? "Registering..." : "Register"}
            </Button>
          </div>
        </Form>
      </div>
    </Container>
  );
}

export default RegisterForm;
