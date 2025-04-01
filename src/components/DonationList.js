import React from 'react';
import styles from './DonationList.module.css';

const DonationList = ({ donations }) => (
  // Removed outer divs, styling is now handled in App.js
  <>
    <h2 className="text-3xl text-[#4a2683] pb-4 mt-0 mb-5 text-center font-semibold">Recente Donaties</h2> {/* Updated text color */}
    <ul className="list-none p-0 m-0 max-h-[500px] overflow-y-auto"> {/* Adjusted max-h if needed */}
      {donations.length === 0 ? (
        <li className="py-6 px-5 text-center text-text italic"> {/* Uses new text color */}
          Nog geen donaties ontvangen
        </li>
      ) : (
        donations.map((donation, index) => (
          <li key={index} className={`py-4 px-5 border-b border-background flex justify-between items-center ${styles.donationItem} group hover:bg-background/30 transition-colors rounded-lg my-1`}> {/* Uses new background color and CSS module */}
            {/* Donation Info (Date/Time) */}
            <div>
              <div className="text-text text-sm">{`${donation.date} ${donation.time}`}</div> {/* Uses new text color */}
            </div>
            {/* Donation Amount */}
            <div className="font-bold text-[#4a2683] text-2xl group-hover:scale-105 transition-transform"> {/* Updated text color */}
              €{donation.amount.toLocaleString('nl-NL')}
            </div>
          </li>
        ))
      )}
    </ul>
  </>
);

export default DonationList;