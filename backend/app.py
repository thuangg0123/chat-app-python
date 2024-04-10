from flask import Flask, render_template, request, jsonify, session
from flask_socketio import SocketIO, join_room, leave_room, emit
from flask_pymongo import PyMongo
from flask_cors import CORS
from bson import ObjectId, json_util
import bcrypt

app = Flask(__name__)
app.secret_key = "123456"
socketio = SocketIO(app, cors_allowed_origins="*")
app.config["MONGO_URI"] = "mongodb://localhost:27017/chatapp"
mongo = PyMongo(app)
CORS(app)

users = mongo.db.users
rooms = mongo.db.rooms
messages = mongo.db.messages


def hash_password(password):
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed_password


def verify_password(hashed_password, password):
    return bcrypt.checkpw(password.encode("utf-8"), hashed_password)


def convert_objectid_to_str(obj):
    if isinstance(obj, ObjectId):
        return str(obj)
    return obj


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/register", methods=["POST"])
def register_user():
    user_data = request.json
    username = user_data.get("username")

    existing_user = users.find_one({"username": username})
    if existing_user:
        return jsonify({"message": "Username already exists."}), 400

    user_data["password"] = hash_password(user_data["password"])

    user_id = users.insert_one(user_data).inserted_id
    users.update_one({"_id": user_id}, {"$set": {"rooms": []}})
    return jsonify({"message": "User account is registered successfully"}), 200


@app.route("/login", methods=["POST"])
def login():
    username = request.json.get("username")
    password = request.json.get("password")

    existing_user = users.find_one({"username": username})
    if existing_user:
        if verify_password(existing_user["password"], password):
            session["username"] = username
            user_id = str(existing_user["_id"])
            user_rooms = existing_user.get("rooms", [])
            user_rooms_data = rooms.find({"_id": {"$in": user_rooms}}, {"room_name": 1})
            user_rooms_info = [
                {"room_id": str(room["_id"]), "room_name": room["room_name"]}
                for room in user_rooms_data
            ]
            return (
                jsonify(
                    {
                        "message": "Login successful",
                        "username": username,
                        "user_id": user_id,
                        "rooms": user_rooms_info,
                    }
                ),
                200,
            )
        else:
            return jsonify({"message": "Username or password is incorrect"}), 400
    else:
        return jsonify({"message": "Your account does not exist"}), 400


@app.route("/create-room", methods=["POST"])
def create_room():
    room_data = request.json
    room_name = room_data.get("room_name")
    user_id = room_data.get("user_id")

    existing_user = users.find_one({"_id": ObjectId(user_id)})
    if not existing_user:
        return jsonify({"message": "User not found"}), 404

    existing_room = rooms.find_one({"room_name": room_name})
    if existing_room:
        return jsonify({"message": "Room already exists"}), 400

    room_id = rooms.insert_one(
        {
            "room_name": room_name,
            "users": [{"user_id": ObjectId(user_id), "role": "owner"}],
        }
    ).inserted_id

    users.update_one({"_id": ObjectId(user_id)}, {"$addToSet": {"rooms": room_id}})

    return (
        jsonify(
            {
                "message": "Room created successfully",
                "room_id": str(room_id),
                "room_name": room_name,
            }
        ),
        200,
    )


@app.route("/join-room", methods=["POST"])
def join_new_room():
    room_id = request.json.get("room_id")
    user_id = request.json.get("user_id")

    if not user_id or not room_id:
        return jsonify({"message": "User ID or Room ID is required"}), 400

    user = users.find_one({"_id": ObjectId(user_id)})
    if not user:
        return jsonify({"message": "User not found"}), 404

    room = rooms.find_one({"_id": ObjectId(room_id)})
    if not room:
        return jsonify({"message": "Room not found"}), 404

    room_users = room.get("users", [])
    existing_user = next(
        (user for user in room_users if user.get("user_id") == ObjectId(user_id)), None
    )

    if existing_user:
        return jsonify({"message": "User already in the room"}), 200

    role = "owner" if str(room_users[0].get("user_id")) == user_id else "member"

    rooms.update_one(
        {"_id": ObjectId(room_id)},
        {"$addToSet": {"users": {"user_id": ObjectId(user_id), "role": role}}},
    )

    users.update_one(
        {"_id": ObjectId(user_id)}, {"$addToSet": {"rooms": ObjectId(room_id)}}
    )

    return jsonify({"message": "Room joined successfully"}), 200


