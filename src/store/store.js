import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import adminAuthReducer from "./admin/adminAuthSlice";
import organizerReducer from "./organizer/organizerSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    adminAuth: adminAuthReducer,
    organizer: organizerReducer,
    
  },
});
