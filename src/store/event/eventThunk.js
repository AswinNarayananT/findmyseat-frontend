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


export const createEventShow = createAsyncThunk(
  "event/createEventShow",
  async (data, { rejectWithValue }) => {
    try {

      const payload = {
        event_id: data.event_id,
        venue: {
          name: data.venue.name,
          formatted_address: data.venue.formatted_address,
          latitude: Number(data.venue.latitude),
          longitude: Number(data.venue.longitude),
        },
        capacity: Number(data.capacity),
        start_times: data.start_times.map((t) => new Date(t).toISOString())
      }

      const response = await api.post("/events/create-show", payload)

      return response.data

    } catch (error) {

      return rejectWithValue(
        error.response?.data?.detail || error.message || "Failed to create show"
      )

    }
  }
)

export const getMyEvents = createAsyncThunk(
  "event/getMyEvents",
  async (_, { rejectWithValue }) => {
    try {

      const response = await api.get("/events/my-events");

      return response.data;

    } catch (error) {

      return rejectWithValue(
        error.response?.data?.detail || "Failed to fetch events"
      );

    }
  }
);

export const fetchEvent = createAsyncThunk(
  "event/fetchEvent",
  async (eventId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/events/${eventId}`)
      return res.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || "Failed to fetch event")
    }
  }
)

export const fetchFullEventDetails = createAsyncThunk(
  "event/fetchFullEventDetails",
  async (eventId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/events/${eventId}`);
      return res.data; 
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to fetch full event details"
      );
    }
  }
);


export const createSeatLayout = createAsyncThunk(
  "event/createSeatLayout",
  async (payload, { rejectWithValue }) => {
    try {
      console.log("Payload being sent:", payload);
      const res = await api.post("/seat-layout/bulk-create", payload);

      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to sync seat layout to selected shows"
      );
    }
  }
);

export const fetchActiveEvents = createAsyncThunk(
  "event/fetchActiveEvents",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/public/events/");
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to load events"
      );
    }
  }
);

export const fetchPublicEventDetails = createAsyncThunk(
  "event/fetchPublicEventDetails",
  async (eventId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/public/events/${eventId}`);
      console.log(res)
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "Could not load event details"
      );
    }
  }
);


export const fetchShowLayout = createAsyncThunk(
  "event/fetchShowLayout",
  async (showId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/public/events/show/${showId}/layout`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || "Error loading layout");
    }
  }
);

export const confirmAndLockSeats = createAsyncThunk(
  "event/confirmAndLockSeats",
  async (payload, { rejectWithValue }) => {
    try {

      const res = await api.post("/public/events/booking/confirm-booking", payload);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to lock seats"
      );
    }
  }
);

export const verifyBookingPayment = createAsyncThunk(
  "event/verifyBookingPayment",
  async (paymentData, { rejectWithValue }) => {
    try {

      const res = await api.post("/public/events/booking/verify-payment", paymentData);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "Payment verification failed"
      );
    }
  }
);

export const checkActiveUserLock = createAsyncThunk(
  "event/checkActiveUserLock",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/public/events/booking/my-active-lock");
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "Error checking active locks"
      );
    }
  }
);

export const fetchUserBookings = createAsyncThunk(
  "event/fetchUserBookings",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/public/events/booking/my-bookings");
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to fetch booking history"
      );
    }
  }
);

export const submitEventReview = createAsyncThunk(
  "event/submitReview",
  async ({ eventId, rating, comment }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/events/${eventId}/reviews`, {
        rating,
        comment,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || 
        error.message || 
        "Failed to submit review"
      );
    }
  }
);


export const cancelEventShow = createAsyncThunk(
  "event/cancelShow",
  async ({ showId, reason }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/organizers/show/${showId}/cancel`, { reason });
      return { showId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || "Failed to cancel show");
    }
  }
);

export const cancelFullEvent = createAsyncThunk(
  "event/cancelEvent",
  async ({ eventId, reason }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/organizers/event/${eventId}/cancel`, { reason });
      return { eventId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || "Failed to cancel event");
    }
  }
);