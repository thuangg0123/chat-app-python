import React, { useState } from "react";
import { Form, Button, Alert, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/slice/userSlice";
import { useNavigate, Link } from "react-router-dom";

function LoginForm() {
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const error = useSelector((state) => state.user.error);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      dispatch({
        type: "user/login/rejected",
        payload: {
          message:
            "Input username or password is missing, please fill in all fields.",
        },
      });
      return;
    }
    let response = await dispatch(login({ username, password }));
    if (response.payload.status === 200) {
      navigate("/");
    }
  };

  return (
    <Container>
      <div className="d-flex justify-content-center align-items-center mt-3">
        <Form onSubmit={handleSubmit} className="w-50">
          <h2 className="text-center mb-4">Login</h2>
          {error && <Alert variant="danger">{error}</Alert>}
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
              size="sm" // smaller input
            />
          </Form.Group>
          <div className="text-center mt-3">
            <Link to="/register">Don't have an account? Sign up now.</Link>
          </div>
          <div className="text-center mt-3">
            <Button variant="primary" type="submit">
              Login
            </Button>
          </div>
        </Form>
      </div>
    </Container>
  );
}

export default LoginForm;
