function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border-dark bg-background-dark/50 backdrop-blur-md">
      <div className="flex items-center justify-between px-10 py-4">
        <div className="flex items-center gap-4 text-white">
          <div className="size-6">
            <svg viewBox="0 0 48 48" fill="none">
              <path
                d="M8.57829 8.57829L24 24L39.4217 8.57829C42.4718 11.6284 44.549 15.5145 45.3905 19.7452C46.2321 23.9758 45.8002 28.361 44.1494 32.3462C42.4987 36.3314 39.7033 39.7375 36.1168 42.134C32.5302 44.5305 28.3135 45.8096 24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19984 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.57829Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold tracking-tight">FindMySeat</h2>
        </div>

        <nav className="hidden md:flex gap-9">
          <a className="text-gray-400 hover:text-white text-sm">Events</a>
          <a className="text-gray-400 hover:text-white text-sm">Venues</a>
          <a className="text-gray-400 hover:text-white text-sm">About</a>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
