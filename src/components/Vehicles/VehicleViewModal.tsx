
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Calendar, Palette, Hash, Eye } from 'lucide-react';

interface Vehicle {
  id: string;
  name: string;
  year: number;
  model: string;
  color: string;
  miles: number;
  vin: string;
  internal_code: string;
  sale_price: number;
  description?: string;
  photos?: string[];
  video?: string;
  category: string;
  title_status?: string;
  title_type?: string;
  created_at: string;
}

interface VehicleViewModalProps {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
}

const VehicleViewModal = ({ vehicle, isOpen, onClose }: VehicleViewModalProps) => {
  if (!vehicle) return null;

  const handleDownloadPhoto = (photoUrl: string, index: number) => {
    const link = document.createElement('a');
    link.href = photoUrl;
    link.download = `${vehicle.name}_${vehicle.year}_foto_${index + 1}.jpg`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getTitleStatusLabel = (status?: string) => {
    switch (status) {
      case 'em-maos': return 'Em Mãos';
      case 'em-transito': return 'Em Trânsito';
      default: return status || 'Não informado';
    }
  };

  const getTitleTypeLabel = (type?: string) => {
    switch (type) {
      case 'clean-title': return 'Clean Title';
      case 'rebuilt': return 'Rebuilt';
      default: return type || 'Não informado';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'forSale': return 'À Venda';
      case 'sold': return 'Vendido';
      default: return category;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'forSale': return 'bg-green-100 text-green-800';
      case 'sold': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <Eye className="h-5 w-5" />
            <span>Visualizar Veículo</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{vehicle.year} {vehicle.name}</h2>
                  <p className="text-lg text-gray-600">{vehicle.model}</p>
                </div>
                <Badge className={getCategoryColor(vehicle.category)}>
                  {getCategoryLabel(vehicle.category)}
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <Palette className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Cor</p>
                    <p className="text-sm text-gray-600">{vehicle.color}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Hash className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Milhas</p>
                    <p className="text-sm text-gray-600">{vehicle.miles.toLocaleString()}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-900">VIN</p>
                  <p className="text-sm text-gray-600 font-mono">{vehicle.vin}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-900">Código Interno</p>
                  <p className="text-sm text-gray-600">{vehicle.internal_code}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-900">Status do Título</p>
                  <p className="text-sm text-gray-600">{getTitleStatusLabel(vehicle.title_status)}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-900">Tipo do Título</p>
                  <p className="text-sm text-gray-600">{getTitleTypeLabel(vehicle.title_type)}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-900">Preço de Venda</p>
                  <p className="text-lg font-bold text-green-600">
                    ${vehicle.sale_price.toLocaleString('en-US')}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Cadastrado em</p>
                    <p className="text-sm text-gray-600">
                      {new Date(vehicle.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Descrição */}
          {vehicle.description && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Descrição</h3>
                <p className="text-gray-600 whitespace-pre-wrap">{vehicle.description}</p>
              </CardContent>
            </Card>
          )}

          {/* Fotos */}
          {vehicle.photos && vehicle.photos.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Fotos do Veículo</h3>
                  <p className="text-sm text-gray-500">{vehicle.photos.length} foto(s)</p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {vehicle.photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={photo}
                        alt={`${vehicle.name} - Foto ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => window.open(photo, '_blank')}
                      />
                      <Button
                        size="sm"
                        variant="secondary"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleDownloadPhoto(photo, index)}
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Vídeo */}
          {vehicle.video && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Vídeo do Veículo</h3>
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <a
                    href={vehicle.video}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Visualizar Vídeo
                  </a>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleViewModal;
