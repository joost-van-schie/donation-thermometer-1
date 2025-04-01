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
  const processApiDonations = useCallback((responseData) => {
    // Gravity Forms API v2 returns an object with an 'entries' key
    const entriesData = responseData?.entries;


    if (!Array.isArray(entriesData)) {
      console.error('Invalid API response or missing "entries" array:', responseData);
      displayApiStatus('Ongeldige API response of "entries" array ontbreekt.', 'error');
      return;
    }

    // Reset if this is our first fetch or if lastFetchedEntry is null
    if (lastFetchedEntry === null && entriesData.length > 0) {
      const latestEntryId = entriesData[0].id; // Assuming entries are sorted DESC by ID
      setLastFetchedEntry(latestEntryId);

      let totalApiAmount = 0;
      const initialDonations = [];

      entriesData.forEach(entry => {
        // Only process entries with payment_status === 'Paid'
        if (entry.payment_status === 'Paid' && entry[donationField]) {
          const amountString = String(entry[donationField]).replace(/[^\d,.-]/g, '').replace(',', '.');
          const amount = parseFloat(amountString);
          if (!isNaN(amount)) {
            totalApiAmount += amount;
            const date = new Date(entry.date_created); // Define date object here
            initialDonations.push({
              id: entry.id, // Store ID for key and tracking
              amount: amount,
              date: date.toLocaleDateString('nl-NL', { timeZone: 'Europe/Amsterdam' }), // Use defined date object and add timezone
              time: date.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Amsterdam' }) // Use defined date object and add timezone
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

    // Subsequent fetches: API call should have filtered entries > lastFetchedEntry
    } else if (lastFetchedEntry !== null) {
        // The API call itself filtered using 'search', so entriesData contains ONLY new entries (if any)
        console.log(`Processing response for donations newer than ID: ${lastFetchedEntry}`);
        console.log('Received entry IDs:', entriesData.map(e => e.id)); // Should be empty or contain only new IDs

        if (entriesData.length > 0) {
            console.log(`Found ${entriesData.length} new donations via API filter.`);
            // Sort new entries by ID ascending to process them in chronological order
            entriesData.sort((a, b) => a.id - b.id);

            // Update lastFetchedEntry with the newest ID from this batch
            const newestIdInBatch = entriesData[entriesData.length - 1].id;
            console.log(`Updating lastFetchedEntry from ${lastFetchedEntry} to ${newestIdInBatch}`);
            setLastFetchedEntry(newestIdInBatch);

            // Process each new entry sequentially using the passed addDonation function
            entriesData.forEach(entry => {
                // Only process entries with payment_status === 'Paid'
                if (entry.payment_status === 'Paid' && entry[donationField]) {
                    const amountString = String(entry[donationField]).replace(/[^\d,.-]/g, '').replace(',', '.');
                    const amount = parseFloat(amountString);
                    if (!isNaN(amount)) {
                        const date = new Date(entry.date_created);
                        addDonation(
                            amount,
                            date.toLocaleDateString('nl-NL', { timeZone: 'Europe/Amsterdam' }),
                            date.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Amsterdam' }),
                            entry.id // Pass the entry ID
                        );
                    }
                }
            });
            displayApiStatus(`${entriesData.length} nieuwe donatie(s) verwerkt.`, 'connected');
        } else {
            console.log("No new donations found since last check.");
            // Update status to show the fetch completed, even if no new donations
            displayApiStatus('Geen nieuwe donaties gevonden.', 'connected');
        }
    }
  }, [addDonation, donationField, lastFetchedEntry, displayApiStatus, onInitialLoad]); // Removed goalAmount, goalReached as they are handled in App

  // --- API Fetching Logic ---
  const fetchDonations = useCallback(async () => {
    // Removed URL parameter check for status, we will always filter by 'Paid'
    if (!apiConfig.baseUrl || !apiConfig.username || !apiConfig.apiKey || !apiConfig.formId) {
      console.error('API configuration incomplete');
      // displayApiStatus('API configuratie onvolledig.', 'error'); // Avoid showing error on auto-refresh
      return;
    }

    displayApiStatus('Donaties ophalen...', 'loading');
    const auth = 'Basic ' + btoa(apiConfig.username + ':' + apiConfig.apiKey);
    // Determine page size: large for initial load, smaller for subsequent checks
    const isInitialLoad = lastFetchedEntry === null;
    const pageSize = isInitialLoad ? 200 : 50; // Fetch more initially, then 50 for updates
    console.log(`Fetching donations. Initial load: ${isInitialLoad}, Page size: ${pageSize}, Last fetched ID: ${lastFetchedEntry}`); // Added logging

    const searchParamsObj = {
      'sorting[key]': 'id',
      'sorting[direction]': 'DESC',
      'paging[page_size]': pageSize,
      search: {} // Initialize search object
    };
    const fieldFilters = [];

    // Add filter for newer entries on subsequent fetches
    if (!isInitialLoad && lastFetchedEntry) {
        fieldFilters.push({ key: 'id', operator: '>', value: lastFetchedEntry });
        console.log(`Adding search filter: id > ${lastFetchedEntry}`);
    }

    // Always add filter for payment status 'Paid'
    fieldFilters.push({ key: 'payment_status', value: 'Paid' });
    console.log(`Adding search filter: payment_status = Paid`);

    // Add field filters to search object if any exist
    if (fieldFilters.length > 0) {
      searchParamsObj.search = JSON.stringify({ field_filters: fieldFilters });
    } else {
      // Remove empty search object if no filters are applied
      delete searchParamsObj.search;
    }

    const searchParams = new URLSearchParams(searchParamsObj);

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
  }, [apiConfig, processApiDonations, displayApiStatus, lastFetchedEntry]); // Added lastFetchedEntry dependency

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