import { Link } from "react-router-dom";
import "./CategoryCard.css";

export default function CategoryCard({ category }) {
  return (
    <Link to={`/restaurants?cat=${category.id}`} className="cat-card" aria-label={`Browse ${category.name}`}>
      <span className="cat-emoji" style={{ background: `${category.color}1a` }}>{category.emoji}</span>
      <span className="cat-name">{category.name}</span>
    </Link>
  );
}
