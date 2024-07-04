import React, { useEffect, useMemo, useState } from 'react';
import { BoxProps } from '@mui/material';
import useWalletBalances from '../hooks/useWalletBalance';
import WalletRow from './WalletRow';

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}

// interface FormattedWalletBalance extends WalletBalance {
//   formatted: string;
// }

class Datasource {
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  async getPrices(): Promise<Record<string, number>> {
    const response = await fetch(this.url);
    if (!response.ok) {
      throw new Error('Failed to fetch prices');
    }
    return response.json();
  }
}

interface Props extends BoxProps {}

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const [prices, setPrices] = useState<Record<string, number>>({});

  useEffect(() => {
    const datasource = new Datasource("https://interview.switcheo.com/prices.json");
    datasource.getPrices()
      .then(setPrices)
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const getPriority = (blockchain: string): number => {
    switch (blockchain) {
      case 'Osmosis': return 100;
      case 'Ethereum': return 50;
      case 'Arbitrum': return 30;
      case 'Zilliqa': return 20;
      case 'Neo': return 20;
      default: return -99;
    }
  }

  const sortedBalances = useMemo(() => {
    return balances
      .filter(balance => getPriority(balance.blockchain) > -99 && balance.amount > 0)
      .sort((lhs, rhs) => getPriority(rhs.blockchain) - getPriority(lhs.blockchain));
  }, [balances]);

  const formattedBalances = useMemo(() => {
    return sortedBalances.map(balance => ({
      ...balance,
      formatted: balance.amount.toFixed(2)
    }));
  }, [sortedBalances]);

  const rows = useMemo(() => {
    return formattedBalances.map((balance, index) => {
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow 
          className="row"
          key={index}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    });
  }, [formattedBalances, prices]);

  return (
    <div {...rest as React.HTMLAttributes<HTMLDivElement>}>
      {rows}
    </div>
  );
}

export default WalletPage;
