import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";


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

export const fetchOrganizerApplication = createAsyncThunk(
  "organizer/fetchApplication",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(
        "/organizers/my-application",
        {
          withCredentials: true,
        }
      );

      return response.data;

    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Failed to fetch organizer application"
      );
    }
  }
);
