import { createSlice } from "@reduxjs/toolkit";
import {
  adminLogin,
  adminLogout,
  fetchOrganizerApplications,
  fetchOrganizerApplicationDetail,
  updateOrganizerApplicationStatus,
} from "./adminAuthThunks";

const initialState = {
  // ─── Auth State ─────────────────────────
  admin: null,
  isAuthenticated: false,
  authLoading: false,
  authError: null,

  // ─── Organizer Applications State ───────
  applications: [],
  applicationDetail: null,
  listLoading: false,
  detailLoading: false,
  organizerError: null,
};

const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // ADMIN LOGIN
      .addCase(adminLogin.pending, (state) => {
        state.authLoading = true;
        state.authError = null;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.authLoading = false;
        state.admin = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.authLoading = false;
        state.authError = action.payload;
      })

      // FETCH APPLICATION LIST
      .addCase(fetchOrganizerApplications.pending, (state) => {
        state.listLoading = true;
        state.organizerError = null;
      })
      .addCase(fetchOrganizerApplications.fulfilled, (state, action) => {
        state.listLoading = false;
        state.applications = action.payload;
      })
      .addCase(fetchOrganizerApplications.rejected, (state, action) => {
        state.listLoading = false;
        state.organizerError = action.payload;
      })

      // FETCH APPLICATION DETAIL
      .addCase(fetchOrganizerApplicationDetail.pending, (state) => {
        state.detailLoading = true;
        state.organizerError = null;
      })
      .addCase(fetchOrganizerApplicationDetail.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.applicationDetail = action.payload;
      })
      .addCase(fetchOrganizerApplicationDetail.rejected, (state, action) => {
        state.detailLoading = false;
        state.organizerError = action.payload;
      })

      // UPDATE ORGANIZER APPLICATION STATUS
      .addCase(updateOrganizerApplicationStatus.pending, (state) => {
        state.detailLoading = true;
        state.organizerError = null;
      })
      .addCase(updateOrganizerApplicationStatus.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.applicationDetail = action.payload;
      })
      .addCase(updateOrganizerApplicationStatus.rejected, (state, action) => {
        state.detailLoading = false;
        state.organizerError = action.payload;
      })
      
      // ADMIN LOGOUT
      .addCase(adminLogout.fulfilled, (state) => {
        state.admin = null;
        state.isAuthenticated = false;
      });
  },
});

export default adminAuthSlice.reducer;
