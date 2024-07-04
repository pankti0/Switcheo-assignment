import React, { useEffect, useState } from 'react';
import axios from 'axios';

const tokenPricesUrl = 'https://interview.switcheo.com/prices.json';

const fetchTokenPrices = async () => {
  const response = await axios.get(tokenPricesUrl);
  return response.data;
};

const BlockchainModal = ({ isOpen, onClose, onSelectBlockchain }) => {
  const blockchains = ['Ethereum', 'Binance Smart Chain', 'Solana']; // Example blockchains

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

const Hero = () => {
  const [tokenPrices, setTokenPrices] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [fromToken, setFromToken] = useState('');
  const [toToken, setToToken] = useState('');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedBlockchain, setSelectedBlockchain] = useState('');

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
        console.log(uniquePrices); // Log the unique prices
        setTokenPrices(uniquePrices);
        setIsLoading(false);
      } catch (error) {
        setError('Failed to fetch token prices');
        setIsLoading(false);
      }
    };
    getTokenPrices();
  }, []);

  const handleFromTokenChange = (e) => {
    setFromToken(e.target.value);
    setToAmount('');
    setError('');
  };

  const handleAmountChange = (e) => {
    setFromAmount(e.target.value);
    setToAmount('');
    setError('');
  };

  const handleToTokenChange = (e) => {
    setToToken(e.target.value);
    calculateToAmount(e.target.value, fromAmount);
  };

  const calculateToAmount = (toToken, fromAmount) => {
    if (!fromToken || !toToken || !fromAmount) {
      setError('All fields are required');
      return;
    }

    const fromPrice = tokenPrices[fromToken];
    const toPrice = tokenPrices[toToken];

    if (!fromPrice || !toPrice) {
      setError('Invalid token selection');
      return;
    }

    const calculatedToAmount = (fromAmount * fromPrice) / toPrice;
    setToAmount(calculatedToAmount);
    setError('');
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleBlockchainSelect = (blockchain) => {
    setSelectedBlockchain(blockchain);
    // Perform actions related to the selected blockchain
    // For example, set state or trigger further actions
  };

  const handleNumberChoice = () => {
    alert('Choose a number for the amount in the form.'); // Simple alert box for demonstration
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="font-sans">

      <form className="max-w-md mx-auto p-6 border shadow-md bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
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
        {fromToken && (
          <div className="mb-4">
            <label className="block mb-2">Amount:</label>
            <input
              className="w-full p-2 bg-black text-white border rounded"
              type="number"
              value={fromAmount}
              onChange={handleAmountChange}
              onClick={handleNumberChoice} // Open popup for number choice
            />
          </div>
        )}
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
        <button
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4"
          type="button"
          onClick={openModal}
        >
          Connect Wallet
        </button>
      </form>

      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      {toAmount && (
        <p className="mt-4 text-center text-4xl animate-pulse">
          You will receive: <span className="text-blue-600">{toAmount} {toToken}</span>
        </p>
      )}

      <BlockchainModal isOpen={showModal} onClose={closeModal} onSelectBlockchain={handleBlockchainSelect} />
    </div>
  );
};

export default Hero;
