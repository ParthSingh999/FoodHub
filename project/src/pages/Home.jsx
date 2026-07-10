import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import HeroSection from "../components/HeroSection.jsx";
import CategoryCard from "../components/CategoryCard.jsx";
import RestaurantCard from "../components/RestaurantCard.jsx";
import { CardSkeleton } from "../components/Loader.jsx";
import PromoBanner from "../components/PromoBanner.jsx";
import { useCart } from "../context/CartContext.jsx";
import { categories } from "../data/categories.js";
import { restaurants } from "../data/restaurants.js";
import { foodItems } from "../data/foodItems.js";
import "./Home.css";

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  const popular = restaurants.filter((r) => r.rating >= 4.5).slice(0, 8);
  const trending = foodItems.filter((f) => f.popular).slice(0, 10);
  const topRated = [...restaurants].sort((a, b) => b.rating - a.rating).slice(0, 4);
  const { addItem, items } = useCart();
  const inCart = (foodId) => items.some((item) => item.id === foodId);

  return (
    <div className="home">
      <HeroSection />

      <section className="section container">
        <div className="section-head"><div><h2>What's on your mind?</h2><p>Pick a category and dive in</p></div></div>
        <div className="home-cats">{categories.map((c) => (<CategoryCard key={c.id} category={c} />))}</div>
      </section>

      <section className="section container">
        <div className="promo-grid">
          <PromoBanner title="Up to 50% OFF" subtitle="On your first 3 orders this week" cta="Order now" image="https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=900" to="/offers" />
          <PromoBanner title="Free Delivery" subtitle="On every order above $25" cta="Browse restaurants" image="https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=900" to="/restaurants" align="right" />
        </div>
      </section>

      <section className="section container">
        <div className="section-head">
          <div><h2>Popular near you</h2><p>Top-rated restaurants our customers love</p></div>
          <Link to="/restaurants" className="view-all">View all →</Link>
        </div>
        {loading ? (
          <div className="grid grid-4">{Array.from({ length: 8 }).map((_, i) => (<CardSkeleton key={i} />))}</div>
        ) : (
          <div className="grid grid-4">{popular.map((r) => (<RestaurantCard key={r.id} restaurant={r} />))}</div>
        )}
      </section>

      <section className="section container">
        <div className="section-head"><div><h2>Trending dishes</h2><p>What everyone's ordering right now</p></div></div>
        <div className="trending-rail">
          {trending.map((f) => (
            <Link to={`/restaurant/${f.restaurantId}`} key={f.id} className="trending-card">
              <img src={f.image} alt={f.name} loading="lazy" />
              <button
                type="button"
                className="trending-add-btn btn btn-sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  addItem(f, 1);
                }}
              >
                {inCart(f.id) ? "Added" : "Add to cart"}
              </button>
              <div className="trending-info">
                <h4>{f.name}</h4>
                <span className="badge badge-amber">★ {f.rating}</span>
                <p className="trending-price">${f.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section container">
        <div className="section-head">
          <div><h2>Top rated this week</h2><p>Highest-rated spots, handpicked for you</p></div>
          <Link to="/restaurants" className="view-all">Explore →</Link>
        </div>
        <div className="grid grid-4">{topRated.map((r) => (<RestaurantCard key={r.id} restaurant={r} />))}</div>
      </section>

      <section className="container">
        <div className="app-cta">
          <div className="app-cta-text">
            <h2>Get the FoodHub app</h2>
            <p>Faster ordering, exclusive app-only deals, and live order tracking.</p>
            <div className="app-cta-btns">
              <span className="store-btn">📱 App Store</span>
              <span className="store-btn">▶ Google Play</span>
            </div>
          </div>
          <div className="app-cta-visual">🍔</div>
        </div>
      </section>
    </div>
  );
}
