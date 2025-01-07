import { motion } from "framer-motion";
import Button from "../Button/Button";
import Logo from "../Logo/Logo";
import "./Navbar.css";

interface NavbarProps {
  content: string;
  href: string;
  bool: boolean;
}

const Navbar = ({ content, href, bool }: NavbarProps) => {
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
      {bool && (
        <ul className="nav">
          <li className="nav-link">
            <a href="#features">Features</a>
          </li>
          <li className="nav-link">
            <a href="#pricing">Pricing</a>
          </li>
          <li className="nav-link">
            <a href="#team">About Us</a>
          </li>
        </ul>
      )}

      <Button content={content} sm href={href} />
    </motion.div>
  );
};

export default Navbar;
