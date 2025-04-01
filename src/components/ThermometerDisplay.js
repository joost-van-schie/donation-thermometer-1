import React from 'react';
import styles from './ThermometerDisplay.module.css';

const ThermometerDisplay = ({ currentAmount, goalAmount }) => {
  // Calculate percentage, ensuring it doesn't exceed 100%
  const percentage = goalAmount > 0 ? Math.min((currentAmount / goalAmount) * 100, 100) : 0;
  const goalReached = currentAmount >= goalAmount;

  // Format numbers for display
  const formattedCurrentAmount = currentAmount.toLocaleString('nl-NL');
  const formattedGoalAmount = goalAmount.toLocaleString('nl-NL');
  const marker3Amount = Math.round(goalAmount * 0.75).toLocaleString('nl-NL');
  const marker2Amount = Math.round(goalAmount * 0.5).toLocaleString('nl-NL');
  const marker1Amount = Math.round(goalAmount * 0.25).toLocaleString('nl-NL');

  return (
    // Removed outer div, styling is now handled in App.js
    <>
      {/* Total Amount Display */}
      <div
        className={`text-6xl font-bold mb-2 text-center transition-transform duration-500 ease-in-out ${goalReached ? 'text-[#4a2683] scale-110' : 'text-[#4a2683] scale-100'} ${goalReached ? styles.goalReachedMessage : ''}`} // Use new primary color and apply pulse animation
      >
        €<span>{formattedCurrentAmount}</span>
      </div>
      <div className="text-2xl mb-8 text-center text-text"> {/* Uses new text color from tailwind config */}
        Ons doel: €<span>{formattedGoalAmount}</span>
      </div>

      {/* Thermometer Visual */}
      <div className="relative w-64 h-[600px] mx-auto flex justify-center">
        {/* Thermometer uses styles from index.css */}
        <div className={styles.thermometer}>
          <div
            className={styles.thermometerFill} // Use CSS module style
            style={{ height: `${percentage}%` }}
          ></div>
        </div>
        {/* Bulb uses styles from index.css */}
        <div className={styles.thermometerBulb}>
          {/* Removed thermometer-shine div */}
        </div>

        {/* Markers with improved visualization */}
        <div className="absolute top-0 right-[-65px] h-[500px] flex flex-col justify-between py-2">
          {/* Top Marker (Goal) */}
          <div className="flex items-center">
            <div className="w-12 h-1.5 bg-[#4a2683] mr-2 rounded-full"></div> {/* Updated style */}
            <div className="text-xl font-bold text-[#4a2683]">€{formattedGoalAmount}</div> {/* Updated color */}
          </div>
          {/* 75% Marker */}
          <div className="flex items-center">
            <div className="w-8 h-1 bg-[#7440c4] mr-2 rounded-full"></div> {/* Updated style & color */}
            <div className="text-lg font-medium text-text">€{marker3Amount}</div> {/* Updated style & color */}
          </div>
          {/* 50% Marker */}
           <div className="flex items-center">
            <div className="w-8 h-1 bg-[#7440c4] mr-2 rounded-full"></div> {/* Updated style & color */}
            <div className="text-lg font-medium text-text">€{marker2Amount}</div> {/* Updated style & color */}
          </div>
          {/* 25% Marker */}
           <div className="flex items-center">
            <div className="w-8 h-1 bg-[#7440c4] mr-2 rounded-full"></div> {/* Updated style & color */}
            <div className="text-lg font-medium text-text">€{marker1Amount}</div> {/* Updated style & color */}
          </div>
          {/* 0% Marker - Reduced Emphasis */}
          <div className="flex items-center">
            <div className="w-8 h-1 bg-[#cccccc] mr-2 rounded-full"></div> {/* Updated style & color */}
            <div className="text-base text-gray-400">€0</div> {/* Updated style & color */}
          </div>
        </div>
      </div>
    </> // Closing the React Fragment
  );
};

export default ThermometerDisplay;