import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Navigation from "./Components/Navigation";
import Home from "./Components/Home";
import LoginForm from "./Components/LoginForm";
import RegisterForm from "./Components/RegisterForm";
import CreateRoom from "./Components/CreateRoom";
import TableRoom from "./Components/TableRoom";
import ChatRoom from "./Components/ChatRoom";
import ErrorPage from "./Components/ErrorPage";

import { useDispatch, useSelector } from "react-redux";
import {
  getUserRooms,
  loadUserDataFromLocalStorage,
} from "./redux/slice/userSlice";

function App() {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUserDataFromLocalStorage());
    dispatch(getUserRooms());
  }, [dispatch]);

  return (
    <Router>
      <Navigation />
      <div>
        <Routes>
          <Route exact path="/" element={<Home />} />
          {!isLoggedIn ? (
            <>
              <Route path="/list-room" element={<Navigate to="/login" />} />
              <Route
                path="/chat-room/:roomId"
                element={<Navigate to="/login" />}
              />
              <Route path="/create-room" element={<Navigate to="/login" />} />
            </>
          ) : (
            <>
              <Route path="/list-room" element={<TableRoom />} />
              <Route path="/chat-room/:roomId" element={<ChatRoom />} />
              <Route path="/create-room" element={<CreateRoom />} />
            </>
          )}

          {isLoggedIn ? (
            <>
              <Route path="/login" element={<Navigate to="/" />} />
              <Route path="/register" element={<Navigate to="/" />} />
            </>
          ) : (
            <>
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
            </>
          )}
          <Route path="/*" element={<ErrorPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
