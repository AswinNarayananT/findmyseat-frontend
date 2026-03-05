import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";
import { uploadToCloudinary } from "../../api/upload";

export const createEvent = createAsyncThunk(
  "event/createEvent",
  async (eventData, { rejectWithValue }) => {
    try {
      let imageData = null;

      if (eventData.imageFile) {
        imageData = await uploadToCloudinary(eventData.imageFile);
      }

      const payload = {
        title: eventData.title,
        description: eventData.description || null,
        entry_type: eventData.entry_type.toLowerCase(),
        category: eventData.category.toLowerCase(),
        estimated_duration_minutes: eventData.estimated_duration_minutes,
        base_price: eventData.base_price,
        image_url: imageData?.url || null,
      };

      const response = await api.post("/events/create", payload);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to create event"
      );
    }
  }
);