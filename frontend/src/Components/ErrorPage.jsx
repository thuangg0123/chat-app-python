import React from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";

function ErrorPage() {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Error 404</h1>
      <p>Page not found!</p>
      <Link to="/">
        <Button variant="primary">Back To Home</Button>
      </Link>
    </div>
  );
}

export default ErrorPage;
