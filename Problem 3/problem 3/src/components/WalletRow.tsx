import React from 'react';

interface WalletRowProps {
  className: string;
  amount: number;
  usdValue: number;
  formattedAmount: string;
}

const WalletRow: React.FC<WalletRowProps> = ({ className, usdValue, formattedAmount }) => {
  return (
    <div className={className}>
      <div>Amount: {formattedAmount}</div>
      <div>USD Value: {usdValue.toFixed(2)}</div>
    </div>
  );
}

export default WalletRow;
