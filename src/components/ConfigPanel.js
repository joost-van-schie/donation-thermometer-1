import React, { useState } from 'react';
import styles from './ConfigPanel.module.css';

const ConfigPanel = ({
  initialApiConfig,
  initialGoalAmount,
  initialRefreshInterval,
  initialDonationField,
  onSaveConfig,
  onTestConnection,
  onAddDonation,
  onReset,
  onFetchDonations,
  apiStatus
}) => {
  const [showContent, setShowContent] = useState(false);
  const [apiConfig, setApiConfig] = useState(initialApiConfig);
  const [goalAmount, setGoalAmount] = useState(initialGoalAmount);
  const [refreshInterval, setRefreshInterval] = useState(initialRefreshInterval);
  const [donationField, setDonationField] = useState(initialDonationField);
  const [testDonationAmount, setTestDonationAmount] = useState(25);

  const handleToggle = () => {
    setShowContent(prev => !prev);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setApiConfig(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSaveConfig({
      apiConfig,
      goalAmount,
      refreshInterval,
      donationField
    });
  };

  const handleAddTestDonation = () => {
    onAddDonation(testDonationAmount);
  };

  return (
    <div className="fixed bottom-5 right-5 z-10 config-panel">
      {/* Toggle Button */}
      <button
        className={`bg-primary text-white border-none rounded-full w-16 h-16 text-2xl cursor-pointer shadow-lg transition-all duration-300 hover:bg-primary/80 config-toggle ${showContent ? 'rotate-45' : 'hover:rotate-45'}`}
        onClick={handleToggle}
        aria-label="Toggle Configuration Panel"
        aria-expanded={showContent}
      >
        ⚙️
      </button>

      {/* Configuration Content */}
      <div
        className={`absolute bottom-[70px] right-0 w-[500px] bg-white rounded-lg p-5 shadow-card transition-all duration-300 ${showContent ? `opacity-100 visible scale-100 ${styles.configContentShow}` : 'opacity-0 invisible scale-95'}`}
        aria-hidden={!showContent}
      >
        {/* API Configuration Section */}
        <div className="bg-background border border-secondary rounded-lg p-6 mb-5 text-left shadow-sm">
          <h3 className="text-2xl text-primary mt-0 mb-5 text-center font-semibold">Gravity Forms API Configuratie</h3>
          <div className="mb-4">
            <label htmlFor="base-url" className="block mb-1 font-bold">WP API Basis URL:</label>
            <input
              type="text" id="base-url" name="baseUrl"
              className="w-full p-2 border border-gray-300 rounded text-base"
              placeholder="bijv. https://uw-website.nl/wp-json/gf/v2"
              value={apiConfig.baseUrl}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="form-id" className="block mb-1 font-bold">Formulier ID:</label>
            <input
              type="number" id="form-id" name="formId"
              className="w-full p-2 border border-gray-300 rounded text-base"
              placeholder="bijv. 7"
              value={apiConfig.formId}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="api-username" className="block mb-1 font-bold">API Gebruikersnaam:</label>
            <input
              type="text" id="api-username" name="username"
              className="w-full p-2 border border-gray-300 rounded text-base"
              placeholder="Gebruikersnaam"
              value={apiConfig.username}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="api-key" className="block mb-1 font-bold">API Sleutel:</label>
            <input
              type="password" id="api-key" name="apiKey"
              className="w-full p-2 border border-gray-300 rounded text-base"
              placeholder="API Sleutel"
              value={apiConfig.apiKey}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="goal-amount-input" className="block mb-1 font-bold">Doelbedrag:</label>
            <input
              type="number" id="goal-amount-input" name="goalAmount"
              className="w-full p-2 border border-gray-300 rounded text-base"
              placeholder="bijv. 4000"
              value={goalAmount}
              onChange={(e) => setGoalAmount(parseInt(e.target.value, 10) || 0)}
              min="0"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="refresh-interval" className="block mb-1 font-bold">Verversingsinterval (sec):</label>
            <input
              type="number" id="refresh-interval" name="refreshInterval"
              className="w-full p-2 border border-gray-300 rounded text-base"
              placeholder="bijv. 60"
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(parseInt(e.target.value, 10) || 10)}
              min="10"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="donation-field" className="block mb-1 font-bold">Donatiebedrag veldnummer:</label>
            <input
              type="text" id="donation-field" name="donationField"
              className="w-full p-2 border border-gray-300 rounded text-base"
              placeholder="bijv. 3"
              value={donationField}
              onChange={(e) => setDonationField(e.target.value)}
            />
          </div>
          <div className="flex justify-between mt-5">
            <button onClick={handleSave} className="bg-gradient-to-b from-primary to-primary/80 text-white border-none py-3 px-6 rounded-full cursor-pointer text-base font-bold transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1">Opslaan</button>
            <button onClick={() => onTestConnection(apiConfig)} className="bg-gradient-to-b from-primary to-primary/80 text-white border-none py-3 px-6 rounded-full cursor-pointer text-base font-bold transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1">Test Verbinding</button>
          </div>
          {/* API Status Message */}
          {apiStatus && apiStatus.message && (
            <div className={`p-2 rounded mt-2 text-center font-bold
              ${apiStatus.status === 'connected' ? 'bg-green-100 text-green-800' : ''}
              ${apiStatus.status === 'error' ? 'bg-red-100 text-red-800' : ''}
              ${apiStatus.status === 'loading' ? 'bg-yellow-100 text-yellow-800' : ''}
            `}>
              {apiStatus.message}
            </div>
          )}
        </div>

        {/* Test Controls Section */}
        <div className="bg-background border border-secondary rounded-xl p-6 text-center shadow-sm">
          <h3 className="text-2xl text-primary mt-0 mb-2 font-semibold">Test Controls</h3>
          <p className="mb-4 text-text">Gebruik deze knoppen om de thermometer te testen</p>
          <div className="flex flex-wrap justify-center gap-2">
            {/* Buttons and controls... with updated styles */}
             <input
              type="number"
              className="p-4 border border-secondary rounded-full text-xl w-32 text-center shadow-inner bg-white text-text" // Updated styles
              value={testDonationAmount}
              onChange={(e) => setTestDonationAmount(parseInt(e.target.value, 10) || 0)}
              min="1"
              max="10000"
            />
            <button onClick={handleAddTestDonation} className="bg-primary text-white border-none py-3 px-6 rounded-full cursor-pointer text-base font-bold transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1 hover:bg-primary/90">Voeg Test Donatie Toe</button> {/* Updated styles */}
            <button onClick={onReset} className="bg-secondary text-white border-none py-3 px-6 rounded-full cursor-pointer text-base font-bold transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1 hover:bg-secondary/90">Reset</button> {/* Updated styles */}
            <button onClick={onFetchDonations} className="bg-secondary text-white border-none py-3 px-6 rounded-full cursor-pointer text-base font-bold transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1 hover:bg-secondary/90">Haal Donaties Op</button> {/* Updated styles */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigPanel;