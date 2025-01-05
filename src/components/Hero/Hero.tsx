import Button from "../Button/Button";
import "./Hero.css";
import HeroImg from "../../assets/hero.png";

const Hero = () => {
  return (
    <div className="hero">
      <div className="hero-content">
        <p className="pill">Powered by Langflow and DataStax.</p>
        <h1>
          Modern Analytics
          <br />
          Supercharged by AI
        </h1>
        <p className="paragraph">
          Transform social media data into actionable insights using
          cutting-edge technology
        </p>
        <div className="btns">
          <Button content="Try Now" />
        </div>
      </div>
      <div className="hero-img">
        <img src={HeroImg} alt="hero" />
      </div>
    </div>
  );
};

export default Hero;
