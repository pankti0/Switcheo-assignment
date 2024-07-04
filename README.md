## Problem 1
Find solution inside Problem 1\Problem 1.along with my analysis of the 3 implementations and some test logs.

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

### To simplify I made the following changes in the refactor:
Key changes and improvements:

1. Fixed the error logging to use console.error.
2. Corrected the sortedBalances filter logic to properly handle priorities and positive balances.
3. Updated the sort function to handle the equality case for priorities.
4. Added the blockchain attribute to the WalletBalance interface.
5. Implemented the Datasource class with error handling.
6. Used proper TypeScript typing throughout the component.
7. Simplified the formattedBalances calculation.
8. Added null checks for prices when calculating USD value.
9. Added missing props to the WalletRow component.

### Please Note:
#### I have created the components and hooks and all necessary files in order to run the code the refactored code can be found in Problem 3\problem 3\src\components\WalletPage.tsx
