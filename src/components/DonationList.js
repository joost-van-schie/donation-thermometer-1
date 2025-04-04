import React from 'react';
import styles from './DonationList.module.css';

const DonationList = ({ donations, latestDonationId }) => ( // Added latestDonationId prop
  // Removed outer divs, styling is now handled in App.js
  <>
    <h2 className="text-3xl text-[#4a2683] pb-4 mt-0 mb-5 text-center font-semibold">Recente Donaties</h2> {/* Updated text color */}
    <ul className="list-none p-0 m-0"> {/* Removed max-h and overflow-y-auto */}
      {donations.length === 0 ? (
        <li className="py-6 px-5 text-center text-text italic"> {/* Uses new text color */}
          Nog geen donaties ontvangen
        </li>
      ) : (
        [...donations].reverse().map((donation) => ( // Reverse the array to show newest first, removed index
          <li
            key={donation.id} // Use donation.id as key
            className={`py-4 px-5 border-b border-background flex justify-between items-center ${styles.donationItem} group hover:bg-background/30 transition-colors rounded-lg my-1 ${donation.id === latestDonationId ? styles.newItemAnimation : ''}`} // Add animation class conditionally
          > {/* Uses new background color and CSS module */}
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