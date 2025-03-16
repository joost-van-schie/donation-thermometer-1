import React from 'react';

const DonationList = ({ donations }) => {
  return (
    <div className="bg-white rounded-xl p-8 shadow-lg flex-grow">
      <h2 className="text-3xl text-primary border-b-2 border-secondary pb-4 mt-0 mb-5 text-center">Recente Donaties</h2>
      <ul className="list-none p-0 m-0 max-h-[500px] overflow-y-auto">
        {donations.length === 0 ? (
          <li className="py-4 px-5 border-b border-gray-200 flex justify-between items-center">Nog geen donaties ontvangen</li>
        ) : (
          donations.map((donation, index) => (
            <li key={index} className="py-4 px-5 border-b border-gray-200 flex justify-between items-center donation-item">
              <div>
                <div className="text-gray-500 text-sm">{`${donation.date} ${donation.time}`}</div>
              </div>
              <div className="font-bold text-secondary text-2xl">{`€${donation.amount.toLocaleString('nl-NL')}`}</div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default DonationList;
