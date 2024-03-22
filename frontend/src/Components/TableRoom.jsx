import React, { useEffect } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { useDispatch, useSelector } from "react-redux";
import { deleteRoom, getUserRooms } from "../redux/slice/userSlice";
import { Link } from "react-router-dom";
import InputJoinRoom from "./InputJoinRoom";

function TableRoom() {
  const listRooms = useSelector((state) => state.user.listRooms);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserRooms());
  }, [dispatch]);

  const handleDeleteRoom = (roomId) => {
    dispatch(deleteRoom(roomId));
  };

  return (
    <div className="container mt-3">
      <div className="d-flex justify-content-between align-items-center">
        <span className="fw-bold">List of available rooms</span>
        <InputJoinRoom />
      </div>
      <Table striped bordered hover className="text-center">
        <thead>
          <tr>
            <th>#</th>
            <th>Room Id</th>
            <th>Room Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {listRooms.map((room, index) => (
            <tr key={room.room_id}>
              <td>{index + 1}</td>
              <td>{room.room_id}</td>
              <td>{room.room_name}</td>
              <td className="d-flex justify-content-center">
                <Link to={`/chat-room/${room.room_id}`}>
                  <Button variant="success" className="me-3">
                    Join Room
                  </Button>
                </Link>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteRoom(room.room_id)}
                >
                  Delete Room
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default TableRoom;
