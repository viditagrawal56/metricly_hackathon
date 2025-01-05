import Button from "../Button/Button";
import Logo from "../Logo/Logo";
import "./Navbar.css";

const Navbar = () => {
  return (
    <div className="navbar">
      <Logo />
      <ul className="nav">
        <li className="nav-link">
          <a href="/">Features</a>
        </li>
        <li className="nav-link">
          <a href="/">Pricing</a>
        </li>
        <li className="nav-link">
          <a href="/">About Us</a>
        </li>
      </ul>
      <Button content="Try Now" sm />
    </div>
  );
};

export default Navbar;
