import React, { useState, useEffect, useRef, useCallback } from 'react';

// Import Components
import Header from './components/Header';
import QRCodeSection from './components/QRCodeSection';
import ThermometerDisplay from './components/ThermometerDisplay';
import DonationList from './components/DonationList';
import ConfigPanel from './components/ConfigPanel';
import { useConfig } from './hooks/useConfig';
import { useDonationApi } from './hooks/useDonationApi';
import { useUIEffects } from './hooks/useUIEffects';

function App() {
  const [currentAmount, setCurrentAmount] = useState(0);
  const {
    apiConfig,
    goalAmount,
    refreshInterval,
    donationField,
    updateConfig, // Function to update config state
  } = useConfig();

  const [donations, setDonations] = useState([]);
  const [goalReached, setGoalReached] = useState(false);

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [showGoalReachedOverlay, setShowGoalReachedOverlay] = useState(false);


 const {
   confettiContainerRef,
   pageContainerRef,
   createConfetti,
   celebrateGoalReached: triggerCelebration,
 } = useUIEffects();

 const celebrateGoalReached = useCallback(() => {
   triggerCelebration(setShowGoalReachedOverlay);
 }, [triggerCelebration, setShowGoalReachedOverlay]);

  const addDonation = useCallback((amount, date = null, time = null) => {
    const now = new Date();
    const newDonation = {
      amount: amount,
      date: date || now.toLocaleDateString('nl-NL'),
      time: time || now.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })
    };

    setDonations(prevDonations => {
      const updatedDonations = [newDonation, ...prevDonations];
      return updatedDonations.slice(0, 8);
    });

    const previousAmount = currentAmount;
    const newTotal = previousAmount + amount;
    setCurrentAmount(newTotal);

    setPopupMessage(`Er is zojuist €${amount.toLocaleString('nl-NL')} gedoneerd!`);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 5000);

    if (amount >= 10) {
      createConfetti(amount);
    }

    if (!goalReached && previousAmount < goalAmount && newTotal >= goalAmount) {
      setGoalReached(true);
      celebrateGoalReached();
    }
  }, [currentAmount, goalAmount, goalReached, celebrateGoalReached, createConfetti, setCurrentAmount, setDonations, setGoalReached, setShowPopup, setPopupMessage]);

const handleInitialApiLoad = useCallback((initialAmount, initialDonations) => {
  setCurrentAmount(initialAmount);
  setDonations(initialDonations);
  if (initialAmount >= goalAmount && !goalReached) {
    setGoalReached(true);
    console.log("Goal reached on initial load.");
  }
}, [goalAmount, goalReached, setCurrentAmount, setDonations, setGoalReached]);

const {
  apiStatus,
  fetchDonations,
  handleTestConnection,
  resetApiState,
} = useDonationApi({
  apiConfig,
  donationField,
  addDonation,
  goalAmount,
  goalReached,
  refreshInterval,
 onInitialLoad: handleInitialApiLoad,
});

  const handleReset = useCallback(() => {
      setCurrentAmount(0);
     setDonations([]);
     setGoalReached(false);
     resetApiState();
     console.log("Thermometer reset.");
 }, [resetApiState, setCurrentAmount, setDonations, setGoalReached]);

  const handleCloseOverlay = () => {
    setShowGoalReachedOverlay(false);
  };


  const handleSaveConfig = useCallback((newConfig) => {
   updateConfig(newConfig);
   console.log('Configuratie opgeslagen.');
 }, [updateConfig]);


 return (
    <div className="bg-background text-text m-0 p-0 overflow-hidden w-[1920px] h-[1080px]">
     <div ref={pageContainerRef} className="page-container origin-top-left">
       <div ref={confettiContainerRef} className="confetti-container absolute top-0 left-0 w-full h-full pointer-events-none z-50"></div>

        <div
          id="goal-reached-overlay"
          className={`fixed top-0 left-0 w-full h-full bg-primary/80 flex flex-col items-center justify-center z-50 transition-opacity duration-500 ${showGoalReachedOverlay ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
          <div className="goal-reached-message text-6xl text-white text-center mb-10 shadow-lg font-bold">
            DOEL BEREIKT! €<span id="goal-reached-amount">{goalAmount.toLocaleString('nl-NL')}</span>
          </div>
          <button
            id="close-overlay"
            onClick={handleCloseOverlay}
            className="bg-white text-primary border-none py-4 px-8 rounded-full cursor-pointer text-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            Geweldig! 🎉
          </button>
        </div>

        <div
          id="donation-popup"
          className={`fixed top-8 right-8 bg-white border-l-8 border-primary shadow-card p-5 rounded-lg z-10 transform transition-transform duration-500 flex items-center max-w-md ${showPopup ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center text-3xl mr-5 flex-shrink-0">€</div>
          <div className="flex-grow">
            <h4 className="font-bold m-0 mb-1 text-primary text-xl">Nieuwe Donatie!</h4>
            <p className="m-0 text-lg" id="popup-message">{popupMessage}</p>
          </div>
        </div>

        <Header />

        <main className="max-w-7xl mx-auto p-5 flex flex-col h-[calc(100vh-128px-84px)]">
          <div className="flex flex-grow mt-8 gap-6">
            <div className="flex-1 flex flex-col bg-white rounded-xl p-8 shadow-lg border-t-4 border-[#4a2683]">
              <QRCodeSection qrCodeUrl="https://www.kerkemst.nl/wp-content/uploads/2025/04/qr-actieavond-1.png" />
            </div>

            <div className="flex-grow flex-2 flex flex-col items-center bg-white rounded-xl p-8 shadow-lg">
              <ThermometerDisplay currentAmount={currentAmount} goalAmount={goalAmount} />
            </div>

            <div className="flex-1 flex flex-col bg-white rounded-xl p-8 shadow-lg border-t-4 border-[#f49b28]">
              <DonationList donations={donations} />
            </div>
          </div>
        </main>

        <ConfigPanel
          initialApiConfig={apiConfig}
          initialGoalAmount={goalAmount}
          initialRefreshInterval={refreshInterval}
          initialDonationField={donationField}
          onSaveConfig={handleSaveConfig}
         onTestConnection={handleTestConnection}
         onAddDonation={addDonation}
         onReset={handleReset}
         onFetchDonations={fetchDonations}
         apiStatus={apiStatus}
        />
      </div>
    </div>
  );
}

export default App;