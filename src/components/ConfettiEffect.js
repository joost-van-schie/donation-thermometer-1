import React, { useEffect } from 'react';

const ConfettiEffect = () => {
  useEffect(() => {
    const createConfetti = (amount) => {
      const confettiContainer = document.getElementById('confetti-container');
      const pieceCount = Math.min(Math.max(amount, 30), 150);

      for (let i = 0; i < pieceCount; i++) {
        const confetti = document.createElement('div');
        const x = Math.random() * 1920;
        const y = -30;
        const size = Math.random() * 15 + 5;
        const colors = ['#e55b13', '#0069b4', '#28a745', '#ffc107', '#dc3545', '#6610f2', '#fd7e14', '#20c997'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.position = 'absolute';
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        confetti.style.backgroundColor = color;
        confetti.style.left = `${x}px`;
        confetti.style.top = `${y}px`;
        const shapes = ['square', 'circle'];
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        if (shape === 'circle') {
          confetti.style.borderRadius = '50%';
        }
        confettiContainer.appendChild(confetti);
        const animationDuration = Math.random() * 3 + 2;
        const fallDistance = 1200;
        const sidewaysMove = Math.random() * 200 - 100;
        confetti.animate([
          { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
          { transform: `translate(${sidewaysMove}px, ${fallDistance}px) rotate(360deg)`, opacity: 0 }
        ], {
          duration: animationDuration * 1000,
          easing: 'cubic-bezier(0.15, 0.85, 0.45, 1)'
        });
        setTimeout(() => {
          confetti.remove();
        }, animationDuration * 1000);
      }
    };

    const handleDonation = (event) => {
      const amount = event.detail.amount;
      createConfetti(amount);
    };

    window.addEventListener('donation', handleDonation);

    return () => {
      window.removeEventListener('donation', handleDonation);
    };
  }, []);

  return <div id="confetti-container" className="confetti-container"></div>;
};

export default ConfettiEffect;
