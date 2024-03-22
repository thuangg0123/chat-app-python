import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

import { joinRoom } from "../redux/slice/userSlice";

function InputJoinRoom() {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.userData);
  const [roomId, setRoomId] = useState("");

  const handleJoinRoom = () => {
    dispatch(joinRoom({ room_id: roomId, user_id: userData.user_id }));
  };
  return (
    <div>
      <InputGroup className="mb-3">
        <Form.Control
          aria-label="Example text with button addon"
          aria-describedby="basic-addon1"
          placeholder="Enter ID Room to join"
          value={roomId}
          onChange={(event) => setRoomId(event.target.value)}
        />
        <Button
          variant="outline-secondary"
          id="button-addon1"
          onClick={handleJoinRoom}
        >
          Button
        </Button>
      </InputGroup>
    </div>
  );
}

export default InputJoinRoom;
