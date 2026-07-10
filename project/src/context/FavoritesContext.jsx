import { createContext, useContext, useEffect, useState } from "react";

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem("fh_favorites") || "[]"));
  useEffect(() => { localStorage.setItem("fh_favorites", JSON.stringify(favorites)); }, [favorites]);
  const toggleFavorite = (id) => setFavorites((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const isFavorite = (id) => favorites.includes(id);
  return <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}
