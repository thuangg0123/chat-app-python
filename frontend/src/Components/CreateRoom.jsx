import React, { useState } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";

import { useDispatch, useSelector } from "react-redux";
import { createRoomChat } from "../redux/slice/userSlice";
import { useNavigate } from "react-router-dom";

function CreateRoom() {
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const [roomName, setRoomName] = useState("");
  const userData = useSelector((state) => state.user.userData);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const error = useSelector((state) => state.user.error);
  const successMessage = useSelector((state) => state.user.successMessage);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!roomName) {
      dispatch({
        type: "user/create-room/rejected",
        payload: {
          message: "Input room name is missing, please fill in all fields.",
        },
      });
      return;
    }

    await dispatch(
      createRoomChat({ room_name: roomName, user_id: userData.user_id })
    );
    setRoomName("");
    setTimeout(() => {
      navigate("/list-room");
    }, 1000);
  };

  return (
    <div className="mt-3">
      {isLoggedIn ? (
        <Container>
          <div className="d-flex justify-content-center align-items-center">
            <Form onSubmit={handleSubmit} className="w-50">
              <h2 className="text-center mb-4">Create Room</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              {successMessage && (
                <Alert variant="success">
                  {successMessage}, page will go to Chat Room
                </Alert>
              )}
              <Form.Group controlId="formBasicRoomName">
                <Form.Label>Room Name:</Form.Label>
                <Form.Control
                  type="text"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder="Enter room name"
                />
              </Form.Group>
              <div className="text-center mt-3">
                <Button variant="primary" type="submit">
                  Create
                </Button>
              </div>
            </Form>
          </div>
        </Container>
      ) : (
        <div className="d-flex justify-content-center align-items-center">
          <h1 className="">Welcome to Chat App</h1>
        </div>
      )}
    </div>
  );
}

export default CreateRoom;
