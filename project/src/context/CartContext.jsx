import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { useToast } from "./ToastContext.jsx";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const toast = useToast();
  const [items, setItems] = useState(() => JSON.parse(localStorage.getItem("fh_cart") || "[]"));

  useEffect(() => { localStorage.setItem("fh_cart", JSON.stringify(items)); }, [items]);

  const addItem = (food, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === food.id);
      if (existing) return prev.map((i) => (i.id === food.id ? { ...i, qty: i.qty + qty } : i));
      return [...prev, { ...food, qty }];
    });
    toast(`${food.name} added to cart`, "success");
  };

  const increment = (id) => setItems((p) => p.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i)));
  const decrement = (id) => setItems((p) => p.map((i) => (i.id === id ? { ...i, qty: Math.max(0, i.qty - 1) } : i)));
  const removeItem = (id) => setItems((p) => p.filter((i) => i.id !== id));
  const clearCart = () => setItems([]);

  const { count, subtotal } = useMemo(
    () => items.reduce((a, i) => { a.count += i.qty; a.subtotal += i.qty * i.price; return a; }, { count: 0, subtotal: 0 }),
    [items]
  );
  const deliveryFee = items.length === 0 ? 0 : 2.99;
  const tax = +(subtotal * 0.05).toFixed(2);
  const total = +(subtotal + deliveryFee + tax).toFixed(2);

  return (
    <CartContext.Provider value={{ items, addItem, increment, decrement, removeItem, clearCart, count, subtotal: +subtotal.toFixed(2), deliveryFee, tax, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
