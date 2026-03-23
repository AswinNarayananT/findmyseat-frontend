import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getCurrentUser } from "../store/auth/authThunks";
import Loader from "../components/Loader";

export default function PublicRoute() {
  const dispatch = useDispatch();
  const location = useLocation();

  const { user, loading } = useSelector((state) => state.auth);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!user && localStorage.getItem("access_token")) {
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

  if (user) {
    const from = location.state?.from?.pathname || "/";
    return <Navigate to={from} replace />;
  }

  return <Outlet />;
}