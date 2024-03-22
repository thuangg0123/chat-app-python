import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { Form, Button, InputGroup } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getMessageFromDB } from "../redux/slice/userSlice";
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

  const handleIncomingMessage = (message) => {
    dispatch(getMessageFromDB(roomId));
  };

  useEffect(() => {
    if (roomId) {
      dispatch(getMessageFromDB(roomId));
      const currentRoom = listRooms.find((room) => room.room_id === roomId);
      if (currentRoom) {
        socket.emit("join", {
          room_id: roomId,
          username: userData.username,
        });
      }
    }
  }, [roomId, listRooms, userData, dispatch]);

  useEffect(() => {
    socket.on("message", handleIncomingMessage);
    return () => {
      socket.off("message", handleIncomingMessage);
    };
  }, [handleIncomingMessage]);

  useEffect(() => {
    return () => {
      if (roomId) {
        socket.emit("leave", {
          room_id: roomId,
          username: userData.username,
        });
      }
    };
  }, [roomId, userData]);

  const sendMessage = () => {
    if (messageInput.trim() !== "") {
      socket.emit("message", {
        username: userData.username,
        message: messageInput,
        room_id: roomId,
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
    <div className="container-chatroom container my-3">
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
