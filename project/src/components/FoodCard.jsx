import { useState } from "react";
import { useCart } from "../context/CartContext.jsx";
import { formatPrice, ratingTone } from "../utils/helpers.js";
import "./FoodCard.css";

export default function FoodCard({ food }) {
  const { addItem, items, increment, decrement } = useCart();
  const inCart = items.find((i) => i.id === food.id);
  const [qty, setQty] = useState(1);

  const handleAdd = () => { addItem(food, qty); setQty(1); };

  return (
    <div className="food-card">
      <div className="food-card-main">
        <span className={`veg-mark ${food.isVeg ? "veg" : "nonveg"}`}>{food.isVeg ? "●" : "▲"}</span>
        <h4 className="food-name">{food.name}</h4>
        <span className={`badge badge-${ratingTone(food.rating)}`}>★ {food.rating}</span>
        <p className="food-desc">{food.description}</p>
        <p className="food-price">{formatPrice(food.price)}</p>
      </div>
      <div className="food-card-media">
        <img src={food.image} alt={food.name} loading="lazy" />
        {inCart ? (
          <div className="qty-stepper in-cart">
            <button onClick={() => decrement(food.id)} aria-label="Decrease">−</button>
            <span>{inCart.qty}</span>
            <button onClick={() => increment(food.id)} aria-label="Increase">+</button>
          </div>
        ) : (
          <div className="qty-stepper">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease">−</button>
            <span>{qty}</span>
            <button onClick={() => setQty((q) => q + 1)} aria-label="Increase">+</button>
          </div>
        )}
        {!inCart && <button className="food-add btn btn-primary btn-sm" onClick={handleAdd}>ADD</button>}
      </div>
    </div>
  );
}
