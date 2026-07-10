import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import RestaurantMenu from "../components/RestaurantMenu.jsx";
import Loader from "../components/Loader.jsx";
import { restaurants } from "../data/restaurants.js";
import { foodItems } from "../data/foodItems.js";
import { useFavorites } from "../context/FavoritesContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { ratingTone, priceRangeLabel } from "../utils/helpers.js";
import "./RestaurantDetails.css";

export default function RestaurantDetails() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const { isFavorite, toggleFavorite } = useFavorites();
  const toast = useToast();

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, [id]);

  const restaurant = restaurants.find((r) => r.id === id);
  const menu = useMemo(() => (restaurant ? foodItems.filter((f) => f.restaurantId === restaurant.id) : []), [restaurant]);

  if (loading) return <Loader />;

  if (!restaurant) {
    return (
      <div className="container empty-state" style={{ margin: "60px auto" }}>
        <span className="empty-emoji">🔍</span>
        <h3>Restaurant not found</h3>
        <p>The restaurant you're looking for doesn't exist.</p>
        <Link to="/restaurants" className="btn btn-primary">Browse restaurants</Link>
      </div>
    );
  }

  const fav = isFavorite(restaurant.id);
  const handleFav = () => {
    toggleFavorite(restaurant.id);
    toast(fav ? "Removed from favorites" : "Added to favorites", fav ? "info" : "success");
  };

  return (
    <div className="rd-page">
      <div className="rd-banner">
        <img src={restaurant.image} alt={restaurant.name} />
        <div className="rd-banner-overlay" />
        <div className="container rd-banner-content">
          <Link to="/restaurants" className="rd-back">← All restaurants</Link>
          <h1>{restaurant.name}</h1>
          <p className="rd-cuisine">{restaurant.cuisine.join(" • ")}</p>
          <div className="rd-banner-meta">
            <span className={`badge badge-${ratingTone(restaurant.rating)}`}>★ {restaurant.rating} <small>({restaurant.reviews})</small></span>
            <span>• {restaurant.deliveryTime}</span>
            <span>• {priceRangeLabel(restaurant.priceRange)} · ${restaurant.priceForTwo} for two</span>
          </div>
        </div>
        <button className={`rd-fav ${fav ? "active" : ""}`} onClick={handleFav} aria-label="Toggle favorite">{fav ? "♥" : "♡"}</button>
      </div>

      <div className="container rd-strip">
        <div className="rd-strip-card"><span className="rd-strip-icon">📍</span><div><strong>Location</strong><p>{restaurant.location}</p></div></div>
        <div className="rd-strip-card"><span className="rd-strip-icon">⏱️</span><div><strong>Delivery</strong><p>{restaurant.deliveryTime}</p></div></div>
        <div className="rd-strip-card"><span className="rd-strip-icon">👨‍🍳</span><div><strong>Dishes</strong><p>{menu.length} items on the menu</p></div></div>
        {restaurant.offer && (<div className="rd-strip-card rd-strip-offer"><span className="rd-strip-icon">🎉</span><div><strong>Offer</strong><p>{restaurant.offer}</p></div></div>)}
      </div>

      <div className="container"><RestaurantMenu foods={menu} /></div>
    </div>
  );
}
