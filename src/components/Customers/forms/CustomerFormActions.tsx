
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '../../../contexts/LanguageContext';

interface CustomerFormActionsProps {
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isSaving: boolean;
}

export const CustomerFormActions = ({ onSubmit, onCancel, isSaving }: CustomerFormActionsProps) => {
  const { t } = useLanguage();

  return (
    <div className="flex space-x-4">
      <Button type="submit" disabled={isSaving} onClick={onSubmit}>
        {isSaving ? t('saving') : t('save')}
      </Button>
      <Button type="button" variant="outline" onClick={onCancel}>
        {t('cancel')}
      </Button>
    </div>
  );
};
