import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const registerUser = createAsyncThunk(
  "auth/register",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/auth/register",
        data,
        {
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || 
        error.response?.data?.message ||
        "Registration failed"
      );
    }
  }
);


export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);

export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async ({ phone_number, otp }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/verify-otp", {
        phone_number,
        otp,
      });
      console.log(response.data)
      return response.data; 
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "OTP verification failed"
      );
    }
  }
);

export const resendOtp = createAsyncThunk(
  "auth/resendOtp",
  async ({ phone_number }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/resend-otp", {
        phone_number,
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to resend OTP"
      );
    }
  }
);


export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async ({ current_password, new_password }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/change-password", {
        current_password,
        new_password,
      });

      console.log(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to change password"
      );
    }
  }
);


