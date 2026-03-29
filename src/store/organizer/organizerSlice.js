import { createSlice } from "@reduxjs/toolkit";
import {
  submitOrganizerApplication,
  fetchMyOrganizerApplication,
} from "./organizerThunk";

const initialState = {
  application: null,
  loading: false,
  detailLoading: false,
  error: null,
  success: false,
};

const organizerSlice = createSlice({
  name: "organizer",
  initialState,
  reducers: {
    clearOrganizerState: (state) => {
      state.loading = false;
      state.detailLoading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyOrganizerApplication.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(fetchMyOrganizerApplication.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.application = action.payload;
      })
      .addCase(fetchMyOrganizerApplication.rejected, (state, action) => {
        state.detailLoading = false;
        if (action.payload !== "No application found for this user.") {
          state.error = action.payload;
        }
      })
      .addCase(submitOrganizerApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(submitOrganizerApplication.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.application = action.payload;
      })
      .addCase(submitOrganizerApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrganizerState } = organizerSlice.actions;

export default organizerSlice.reducer;