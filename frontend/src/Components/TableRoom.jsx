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
  const userData = useSelector((state) => state.user.userData);

  useEffect(() => {
    dispatch(getUserRooms());
  }, [dispatch]);

  const handleDeleteRoom = async (room_id) => {
    try {
      // Kiểm tra xem userData có tồn tại và có chứa user_id không
      if (!userData || !userData.user_id) {
        console.error("User data or user ID is missing");
        return;
      }

      // Gửi yêu cầu xóa phòng với ID phòng và ID người dùng hợp lệ
      const response = await dispatch(
        deleteRoom({ room_id: room_id, user_id: userData.user_id })
      );

      // Kiểm tra xem yêu cầu đã thành công và cập nhật lại danh sách phòng nếu cần
      if (response.payload.message === "Room deleted successfully") {
        dispatch(getUserRooms());
      }
    } catch (error) {
      console.error("Error deleting room:", error);
    }
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
