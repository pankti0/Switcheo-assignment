import React from 'react';
import { WalletBalance } from '../types/wallet';

interface WalletRowProps {
  amount: number;
  usdValue: number;
  formattedAmount: string;
  blockchain: string;
  currency: string;
}

const WalletRow: React.FC<WalletRowProps> = ({
  amount,
  usdValue,
  formattedAmount,
  blockchain,
  currency
}) => {
  return (
    <div>
      <span>{blockchain}</span>
      <span>{currency}</span>
      <span>{formattedAmount}</span>
      <span>${usdValue.toFixed(2)}</span>
    </div>
  );
};

export default WalletRow;