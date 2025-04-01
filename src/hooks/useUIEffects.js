import { useState, useEffect, useRef, useCallback } from 'react';

export function useUIEffects() {
  const confettiContainerRef = useRef(null);
  const pageContainerRef = useRef(null);

  // --- Update Scale on Resize ---
  const updateScale = useCallback(() => {
    if (!pageContainerRef.current) return;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    // Define base dimensions for scaling
    const baseWidth = 1920;
    const baseHeight = 1080;
    const scaleX = windowWidth / baseWidth;
    const scaleY = windowHeight / baseHeight;
    const scale = Math.min(scaleX, scaleY);
    pageContainerRef.current.style.transformOrigin = 'top left'; // Ensure scaling origin is consistent
    pageContainerRef.current.style.transform = `scale(${scale})`;
  }, []); // No dependencies needed

  useEffect(() => {
    updateScale(); // Initial scale
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale); // Cleanup
  }, [updateScale]);

  // --- Confetti Function ---
  const createConfetti = useCallback((amount) => {
    if (!confettiContainerRef.current) return;

    const pieceCount = Math.min(Math.max(amount, 30), 150); // Clamp confetti amount
    const container = confettiContainerRef.current;
    const containerWidth = container.offsetWidth || 1920; // Use container width or fallback
    const containerHeight = container.offsetHeight || 1080; // Use container height or fallback

    for (let i = 0; i < pieceCount; i++) {
      const confetti = document.createElement('div');
      const x = Math.random() * containerWidth;
      const y = -30; // Start above the container
      const size = Math.random() * 15 + 5;
      const colors = ['#e55b13', '#0069b4', '#28a745', '#ffc107', '#dc3545', '#6610f2', '#fd7e14', '#20c997'];
      const color = colors[Math.floor(Math.random() * colors.length)];

      confetti.style.position = 'absolute';
      confetti.style.width = `${size}px`;
      confetti.style.height = `${size}px`;
      confetti.style.backgroundColor = color;
      confetti.style.left = `${x}px`;
      confetti.style.top = `${y}px`;
      confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0'; // Random square/circle
      confetti.style.zIndex = 100; // Ensure confetti is above most elements

      container.appendChild(confetti);

      const animationDuration = Math.random() * 3 + 2; // seconds
      const fallDistance = containerHeight + 50; // Ensure it falls past the bottom
      const sidewaysMove = Math.random() * 200 - 100; // Horizontal drift

      confetti.animate([
        { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
        { transform: `translate(${sidewaysMove}px, ${fallDistance}px) rotate(${Math.random() * 720 - 360}deg)`, opacity: 0 }
      ], {
        duration: animationDuration * 1000,
        easing: 'cubic-bezier(0.15, 0.85, 0.45, 1)' // Smoother fall easing
      });

      // Remove confetti element after animation finishes
      setTimeout(() => {
        if (container.contains(confetti)) {
            container.removeChild(confetti);
        }
      }, animationDuration * 1000);
    }
  }, []); // No dependencies needed

  // --- Celebrate Goal Reached ---
  // Returns a function that needs setShowGoalReachedOverlay to be called
  const celebrateGoalReached = useCallback((setShowGoalReachedOverlay) => {
    setShowGoalReachedOverlay(true);
    createConfetti(500); // Massive confetti burst
    // Schedule subsequent smaller bursts
    setTimeout(() => createConfetti(300), 2000);
    setTimeout(() => createConfetti(300), 4000);
  }, [createConfetti]); // Depends on createConfetti

  return {
    confettiContainerRef,
    pageContainerRef,
    createConfetti,
    celebrateGoalReached, // Expose the celebration trigger function
  };
}