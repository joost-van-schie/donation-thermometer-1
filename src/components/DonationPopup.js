import React, { useEffect, useState } from 'react';

const DonationPopup = ({ donation }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (donation) {
      setVisible(true);
      setTimeout(() => {
        setVisible(false);
      }, 5000);
    }
  }, [donation]);

  return (
    <div
      className={`fixed top-8 right-8 bg-white border-l-8 border-success shadow-lg p-5 rounded-lg z-10 transform transition-transform duration-500 flex items-center max-w-md ${
        visible ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="bg-success text-white w-12 h-12 rounded-full flex items-center justify-center text-3xl mr-5 flex-shrink-0">
        €
      </div>
      <div className="flex-grow">
        <h4 className="font-bold m-0 mb-1 text-success text-xl">Nieuwe Donatie!</h4>
        <p className="m-0 text-lg">
          Er is zojuist €{donation?.amount} gedoneerd!
        </p>
      </div>
    </div>
  );
};

export default DonationPopup;
