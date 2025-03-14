async function fetchDonationAmount() {
    try {
        const response = await fetch('https://api.example.com/donations/total');
        const data = await response.json();
        updateThermometer(data.total);
    } catch (error) {
        console.error('Error fetching donation amount:', error);
    }
}

function updateThermometer(amount) {
    const thermometer = document.getElementById('thermometer');
    const height = (amount / 4000) * 100;
    thermometer.style.setProperty('--thermometer-height', `${height}%`);
}

async function fetchRecentDonations() {
    try {
        const response = await fetch('https://api.example.com/donations/recent');
        const data = await response.json();
        updateRecentDonations(data.donations);
    } catch (error) {
        console.error('Error fetching recent donations:', error);
    }
}

function updateRecentDonations(donations) {
    const recentDonations = document.getElementById('recent-donations');
    recentDonations.innerHTML = '';
    donations.forEach(donation => {
        const donationElement = document.createElement('div');
        donationElement.textContent = `${donation.name}: €${donation.amount}`;
        recentDonations.appendChild(donationElement);
    });
}

function displayConfetti() {
    const confetti = document.createElement('div');
    confetti.classList.add('confetti');
    document.body.appendChild(confetti);
    setTimeout(() => {
        confetti.remove();
    }, 2000);
}

function displayNotification(donation) {
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.textContent = `New donation from ${donation.name}: €${donation.amount}`;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

setInterval(fetchDonationAmount, 5000);
setInterval(fetchRecentDonations, 5000);
