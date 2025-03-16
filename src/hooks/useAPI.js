import { useState, useEffect } from 'react';

const useAPI = () => {
  const [apiStatus, setApiStatus] = useState('');
  const [donations, setDonations] = useState([]);
  const [lastFetchedEntry, setLastFetchedEntry] = useState(null);
  const [refreshInterval, setRefreshInterval] = useState(60);
  const [refreshTimer, setRefreshTimer] = useState(null);

  const apiConfig = {
    baseUrl: '',
    formId: '7',
    username: '',
    apiKey: '',
  };

  useEffect(() => {
    const savedConfig = localStorage.getItem('donationThermometerConfig');
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        apiConfig.baseUrl = config.apiConfig.baseUrl;
        apiConfig.formId = config.apiConfig.formId;
        apiConfig.username = config.apiConfig.username;
        apiConfig.apiKey = config.apiConfig.apiKey;
        setRefreshInterval(config.refreshInterval || 60);
        if (apiConfig.baseUrl && apiConfig.username && apiConfig.apiKey) {
          startFetchingDonations();
        }
      } catch (error) {
        console.error('Error loading config:', error);
      }
    }
  }, []);

  const saveConfig = (config) => {
    localStorage.setItem('donationThermometerConfig', JSON.stringify(config));
  };

  const testApiConnection = (baseUrl, formId, username, apiKey) => {
    setApiStatus('Verbinding testen...');
    const auth = 'Basic ' + btoa(username + ':' + apiKey);
    fetch(`${baseUrl}/forms/${formId}`, {
      method: 'GET',
      headers: {
        'Authorization': auth,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setApiStatus('Verbinding succesvol!');
        console.log('API Test Success:', data);
      })
      .catch(error => {
        setApiStatus(`Verbindingsfout: ${error.message}`);
        console.error('API Test Error:', error);
      });
  };

  const startFetchingDonations = () => {
    if (refreshTimer) {
      clearInterval(refreshTimer);
    }
    fetchDonations();
    setRefreshTimer(setInterval(fetchDonations, refreshInterval * 1000));
  };

  const fetchDonations = () => {
    if (!apiConfig.baseUrl || !apiConfig.username || !apiConfig.apiKey || !apiConfig.formId) {
      console.error('API configuration incomplete');
      return;
    }
    const auth = 'Basic ' + btoa(apiConfig.username + ':' + apiConfig.apiKey);
    const searchParams = new URLSearchParams({
      'sorting[key]': 'id',
      'sorting[direction]': 'DESC',
      'paging[page_size]': 20
    });
    fetch(`${apiConfig.baseUrl}/forms/${apiConfig.formId}/entries?${searchParams.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': auth,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        processApiDonations(data);
      })
      .catch(error => {
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
      entriesData.forEach(entry => {
        if (entry[donationField]) {
          const amount = parseFloat(entry[donationField].replace(/[^\d,.-]/g, '').replace(',', '.'));
          if (!isNaN(amount)) {
            totalApiAmount += amount;
            const date = new Date(entry.date_created);
            const donation = {
              amount: amount,
              date: date.toLocaleDateString('nl-NL'),
              time: date.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })
            };
            setDonations(prevDonations => {
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
      const newEntries = entriesData.filter(entry => entry.id > lastFetchedEntry);
      if (newEntries.length > 0) {
        setLastFetchedEntry(newEntries[0].id);
        newEntries.forEach(entry => {
          if (entry[donationField]) {
            const amount = parseFloat(entry[donationField].replace(/[^\d,.-]/g, '').replace(',', '.'));
            if (!isNaN(amount)) {
              const date = new Date(entry.date_created);
              addDonation(
                amount,
                date.toLocaleDateString('nl-NL'),
                date.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })
              );
            }
          }
        });
      }
    }
  };

  return {
    apiStatus,
    fetchDonations,
    testApiConnection,
    saveConfig,
    startFetchingDonations
  };
};

export { useAPI };
