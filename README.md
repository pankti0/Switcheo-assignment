## Problem 1
Find solution inside Problem 1/Problem 1.along with my analysis of the 3 implementations and some test logs.

## Problem 2
I have used vite+react hence clone the code found under the Problem 2 folder. Then use npm run dev to view the website on your local server.

## Problem 3
The computational inefficiencies and anti-patterns found along with their improvements are as follows:
1. The error is logged to the console using console.err, which is not a standard method.
Improvement: Use console.error for logging errors and consider implementing proper error handling and display.
2. There is an inconsistency in the implementation of sortedBalances the if conditional is used wrongly it return true for a blockchain with prioritty > -99 if it has negative balance. Instead it should have been
   if (lhsPriority > -99) {
		     if (balance.amount > 0) {
		       return true;
		     }
		  }
3. Another discrepancy is in the .sort here we make a customised sort criteria however the if conditional comparing the leftPriority and rightPriority doesnt account for the equality case. We can improve the code to as follows:
.sort((lhs: WalletBalance, rhs: WalletBalance) => {
			const leftPriority = getPriority(lhs.blockchain);
		  const rightPriority = getPriority(rhs.blockchain);
		  if (leftPriority >= rightPriority) {
		    return -1;
		  } else if (rightPriority > leftPriority) {
		    return 1;
		  }
    });
4. In the provided interfaces WalletBalance and FormattedWalletBalance, there is no blockchain attribute defined. The interfaces only include currency and amount (and formatted for FormattedWalletBalance). 
However, the code uses balance.blockchain in several places:
In the getPriority function: getPriority(balance.blockchain)
In the sortedBalances useMemo hook: getPriority(lhs.blockchain) and getPriority(rhs.blockchain)
This discrepancy indicates a mismatch between the defined interface and the actual structure of the data being used in the component.
To resolve this issue, the WalletBalance interface should be updated to include the blockchain attribute
