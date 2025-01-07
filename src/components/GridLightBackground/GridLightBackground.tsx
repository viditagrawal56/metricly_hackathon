import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import "./GridLightEffect.css";

const GridLightBackground: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [lines, setLines] = useState<{ id: number; left: number }[]>([]);

  useEffect(() => {
    if (svgRef.current) {
      const svg = svgRef.current;
      const width = svg.clientWidth;
      const height = svg.clientHeight;

      // Create grid lines
      for (let i = 0; i <= width; i += 30) {
        createLine(svg, i, 0, i, height, "grid-line");
      }
      for (let i = 0; i <= height; i += 30) {
        createLine(svg, 0, i, width, i, "grid-line");
      }

      // Create dynamic light lines
      const lineCount = 10;
      const newLines = Array.from({ length: lineCount }, (_, i) => ({
        id: i,
        left: Math.floor(Math.random() * (width / 30)) * 30,
      }));
      setLines(newLines);
    }
  }, []);

  const createLine = (
    svg: SVGSVGElement,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    className: string
  ) => {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1.toString());
    line.setAttribute("y1", y1.toString());
    line.setAttribute("x2", x2.toString());
    line.setAttribute("y2", y2.toString());
    line.setAttribute("class", className);
    svg.appendChild(line);
  };

  return (
    <div className="grid-light-effect">
      <svg ref={svgRef} width="100%" height="100%">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
      {lines.map((line) => (
        <div
          key={line.id}
          className="light-line"
          style={{ left: `${line.left}px` }}
        >
          <LightEffect />
        </div>
      ))}
    </div>
  );
};

const LightEffect: React.FC = () => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const startAnimation = () => {
      setIsAnimating(true);
      const duration = Math.random() * 3000 + 2000; // Random duration between 2-5 seconds
      setTimeout(() => {
        setIsAnimating(false);
        scheduleNextAnimation();
      }, duration);
    };

    const scheduleNextAnimation = () => {
      const delay = Math.random() * 5000 + 3000; // Random delay between 1-6 seconds
      setTimeout(startAnimation, delay);
    };

    scheduleNextAnimation();
  }, []);

  if (!isAnimating) return null;

  return (
    <motion.div
      className="light"
      initial={{ top: "-15%" }}
      animate={{ top: "115%" }}
      transition={{
        duration: Math.random() * 4 + 2, // Random duration between 2-5 seconds
        ease: "easeInOut",
      }}
    />
  );
};

export default GridLightBackground;
