
import React from 'react';
import FinancialDashboard from './FinancialDashboard';
import ExpenseManagement from './ExpenseManagement';
import FixedExpenseManagement from './FixedExpenseManagement';
import RevenueManagement from './RevenueManagement';
import BankStatementImport from './BankStatementImport';
import SoftwareManagement from './SoftwareManagement';
import FinancialSettings from './FinancialSettings';

interface FinancialManagementProps {
  activeSubTab: string;
}

const FinancialManagement: React.FC<FinancialManagementProps> = ({ activeSubTab }) => {
  const renderContent = () => {
    switch (activeSubTab) {
      case 'financial':
        return <FinancialDashboard />;
      case 'revenues':
        return <RevenueManagement />;
      case 'expenses':
        return <ExpenseManagement />;
      case 'fixed-expenses':
        return <FixedExpenseManagement />;
      case 'bank-statements':
        return <BankStatementImport />;
      case 'software':
        return <SoftwareManagement />;
      case 'financial-config':
        return <FinancialSettings />;
      default:
        return <FinancialDashboard />;
    }
  };

  return <div className="container mx-auto px-4 py-6">{renderContent()}</div>;
};

export default FinancialManagement;
