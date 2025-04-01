import React from 'react';

const DonationList = ({ donations }) => (
  <div className="flex-1 flex flex-col ml-12">
    <div className="bg-white rounded-xl p-8 shadow-card flex-grow border-t-4 border-secondary">
      <h2 className="text-3xl text-primary pb-4 mt-0 mb-5 text-center font-semibold">Recente Donaties</h2>
      <ul className="list-none p-0 m-0 max-h-[500px] overflow-y-auto">
        {donations.length === 0 ? (
          <li className="py-6 px-5 text-center text-text italic">
            Nog geen donaties ontvangen
          </li>
        ) : (
          donations.map((donation, index) => (
            <li key={index} className="py-4 px-5 border-b border-background flex justify-between items-center donation-item group hover:bg-background/30 transition-colors rounded-lg my-1">
              {/* Donation Info (Date/Time) */}
              <div>
                <div className="text-text text-sm">{`${donation.date} ${donation.time}`}</div>
              </div>
              {/* Donation Amount */}
              <div className="font-bold text-primary text-2xl group-hover:scale-105 transition-transform">
                €{donation.amount.toLocaleString('nl-NL')}
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  </div>
);

export default DonationList;