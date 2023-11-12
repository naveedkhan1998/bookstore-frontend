// Navbar.js
import React, { useState } from "react";
import { Link } from "react-router-dom"; // If you are using React Router

const Navbar = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-xl font-bold">
          Your Logo
        </Link>

        <div className="lg:hidden">
          <button onClick={toggleNav} className="text-white focus:outline-none">
            &#9776; {/* Hamburger Icon */}
          </button>
        </div>

        <div
          className={`${
            isNavOpen
              ? "fixed top-0 left-0 h-screen w-3/4 bg-gray-800 z-50"
              : "hidden"
          } lg:flex lg:items-center lg:w-auto`}
        >
          <ul className="lg:flex space-x-4">
            <li>
              <Link to="/" className="text-white">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-white">
                About
              </Link>
            </li>
            {/* Add more links as needed */}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
