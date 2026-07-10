export const formatPrice = (n) => `$${Number(n).toFixed(2)}`;
export const ratingTone = (r) => (r >= 4.5 ? "green" : r >= 4.0 ? "amber" : "red");
export const priceRangeLabel = (n) => "$".repeat(n || 1);
export const saveOrder = (order) => {
  const all = JSON.parse(localStorage.getItem("fh_orders") || "[]");
  all.unshift(order);
  localStorage.setItem("fh_orders", JSON.stringify(all));
};
export const getOrders = () => JSON.parse(localStorage.getItem("fh_orders") || "[]");
export const saveAddress = (addr) => localStorage.setItem("fh_address", JSON.stringify(addr));
export const getAddress = () => { const r = localStorage.getItem("fh_address"); return r ? JSON.parse(r) : null; };
