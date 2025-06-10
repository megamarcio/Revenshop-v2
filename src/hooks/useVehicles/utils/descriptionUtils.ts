
// Helper function to extract extended category from description
export const extractExtendedCategory = (description: string): 'rental' | 'maintenance' | 'consigned' | null => {
  const match = description?.match(/\[CATEGORY:([^\]]+)\]/);
  if (!match) return null;
  
  const category = match[1];
  // Only return valid extended categories
  if (category === 'rental' || category === 'maintenance' || category === 'consigned') {
    return category;
  }
  
  return null;
};

// Helper function to extract consignment store from description
export const extractConsignmentStore = (description: string): string => {
  const match = description?.match(/\[STORE:([^\]]+)\]/);
  return match ? match[1] : '';
};

// Helper function to clean description from metadata
export const cleanDescription = (description: string): string => {
  if (!description) return '';
  return description
    .replace(/\[CATEGORY:[^\]]+\]\s*/, '')
    .replace(/\[STORE:[^\]]+\]\s*/, '')
    .trim();
};
