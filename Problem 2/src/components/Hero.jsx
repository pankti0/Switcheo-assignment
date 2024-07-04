import React, { useEffect, useState } from 'react';
import axios from 'axios';

const tokenPricesUrl = 'https://interview.switcheo.com/prices.json';

const fetchTokenPrices = async () => {
  const response = await axios.get(tokenPricesUrl);
  return response.data;
};

// Modal component for selecting blockchain
const BlockchainModal = ({ isOpen, onClose, onSelectBlockchain }) => {
  const blockchains = ['Ethereum', 'Binance Smart Chain', 'Solana']; // Example blockchains

  // Handler for selecting a blockchain
  const handleBlockchainSelect = (blockchain) => {
    onSelectBlockchain(blockchain);
    onClose();
  };

  return (
    isOpen && (
      <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-black p-4 rounded shadow-md max-w-md">
          <h2 className="text-lg font-bold mb-4">Choose Blockchain</h2>
          <ul>
            {blockchains.map((blockchain) => (
              <li key={blockchain} className="cursor-pointer py-2 hover:bg-gray-700" onClick={() => handleBlockchainSelect(blockchain)}>
                {blockchain}
              </li>
            ))}
          </ul>
          <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    )
  );
};

// Main Hero component
const Hero = () => {
  // State variables
  const [tokenPrices, setTokenPrices] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [fromToken, setFromToken] = useState('');
  const [toToken, setToToken] = useState('');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedBlockchain, setSelectedBlockchain] = useState('');

  // Fetch token prices on component mount
  useEffect(() => {
    const getTokenPrices = async () => {
      try {
        const prices = await fetchTokenPrices();
        const uniquePrices = {};
        prices.forEach(({ currency, price }) => {
          if (!uniquePrices[currency]) {
            uniquePrices[currency] = price;
          }
        });
        setTokenPrices(uniquePrices); // Set token prices state
        setIsLoading(false); // Mark loading as complete
      } catch (error) {
        setError('Failed to fetch token prices'); // Handle error on fetch failure
        setIsLoading(false); // Mark loading as complete
      }
    };
    getTokenPrices(); // Call the function to fetch token prices
  }, []); // Empty dependency array ensures this effect runs only once on mount

  // Handler for changing 'From Token' selection
  const handleFromTokenChange = (e) => {
    setFromToken(e.target.value); // Update 'From Token' state
    setToAmount(''); // Reset 'To Amount' when token changes
    setError(''); // Clear any previous errors
  };

  // Handler for changing amount input
  const handleAmountChange = (e) => {
    setFromAmount(e.target.value); // Update 'From Amount' state
    setToAmount(''); // Reset 'To Amount' when amount changes
    setError(''); // Clear any previous errors
  };

  // Handler for changing 'To Token' selection
  const handleToTokenChange = (e) => {
    setToToken(e.target.value); // Update 'To Token' state
    calculateToAmount(e.target.value, fromAmount); // Calculate 'To Amount' based on new token selection
  };

  // Calculate 'To Amount' based on 'From Token', 'To Token', and 'From Amount'
  const calculateToAmount = (toToken, fromAmount) => {
    if (!fromToken || !toToken || !fromAmount) {
      setError('All fields are required'); // Display error if any field is missing
      return;
    }

    const fromPrice = tokenPrices[fromToken];
    const toPrice = tokenPrices[toToken];

    if (!fromPrice || !toPrice) {
      setError('Invalid token selection'); // Display error for invalid token selection
      return;
    }

    const calculatedToAmount = (fromAmount * fromPrice) / toPrice; // Perform calculation
    setToAmount(calculatedToAmount); // Update 'To Amount' state
    setError(''); // Clear any previous errors
  };

  // Open modal to connect wallet
  const openModal = () => {
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
  };

  // Handle blockchain selection from modal
  const handleBlockchainSelect = (blockchain) => {
    setSelectedBlockchain(blockchain); // Update selected blockchain state
    // Additional actions related to blockchain selection can be performed here
  };

  // Handle number choice for amount input (placeholder function for demonstration)
  const handleNumberChoice = () => {
    alert('Choose a number for the amount in the form.'); // Simple alert box for demonstration
  };

  // Render loading indicator while fetching data
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Render Hero component
  return (
    <div className="font-sans">
      {/* Token swap form */}
      <form className="max-w-md mx-auto p-6 border shadow-md bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
        {/* Select 'From Token' */}
        <div className="mb-4">
          <label className="block mb-2">From Token:</label>
          <select
            className="w-full p-2 bg-black text-white border rounded"
            value={fromToken}
            onChange={handleFromTokenChange}
          >
            <option value="">Select a token</option>
            {Object.keys(tokenPrices).map((token) => (
              <option key={token} value={token}>
                {token}
              </option>
            ))}
          </select>
        </div>

        {/* Input 'Amount' */}
        {fromToken && (
          <div className="mb-4">
            <label className="block mb-2">Amount:</label>
            <input
              className="w-full p-2 bg-black text-white border rounded"
              type="number"
              value={fromAmount}
              onChange={handleAmountChange}
              onClick={handleNumberChoice} // Placeholder for number choice popup
            />
          </div>
        )}

        {/* Select 'To Token' */}
        {fromToken && fromAmount && (
          <div className="mb-4">
            <label className="block mb-2">To Token:</label>
            <select
              className="w-full p-2 bg-black text-white border rounded"
              value={toToken}
              onChange={handleToTokenChange}
            >
              <option value="">Select a token</option>
              {Object.keys(tokenPrices).map((token) => (
                <option key={token} value={token}>
                  {token}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Button to connect wallet */}
        <button
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4"
          type="button"
          onClick={openModal}
        >
          Connect Wallet
        </button>
      </form>

      {/* Error message display */}
      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

      {/* Display 'To Amount' if calculated */}
      {toAmount && (
        <p className="mt-4 text-center text-4xl animate-pulse">
          You will receive: <span className="text-blue-600">{toAmount} {toToken}</span>
        </p>
      )}

      {/* Blockchain modal for selecting blockchain */}
      <BlockchainModal isOpen={showModal} onClose={closeModal} onSelectBlockchain={handleBlockchainSelect} />
    </div>
  );
};

export default Hero;
