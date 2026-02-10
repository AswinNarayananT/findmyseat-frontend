function Footer() {
  return (
    <footer className="border-t border-border-dark py-6 flex flex-col md:flex-row justify-center items-center gap-6">
      <p className="text-gray-600 text-xs">
        © 2024 EVENT Inc. All rights reserved.
      </p>
      <div className="flex gap-4">
        <a className="text-gray-600 hover:text-white text-xs">Privacy</a>
        <a className="text-gray-600 hover:text-white text-xs">Terms</a>
        <a className="text-gray-600 hover:text-white text-xs">Contact</a>
      </div>
    </footer>
  );
}

export default Footer;
