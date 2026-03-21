import { createSlice } from "@reduxjs/toolkit";
import {
  createEvent,
  createEventShow,
  getMyEvents,
  fetchEvent,
  createSeatLayout,
  fetchFullEventDetails,
  fetchActiveEvents,
  fetchPublicEventDetails,
  fetchShowLayout,
  confirmAndLockSeats,
  verifyBookingPayment,
  checkActiveUserLock
} from "./eventThunk";

const initialState = {
  events: [],
  event: null,
  eventShows: [],
  layout: null,
  seats: [],
  selectedSeats: [],
  lockedSeats: [],
  activeLock: null,
  loading: false,
  error: null,
};

const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    clearSelectedSeats: (state) => {
      state.selectedSeats = [];
    },
    clearEventError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events.push(action.payload);
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createEventShow.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEventShow.fulfilled, (state, action) => {
        state.loading = false;
        state.eventShows.push(action.payload);
      })
      .addCase(createEventShow.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchEvent.fulfilled, (state, action) => {
        state.event = action.payload;
      })

      .addCase(getMyEvents.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMyEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(getMyEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchFullEventDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFullEventDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.event = action.payload;
        state.eventShows = action.payload.shows || [];
      })
      .addCase(fetchFullEventDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createSeatLayout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSeatLayout.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createSeatLayout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchActiveEvents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchActiveEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(fetchActiveEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchPublicEventDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublicEventDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.event = action.payload;
        state.eventShows = action.payload.shows || [];
        state.layout = null;
        state.seats = [];
      })

      .addCase(fetchShowLayout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShowLayout.fulfilled, (state, action) => {
        state.loading = false;
        state.layout = action.payload.current_show.seat_layout;
        state.seats = action.payload.current_show.seat_layout?.seats || [];
        state.eventShows = action.payload.other_shows || [];
      })
      .addCase(fetchShowLayout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(confirmAndLockSeats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(confirmAndLockSeats.fulfilled, (state, action) => {
        state.loading = false;
        state.activeLock = action.payload;
      })
      .addCase(confirmAndLockSeats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(checkActiveUserLock.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkActiveUserLock.fulfilled, (state, action) => {
        state.loading = false;
        state.activeLock = action.payload;
      })
      .addCase(checkActiveUserLock.rejected, (state, action) => {
        state.loading = false;
        state.activeLock = { has_active_lock: false };
      })

      .addCase(verifyBookingPayment.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyBookingPayment.fulfilled, (state) => {
        state.loading = false;
        state.activeLock = null;
        state.selectedSeats = [];
      })
      .addCase(verifyBookingPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSelectedSeats, clearEventError } = eventSlice.actions;
export default eventSlice.reducer;