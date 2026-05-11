import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";


export const getAdminMe = createAsyncThunk(
  "adminAuth/getAdminMe",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/me");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || "Admin session expired");
    }
  }
);

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
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/organizer-applications", {
        params: {
          status_filter: params.status_filter || undefined,
          search: params.search || undefined,
          skip: params.skip || 0,
          limit: params.limit || 10,
        },
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
      await api.post("/admin/logout"); 
      localStorage.removeItem("access_token");
      return true;
    } catch (error) {
      localStorage.removeItem("access_token");
      return rejectWithValue(error.response?.data?.detail || "Logout failed");
    }
  }
);


export const fetchAdminFinanceDashboard = createAsyncThunk(
  "adminFinance/fetchDashboard",
  async ({ page = 1, limit = 10, organizerId, month, year }, { rejectWithValue }) => {
    try {

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (organizerId) params.append("organizer_id", organizerId);
      if (month) params.append("month", month.toString());
      if (year) params.append("year", year.toString());

      const response = await api.get(`/admin/finance/global-summary?${params.toString()}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || 
        error.message || 
        "Failed to fetch admin finance data"
      );
    }
  }
);