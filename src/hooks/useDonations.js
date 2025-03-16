import { useState, useEffect } from 'react';

const useDonations = () => {
  const [donations, setDonations] = useState([]);
  const [currentAmount, setCurrentAmount] = useState(0);
  const [goalAmount, setGoalAmount] = useState(4000);
  const [goalReached, setGoalReached] = useState(false);

  useEffect(() => {
    const savedDonations = JSON.parse(localStorage.getItem('donations')) || [];
    const savedCurrentAmount = parseInt(localStorage.getItem('currentAmount')) || 0;
    const savedGoalAmount = parseInt(localStorage.getItem('goalAmount')) || 4000;
    const savedGoalReached = JSON.parse(localStorage.getItem('goalReached')) || false;

    setDonations(savedDonations);
    setCurrentAmount(savedCurrentAmount);
    setGoalAmount(savedGoalAmount);
    setGoalReached(savedGoalReached);
  }, []);

  useEffect(() => {
    localStorage.setItem('donations', JSON.stringify(donations));
    localStorage.setItem('currentAmount', currentAmount);
    localStorage.setItem('goalAmount', goalAmount);
    localStorage.setItem('goalReached', goalReached);
  }, [donations, currentAmount, goalAmount, goalReached]);

  const addDonation = (amount, date = null, time = null) => {
    const now = new Date();
    const donation = {
      amount: amount,
      date: date || now.toLocaleDateString('nl-NL'),
      time: time || now.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })
    };

    setDonations(prevDonations => {
      const newDonations = [donation, ...prevDonations];
      if (newDonations.length > 8) {
        newDonations.pop();
      }
      return newDonations;
    });

    setCurrentAmount(prevAmount => {
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

  return {
    donations,
    addDonation,
    resetDonations,
    goalReached,
    currentAmount,
    goalAmount,
    setGoalAmount
  };
};

export { useDonations };
