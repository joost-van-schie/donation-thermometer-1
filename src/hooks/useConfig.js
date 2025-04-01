import { useState, useEffect, useCallback } from 'react';

const DEFAULT_GOAL = 4000;
const DEFAULT_INTERVAL = 60;
const DEFAULT_FIELD = '3';
const DEFAULT_API_CONFIG = {
  baseUrl: 'https://www.kerkemst.nl/wp-json/gf/v2',
  formId: '7',
  username: '',
  apiKey: '',
};

export function useConfig() {
  const [goalAmount, setGoalAmount] = useState(DEFAULT_GOAL);
  const [refreshInterval, setRefreshInterval] = useState(DEFAULT_INTERVAL); // seconds
  const [donationField, setDonationField] = useState(DEFAULT_FIELD);
  const [apiConfig, setApiConfig] = useState(DEFAULT_API_CONFIG);

  // Load config on mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('donationThermometerConfig');
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        setApiConfig(config.apiConfig || DEFAULT_API_CONFIG);
        setGoalAmount(config.goalAmount || DEFAULT_GOAL);
        setRefreshInterval(config.refreshInterval || DEFAULT_INTERVAL);
        setDonationField(config.donationField || DEFAULT_FIELD);
      } catch (error) {
        console.error('Error loading config:', error);
        // Optionally reset to defaults if loading fails
        setApiConfig(DEFAULT_API_CONFIG);
        setGoalAmount(DEFAULT_GOAL);
        setRefreshInterval(DEFAULT_INTERVAL);
        setDonationField(DEFAULT_FIELD);
      }
    }
  }, []); // Empty dependency array means run once on mount

  // Save config whenever relevant state changes
  const saveConfig = useCallback(() => {
    const configToSave = {
      apiConfig: apiConfig,
      goalAmount: goalAmount,
      refreshInterval: refreshInterval,
      donationField: donationField
    };
    localStorage.setItem('donationThermometerConfig', JSON.stringify(configToSave));
  }, [apiConfig, goalAmount, refreshInterval, donationField]);

  useEffect(() => {
    saveConfig();
  }, [saveConfig]); // saveConfig itself depends on the state values

  // Function to update the entire config state, typically used by ConfigPanel
  const updateConfig = useCallback((newConfig) => {
    setApiConfig(newConfig.apiConfig || DEFAULT_API_CONFIG);
    setGoalAmount(newConfig.goalAmount || DEFAULT_GOAL);
    setRefreshInterval(newConfig.refreshInterval || DEFAULT_INTERVAL);
    setDonationField(newConfig.donationField || DEFAULT_FIELD);
    // Saving is handled by the useEffect watching the state variables
  }, []);

  return {
    apiConfig,
    goalAmount,
    refreshInterval,
    donationField,
    updateConfig, // Provide a way to update the whole config object
    // Individual setters might be needed if direct updates outside ConfigPanel are required
    setApiConfig,
    setGoalAmount,
    setRefreshInterval,
    setDonationField,
  };
}