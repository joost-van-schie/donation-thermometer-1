import React from 'react';

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
    <div className="flex-grow flex-2 flex flex-col items-center">
      {/* Total Amount Display */}
      <div
        className={`text-6xl font-bold mb-2 text-center transition-transform duration-500 ease-in-out ${goalReached ? 'text-primary scale-110' : 'text-primary scale-100'}`}
      >
        €<span>{formattedCurrentAmount}</span>
      </div>
      <div className="text-2xl mb-8 text-center text-text">
        Ons doel: €<span>{formattedGoalAmount}</span>
      </div>

      {/* Thermometer Visual */}
      <div className="relative w-64 h-[600px] mx-auto flex items-end justify-center">
        <div className="thermometer bg-white shadow-soft rounded-t-full">
          <div
            className="thermometer-fill bg-primary rounded-t-full"
            style={{ height: `${percentage}%` }}
          ></div>
        </div>
        <div className="thermometer-bulb bg-primary border-4 border-white">
          <div className="thermometer-shine"></div>
        </div>

        {/* Markers */}
        <div className="absolute top-0 right-[-140px] h-[500px] flex flex-col justify-between py-2">
          {/* Top Marker (Goal) */}
          <div className="flex items-center">
            <div className="w-12 h-0.5 bg-primary mr-2"></div>
            <div className="text-xl font-bold text-text">€{formattedGoalAmount}</div>
          </div>
          {/* 75% Marker */}
          <div className="flex items-center">
            <div className="w-8 h-0.5 bg-secondary mr-2"></div>
            <div className="text-xl font-bold text-text">€{marker3Amount}</div>
          </div>
          {/* 50% Marker */}
          <div className="flex items-center">
            <div className="w-8 h-0.5 bg-secondary mr-2"></div>
            <div className="text-xl font-bold text-text">€{marker2Amount}</div>
          </div>
          {/* 25% Marker */}
          <div className="flex items-center">
            <div className="w-8 h-0.5 bg-secondary mr-2"></div>
            <div className="text-xl font-bold text-text">€{marker1Amount}</div>
          </div>
          {/* 0% Marker */}
          <div className="flex items-center">
            <div className="w-8 h-0.5 bg-secondary mr-2"></div>
            <div className="text-xl font-bold text-text">€0</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThermometerDisplay;