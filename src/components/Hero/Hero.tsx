import Button from "../Button/Button";
import "./Hero.css";
import { motion } from "framer-motion";
import HeroImg from "../../assets/hero.png";

const Hero = () => {
  return (
    <div className="hero">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hero-content"
      >
        <p className="pill">✨ Powered by Langflow and DataStax</p>
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.85, damping: 15 }}
            whileHover={{
              scale: 1.05,
              y: -3,
              transition: { duration: 0.2 },
            }}
          >
            <Button content="Try Now →" href="/graph" />
          </motion.div>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hero-img"
      >
        <img src={HeroImg} alt="hero" />
      </motion.div>
    </div>
  );
};

export default Hero;
