import React, { useState, useEffect, useMemo } from 'react';
import { BoxProps } from '@mui/material';
import WalletRow from './WalletRow';
import { useWalletBalances } from '../hooks/useWalletBalance';
import { WalletBalance, FormattedWalletBalance } from '../types/wallet';

class Datasource {
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  async getPrices(): Promise<Record<string, number>> {
    try {
      const response = await fetch(this.url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching prices:", error);
      throw error;
    }
  }
}

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const [prices, setPrices] = useState<Record<string, number>>({});

  useEffect(() => {
    const datasource = new Datasource("https://interview.switcheo.com/prices.json");
    datasource.getPrices()
      .then(setPrices)
      .catch(error => {
        console.error("Error setting prices:", error);
      });
  }, []);

  const getPriority = (blockchain: string): number => {
    switch (blockchain) {
      case 'Osmosis':
        return 100;
      case 'Ethereum':
        return 50;
      case 'Arbitrum':
        return 30;
      case 'Zilliqa':
      case 'Neo':
        return 20;
      default:
        return -99;
    }
  };

  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        return balancePriority > -99 && balance.amount > 0;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        if (leftPriority >= rightPriority) {
          return -1;
        } else {
          return 1;
        }
      });
  }, [balances]);

  const formattedBalances: FormattedWalletBalance[] = sortedBalances.map((balance: WalletBalance) => ({
    ...balance,
    formatted: balance.amount.toFixed(2)
  }));

  const rows = formattedBalances.map((balance: FormattedWalletBalance, index: number) => {
    const usdValue = (prices[balance.currency] || 0) * balance.amount;
    return (
      <WalletRow 
        key={index}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
        blockchain={balance.blockchain}
        currency={balance.currency}
      />
    );
  });

  return (
    <div {...rest}>
      {rows}
    </div>
  );
};

export default WalletPage;