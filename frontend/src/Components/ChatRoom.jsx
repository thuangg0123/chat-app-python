import React, { useState, useEffect } from "react";
import io from "socket.io-client";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";

import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { login, getUserRooms } from "../redux/slice/userSlice";
const socket = io("http://localhost:5000");
import "./style.css";

function ChatRoom() {
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");

  const userData = useSelector((state) => state.user.userData);
  const listRooms = useSelector((state) => state.user.listRooms);
  const dispatch = useDispatch();

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
    return () => {
      socket.off("message");
    };
  }, []);

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
  }, [listRooms, userData]);

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
      console.log("Sending message:", messageInput);
      socket.emit("message", {
        username: userData.username,
        message: messageInput,
        room_id: listRooms[0].room_id,
      });
      setMessageInput("");
    }
  };

  console.log("messages", messages);

  return (
    <div className="container-chatroom container">
      <div className="py-3 d-flex">
        <h6 className="">Room Chat - #{roomId}</h6>
      </div>

      <section className="chat">
        {messages.map((message, index) => (
          <span className="d-flex" key={index}>
            <p>
              <strong>{message.username}</strong>: {message.message}
            </p>
          </span>
        ))}
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
