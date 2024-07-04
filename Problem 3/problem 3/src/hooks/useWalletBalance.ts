import { useState, useEffect } from 'react';

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}

const useWalletBalances = (): WalletBalance[] => {
  const [balances, setBalances] = useState<WalletBalance[]>([]);

  useEffect(() => {
    // Mock fetching wallet balances
    const mockBalances: WalletBalance[] = [
      { currency: 'USD', amount: 1000, blockchain: 'Ethereum' },
      { currency: 'BTC', amount: 2, blockchain: 'Osmosis' },
      { currency: 'ETH', amount: 5, blockchain: 'Arbitrum' },
    ];
    setBalances(mockBalances);
  }, []);

  return balances;
}

export default useWalletBalances;
