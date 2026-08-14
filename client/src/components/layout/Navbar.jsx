import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaHeartbeat, FaBars, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-slate-900/80 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 text-white text-2xl font-bold"
        >
          <FaHeartbeat className="text-red-500 text-3xl animate-pulse" />
          Sankat Mochan
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-8 text-white font-medium">
          <li>
            <a href="#home" className="hover:text-blue-400 duration-300">
              Home
            </a>
          </li>

          <li>
            <a href="#features" className="hover:text-blue-400 duration-300">
              Features
            </a>
          </li>

          <li>
            <a href="#how" className="hover:text-blue-400 duration-300">
              How It Works
            </a>
          </li>

          <li>
            <a href="#contact" className="hover:text-blue-400 duration-300">
              Contact
            </a>
          </li>
        </ul>

        {/* Buttons */}
        <div className="hidden md:flex gap-4">
          <Link
            to="/login"
            className="px-5 py-2 rounded-lg border border-blue-500 text-white hover:bg-blue-600 duration-300"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white duration-300"
          >
            Register
          </Link>
        </div>

        {/* Mobile Button */}
        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-slate-900 text-white px-6 py-6 space-y-5"
        >
          <a href="#home" className="block">
            Home
          </a>

          <a href="#features" className="block">
            Features
          </a>

          <a href="#how" className="block">
            How It Works
          </a>

          <a href="#contact" className="block">
            Contact
          </a>

          <Link to="/login" className="block">
            Login
          </Link>

          <Link to="/register" className="block">
            Register
          </Link>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;