import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

import logo from "../img/logo.png";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../redux/slice/userSlice";

import "./style.css";

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
    <Navbar expand="lg" style={{ backgroundColor: "#272A33" }}>
      <Container className="justify-content-between">
        <Navbar.Brand as={Link} to="/">
          <div className="d-flex align-items-center">
            <img src={logo} alt="" style={{ width: "80px", height: "80px" }} />
            <span style={{ color: "#fff", fontWeight: "bold" }}>CHAT APP</span>
          </div>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" style={{ color: "#ffffff" }}>
              Home
            </Nav.Link>

            {isLoggedIn === false ? (
              <>
                <Nav.Link as={Link} to="/register" style={{ color: "#ffffff" }}>
                  Register
                </Nav.Link>
                <Nav.Link as={Link} to="/login" style={{ color: "#ffffff" }}>
                  Login
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link
                  as={Link}
                  to="/list-room"
                  style={{ color: "#ffffff" }}
                >
                  List Room
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/create-room"
                  style={{ color: "#ffffff" }}
                >
                  Create Room
                </Nav.Link>
              </>
            )}
            {isLoggedIn && (
              <NavDropdown
                title={userData.username}
                id="basic-nav-dropdown"
                className="white-text"
              >
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
