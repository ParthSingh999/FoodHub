import { Link } from "react-router-dom";
import { ratingTone, priceRangeLabel } from "../utils/helpers.js";
import { useFavorites } from "../context/FavoritesContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import "./RestaurantCard.css";

export default function RestaurantCard({ restaurant }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const toast = useToast();
  const fav = isFavorite(restaurant.id);

  const handleFav = (e) => {
    e.preventDefault(); e.stopPropagation();
    toggleFavorite(restaurant.id);
    toast(fav ? `${restaurant.name} removed from favorites` : `${restaurant.name} added to favorites`, fav ? "info" : "success");
  };

  return (
    <Link to={`/restaurant/${restaurant.id}`} className="rest-card fade-up">
      <div className="rest-card-media">
        <img src={restaurant.image} alt={restaurant.name} loading="lazy" />
        {restaurant.promoted && <span className="rest-promoted">PROMOTED</span>}
        <button className={`rest-fav ${fav ? "active" : ""}`} onClick={handleFav} aria-label={fav ? "Remove from favorites" : "Add to favorites"}>
          {fav ? "♥" : "♡"}
        </button>
        {restaurant.offer && <span className="rest-offer">🎉 {restaurant.offer}</span>}
      </div>
      <div className="rest-card-body">
        <h3 className="rest-name">{restaurant.name}</h3>
        <p className="rest-cuisine">{restaurant.cuisine.join(", ")}</p>
        <div className="rest-card-meta">
          <span className={`badge badge-${ratingTone(restaurant.rating)}`}>★ {restaurant.rating}</span>
          <span className="rest-dot">•</span>
          <span className="rest-time">{restaurant.deliveryTime}</span>
          <span className="rest-dot">•</span>
          <span className="rest-price">{priceRangeLabel(restaurant.priceRange)} · ${restaurant.priceForTwo} for two</span>
        </div>
        <p className="rest-loc">📍 {restaurant.location}</p>
      </div>
    </Link>
  );
}
