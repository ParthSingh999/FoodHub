import { useCart } from "../context/CartContext.jsx";
import { formatPrice } from "../utils/helpers.js";
import "./CartItem.css";

export default function CartItem({ item }) {
  const { increment, decrement, removeItem } = useCart();
  return (
    <div className="cart-item">
      <img src={item.image} alt={item.name} className="cart-item-img" />
      <div className="cart-item-info">
        <h4 className="cart-item-name">
          <span className={`veg-mark ${item.isVeg ? "veg" : "nonveg"}`}>{item.isVeg ? "●" : "▲"}</span>
          {item.name}
        </h4>
        <p className="cart-item-price">{formatPrice(item.price)}</p>
        <div className="cart-item-controls">
          <div className="cart-qty">
            <button onClick={() => decrement(item.id)} aria-label="Decrease">−</button>
            <span>{item.qty}</span>
            <button onClick={() => increment(item.id)} aria-label="Increase">+</button>
          </div>
          <button className="cart-remove" onClick={() => removeItem(item.id)}>Remove</button>
        </div>
      </div>
      <div className="cart-item-total">{formatPrice(item.price * item.qty)}</div>
    </div>
  );
}
