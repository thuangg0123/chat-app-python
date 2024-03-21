import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

import { useSelector, useDispatch } from "react-redux";

import { logoutUser } from "../redux/slice/userSlice";

const Navigation = () => {
  let navigate = useNavigate();
  const userData = useSelector((state) => state.user.userData);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logoutUser());

    alert("Login is successfully");
    navigate("/");
  };

  return (
    <Navbar expand="lg" className="bg-success">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Logo
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>

            {isLoggedIn === false ? (
              <>
                <Nav.Link as={Link} to="/register">
                  Register
                </Nav.Link>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/list-room">
                  List Room
                </Nav.Link>
                <Nav.Link as={Link} to="/create-room">
                  Create Room
                </Nav.Link>
              </>
            )}
            {isLoggedIn && (
              <NavDropdown title={userData.username} id="basic-nav-dropdown">
                <NavDropdown.Item onClick={handleLogout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
