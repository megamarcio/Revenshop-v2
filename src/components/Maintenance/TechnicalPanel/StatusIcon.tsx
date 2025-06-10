
import React from 'react';
import { CheckCircle, Clock, AlertTriangle, XCircle } from 'lucide-react';

interface StatusIconProps {
  status: string;
}

const StatusIcon = ({ status }: StatusIconProps) => {
  switch (status) {
    case 'em-dia': return <CheckCircle className="h-3 w-3" />;
    case 'proximo-troca': return <Clock className="h-3 w-3" />;
    case 'trocar': return <AlertTriangle className="h-3 w-3" />;
    default: return <XCircle className="h-3 w-3" />;
  }
};

export default StatusIcon;
