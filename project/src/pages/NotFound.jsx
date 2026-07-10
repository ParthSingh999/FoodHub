import { Link } from "react-router-dom";
import "./NotFound.css";

export default function NotFound() {
  return (
    <div className="notfound">
      <div className="notfound-plate">🍽️</div>
      <h1>404</h1>
      <h2>This page is off the menu</h2>
      <p>The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/" className="btn btn-primary btn-lg">Back to home</Link>
    </div>
  );
}
