import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";



export const fetchMyOrganizerApplication = createAsyncThunk(
  "organizer/fetchMyOrganizerApplication",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/organizers/my-application");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || 
        "Failed to fetch your application status"
      );
    }
  }
);

export const submitOrganizerApplication = createAsyncThunk(
  "organizer/submitApplication",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/organizers/apply",
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
        "Failed to submit organizer application"
      );
    }
  }
);

export const verifyTicketQR = createAsyncThunk(
  "organizer/verifyTicketQR",
  async ({ showId, bookingId }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/organizers/booking/verify-checkin/${showId}/${bookingId}`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.detail || "Verification failed";
      return rejectWithValue(message);
    }
  }
);
