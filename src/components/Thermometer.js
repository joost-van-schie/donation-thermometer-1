import React from 'react';

const Thermometer = ({ currentAmount, goalAmount }) => {
  // Calculate percentage, handling edge cases
  const percentage = goalAmount > 0 
    ? Math.max(0, Math.min((currentAmount / goalAmount) * 100, 100)) 
    : 0;

  return (
    <div 
      className="flex flex-row items-start justify-center" 
      aria-label={`Progress: €${currentAmount.toLocaleString('nl-NL')} out of €${goalAmount.toLocaleString('nl-NL')}`}
    >
      {/* Thermometer Container */}
      <div className="thermometer-container flex flex-col items-center">
        <div className="thermometer-tube relative bg-white shadow-lg w-16 h-[500px]">
          <div 
            className="thermometer-fill absolute bottom-0 w-full bg-red-500" 
            style={{ height: `${percentage}%` }}
          ></div>
        </div>
        <div className="thermometer-bulb relative w-24 h-24 bg-red-500 rounded-full mt-[-20px]"></div>
      </div>

      {/* Labels Container */}
      <div className="labels-container ml-4 h-[500px] flex flex-col justify-between py-2">
        <div className="flex items-center">
          <div className="w-5 h-0.5 bg-gray-600 mr-2"></div>
          <div className="text-xl font-bold">€{goalAmount.toLocaleString('nl-NL')}</div>
        </div>
        <div className="flex items-center">
          <div className="w-5 h-0.5 bg-gray-600 mr-2"></div>
          <div className="text-xl font-bold">€{Math.round(goalAmount * 0.75).toLocaleString('nl-NL')}</div>
        </div>
        <div className="flex items-center">
          <div className="w-5 h-0.5 bg-gray-600 mr-2"></div>
          <div className="text-xl font-bold">€{Math.round(goalAmount * 0.5).toLocaleString('nl-NL')}</div>
        </div>
        <div className="flex items-center">
          <div className="w-5 h-0.5 bg-gray-600 mr-2"></div>
          <div className="text-xl font-bold">€{Math.round(goalAmount * 0.25).toLocaleString('nl-NL')}</div>
        </div>
        <div className="flex items-center">
          <div className="w-5 h-0.5 bg-gray-600 mr-2"></div>
          <div className="text-xl font-bold">€0</div>
        </div>
      </div>
    </div>
  );
};

export default Thermometer;