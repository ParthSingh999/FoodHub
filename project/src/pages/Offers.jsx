import PromoBanner from "../components/PromoBanner.jsx";
import { restaurants } from "../data/restaurants.js";
import { Link } from "react-router-dom";
import "./Offers.css";

export default function Offers() {
  const offerRestaurants = restaurants.filter((r) => r.offer).slice(0, 8);

  return (
    <div className="container offers-page">
      <div className="offers-head">
        <h1>Offers & deals</h1>
        <p>Save big on your favourite meals this week</p>
      </div>

      <div className="offers-promos">
        <PromoBanner title="FLAT 50% OFF" subtitle="On first 3 orders. Max discount $12." cta="Use code FOOD50" image="https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=900" to="/restaurants" />
        <PromoBanner title="Free delivery week" subtitle="On all orders above $25" cta="Order now" image="https://images.pexels.com/photos/4148299/pexels-photo-4148299.jpeg?auto=compress&cs=tinysrgb&w=900" to="/restaurants" align="right" />
      </div>

      <section className="section">
        <div className="section-head"><div><h2>Restaurant offers</h2><p>Exclusive deals from top restaurants</p></div></div>
        <div className="offers-grid">
          {offerRestaurants.map((r) => (
            <Link to={`/restaurant/${r.id}`} key={r.id} className="offer-card">
              <img src={r.image} alt={r.name} loading="lazy" />
              <div className="offer-card-body">
                <span className="offer-tag">🎉 {r.offer}</span>
                <h4>{r.name}</h4>
                <p className="muted">{r.cuisine.join(", ")}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="offers-codes">
        <h2>Promo codes</h2>
        <div className="codes-grid">
          {[{code:"FOOD50",desc:"50% off up to $12 on first 3 orders"},{code:"FREEDEL",desc:"Free delivery on orders above $25"},{code:"WEEKEND20",desc:"20% off on weekend orders above $40"}].map((c) => (
            <div className="code-card" key={c.code}>
              <div><span className="code">{c.code}</span><p className="muted">{c.desc}</p></div>
              <button className="btn btn-outline btn-sm" onClick={() => navigator.clipboard?.writeText(c.code)}>Copy</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
