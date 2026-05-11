import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const fetchMyWallet = createAsyncThunk(
  "finance/fetchMyWallet",
  async ({ page = 1, size = 10 } = {}, { rejectWithValue }) => {
    try {
      const response = await api.get(`/auth/wallet/me?page=${page}&size=${size}`);
      return { 
        data: response.data, 
        page 
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || 
        error.message || 
        "Failed to load wallet details"
      );
    }
  }
);


export const fetchOrganizerRevenue = createAsyncThunk(
  "finance/fetchOrganizerRevenue",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/organizers/revenue-summary");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || "Failed to load revenue");
    }
  }
);

export const claimRevenue = createAsyncThunk(
  "finance/claimRevenue",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post("/finance/organizer/claim-revenue");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || "Claim request failed");
    }
  }
);