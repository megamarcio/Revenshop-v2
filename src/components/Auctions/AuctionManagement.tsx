
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Search } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import AuctionList from './AuctionList';
import AuctionForm from './AuctionForm';
import VinConsultation from './VinConsultation';

const AuctionManagement = () => {
  const { t } = useLanguage();
  const { canEditVehicles } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingAuction, setEditingAuction] = useState(null);
  const [submenu, setSubmenu] = useState<'none'|'vinConsult' >('none');

  const handleAddAuction = () => {
    setEditingAuction(null);
    setShowForm(true);
    setSubmenu('none');
  };

  const handleEditAuction = (auction: any) => {
    setEditingAuction(auction);
    setShowForm(true);
    setSubmenu('none');
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingAuction(null);
    setSubmenu('none');
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

  if (submenu === 'vinConsult') {
    return (
      <div className="p-6">
        <Button
          onClick={() => setSubmenu('none')}
          variant="outline"
          className="mb-4"
        >
          Voltar
        </Button>
        <VinConsultation />
      </div>
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
            <div className="flex flex-row gap-2">
              <Button
                onClick={() => setSubmenu('vinConsult')}
                variant="secondary"
                className="flex items-center"
                title="Abrir consulta de VIN"
              >
                <Search className="w-4 h-4 mr-2" />
                Consulta VIN
              </Button>
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
