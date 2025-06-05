
export interface VehicleFormProps {
  onSubmit: (vehicleData: any) => Promise<void>;
  initialData?: any;
}
