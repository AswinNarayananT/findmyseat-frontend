import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Auth from "../pages/Auth/Auth";
import VerifyOtp from "../pages/Auth/VerifyOtp";
import Profile from "../pages/Auth/Profile";
import AdminLogin from "../pages/Admin/AdminLogin";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import OrganizerApplication from "../pages/organizer/OrganizerApplication";
import ApplicationSuccess from "../pages/organizer/Applicationsuccess";
import AdminBase from "../pages/Admin/Adminbase";
import OrganizerApplications from "../pages/Admin/OrganizerApplications";
import OrganizerApplicationDetail from "../pages/Admin/OrganizerApplicationDetail";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* User Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/profile" element={<Profile />} />


        {/* Organizer Routes */}
        <Route path="/organizer-application" element={<OrganizerApplication />} />
        <Route path="/application-success" element={<ApplicationSuccess />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminBase />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="organizer-applications" element={<OrganizerApplications />} />
        </Route>
        <Route  path="/admin/organizer-applications/:id"element={<OrganizerApplicationDetail />} />


      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
