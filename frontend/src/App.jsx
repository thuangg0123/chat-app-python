// Trong component App.js
import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navigation from "./Components/Navigation";
import Home from "./Components/Home";
import LoginForm from "./Components/LoginForm";
import RegisterForm from "./Components/RegisterForm";
import CreateRoom from "./Components/CreateRoom";
import TableRoom from "./Components/TableRoom";
import ChatRoom from "./Components/ChatRoom";

import { useDispatch } from "react-redux";
import {
  getUserRooms,
  loadUserDataFromLocalStorage,
} from "./redux/slice/userSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUserDataFromLocalStorage());
    dispatch(getUserRooms());
  }, [dispatch]);

  return (
    <Router>
      <Navigation />
      <div className="container mt-3">
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/list-room" element={<TableRoom />} />
          <Route path="/create-room" element={<CreateRoom />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/chat-room/:roomId" element={<ChatRoom />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
