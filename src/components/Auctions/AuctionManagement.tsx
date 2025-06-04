
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import AuctionList from './AuctionList';
import AuctionForm from './AuctionForm';

const AuctionManagement = () => {
  const { t } = useLanguage();
  const { canEditVehicles } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingAuction, setEditingAuction] = useState(null);

  const handleAddAuction = () => {
    setEditingAuction(null);
    setShowForm(true);
  };

  const handleEditAuction = (auction: any) => {
    setEditingAuction(auction);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingAuction(null);
  };

  if (showForm) {
    return (
      <AuctionForm 
        auction={editingAuction}
        onSave={handleCloseForm}
        onCancel={handleCloseForm}
      />
    );
  }

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Leilões
              </CardTitle>
              <p className="text-gray-600">Gerenciar leilões de veículos</p>
            </div>
            {canEditVehicles && (
              <Button 
                onClick={handleAddAuction}
                className="bg-revenshop-primary hover:bg-revenshop-primary/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Leilão
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <AuctionList onEditAuction={handleEditAuction} />
        </CardContent>
      </Card>
    </div>
  );
};

export default AuctionManagement;
