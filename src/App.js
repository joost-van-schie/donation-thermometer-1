import React, { useState, useEffect, useRef, useCallback } from 'react';

// Import Components
import Header from './components/Header';
import QRCodeSection from './components/QRCodeSection';
import ThermometerDisplay from './components/ThermometerDisplay';
import DonationList from './components/DonationList';
import Footer from './components/Footer';
import ConfigPanel from './components/ConfigPanel';
// Removed placeholder component definitions

// --- Main App Component ---
function App() {
  // --- State Variables ---
  const [currentAmount, setCurrentAmount] = useState(0);
  const [goalAmount, setGoalAmount] = useState(4000);
  const [donations, setDonations] = useState([]);
  const [goalReached, setGoalReached] = useState(false);
  const [lastFetchedEntry, setLastFetchedEntry] = useState(null);
  const [refreshInterval, setRefreshInterval] = useState(60); // seconds
  const [donationField, setDonationField] = useState('3');
  const [apiConfig, setApiConfig] = useState({
    baseUrl: '',
    formId: '7',
    username: '',
    apiKey: '',
  });

  // UI State
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [showGoalReachedOverlay, setShowGoalReachedOverlay] = useState(false);
  // const [showConfigPanel, setShowConfigPanel] = useState(false); // Config panel visibility is managed within ConfigPanel component
  const [apiStatus, setApiStatus] = useState({ message: '', status: '' }); // status: '', 'loading', 'connected', 'error'

  // Refs
  const refreshTimer = useRef(null);
  const confettiContainerRef = useRef(null);
  const pageContainerRef = useRef(null);

  // --- Load Config on Mount ---
  useEffect(() => {
    const savedConfig = localStorage.getItem('donationThermometerConfig');
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        setApiConfig(config.apiConfig || { baseUrl: '', formId: '7', username: '', apiKey: '' });
        setGoalAmount(config.goalAmount || 4000);
        setRefreshInterval(config.refreshInterval || 60);
        setDonationField(config.donationField || '3');

        // If we have valid API credentials, start fetching
        if (config.apiConfig?.baseUrl && config.apiConfig?.username && config.apiConfig?.apiKey) {
          // startFetchingDonations(); // We'll define this later
        }
      } catch (error) {
        console.error('Error loading config:', error);
      }
    }
    // Removed initial demo donations, rely on API fetch or manual additions
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array means run once on mount

  // --- Save Config ---
  const saveConfig = useCallback(() => {
    const configToSave = {
      apiConfig: apiConfig,
      goalAmount: goalAmount,
      refreshInterval: refreshInterval,
      donationField: donationField
    };
    localStorage.setItem('donationThermometerConfig', JSON.stringify(configToSave));
  }, [apiConfig, goalAmount, refreshInterval, donationField]);

  // --- Update Scale on Resize ---
  const updateScale = useCallback(() => {
    if (!pageContainerRef.current) return;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const scaleX = windowWidth / 1920;
    const scaleY = windowHeight / 1080;
    const scale = Math.min(scaleX, scaleY);
    pageContainerRef.current.style.transform = `scale(${scale})`;
  }, []);

  useEffect(() => {
    updateScale(); // Initial scale
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale); // Cleanup
  }, [updateScale]);

  // --- Confetti Function ---
  const createConfetti = useCallback((amount) => {
    if (!confettiContainerRef.current) return;

    const pieceCount = Math.min(Math.max(amount, 30), 150);
    const container = confettiContainerRef.current;

    for (let i = 0; i < pieceCount; i++) {
      const confetti = document.createElement('div');
      const x = Math.random() * 1920; // Use fixed width of container
      const y = -30;
      const size = Math.random() * 15 + 5;
      const colors = ['#e55b13', '#0069b4', '#28a745', '#ffc107', '#dc3545', '#6610f2', '#fd7e14', '#20c997'];
      const color = colors[Math.floor(Math.random() * colors.length)];

      confetti.style.position = 'absolute';
      confetti.style.width = `${size}px`;
      confetti.style.height = `${size}px`;
      confetti.style.backgroundColor = color;
      confetti.style.left = `${x}px`;
      confetti.style.top = `${y}px`;
      confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0'; // Random square/circle

      container.appendChild(confetti);

      const animationDuration = Math.random() * 3 + 2;
      const fallDistance = 1200; // Use fixed height
      const sidewaysMove = Math.random() * 200 - 100;

      confetti.animate([
        { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
        { transform: `translate(${sidewaysMove}px, ${fallDistance}px) rotate(${Math.random() * 720 - 360}deg)`, opacity: 0 }
      ], {
        duration: animationDuration * 1000,
        easing: 'cubic-bezier(0.15, 0.85, 0.45, 1)'
      });

      setTimeout(() => {
        if (container.contains(confetti)) {
            container.removeChild(confetti);
        }
      }, animationDuration * 1000);
    }
  }, []);

  // --- Celebrate Goal Reached ---
  const celebrateGoalReached = useCallback(() => {
    setShowGoalReachedOverlay(true);
    createConfetti(500); // Massive confetti
    setTimeout(() => createConfetti(300), 2000);
    setTimeout(() => createConfetti(300), 4000);
  }, [createConfetti]);

  // --- Add Donation Logic ---
  const addDonation = useCallback((amount, date = null, time = null) => {
    const now = new Date();
    const newDonation = {
      amount: amount,
      date: date || now.toLocaleDateString('nl-NL'),
      time: time || now.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })
    };

    setDonations(prevDonations => {
      const updatedDonations = [newDonation, ...prevDonations];
      // Keep only the latest 8 donations
      return updatedDonations.slice(0, 8);
    });

    const previousAmount = currentAmount;
    const newTotal = previousAmount + amount;
    setCurrentAmount(newTotal);

    // Show popup
    setPopupMessage(`Er is zojuist €${amount.toLocaleString('nl-NL')} gedoneerd!`);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 5000); // Hide after 5 seconds

    // Confetti
    if (amount >= 10) {
      createConfetti(amount);
    }

    // Check goal reached
    if (!goalReached && previousAmount < goalAmount && newTotal >= goalAmount) {
      setGoalReached(true);
      celebrateGoalReached();
    }
  }, [currentAmount, goalAmount, goalReached, celebrateGoalReached, createConfetti]);


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

        setCurrentAmount(totalApiAmount);
        setDonations(initialDonations.slice(0, 8)); // Keep only the latest 8

        console.log(`Initial load: ${entriesData.length} entries processed, total amount: ${totalApiAmount}`);
        displayApiStatus(`${initialDonations.length} donaties geladen, totaal: €${totalApiAmount.toLocaleString('nl-NL')}`, 'connected');

        if (totalApiAmount >= goalAmount && !goalReached) {
            setGoalReached(true);
            // Don't trigger full celebration on initial load, maybe just update state
        }

    } else if (entriesData.length > 0 && lastFetchedEntry !== null) {
        // Find new entries (those with ID greater than lastFetchedEntry)
        const newEntries = entriesData.filter(entry => entry.id > lastFetchedEntry);

        if (newEntries.length > 0) {
            console.log(`Found ${newEntries.length} new donations`);
            // Sort new entries by ID ascending to process them in order
            newEntries.sort((a, b) => a.id - b.id);

            // Update lastFetchedEntry with the newest ID
            setLastFetchedEntry(newEntries[newEntries.length - 1].id);

            // Process each new entry sequentially
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
  }, [addDonation, donationField, goalAmount, lastFetchedEntry, displayApiStatus, goalReached]); // Added dependencies


  // --- API Fetching Logic ---
  const fetchDonations = useCallback(async () => {
    if (!apiConfig.baseUrl || !apiConfig.username || !apiConfig.apiKey || !apiConfig.formId) {
      console.error('API configuration incomplete');
      // Optionally display status only if manually triggered?
      // displayApiStatus('API configuratie onvolledig.', 'error');
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
    if (apiConfig.baseUrl && apiConfig.username && apiConfig.apiKey && apiConfig.formId) {
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


  // --- Event Handlers ---
  const handleReset = useCallback(() => {
      setCurrentAmount(0);
      setDonations([]);
      setGoalReached(false);
      setLastFetchedEntry(null); // Reset last fetched entry ID
      // Optionally clear API status?
      // displayApiStatus('', '');
      console.log("Thermometer reset.");
  }, []); // No dependencies needed for reset

  const handleCloseOverlay = () => {
    setShowGoalReachedOverlay(false);
  };

  // Config panel toggle is handled internally by ConfigPanel component
  // const handleToggleConfig = () => {
  //   setShowConfigPanel(prev => !prev);
  // };

  const handleSaveConfig = useCallback((newConfig) => {
    // Update state with values from ConfigPanel
    setApiConfig(newConfig.apiConfig);
    setGoalAmount(newConfig.goalAmount);
    setRefreshInterval(newConfig.refreshInterval);
    setDonationField(newConfig.donationField);

    // Save to localStorage (use a separate effect for this to avoid issues)
    // saveConfig(); // Let the effect handle saving

    displayApiStatus('Configuratie opgeslagen.', 'connected');
    // The useEffect watching [apiConfig, refreshInterval] will automatically restart the timer.
  }, [displayApiStatus]); // Removed saveConfig dependency, will use effect

  // Effect to save config whenever relevant state changes
  useEffect(() => {
    saveConfig();
  }, [saveConfig]); // saveConfig itself depends on the state values

  // Updated to accept config from ConfigPanel component state
  const handleTestConnection = useCallback(async (configToTest) => {
    if (!configToTest.baseUrl || !configToTest.username || !configToTest.apiKey || !configToTest.formId) {
        displayApiStatus('Vul alle API gegevens in om te testen.', 'error');
        return;
    }
    displayApiStatus('Verbinding testen...', 'loading');
    const auth = 'Basic ' + btoa(configToTest.username + ':' + configToTest.apiKey);
    try {
        // Use the config passed from the component for the test
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

  // Renamed for clarity, passed directly to ConfigPanel
  // const handleManualFetch = () => {
  //   fetchDonations();
  // };

  // --- Render ---
  return (
    <div className="bg-background text-text m-0 p-0 overflow-hidden w-[1920px] h-[1080px]">
      <div ref={pageContainerRef} className="page-container">
        <div ref={confettiContainerRef} className="confetti-container"></div>

        {/* Goal Reached Overlay */}
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

        {/* Donation Popup */}
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

        <main className="max-w-7xl mx-auto p-5 flex flex-col h-[calc(100vh-128px-84px)]"> {/* Adjusted height calculation if needed */}
          <div className="flex flex-grow mt-8 gap-6"> {/* Added gap */}
            {/* QR Code Section with consistent styling */}
            <div className="flex-1 flex flex-col mr-6 bg-white rounded-xl p-8 shadow-lg border-t-4 border-[#4a2683]">
              <QRCodeSection qrCodeUrl="https://www.kerkemst.nl/wp-content/uploads/2025/04/qr-actieavond-1.png" />
            </div>

            {/* Thermometer Display with consistent styling */}
            <div className="flex-grow flex-2 flex flex-col items-center bg-white rounded-xl p-8 shadow-lg">
              <ThermometerDisplay currentAmount={currentAmount} goalAmount={goalAmount} />
            </div>

            {/* Donation List with consistent styling */}
            <div className="flex-1 flex flex-col ml-6 bg-white rounded-xl p-8 shadow-lg border-t-4 border-[#f49b28]">
              <DonationList donations={donations} />
            </div>
          </div>
        </main>

        <Footer />

        {/* Configuration Panel Component */}
        <ConfigPanel
          initialApiConfig={apiConfig}
          initialGoalAmount={goalAmount}
          initialRefreshInterval={refreshInterval}
          initialDonationField={donationField}
          onSaveConfig={handleSaveConfig}
          onTestConnection={handleTestConnection}
          onAddDonation={addDonation} // Pass the main addDonation function
          onReset={handleReset} // Pass the reset handler
          onFetchDonations={fetchDonations} // Pass the fetch handler
          apiStatus={apiStatus}
        />
      </div>
    </div>
  );
}

export default App;