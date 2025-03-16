import React, { createContext, useState, useEffect } from 'react';

const DonationsContext = createContext();

const DonationsProvider = ({ children }) => {
  const [donations, setDonations] = useState([]);
  const [currentAmount, setCurrentAmount] = useState(0);
  const [goalAmount, setGoalAmount] = useState(4000);
  const [goalReached, setGoalReached] = useState(false);
  const [apiConfig, setApiConfig] = useState({
    baseUrl: '',
    formId: '7',
    username: '',
    apiKey: '',
  });
  const [refreshInterval, setRefreshInterval] = useState(60);
  const [lastFetchedEntry, setLastFetchedEntry] = useState(null);

  useEffect(() => {
    const savedConfig = localStorage.getItem('donationThermometerConfig');
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        setApiConfig(config.apiConfig);
        setGoalAmount(config.goalAmount || 4000);
        setRefreshInterval(config.refreshInterval || 60);
        if (config.apiConfig.baseUrl && config.apiConfig.username && config.apiConfig.apiKey) {
          startFetchingDonations();
        }
      } catch (error) {
        console.error('Error loading config:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('donationThermometerConfig', JSON.stringify({
      apiConfig,
      goalAmount,
      refreshInterval,
    }));
  }, [apiConfig, goalAmount, refreshInterval]);

  const addDonation = (amount, date = null, time = null) => {
    const now = new Date();
    const donation = {
      amount,
      date: date || now.toLocaleDateString('nl-NL'),
      time: time || now.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' }),
    };

    setDonations((prevDonations) => {
      const newDonations = [donation, ...prevDonations];
      if (newDonations.length > 8) {
        newDonations.pop();
      }
      return newDonations;
    });

    setCurrentAmount((prevAmount) => {
      const newAmount = prevAmount + amount;
      if (newAmount >= goalAmount && !goalReached) {
        setGoalReached(true);
      }
      return newAmount;
    });
  };

  const resetDonations = () => {
    setDonations([]);
    setCurrentAmount(0);
    setGoalReached(false);
  };

  const startFetchingDonations = () => {
    fetchDonations();
    setInterval(fetchDonations, refreshInterval * 1000);
  };

  const fetchDonations = () => {
    if (!apiConfig.baseUrl || !apiConfig.username || !apiConfig.apiKey || !apiConfig.formId) {
      console.error('API configuration incomplete');
      return;
    }

    const auth = 'Basic ' + btoa(`${apiConfig.username}:${apiConfig.apiKey}`);
    const searchParams = new URLSearchParams({
      'sorting[key]': 'id',
      'sorting[direction]': 'DESC',
      'paging[page_size]': 20,
    });

    fetch(`${apiConfig.baseUrl}/forms/${apiConfig.formId}/entries?${searchParams.toString()}`, {
      method: 'GET',
      headers: {
        Authorization: auth,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        processApiDonations(data);
      })
      .catch((error) => {
        console.error('API Fetch Error:', error);
      });
  };

  const processApiDonations = (entriesData) => {
    if (!Array.isArray(entriesData)) {
      console.error('Invalid API response:', entriesData);
      return;
    }

    if (lastFetchedEntry === null && entriesData.length > 0) {
      setLastFetchedEntry(entriesData[0].id);
      let totalApiAmount = 0;
      entriesData.forEach((entry) => {
        if (entry[donationField]) {
          const amount = parseFloat(entry[donationField].replace(/[^\d,.-]/g, '').replace(',', '.'));
          if (!isNaN(amount)) {
            totalApiAmount += amount;
            const date = new Date(entry.date_created);
            const donation = {
              amount,
              date: date.toLocaleDateString('nl-NL'),
              time: date.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' }),
            };
            setDonations((prevDonations) => {
              const newDonations = [donation, ...prevDonations];
              if (newDonations.length > 8) {
                newDonations.pop();
              }
              return newDonations;
            });
          }
        }
      });
      setCurrentAmount(totalApiAmount);
    } else if (entriesData.length > 0) {
      const newEntries = entriesData.filter((entry) => entry.id > lastFetchedEntry);
      if (newEntries.length > 0) {
        setLastFetchedEntry(newEntries[0].id);
        newEntries.forEach((entry) => {
          if (entry[donationField]) {
            const amount = parseFloat(entry[donationField].replace(/[^\d,.-]/g, '').replace(',', '.'));
            if (!isNaN(amount)) {
              const date = new Date(entry.date_created);
              addDonation(
                amount,
                date.toLocaleDateString('nl-NL'),
                date.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' }),
              );
            }
          }
        });
      }
    }
  };

  return (
    <DonationsContext.Provider
      value={{
        donations,
        currentAmount,
        goalAmount,
        goalReached,
        addDonation,
        resetDonations,
        setGoalAmount,
        apiConfig,
        setApiConfig,
        fetchDonations,
        startFetchingDonations,
      }}
    >
      {children}
    </DonationsContext.Provider>
  );
};

export { DonationsContext, DonationsProvider };
