import { motion } from "framer-motion";
import Button from "../Button/Button";
import Logo from "../Logo/Logo";
import "./Navbar.css";
import { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <motion.div
      className="navbar"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 15,
        mass: 1,
        duration: 0.8,
      }}
    >
      <Logo />
      <button
        className={`hamburger ${isMenuOpen ? "active" : ""}`}
        onClick={toggleMenu}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      <ul className={`nav ${isMenuOpen ? "active" : ""}`}>
        <li className="nav-link">
          <a href="#features" onClick={() => setIsMenuOpen(false)}>
            Features
          </a>
        </li>
        <li className="nav-link">
          <a href="#pricing" onClick={() => setIsMenuOpen(false)}>
            Pricing
          </a>
        </li>
        <li className="nav-link">
          <a href="#team" onClick={() => setIsMenuOpen(false)}>
            About Us
          </a>
        </li>
      </ul>
      <Button content="Try Now  →" sm href="/chat" />
    </motion.div>
  );
};

export default Navbar;
