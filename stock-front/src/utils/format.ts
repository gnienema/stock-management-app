// src/utils/format.ts

// Formate un nombre en FCFA (ex: 10 000 FCFA)
export const formatPrice = (price: number): string => {
  if (isNaN(price)) return '0 FCFA';
  return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
};

// Formate une date (ex: 12/12/2025)
export const formatDate = (dateString: string): string => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('fr-FR');
};