
export const calculateRemainingInstallments = (totalInstallments: string, paidInstallments: string): string => {
  const total = parseInt(totalInstallments) || 0;
  const paid = parseInt(paidInstallments) || 0;
  const remaining = total - paid;
  return remaining.toString();
};

export const calculateTotalToPay = (remainingInstallments: string, installmentValue: string): string => {
  const remaining = parseInt(remainingInstallments) || 0;
  const installmentVal = parseFloat(installmentValue) || 0;
  const total = remaining * installmentVal;
  return total.toFixed(2);
};

export const calculateInterestRate = (financedAmount: string, installmentValue: string, totalInstallments: string): string => {
  const financedAmt = parseFloat(financedAmount) || 0;
  const installmentVal = parseFloat(installmentValue) || 0;
  const totalInst = parseInt(totalInstallments) || 0;

  if (financedAmt > 0 && installmentVal > 0 && totalInst > 0) {
    const totalPayment = installmentVal * totalInst;
    const monthlyRate = Math.pow(totalPayment / financedAmt, 1.0 / totalInst) - 1;
    // Retorna a taxa anual em percentual (taxa mensal * 12)
    const annualRate = monthlyRate * 12 * 100;
    return annualRate.toFixed(4);
  }
  return '';
};

export const calculateMonthlyRate = (financedAmount: string, installmentValue: string, totalInstallments: string): string => {
  const financedAmt = parseFloat(financedAmount) || 0;
  const installmentVal = parseFloat(installmentValue) || 0;
  const totalInst = parseInt(totalInstallments) || 0;

  if (financedAmt > 0 && installmentVal > 0 && totalInst > 0) {
    const totalPayment = installmentVal * totalInst;
    const monthlyRate = Math.pow(totalPayment / financedAmt, 1.0 / totalInst) - 1;
    return (monthlyRate * 100).toFixed(4);
  }
  return '';
};
