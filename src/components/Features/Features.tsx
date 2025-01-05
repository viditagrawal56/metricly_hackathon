import Card from "../Card/Card";
import cardData from "./cardData";
import { motion } from "framer-motion";
import "./Features.css";

const Features = () => {
  const Cards = cardData.map((card) => (
    <Card
      key={card.id}
      icon={card.icon}
      title={card.title}
      content={card.content}
      img={card.img}
    />
  ));
  return (
    <div  className="features" id="features">
      <motion.div initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }} className="features-title">
        <h1>Features that work for your future.</h1>
        <p>
          Check out our amazing features and experience the power of Vaultflow
          for yourself.
        </p>
      </motion.div>
      <motion.div initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay:  0.1 }} className="features-card">{Cards}</motion.div>
    </div>
  );
};

export default Features;
