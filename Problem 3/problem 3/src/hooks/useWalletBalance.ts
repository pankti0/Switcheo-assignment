import { useState, useEffect } from 'react';
import { WalletBalance } from '../types/wallet';

export const useWalletBalances = (): WalletBalance[] => {
  const [balances, setBalances] = useState<WalletBalance[]>([]);

  useEffect(() => {
    // Simulating API call
    const fetchBalances = async () => {
      // Replace this with actual API call
      const mockBalances: WalletBalance[] = [
        { currency: 'ETH', amount: 0.5, blockchain: 'Ethereum' },
        { currency: 'OSMO', amount: 100, blockchain: 'Osmosis' },
        { currency: 'ARB', amount: 50, blockchain: 'Arbitrum' },
        { currency: 'ZIL', amount: 1000, blockchain: 'Zilliqa' },
      ];
      setBalances(mockBalances);
    };

    fetchBalances();
  }, []);

  return balances;
};