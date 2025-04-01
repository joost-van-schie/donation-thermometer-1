import { useState, useCallback, useEffect, useRef } from 'react';

export function useDonationApi({
  apiConfig,
  donationField,
  addDonation, // Function to add a processed donation to the main state
  goalAmount,
  goalReached,
  refreshInterval,
  onInitialLoad, // Callback to set initial amount and donations list
}) {
  const [lastFetchedEntry, setLastFetchedEntry] = useState(null);
  const [apiStatus, setApiStatus] = useState({ message: '', status: '' }); // status: '', 'loading', 'connected', 'error'
  const refreshTimer = useRef(null);

  // --- API Status Helper ---
  const displayApiStatus = useCallback((message, status) => {
    setApiStatus({ message, status });
    // Auto hide after 5 seconds for success/connected messages
    if (status === 'connected') {
      setTimeout(() => setApiStatus({ message: '', status: '' }), 5000);
    }
  }, []);

  // --- Process API Donations ---
  const processApiDonations = useCallback((entriesData) => {
    if (!Array.isArray(entriesData)) {
      console.error('Invalid API response:', entriesData);
      displayApiStatus('Ongeldige API response ontvangen.', 'error');
      return;
    }

    // Reset if this is our first fetch or if lastFetchedEntry is null
    if (lastFetchedEntry === null && entriesData.length > 0) {
      const latestEntryId = entriesData[0].id; // Assuming entries are sorted DESC by ID
      setLastFetchedEntry(latestEntryId);

      let totalApiAmount = 0;
      const initialDonations = [];

      entriesData.forEach(entry => {
        if (entry[donationField]) {
          const amountString = String(entry[donationField]).replace(/[^\d,.-]/g, '').replace(',', '.');
          const amount = parseFloat(amountString);
          if (!isNaN(amount)) {
            totalApiAmount += amount;
            const date = new Date(entry.date_created);
            initialDonations.push({
              id: entry.id, // Store ID for key and tracking
              amount: amount,
              date: date.toLocaleDateString('nl-NL'),
              time: date.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })
            });
          }
        }
      });

      // Sort by date (newest first) before slicing
      initialDonations.sort((a, b) => b.id - a.id); // Sort by ID desc (newest first)

      // Call the callback to update App state
      onInitialLoad(totalApiAmount, initialDonations.slice(0, 8));

      console.log(`Initial load: ${entriesData.length} entries processed, total amount: ${totalApiAmount}`);
      displayApiStatus(`${initialDonations.length} donaties geladen, totaal: €${totalApiAmount.toLocaleString('nl-NL')}`, 'connected');

      // Note: Goal reached check on initial load is handled in App component after onInitialLoad updates state

    } else if (entriesData.length > 0 && lastFetchedEntry !== null) {
      // Find new entries (those with ID greater than lastFetchedEntry)
      const newEntries = entriesData.filter(entry => entry.id > lastFetchedEntry);

      if (newEntries.length > 0) {
        console.log(`Found ${newEntries.length} new donations`);
        // Sort new entries by ID ascending to process them in order
        newEntries.sort((a, b) => a.id - b.id);

        // Update lastFetchedEntry with the newest ID
        setLastFetchedEntry(newEntries[newEntries.length - 1].id);

        // Process each new entry sequentially using the passed addDonation function
        newEntries.forEach(entry => {
          if (entry[donationField]) {
            const amountString = String(entry[donationField]).replace(/[^\d,.-]/g, '').replace(',', '.');
            const amount = parseFloat(amountString);
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
        displayApiStatus(`${newEntries.length} nieuwe donatie(s) verwerkt.`, 'connected');
      } else {
        console.log("No new donations found.");
        // Optionally show a status like "Geen nieuwe donaties."
      }
    }
  }, [addDonation, donationField, lastFetchedEntry, displayApiStatus, onInitialLoad]); // Removed goalAmount, goalReached as they are handled in App

  // --- API Fetching Logic ---
  const fetchDonations = useCallback(async () => {
    if (!apiConfig.baseUrl || !apiConfig.username || !apiConfig.apiKey || !apiConfig.formId) {
      console.error('API configuration incomplete');
      // displayApiStatus('API configuratie onvolledig.', 'error'); // Avoid showing error on auto-refresh
      return;
    }

    displayApiStatus('Donaties ophalen...', 'loading');
    const auth = 'Basic ' + btoa(apiConfig.username + ':' + apiConfig.apiKey);
    const searchParams = new URLSearchParams({
      'sorting[key]': 'id',
      'sorting[direction]': 'DESC',
      'paging[page_size]': 20 // Fetch a reasonable number to check for new ones
    });

    try {
      const response = await fetch(`${apiConfig.baseUrl}/forms/${apiConfig.formId}/entries?${searchParams.toString()}`, {
        method: 'GET',
        headers: {
          'Authorization': auth,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API error: ${response.status} ${response.statusText}`, errorText);
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      processApiDonations(data);

    } catch (error) {
      console.error('API Fetch Error:', error);
      displayApiStatus(`Fout bij ophalen: ${error.message}`, 'error');
    }
  }, [apiConfig, processApiDonations, displayApiStatus]); // Dependencies

  // --- Start/Stop Fetching Timer ---
  useEffect(() => {
    // Clear existing timer if interval or config changes
    if (refreshTimer.current) {
      clearInterval(refreshTimer.current);
    }

    // Start new timer if config is valid
    if (apiConfig.baseUrl && apiConfig.username && apiConfig.apiKey && apiConfig.formId && refreshInterval > 0) {
      fetchDonations(); // Fetch immediately
      refreshTimer.current = setInterval(fetchDonations, refreshInterval * 1000);
    }

    // Cleanup function to clear timer on unmount or dependency change
    return () => {
      if (refreshTimer.current) {
        clearInterval(refreshTimer.current);
      }
    };
  }, [apiConfig, refreshInterval, fetchDonations]); // Dependencies that should restart the timer


  // --- Test Connection Logic ---
  const handleTestConnection = useCallback(async (configToTest) => {
    if (!configToTest.baseUrl || !configToTest.username || !configToTest.apiKey || !configToTest.formId) {
      displayApiStatus('Vul alle API gegevens in om te testen.', 'error');
      return;
    }
    displayApiStatus('Verbinding testen...', 'loading');
    const auth = 'Basic ' + btoa(configToTest.username + ':' + configToTest.apiKey);
    try {
      const response = await fetch(`${configToTest.baseUrl}/forms/${configToTest.formId}`, {
        method: 'GET',
        headers: { 'Authorization': auth, 'Content-Type': 'application/json' }
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Test error: ${response.status} ${response.statusText}`, errorText);
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      await response.json(); // Check if response is valid JSON
      displayApiStatus('Verbinding succesvol!', 'connected');
    } catch (error) {
      displayApiStatus(`Verbindingsfout: ${error.message}`, 'error');
      console.error('API Test Error:', error);
    }
  }, [displayApiStatus]); // Dependency

  // --- Reset Fetch State ---
   const resetApiState = useCallback(() => {
        setLastFetchedEntry(null);
        // Optionally clear API status?
        // displayApiStatus('', '');
        // Clear timer immediately
        if (refreshTimer.current) {
            clearInterval(refreshTimer.current);
            refreshTimer.current = null; // Ensure it's cleared
        }
        // Restart fetching based on current config (will be triggered by useEffect)
        // Note: The useEffect watching apiConfig/refreshInterval handles restarting.
        // We might need to trigger fetchDonations manually after reset if the config hasn't changed.
        // However, the typical use case for reset likely involves fetching fresh data anyway.
        console.log("API fetch state reset.");
    }, [/* displayApiStatus */]); // No dependencies needed that would cause re-creation


  return {
    apiStatus,
    fetchDonations, // Expose manual fetch trigger
    handleTestConnection,
    resetApiState, // Expose reset function
  };
}