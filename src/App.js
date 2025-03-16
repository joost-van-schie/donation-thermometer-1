import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import QRCode from './components/QRCode';
import Thermometer from './components/Thermometer';
import DonationList from './components/DonationList';
import DonationPopup from './components/DonationPopup';
import GoalReachedOverlay from './components/GoalReachedOverlay';
import ConfettiEffect from './components/ConfettiEffect';
import ConfigPanel from './components/ConfigPanel';
import { useDonations } from './hooks/useDonations';
import { useAPI } from './hooks/useAPI';
import { useScale } from './hooks/useScale';

const App = () => {
  const { donations, addDonation, resetDonations, goalReached, currentAmount, goalAmount } = useDonations();
  const { fetchDonations, testApiConnection, apiStatus } = useAPI();
  const { scale, updateScale } = useScale();

  return (
    <div className="page-container" style={{ transform: `scale(${scale})` }}>
      <ConfettiEffect />
      <GoalReachedOverlay goalReached={goalReached} goalAmount={goalAmount} />
      <DonationPopup />
      <Header />
      <div className="main-content">
        <QRCode />
        <Thermometer currentAmount={currentAmount} goalAmount={goalAmount} />
        <DonationList donations={donations} />
      </div>
      <Footer />
      <ConfigPanel
        addDonation={addDonation}
        resetDonations={resetDonations}
        fetchDonations={fetchDonations}
        testApiConnection={testApiConnection}
        apiStatus={apiStatus}
      />
    </div>
  );
};

export default App;
