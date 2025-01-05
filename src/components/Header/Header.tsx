import Hero from "../Hero/Hero";
import Navbar from "../Navbar/Navbar";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <Navbar />
      <Hero />
    </header>
  );
};

export default Header;
