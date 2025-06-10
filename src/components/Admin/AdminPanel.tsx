
import React from 'react';
import ConfigurationsPanel from './ConfigurationsPanel';

interface AdminPanelProps {
  onNavigateToUsers: () => void;
}

const AdminPanel = ({ onNavigateToUsers }: AdminPanelProps) => {
  return <ConfigurationsPanel onNavigateToUsers={onNavigateToUsers} />;
};

export default AdminPanel;
