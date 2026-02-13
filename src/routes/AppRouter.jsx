import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import LoginRegister from "../pages/Auth/LoginRegister";
import Auth from "../pages/Auth/Auth";
import VerifyOtp from "../pages/Auth/VerifyOtp";
import Profile from "../pages/Auth/profile";


function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
