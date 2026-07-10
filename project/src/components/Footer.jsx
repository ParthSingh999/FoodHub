import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link to="/" className="brand">
            <span className="brand-logo">F</span>
            <span className="brand-name">Food<span className="brand-accent">Hub</span></span>
          </Link>
          <p>FoodHub connects you with the best restaurants around you. Order food online and get it delivered fast — your cravings, our mission.</p>
          <div className="footer-social">
            <a href="#" aria-label="Facebook">f</a>
            <a href="#" aria-label="Twitter">𝕏</a>
            <a href="#" aria-label="Instagram">◉</a>
          </div>
        </div>
        <div className="footer-col">
          <h4>Company</h4>
          <Link to="/restaurants">Restaurants</Link>
          <Link to="/offers">Offers</Link>
          <a href="#">About us</a>
          <a href="#">Careers</a>
        </div>
        <div className="footer-col">
          <h4>For Foodies</h4>
          <a href="#">Help & Support</a>
          <a href="#">Terms of Service</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Blog</a>
        </div>
        <div className="footer-col">
          <h4>Stay in the loop</h4>
          <p className="footer-news-text">Get the best deals delivered to your inbox.</p>
          <form className="footer-news" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Your email" aria-label="Email" />
            <button className="btn btn-primary btn-sm" type="submit">Subscribe</button>
          </form>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <span>© {new Date().getFullYear()} FoodHub. Built for demo purposes.</span>
          <span>Made with ♥ for food lovers</span>
        </div>
      </div>
    </footer>
  );
}
