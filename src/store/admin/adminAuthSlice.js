import { createSlice } from "@reduxjs/toolkit";
import {
  adminLogin,
  adminLogout,
  fetchOrganizerApplications,
  fetchOrganizerApplicationDetail,
  updateOrganizerApplicationStatus,
  getAdminMe,
} from "./adminAuthThunks";

const initialState = {
  admin: null,
  isAuthenticated: false,
  authLoading: false,
  authError: null,

  applications: [],
  applicationDetail: null,
  listLoading: false,
  detailLoading: false,
  organizerError: null,
};

const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {
    clearApplicationDetail: (state) => {
      state.applicationDetail = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAdminMe.pending, (state) => {
        state.authLoading = true;
      })
      .addCase(getAdminMe.fulfilled, (state, action) => {
        state.authLoading = false;
        state.admin = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getAdminMe.rejected, (state) => {
        state.authLoading = false;
        state.admin = null;
        state.isAuthenticated = false;
        localStorage.removeItem("access_token");
      })

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

      .addCase(updateOrganizerApplicationStatus.pending, (state) => {
        state.detailLoading = true;
        state.organizerError = null;
      })
      .addCase(updateOrganizerApplicationStatus.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.applicationDetail = action.payload;
        const index = state.applications.findIndex(app => app.id === action.payload.id);
        if (index !== -1) {
          state.applications[index] = action.payload;
        }
      })
      .addCase(updateOrganizerApplicationStatus.rejected, (state, action) => {
        state.detailLoading = false;
        state.organizerError = action.payload;
      })

      .addCase(adminLogout.pending, (state) => {
        state.authLoading = true;
      })
      .addCase(adminLogout.fulfilled, (state) => {
        state.admin = null;
        state.isAuthenticated = false;
        state.authLoading = false;
        state.authError = null;
      })
      .addCase(adminLogout.rejected, (state, action) => {
        state.admin = null;
        state.isAuthenticated = false;
        state.authLoading = false;
        state.authError = action.payload;
      });
  },
});

export const { clearApplicationDetail } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;