
import { FinancingData, CalculationResults } from '../types';

export const calculateFinancing = (financingData: FinancingData): CalculationResults => {
  const {
    vehiclePrice,
    downPayment,
    interestRate,
    installments,
    dealerFee,
    taxRate,
    registrationFee,
    otherFees
  } = financingData;

  // Cálculos
  const downPaymentAmount = downPayment; // Já é valor absoluto
  const totalTaxes = (vehiclePrice * taxRate) / 100;
  const totalFees = dealerFee + registrationFee + otherFees;
  const financedAmount = vehiclePrice - downPaymentAmount + totalTaxes + totalFees;
  
  // Converter taxa anual para mensal
  const monthlyInterestRate = interestRate / 100 / 12;
  
  // Fórmula de pagamento mensal com juros compostos
  const monthlyPayment = financedAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, installments)) / (Math.pow(1 + monthlyInterestRate, installments) - 1);
  
  const totalAmount = downPaymentAmount + (monthlyPayment * installments);

  return {
    downPaymentAmount,
    financedAmount,
    totalTaxes,
    totalFees,
    totalLoanAmount: financedAmount,
    monthlyPayment,
    totalAmount
  };
};
