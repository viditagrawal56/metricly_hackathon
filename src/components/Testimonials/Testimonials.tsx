import { motion } from "framer-motion";
import { testimonials } from "./testimonials-data";
import { FaQuoteLeft } from "react-icons/fa";

import "./Testimonials.css";

const Testimonials = () => {
  return (
    <section className="testimonials-section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="testimonials-header"
        >
          <h2 className="testimonials-title">What Our Users Say</h2>
          <p className="testimonials-subtitle">
            Discover how Metricly has transformed businesses
          </p>
        </motion.div>

        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="testimonial-card"
            >
              <div className="quote-icon">
                <FaQuoteLeft />
              </div>
              <div className="testimonial-header">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="testimonial-avatar"
                />
                <div className="testimonial-info">
                  <h3 className="testimonial-name">{testimonial.name}</h3>
                  <p className="testimonial-position">{testimonial.position}</p>
                </div>
              </div>
              <p className="testimonial-quote">{testimonial.quote}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
