import React, { useState, useEffect } from 'react';

const ConfigPanel = ({ addDonation, resetDonations, fetchDonations, testApiConnection, apiStatus }) => {
  const [baseUrl, setBaseUrl] = useState('');
  const [formId, setFormId] = useState('7');
  const [username, setUsername] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [goalAmount, setGoalAmount] = useState(4000);
  const [refreshInterval, setRefreshInterval] = useState(60);
  const [donationField, setDonationField] = useState('3');
  const [donationAmount, setDonationAmount] = useState(25);
  const [configVisible, setConfigVisible] = useState(false);

  useEffect(() => {
    const savedConfig = localStorage.getItem('donationThermometerConfig');
    if (savedConfig) {
      const config = JSON.parse(savedConfig);
      setBaseUrl(config.apiConfig.baseUrl);
      setFormId(config.apiConfig.formId);
      setUsername(config.apiConfig.username);
      setApiKey(config.apiConfig.apiKey);
      setGoalAmount(config.goalAmount);
      setRefreshInterval(config.refreshInterval);
      setDonationField(config.donationField);
    }
  }, []);

  const saveConfig = () => {
    const config = {
      apiConfig: { baseUrl, formId, username, apiKey },
      goalAmount,
      refreshInterval,
      donationField,
    };
    localStorage.setItem('donationThermometerConfig', JSON.stringify(config));
  };

  return (
    <div className="fixed bottom-5 right-5 z-10 config-panel">
      <button
        className="bg-primary text-white border-none rounded-full w-16 h-16 text-2xl cursor-pointer shadow-lg transition-all duration-300 hover:bg-primary/80 hover:rotate-45 config-toggle"
        onClick={() => setConfigVisible(!configVisible)}
      >
        ⚙️
      </button>
      {configVisible && (
        <div className="absolute bottom-[70px] right-0 w-[500px] bg-white rounded-lg p-5 shadow-xl">
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-5 text-left shadow-sm">
            <h3 className="text-2xl text-primary mt-0 mb-5 text-center">Gravity Forms API Configuratie</h3>
            <div className="mb-4">
              <label htmlFor="base-url" className="block mb-1 font-bold">WP API Basis URL:</label>
              <input
                type="text"
                id="base-url"
                className="w-full p-2 border border-gray-300 rounded text-base"
                placeholder="bijv. https://uw-website.nl/wp-json/gf/v2"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="form-id" className="block mb-1 font-bold">Formulier ID:</label>
              <input
                type="number"
                id="form-id"
                className="w-full p-2 border border-gray-300 rounded text-base"
                placeholder="bijv. 7"
                value={formId}
                onChange={(e) => setFormId(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="api-username" className="block mb-1 font-bold">API Gebruikersnaam:</label>
              <input
                type="text"
                id="api-username"
                className="w-full p-2 border border-gray-300 rounded text-base"
                placeholder="Gebruikersnaam"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="api-key" className="block mb-1 font-bold">API Sleutel:</label>
              <input
                type="password"
                id="api-key"
                className="w-full p-2 border border-gray-300 rounded text-base"
                placeholder="API Sleutel"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="goal-amount-input" className="block mb-1 font-bold">Doelbedrag:</label>
              <input
                type="number"
                id="goal-amount-input"
                className="w-full p-2 border border-gray-300 rounded text-base"
                placeholder="bijv. 4000"
                value={goalAmount}
                onChange={(e) => setGoalAmount(parseInt(e.target.value))}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="refresh-interval" className="block mb-1 font-bold">Verversingsinterval (seconden):</label>
              <input
                type="number"
                id="refresh-interval"
                className="w-full p-2 border border-gray-300 rounded text-base"
                placeholder="bijv. 60"
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(parseInt(e.target.value))}
                min="10"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="donation-field" className="block mb-1 font-bold">Donatiebedrag veldnummer:</label>
              <input
                type="text"
                id="donation-field"
                className="w-full p-2 border border-gray-300 rounded text-base"
                placeholder="bijv. 3"
                value={donationField}
                onChange={(e) => setDonationField(e.target.value)}
              />
            </div>
            <div className="flex justify-between mt-5">
              <button
                onClick={saveConfig}
                className="bg-gradient-to-b from-primary to-primary/80 text-white border-none py-3 px-6 rounded-full cursor-pointer text-base font-bold transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1"
              >
                Opslaan
              </button>
              <button
                onClick={() => testApiConnection(baseUrl, formId, username, apiKey)}
                className="bg-gradient-to-b from-primary to-primary/80 text-white border-none py-3 px-6 rounded-full cursor-pointer text-base font-bold transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1"
              >
                Test Verbinding
              </button>
            </div>
            <div className="p-2 rounded mt-2 text-center font-bold hidden" id="api-status">
              {apiStatus}
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6 text-center shadow-md">
            <h3 className="text-2xl text-primary mt-0 mb-2">Test Controls</h3>
            <p className="mb-4">Gebruik deze knoppen om de thermometer te testen</p>
            <div className="flex flex-wrap justify-center gap-2">
              <input
                type="number"
                id="donation-amount"
                className="p-4 border border-gray-300 rounded-full text-xl w-32 text-center shadow-inner"
                value={donationAmount}
                onChange={(e) => setDonationAmount(parseInt(e.target.value))}
                min="1"
                max="1000"
              />
              <button
                onClick={() => addDonation(donationAmount)}
                className="bg-gradient-to-b from-primary to-primary/80 text-white border-none py-4 px-8 rounded-full cursor-pointer text-xl font-bold transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1"
              >
                Voeg donatie toe
              </button>
              <button
                onClick={resetDonations}
                className="bg-gradient-to-b from-primary to-primary/80 text-white border-none py-4 px-8 rounded-full cursor-pointer text-xl font-bold transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1"
              >
                Reset
              </button>
              <button
                onClick={fetchDonations}
                className="bg-gradient-to-b from-primary to-primary/80 text-white border-none py-4 px-8 rounded-full cursor-pointer text-xl font-bold transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1"
              >
                Haal Donaties Op
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfigPanel;
