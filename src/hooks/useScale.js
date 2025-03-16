import { useState, useEffect } from 'react';

const useScale = () => {
  const [scale, setScale] = useState(1);

  const updateScale = () => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const scaleX = windowWidth / 1920;
    const scaleY = windowHeight / 1080;
    const newScale = Math.min(scaleX, scaleY);
    setScale(newScale);
  };

  useEffect(() => {
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => {
      window.removeEventListener('resize', updateScale);
    };
  }, []);

  return { scale, updateScale };
};

export { useScale };
