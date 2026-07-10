import "./HeroSection.css";
import SearchBar from "./SearchBar.jsx";

export default function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-overlay" />
      <div className="container hero-content">
        <span className="hero-eyebrow">Food delivery, reimagined</span>
        <h1 className="hero-title">Craving something? <br /><span className="hero-accent">We'll bring it to your door.</span></h1>
        <p className="hero-sub">Order from 1,000+ restaurants near you. Fast delivery, exclusive offers, and your favourite dishes — all in one place.</p>
        <SearchBar variant="hero" />
        <div className="hero-stats">
          <div><strong>1,000+</strong><span>Restaurants</span></div>
          <div><strong>50k+</strong><span>Dishes</span></div>
          <div><strong>4.6★</strong><span>Avg rating</span></div>
        </div>
      </div>
    </section>
  );
}
