import React, { useEffect, useRef } from 'react';

const Thermometer = ({ currentAmount, goalAmount }) => {
  const fillRef = useRef(null);

  useEffect(() => {
    const percentage = Math.min((currentAmount / goalAmount) * 100, 100);
    fillRef.current.style.height = `${percentage}%`;
  }, [currentAmount, goalAmount]);

  return (
    <div className="relative w-64 h-[600px] mx-auto flex items-end justify-center">
      <div className="thermometer bg-white shadow-lg">
        <div className="thermometer-fill" ref={fillRef}></div>
      </div>
      <div className="thermometer-bulb">
        <div className="thermometer-shine"></div>
      </div>
      <div className="absolute top-0 right-[-140px] h-[500px] flex flex-col justify-between py-2">
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
