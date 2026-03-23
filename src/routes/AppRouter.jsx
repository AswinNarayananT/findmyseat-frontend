import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "../pages/Home";
import Auth from "../pages/Auth/Auth";
import VerifyOtp from "../pages/Auth/VerifyOtp";
// import Profile from "../pages/Auth/profile";
import AdminLogin from "../pages/Admin/AdminLogin";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import OrganizerApplication from "../pages/organizer/OrganizerApplication";
import ApplicationSuccess from "../pages/organizer/Applicationsuccess";
import AdminBase from "../pages/Admin/Adminbase";
import OrganizerApplications from "../pages/Admin/OrganizerApplications";
import OrganizerApplicationDetail from "../pages/Admin/OrganizerApplicationDetail";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import ResetPassword from "../pages/Auth/ResetPassword";
import CreateEvent from "../pages/event/CreateEvent";
import CreateEventShow from "../pages/event/CreateEventShow";
import MyEvents from "../pages/event/MyEvents";
import SeatLayoutBuilder from "../pages/event/SeatLayoutBuilder";
import EventDetailPage from "../pages/event/EventDetailPage";
import EventDiscoveryPage from "../pages/user/EventDiscoveryPage";
import BookingPage from "../pages/user/BookingPage";
import SeatSelectionPage from "../pages/user/SeatSelectionPage";
import PaymentPage from "../pages/event/PaymentPage";
import BookingHistoryPage from "../pages/profile/BookingHistoryPage";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import AdminRoute from "./AdminRoute";
import Profile from "../pages/profile/profile";
import VerifyTicketsPage from "../pages/organizer/VerifyTicketsPage";

function AppRouter() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1f2937",
            color: "#fff",
          },
        }}
      />
      <Routes>
        {/* --- Public Access Routes --- */}
        <Route path="/" element={<Home />} />
        <Route path="/public-events" element={<EventDiscoveryPage />} />
        <Route path="/event/:eventId" element={<EventDetailPage />} />

        {/* --- Guest Only Routes (Login/Signup/etc) --- */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Auth />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/admin/login" element={<AdminLogin />} />
        </Route>

        {/* --- User/Organizer Protected Routes --- */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/bookings" element={<BookingHistoryPage />} />
          <Route path="/booking/event/:eventId" element={<BookingPage />} />
          <Route path="/booking/seats/:showId" element={<SeatSelectionPage />} />
          <Route path="/booking/checkout/:showId" element={<PaymentPage />} />

          {/* Organizer Specific */}
          <Route path="/organizer-application" element={<OrganizerApplication />} />
          <Route path="/application-success" element={<ApplicationSuccess />} />
          <Route path="/my-events" element={<MyEvents />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/create-event-show/:eventId" element={<CreateEventShow />} />
          <Route path="/event-layout/:eventId" element={<SeatLayoutBuilder />} />
          <Route path="/organizer/verify-tickets/:showId" element={<VerifyTicketsPage />} />
        </Route>

        {/* --- Admin Protected Routes --- */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminBase />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="organizer-applications" element={<OrganizerApplications />} />
            <Route path="organizer-applications/:id" element={<OrganizerApplicationDetail />} />
          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;