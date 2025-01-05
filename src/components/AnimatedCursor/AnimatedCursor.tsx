import { useState, useEffect } from 'react';
import './AnimatedCursor.css';

const AnimatedCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const onMouseMove = (e :any) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const onMouseOver = (e : any) => {
      const target = e.target;
      const isClickable = 
        target.onclick || 
        target.tagName.toLowerCase() === 'button' ||
        target.tagName.toLowerCase() === 'a' ||
        target.closest('button') ||
        target.closest('a') ||
        getComputedStyle(target).cursor === 'pointer';
      
      setIsPointer(isClickable);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseover', onMouseOver);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
    };
  }, []);

  return (
    <div 
      className={`cursor-dot ${isPointer ? 'pointer' : ''}`}
      style={{
        left: `${position.x - 0.4}px`,
        top: `${position.y - 0.4}px`,
      }}
    >
      <div className="cursor-dot-inner" />
    </div>
  );
};

export default AnimatedCursor;