import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const adminLogin = createAsyncThunk(
  "adminAuth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post("/admin/login", { email, password });
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

export const fetchOrganizerApplications = createAsyncThunk(
  "adminAuth/fetchOrganizerApplications",
  async (status_filter = null, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/organizer-applications", {
        params: status_filter ? { status_filter } : {},
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail ||
          error.message ||
          "Failed to fetch organizer applications"
      );
    }
  }
);

export const fetchOrganizerApplicationDetail = createAsyncThunk(
  "adminAuth/fetchOrganizerApplicationDetail",
  async (application_id, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/admin/organizer-applications/${application_id}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail ||
          error.message ||
          "Failed to fetch application detail"
      );
    }
  }
);

export const updateOrganizerApplicationStatus = createAsyncThunk(
  "adminAuth/updateOrganizerStatus",
  async ({ id, status, rejection_reason }, { rejectWithValue }) => {
    try {
      const response = await api.patch(
        `/admin/organizer-applications/${id}`,
        {
          status,
          rejection_reason,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

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
