
export interface FinancingData {
  vehicle?: any;
  customer?: any;
  vehiclePrice: number;
  downPayment: number;
  interestRate: number;
  installments: number;
  dealerFee: number;
  taxRate: number;
  registrationFee: number;
  otherFees: number;
  otherFeesDescription: string;
}

export interface CalculationResults {
  downPaymentAmount: number;
  financedAmount: number;
  totalTaxes: number;
  totalFees: number;
  totalLoanAmount: number;
  monthlyPayment: number;
  totalAmount: number;
}
