import { useState, useEffect, useCallback } from 'react';

const DEFAULT_GOAL = 4000;
const DEFAULT_INTERVAL = 5;
const DEFAULT_FIELD = '3';
const DEFAULT_CASH_AMOUNT = 0;
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
  const [cashAmount, setCashAmount] = useState(DEFAULT_CASH_AMOUNT);

  // Load config on mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('donationThermometerConfig');
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        const loadedApiConfig = config.apiConfig || DEFAULT_API_CONFIG;
        setApiConfig(loadedApiConfig);
        setGoalAmount(config.goalAmount || DEFAULT_GOAL);
        setRefreshInterval(config.refreshInterval || DEFAULT_INTERVAL);
        setDonationField(config.donationField || DEFAULT_FIELD);
        setCashAmount(config.cashAmount || DEFAULT_CASH_AMOUNT); // Load cash amount
      } catch (error) {
        console.error('Error loading config:', error);
        // Optionally reset to defaults if loading fails
        setApiConfig(DEFAULT_API_CONFIG);
        setGoalAmount(DEFAULT_GOAL);
        setRefreshInterval(DEFAULT_INTERVAL);
        setDonationField(DEFAULT_FIELD);
        setCashAmount(DEFAULT_CASH_AMOUNT); // Reset cash amount on error
      }
    } else {
    }
  }, []); // Empty dependency array means run once on mount

  // Function to save the provided config object to localStorage, memoized with useCallback
  const saveConfigToLocalStorage = useCallback((configToSave) => {
    // Ensure all parts are present, falling back to current state or defaults if needed
    // This prevents accidentally saving incomplete objects if updateConfig is called partially
    const fullConfig = {
        apiConfig: configToSave.apiConfig !== undefined ? configToSave.apiConfig : apiConfig,
        goalAmount: configToSave.goalAmount !== undefined ? configToSave.goalAmount : goalAmount,
        refreshInterval: configToSave.refreshInterval !== undefined ? configToSave.refreshInterval : refreshInterval,
        donationField: configToSave.donationField !== undefined ? configToSave.donationField : donationField,
        cashAmount: configToSave.cashAmount !== undefined ? configToSave.cashAmount : cashAmount // Save cash amount
    };
    localStorage.setItem('donationThermometerConfig', JSON.stringify(fullConfig));
    console.log('useConfig: Saved to localStorage:', fullConfig); // Add log for confirmation
  }, [apiConfig, goalAmount, refreshInterval, donationField, cashAmount]); // Add cashAmount to dependencies

  // Remove the useEffect that automatically saves on state change
  // useEffect(() => {
  //   saveConfig();
  // }, [saveConfig]);

  // Function to update the entire config state, typically used by ConfigPanel
  // Function to update the entire config state AND save immediately
  const updateConfig = useCallback((newConfig) => {
    // Update state first
    const updatedApiConfig = newConfig.apiConfig !== undefined ? newConfig.apiConfig : apiConfig;
    const updatedGoalAmount = newConfig.goalAmount !== undefined ? newConfig.goalAmount : goalAmount;
    const updatedRefreshInterval = newConfig.refreshInterval !== undefined ? newConfig.refreshInterval : refreshInterval;
    const updatedDonationField = newConfig.donationField !== undefined ? newConfig.donationField : donationField;
    const updatedCashAmount = newConfig.cashAmount !== undefined ? newConfig.cashAmount : cashAmount; // Handle cash amount update

    setApiConfig(updatedApiConfig);
    setGoalAmount(updatedGoalAmount);
    setRefreshInterval(updatedRefreshInterval);
    setDonationField(updatedDonationField);
    setCashAmount(updatedCashAmount); // Set cash amount state

    // Immediately save the new configuration object passed in
    saveConfigToLocalStorage(newConfig);

  }, [apiConfig, goalAmount, refreshInterval, donationField, cashAmount, saveConfigToLocalStorage]); // Add saveConfigToLocalStorage dependency

  return {
    apiConfig,
    goalAmount,
    refreshInterval,
    donationField,
    cashAmount, // Return cash amount
    updateConfig,
    setApiConfig,
    setGoalAmount,
    setRefreshInterval,
    setDonationField,
    setCashAmount, // Return setter for cash amount
  };
}