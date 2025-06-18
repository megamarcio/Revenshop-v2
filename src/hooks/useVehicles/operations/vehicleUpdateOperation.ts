
import { supabase } from '@/integrations/supabase/client';
import { mapFormToDbData } from '../utils/formToDbMapper';

export const updateVehicle = async (vehicleData: any) => {
  console.log('updateVehicle - input vehicleData:', vehicleData);
  
  if (!vehicleData || !vehicleData.id) {
    console.error('updateVehicle - Vehicle ID is missing:', vehicleData);
    throw new Error('Vehicle ID is required for update');
  }

  const vehicleId = vehicleData.id;
  console.log('updateVehicle - extracted vehicleId:', vehicleId);

  // Map form data to database format
  const dbVehicleData = mapFormToDbData(vehicleData);
  
  console.log('updateVehicle - mapped dbVehicleData:', dbVehicleData);
  console.log('updateVehicle - category field being sent:', dbVehicleData.category);

  const { data, error } = await supabase
    .from('vehicles')
    .update(dbVehicleData)
    .eq('id', vehicleId)
    .select()
    .single();

  if (error) {
    console.error('Supabase error updating vehicle:', error);
    throw error;
  }

  console.log('Vehicle updated successfully:', data);

  // Handle photos update if provided
  if (vehicleData.photos) {
    console.log('Updating vehicle photos:', vehicleData.photos);
    
    // First, delete existing photos
    await supabase
      .from('vehicle_photos')
      .delete()
      .eq('vehicle_id', vehicleId);

    // Then insert new photos
    if (vehicleData.photos.length > 0) {
      const photoInserts = vehicleData.photos.map((url: string, index: number) => ({
        vehicle_id: vehicleId,
        url: url,
        position: index,
        is_main: index === 0
      }));

      const { error: photoError } = await supabase
        .from('vehicle_photos')
        .insert(photoInserts);

      if (photoError) {
        console.error('Error updating vehicle photos:', photoError);
      } else {
        console.log('Vehicle photos updated successfully');
      }
    }
  }

  // Handle sale record creation if vehicle is marked as sold
  if (vehicleData.category === 'sold' && vehicleData.selectedCustomer) {
    console.log('Creating sale record for sold vehicle');
    
    try {
      // Create sale record
      const saleData = {
        vehicle_id: vehicleId,
        customer_name: vehicleData.customerName,
        customer_phone: vehicleData.customerPhone,
        final_sale_price: parseFloat(vehicleData.finalSalePrice),
        sale_date: vehicleData.saleDate,
        seller_id: vehicleData.created_by, // Assuming current user is seller
        payment_method: vehicleData.paymentMethod,
        financing_company: vehicleData.financingCompany,
        check_details: vehicleData.checkDetails,
        other_payment_details: vehicleData.otherPaymentDetails,
        seller_commission: vehicleData.sellerCommission ? parseFloat(vehicleData.sellerCommission) : null,
        sale_notes: vehicleData.saleNotes
      };

      const { data: saleRecord, error: saleError } = await supabase
        .from('sales')
        .insert(saleData)
        .select()
        .single();

      if (saleError) {
        console.error('Error creating sale record:', saleError);
      } else {
        console.log('Sale record created successfully:', saleRecord);
      }

      // Create customer deal record
      const dealData = {
        customer_id: vehicleData.selectedCustomer.id,
        vehicle_id: vehicleId,
        seller_id: vehicleData.created_by,
        deal_type: 'sale',
        status: 'completed',
        total_amount: parseFloat(vehicleData.finalSalePrice),
        payment_method: vehicleData.paymentMethod,
        deal_details: {
          vehicle_sale: {
            final_sale_price: parseFloat(vehicleData.finalSalePrice),
            sale_date: vehicleData.saleDate,
            payment_method: vehicleData.paymentMethod,
            financing_company: vehicleData.financingCompany,
            seller_commission: vehicleData.sellerCommission ? parseFloat(vehicleData.sellerCommission) : null,
            sale_notes: vehicleData.saleNotes
          },
          customer_info: {
            name: vehicleData.customerName,
            phone: vehicleData.customerPhone,
            email: vehicleData.selectedCustomer.email
          }
        }
      };

      const { data: dealRecord, error: dealError } = await supabase
        .from('customer_deals')
        .insert(dealData)
        .select()
        .single();

      if (dealError) {
        console.error('Error creating customer deal:', dealError);
      } else {
        console.log('Customer deal created successfully:', dealRecord);
      }

    } catch (error) {
      console.error('Error creating sale/deal records:', error);
      // Don't throw error here, as vehicle update was successful
    }
  }

  return data;
};
