import Hero from "../Hero/Hero";
import Navbar from "../Navbar/Navbar";
import headerBg from "../../assets/header.jpg";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="header-image-container">
        <img
          src={headerBg}
          alt="Header background"
          className="header-image"
          loading="eager"
        />
      </div>
      <Navbar content={"Chat with AI → "} href={"/chat"} bool={true} />
      <Hero />
    </header>
  );
};

export default Header;
