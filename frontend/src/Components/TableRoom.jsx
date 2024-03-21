import React, { useEffect } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { useDispatch, useSelector } from "react-redux";
import { deleteRoom, getUserRooms } from "../redux/slice/userSlice";

import { Link } from "react-router-dom";

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
      <div className="">
        <p className="fw-bold">List of available rooms</p>
      </div>
      <Table striped bordered hover>
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
              <td className="d-flex">
                <Link to={`/chat-room/${room.room_name}`}>
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
