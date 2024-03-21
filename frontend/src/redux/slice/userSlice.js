import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    isLoggedIn: false,
    registering: false,
    error: null,
    userData: {},
    isCreateRoom: false,
    successMessage: null,
    listRooms: []
}

export const register = createAsyncThunk(
    'user/register',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post('http://localhost:5000/register', userData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const login = createAsyncThunk(
    'user/login',
    async ({ username, password }, { rejectWithValue, dispatch }) => {
        try {
            const response = await axios.post('http://localhost:5000/login', { username, password });
            dispatch(getUserRooms());
            return response;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const getUserRooms = createAsyncThunk(
    'user/getUserRooms',
    async (_, { rejectWithValue, getState }) => {
        try {
            const { userData } = getState().user;
            if (!userData || !userData.user_id) {
                throw new Error("User is not logged in");
            }
            const response = await axios.get(`http://localhost:5000/user/${userData.user_id}/rooms`);
            return response.data.rooms;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);


export const createRoomChat = createAsyncThunk(
    'user/create-room',
    async ({ room_name, user_id }, { rejectWithValue }) => {
        try {
            const response = await axios.post('http://localhost:5000/create-room', { room_name, user_id });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const deleteRoom = createAsyncThunk(
    'user/delete-room',
    async (room_id, { rejectWithValue, dispatch }) => {
        try {
            const response = await axios.post('http://localhost:5000/delete-room', { room_id });
            dispatch(getUserRooms());
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const loadUserDataFromLocalStorage = createAction('user/loadUserDataFromLocalStorage')

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginUser: (state) => {
            state.isLoggedIn = true;
        },
        logoutUser: (state) => {
            state.isLoggedIn = false;
            state.userData = {};

            localStorage.removeItem("userData");
            localStorage.removeItem("isLoggedIn");
        },
        showErrorMessage: (state, action) => {
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.registering = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state) => {
                state.registering = false;
                state.error = null;
                state.successMessage = "User account is registered successfully,";
            })
            .addCase(register.rejected, (state, action) => {
                state.registering = false;
                state.error = action.payload.message;
            })
            .addCase(login.pending, (state) => {
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.userData = action.payload.data;
                state.isLoggedIn = true;
                state.error = null;

                localStorage.setItem("userData", JSON.stringify(action.payload.data));
                localStorage.setItem("isLoggedIn", true);
            })
            .addCase(loadUserDataFromLocalStorage, (state, action) => {
                const userData = JSON.parse(localStorage.getItem("userData"));
                const isLoggedIn = localStorage.getItem("isLoggedIn");
                if (userData && isLoggedIn) {
                    state.userData = userData;
                    state.isLoggedIn = isLoggedIn;
                }
            })
            .addCase(login.rejected, (state, action) => {
                state.error = action.payload.message;
            })
            .addCase(createRoomChat.fulfilled, (state, action) => {
                state.isCreateRoom = false;
                const { room_id, room_name } = action.payload;
                state.userData.rooms = [...state.userData.rooms, { room_id, room_name }]
                state.error = null;
                state.successMessage = action.payload.message;
            })
            .addCase(createRoomChat.rejected, (state, action) => {
                state.isCreateRoom = false;
                state.error = action.payload.message;
            })
            .addCase(getUserRooms.pending, (state) => {
                state.error = null;
            })
            .addCase(getUserRooms.fulfilled, (state, action) => {
                state.listRooms = action.payload;
            })
            .addCase(getUserRooms.rejected, (state, action) => {
                state.error = action.payload.message;
            })
    },
});

export const { loginUser, logoutUser, showErrorMessage, clearError } = userSlice.actions;
export const selectUser = (state) => state.user;
export default userSlice.reducer;
