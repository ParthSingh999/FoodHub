import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import FilterBar from "../components/FilterBar.jsx";
import RestaurantCard from "../components/RestaurantCard.jsx";
import SearchBar from "../components/SearchBar.jsx";
import { CardSkeleton } from "../components/Loader.jsx";
import { restaurants } from "../data/restaurants.js";
import { foodItems } from "../data/foodItems.js";
import "./Restaurants.css";

export default function Restaurants() {
  const [params] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});

  const query = params.get("q") || "";
  const searchType = params.get("type") || "restaurants";
  const cat = params.get("cat");

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    return restaurants.filter((r) => {
      if (cat) {
        const catMatch = r.cuisine.some((c) => c.toLowerCase().includes(cat.toLowerCase()));
        if (!catMatch) return false;
      }
      if (query) {
        const q = query.toLowerCase();
        if (searchType === "dishes") {
          const hasDish = foodItems.some((f) => f.restaurantId === r.id && f.name.toLowerCase().includes(q));
          if (!hasDish) return false;
        } else if (searchType === "locations") {
          if (!r.location.toLowerCase().includes(q)) return false;
        } else {
          const matches = r.name.toLowerCase().includes(q) || r.cuisine.some((c) => c.toLowerCase().includes(q)) || r.location.toLowerCase().includes(q);
          if (!matches) return false;
        }
      }
      if (filters.minRating && r.rating < filters.minRating) return false;
      if (filters.maxPrice && r.priceRange !== filters.maxPrice) return false;
      if (filters.cuisine && !r.cuisine.includes(filters.cuisine)) return false;
      if (filters.maxTime) {
        const max = Number(r.deliveryTime.split("-").pop());
        if (max > filters.maxTime) return false;
      }
      return true;
    });
  }, [query, searchType, cat, filters]);

  return (
    <div className="container restaurants-page">
      <div className="restaurants-head">
        <h1>Restaurants</h1>
        <p>{loading ? "Loading…" : `${filtered.length} restaurants found`}{query && <> for “{query}”</>}</p>
        <div className="restaurants-search"><SearchBar variant="inline" /></div>
      </div>
      <div className="restaurants-layout">
        <FilterBar value={filters} onChange={setFilters} resultCount={filtered.length} />
        <div className="restaurants-results">
          {loading ? (
            <div className="grid grid-3">{Array.from({ length: 6 }).map((_, i) => (<CardSkeleton key={i} />))}</div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <span className="empty-emoji">🍽️</span>
              <h3>No restaurants match your filters</h3>
              <p>Try adjusting your search or clearing the filters.</p>
              <button className="btn btn-primary" onClick={() => setFilters({})}>Clear filters</button>
            </div>
          ) : (
            <div className="grid grid-3">{filtered.map((r) => (<RestaurantCard key={r.id} restaurant={r} />))}</div>
          )}
        </div>
      </div>
    </div>
  );
}
