import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getCurrentUser } from "../store/auth/authThunks";
import Loader from "../components/Loader";

export default function ProtectedRoute() {
  const dispatch = useDispatch();
  const location = useLocation();

  const { user, loading } = useSelector((state) => state.auth);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!user) {
      dispatch(getCurrentUser())
        .unwrap()
        .catch(() => null)
        .finally(() => setChecked(true));
    } else {
      setChecked(true);
    }
  }, [dispatch, user]);

  if (!checked || loading) {
    return <Loader />;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}