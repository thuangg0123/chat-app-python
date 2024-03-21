import React from "react";

import "./style.css";

import demo from "../img/demo.png";

import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function Home() {
  const userData = useSelector((state) => state.user.userData);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  return (
    <section style={{ background: "#034d3a" }}>
      <div className="d-flex justify-content-center align-items-center welcome-container bg-homepage container">
        <div className="d-flex w-100" style={{ gap: "20px" }}>
          <div style={{ width: "40%" }}>
            <h2>CHAT APP</h2>
            <p className="py-3" style={{ color: "#ccc" }}>
              CHATAPP is built with Bootstrap 5.3.2 in HTML, SCSS with
              responsive in all devices and supported Dark, Light, RTL modes.
              You can change mode very quickly by doing a single change. It has
              many features like one-to-one chat, group chat, contact, send
              files, online users, read and unread new messages from users,
              authentication pages, and many more.
            </p>
            <div className="d-flex">
              {!isLoggedIn ? (
                <>
                  <Link to="/login">
                    <button className="btn btn-primary me-2">Login</button>
                  </Link>
                  <Link to="/resgister">
                    <button className="btn btn-danger">Register</button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/list-room">
                    <button className="btn btn-primary me-2">Chat Room</button>
                  </Link>
                </>
              )}
            </div>
          </div>
          <div style={{ width: "60%" }}>
            <img src={demo} alt="" className="demo" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Home;
