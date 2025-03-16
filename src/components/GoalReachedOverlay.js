import React from 'react';

const GoalReachedOverlay = ({ goalReached, goalAmount }) => {
  if (!goalReached) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/70 flex flex-col items-center justify-center z-50 opacity-100 pointer-events-auto transition-opacity duration-500">
      <div className="goal-reached-message text-6xl text-white text-center mb-10 shadow-lg">
        DOEL BEREIKT! €<span>{goalAmount.toLocaleString('nl-NL')}</span>
      </div>
      <button className="bg-gradient-to-b from-primary to-primary/80 text-white border-none py-4 px-8 rounded-full cursor-pointer text-xl font-bold transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1">
        Geweldig! 🎉
      </button>
    </div>
  );
};

export default GoalReachedOverlay;
