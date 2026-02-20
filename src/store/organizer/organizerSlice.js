import { createSlice } from "@reduxjs/toolkit";
import {
  submitOrganizerApplication,
  fetchOrganizerApplication,
} from "./organizerThunk";


const initialState = {
  application: null,
  loading: false,
  error: null,
  success: false,
};


const organizerSlice = createSlice({
  name: "organizer",
  initialState,
  reducers: {
    clearOrganizerState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder

      // -------------------------
      // SUBMIT APPLICATION
      // -------------------------
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
      })

      // -------------------------
      // FETCH APPLICATION
      // -------------------------
      .addCase(fetchOrganizerApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrganizerApplication.fulfilled, (state, action) => {
        state.loading = false;
        state.application = action.payload;
      })
      .addCase(fetchOrganizerApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrganizerState } = organizerSlice.actions;

export default organizerSlice.reducer;
