import "./Logo.css";
import LogoImg from "../../assets/logo.svg";

function Logo() {
  return (
    <a className="logo" href="/">
      <img loading="eager" src={LogoImg} alt="" />
      <h1>Metricly</h1>
    </a>
  );
}

export default Logo;
