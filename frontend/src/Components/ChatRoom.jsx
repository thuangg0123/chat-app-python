import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";

import { useSelector, useDispatch } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { getUserRooms, getMessageFromDB } from "../redux/slice/userSlice";
import "./style.css";

const socket = io("http://localhost:5000");

function ChatRoom() {
  const { roomId } = useParams();
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef(null);

  const userData = useSelector((state) => state.user.userData);
  const listRooms = useSelector((state) => state.user.listRooms);
  const messagesDB = useSelector((state) => state.user.messagesDB);
  const dispatch = useDispatch();

  useEffect(() => {
    socket.on("message", (message) => {
      dispatch(getMessageFromDB(userData.rooms[0].room_id));
    });
    return () => {
      socket.off("message");
    };
  }, [dispatch, userData]);

  useEffect(() => {
    if (userData.user_id) {
      dispatch(getUserRooms());
    }
  }, [userData, dispatch]);

  useEffect(() => {
    if (listRooms.length > 0) {
      const currentRoom = listRooms[0];
      socket.emit("join", {
        room_id: currentRoom.room_id,
        username: userData.username,
      });
    }
    dispatch(getMessageFromDB(userData.rooms[0].room_id));
  }, [listRooms, userData, roomId, dispatch]);

  useEffect(() => {
    return () => {
      const currentRoom = listRooms[0];
      socket.emit("leave", {
        room_id: currentRoom.room_id,
        username: userData.username,
      });
    };
  }, [listRooms, userData]);

  const sendMessage = () => {
    if (messageInput.trim() !== "") {
      socket.emit("message", {
        username: userData.username,
        message: messageInput,
        room_id: listRooms[0].room_id,
      });
      setMessageInput("");
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messagesDB]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="container-chatroom container mt-3">
      <div className="p-3 d-flex justify-content-between align-items-center">
        <h6 className="m-0">Room Chat - #{roomId}</h6>
        <Link to="/list-room">
          <Button variant="primary">Back List Room</Button>
        </Link>
      </div>

      <section
        className="chat px-3"
        style={{ overflowY: "auto", maxHeight: "70vh" }}
      >
        <div className="message-container">
          {messagesDB.map((message, index) => (
            <span
              className={`d-flex ${
                message.username === userData.username
                  ? "justify-content-end"
                  : "justify-content-start"
              }`}
              key={index}
            >
              <p
                className={`message ${
                  message.username === userData.username
                    ? "own-message"
                    : "other-message"
                }`}
              >
                {message.username === userData.username ? (
                  <>
                    {message.message}: <strong>You</strong>
                  </>
                ) : (
                  <>
                    <strong>{message.username}</strong>: {message.message}
                  </>
                )}
              </p>
            </span>
          ))}
        </div>
        <div ref={messagesEndRef} />
      </section>

      <Form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
      >
        <InputGroup className="mb-3" style={{ borderRadius: "10px" }}>
          <Form.Control
            placeholder="Say something nice"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
          />
          <Button
            variant="outline-secondary"
            type="submit"
            style={{ color: "#fff" }}
          >
            Send
          </Button>
        </InputGroup>
      </Form>
    </div>
  );
}

export default ChatRoom;
