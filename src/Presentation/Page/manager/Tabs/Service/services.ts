export interface Service {
  id: string;
  name: string;
  icon: string;
  category: 'utilities' | 'office';
}

export const services: Service[] = [
  // Utilities
  { id: 'electricity', name: 'Electricity', icon: '⚡', category: 'utilities' },
  { id: 'water', name: 'Water', icon: '💧', category: 'utilities' },
  { id: 'internet', name: 'Internet', icon: '🌐', category: 'utilities' },
  // Office Services
  { id: 'office-rent', name: 'Office Rent', icon: '🏢', category: 'office' },
  { id: 'cleaning', name: 'Cleaning', icon: '🧹', category: 'office' },
  { id: 'security', name: 'Security', icon: '🔒', category: 'office' },
];
