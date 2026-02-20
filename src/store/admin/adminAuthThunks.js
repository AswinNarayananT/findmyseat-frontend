import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

// Admin Login
export const adminLogin = createAsyncThunk(
  "adminAuth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post("/admin/login", {
        email,
        password,
      });

      const { access_token } = response.data;

      localStorage.setItem("access_token", access_token);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "Admin login failed"
      );
    }
  }
);

// Admin Logout
export const adminLogout = createAsyncThunk(
  "adminAuth/logout",
  async (_, { rejectWithValue }) => {
    try {
      localStorage.removeItem("access_token");
      return true;
    } catch (error) {
      return rejectWithValue("Admin logout failed");
    }
  }
);
