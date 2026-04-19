export function formatPKR(amount) {
  return new Intl.NumberFormat('ur-PK', { style: 'currency', currency: 'PKR' }).format(amount);
}