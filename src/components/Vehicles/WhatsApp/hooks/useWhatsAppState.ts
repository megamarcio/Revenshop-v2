
import { useState } from 'react';

export const useWhatsAppState = () => {
  const [sendType, setSendType] = useState<'client' | 'group'>('client');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const resetState = () => {
    setSendType('client');
    setPhoneNumber('');
    setSelectedGroup('');
  };

  return {
    sendType,
    setSendType,
    phoneNumber,
    setPhoneNumber,
    selectedGroup,
    setSelectedGroup,
    isLoading,
    setIsLoading,
    resetState
  };
};
