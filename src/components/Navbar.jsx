import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { logout } from "../store/auth/authSlice";
import FindMySeatIcon from "../assets/findmyseat.svg";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleAddEvent = () => {
    if (!user) return;

    if (user.role === "user") {
      navigate("/organizer-application");
    } else {
      navigate("/create-event");
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#282e39] bg-background-dark/80 backdrop-blur-md">
      <div className="flex items-center justify-between px-6 md:px-10 py-4 max-w-[1440px] mx-auto">
        
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-3 text-white">
          <div className="size-8">
            <img
              src={FindMySeatIcon}
              alt="FindMySeat Logo"
              className="w-full h-full"
            />
          </div>
          <h2 className="text-xl font-black tracking-tighter uppercase">
            FindMySeat
          </h2>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex gap-8 items-center">
          <Link
            to="/events"
            className="text-sm font-medium text-[#9ca6ba] hover:text-white transition-colors cursor-pointer"
          >
            Events
          </Link>

          <Link
            to="/venues"
            className="text-sm font-medium text-[#9ca6ba] hover:text-white transition-colors cursor-pointer"
          >
            Venues
          </Link>

          <Link
            to="/about"
            className="text-sm font-medium text-[#9ca6ba] hover:text-white transition-colors cursor-pointer"
          >
            About
          </Link>

          {isAuthenticated && (
            <button
              onClick={handleAddEvent}
              className="text-sm font-semibold text-primary hover:text-white transition-colors duration-200 cursor-pointer"
            >
              Add Event
            </button>
          )}
        </nav>

        {/* Auth Section */}
        <div className="flex items-center gap-4">
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-bold text-white bg-primary rounded-lg hover:bg-primary/90 transition-all cursor-pointer"
              >
                Sign In
              </Link>

              <Link
                to="/login"
                className="hidden sm:block px-4 py-2 text-sm font-semibold text-white bg-[#1E1E1E] border border-[#282e39] rounded-lg hover:bg-[#282e39] transition-all cursor-pointer"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              {/* User Profile */}
              <Link
                to="/profile"
                className="flex items-center gap-2 bg-[#1E1E1E] border border-[#282e39] rounded-lg px-3 py-2 hover:bg-[#282e39] transition-all cursor-pointer"
              >
                <div className="size-8 rounded-full bg-primary flex items-center justify-center text-white font-black text-sm">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>

                <span className="hidden sm:block text-sm font-semibold text-white">
                  {user?.name}
                </span>
              </Link>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-semibold text-white bg-[#1E1E1E] border border-[#282e39] rounded-lg hover:bg-red-600 hover:border-red-600 transition-all duration-200 cursor-pointer"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
