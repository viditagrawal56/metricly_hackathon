import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import "./Graphs.css";

const texts: string[] = [
  "Gain insights into your social media performance",
  "Track your engagement across multiple platforms",
  "Optimize your content strategy with data-driven decisions",
  "Understand your audience better through analytics",
];

export const AnimatedText: React.FC = () => {
  const [index, setIndex] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, 4000); // Change text every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="animated-text"
        >
          {texts[index]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
};