@app.route("/delete-room", methods=["POST"])
def delete_room():
    room_id = request.json.get("room_id")
    user_id = request.json.get("user_id")

    if not room_id:
        return jsonify({"message": "Room ID is required"}), 400

    if not ObjectId.is_valid(room_id):
        return jsonify({"message": "Invalid Room ID"}), 400

    if not ObjectId.is_valid(user_id):
        return jsonify({"message": "Invalid User ID"}), 400

    room = rooms.find_one({"_id": ObjectId(room_id)})
    if not room:
        return jsonify({"message": "Room not found"}), 404

    room_users = room.get("users", [])
    user_role = None

    for user in room_users:
        if str(user.get("user_id")) == user_id:
            user_role = user.get("role")
            break

    if not user_role:
        return jsonify({"message": "User is not a member of this room"}), 403

    if user_role == "owner":
        rooms.delete_one({"_id": ObjectId(room_id)})
        users.update_many({}, {"$pull": {"rooms": ObjectId(room_id)}})

        if "messages" in globals():
            messages.delete_many({"room_id": room_id})

        return jsonify({"message": "Room deleted successfully"}), 200
    elif user_role == "member":
        rooms.update_one(
            {"_id": ObjectId(room_id)},
            {"$pull": {"users": {"user_id": ObjectId(user_id)}}},
        )
        users.update_one(
            {"_id": ObjectId(user_id)}, {"$pull": {"rooms": ObjectId(room_id)}}
        )
        return jsonify({"message": "Membership revoked successfully"}), 200
    else:
        return jsonify({"message": "Permission denied"}), 403


@app.route("/user/<userId>/rooms", methods=["GET"])
def get_user_rooms(userId):
    user = users.find_one({"_id": ObjectId(userId)})
    if user:
        user_rooms = user.get("rooms", [])
        user_rooms_data = rooms.find({"_id": {"$in": user_rooms}})
        user_rooms_info = [
            {"room_id": str(room["_id"]), "room_name": room["room_name"]}
            for room in user_rooms_data
        ]
        return jsonify({"rooms": user_rooms_info}), 200
    else:
        return jsonify({"message": "User not found"}), 404


@app.route("/messages/<room_id>")
def get_messages(room_id):
    messages = list(mongo.db.messages.find({"room_id": room_id}))
    conver_messages = json_util.dumps(messages)
    return conver_messages


@socketio.on("join")
def on_join(data):
    username = data.get("username")
    room_id = data.get("room_id")
    room_id_obj = ObjectId(room_id)

    room = rooms.find_one({"_id": room_id_obj})
    if room is not None:
        users_in_room = room.get("users", [])
        if username not in users_in_room:
            users_in_room.append(username)
            rooms.update_one({"_id": room_id_obj}, {"$set": {"users": users_in_room}})
            join_room(room_id)
            emit("user_joined", {"username": username}, room=room_id)
        else:
            emit("user_already_joined", {"username": username}, room=room_id)
    else:
        emit("room_not_found", {"room_id": room_id})


@socketio.on("leave")
def on_leave(data):
    username = data.get("username")
    room_id = data.get("room_id")

    room = rooms.find_one({"_id": ObjectId(room_id)})

    if room is not None:
        users_in_room = room.get("users", [])
        if username in users_in_room:
            users_in_room.remove(username)
            rooms.update_one(
                {"_id": ObjectId(room_id)}, {"$set": {"users": users_in_room}}
            )
            leave_room(room_id)
            emit("user_left", {"username": username}, room=room_id)
    else:
        emit("room_not_found", {"room_id": room_id})


@socketio.on("message")
def handle_message(message):
    username = message.get("username")
    room_id = message.get("room_id")
    message_text = message.get("message")

    mongo.db.messages.insert_one(
        {"username": username, "room_id": room_id, "message": message_text}
    )
    emit("message", {"username": username, "message": message_text}, room=room_id)


if __name__ == "__main__":
    socketio.run(app)
    # socketio.run(app, host="192.168.0.199", port=5000)
