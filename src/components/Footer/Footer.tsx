import { motion } from "framer-motion";
import "./Footer.css";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";
import Logo from "../Logo/Logo";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
      <motion.div 
          className="footer-section"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="footer-brand">
            <Logo />
            <p>Empowering your digital journey with intelligent analytics and insights.</p>
            <div className="social-links">
              <a href="https://github.com"><FaGithub /></a>
              <a href="https://twitter.com"><FaTwitter /></a>
              <a href="https://linkedin.com"><FaLinkedin /></a>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="footer-section"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#features">Features</a></li>
            <li><a href="#pricing">Pricing</a></li>
            <li><a href="#team">About</a></li>
          </ul>
        </motion.div>

        <motion.div 
          className="footer-section"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <h4>Contact</h4>
          <ul>
            <li>Email: metricly1@gmail.com</li>
            <li>Support: support@metricly.com</li>
          </ul>
        </motion.div>
      </div>
      
      <motion.div 
        className="footer-bottom"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6 }}
      >
        <p>&copy; 2025 Metricly. All rights reserved.</p>
      </motion.div>
    </footer>
  );
};

export default Footer;