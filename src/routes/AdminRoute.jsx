import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getAdminMe } from "../store/admin/adminAuthThunks";
import Loader from "../components/Loader";

export default function AdminRoute() {
  const dispatch = useDispatch();
  const location = useLocation();

  const { admin, authLoading } = useSelector((state) => state.adminAuth);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!admin && localStorage.getItem("access_token")) {
      dispatch(getAdminMe())
        .unwrap()
        .catch(() => null)
        .finally(() => setChecked(true));
    } else {
      setChecked(true);
    }
  }, [dispatch, admin]);

  if (!checked || authLoading) {
    return <Loader />;
  }

  if (!admin || admin.role !== "admin") {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}