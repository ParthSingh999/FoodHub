import { useState } from "react";
import FoodCard from "./FoodCard.jsx";
import "./RestaurantMenu.css";

export default function RestaurantMenu({ foods }) {
  // Group menu items by their categoryId for collapsible sections.
  const grouped = foods.reduce((acc, f) => { (acc[f.categoryId] = acc[f.categoryId] || []).push(f); return acc; }, {});
  const categoryNames = { pizza: "Pizzas", burger: "Burgers", indian: "Indian Classics", chinese: "Chinese Specials", desserts: "Desserts", drinks: "Beverages", "fast-food": "Fast Food" };
  const keys = Object.keys(grouped);
  const [openKey, setOpenKey] = useState(keys[0]);

  return (
    <div className="rest-menu">
      <h2 className="rest-menu-title">Menu</h2>
      {keys.map((key) => {
        const isOpen = openKey === key;
        return (
          <div key={key} className="menu-section">
            <button className="menu-section-head" onClick={() => setOpenKey(isOpen ? null : key)} aria-expanded={isOpen}>
              <span>{categoryNames[key] || key}</span>
              <span className="menu-count">{grouped[key].length} items</span>
              <span className={`menu-chevron ${isOpen ? "open" : ""}`}>⌄</span>
            </button>
            {isOpen && (
              <div className="menu-items">
                {grouped[key].map((food) => (<FoodCard key={food.id} food={food} />))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
