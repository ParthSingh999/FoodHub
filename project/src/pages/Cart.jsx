import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import CartItem from "../components/CartItem.jsx";
import { formatPrice } from "../utils/helpers.js";
import "./Cart.css";

export default function Cart() {
  const { items, subtotal, deliveryFee, tax, total, clearCart } = useCart();
  const { user } = useAuth();

  if (items.length === 0) {
    return (
      <div className="container cart-empty">
        <span className="empty-emoji">🛒</span>
        <h1>Your cart is empty</h1>
        <p>Looks like you haven't added anything yet. Let's fix that!</p>
        <Link to="/restaurants" className="btn btn-primary btn-lg">Browse restaurants</Link>
      </div>
    );
  }

  return (
    <div className="container cart-page">
      <div className="cart-page-head">
        <h1>Your Cart</h1>
        <button className="cart-clear-all" onClick={clearCart}>Clear cart</button>
      </div>
      <div className="cart-layout">
        <div className="cart-list">
          {items.map((item) => (<CartItem key={item.id} item={item} />))}
          <Link to="/restaurants" className="cart-add-more">+ Add more items</Link>
        </div>
        <aside className="cart-bill">
          <h3>Bill details</h3>
          <div className="bill-row"><span>Item total</span><span>{formatPrice(subtotal)}</span></div>
          <div className="bill-row"><span>Delivery fee</span><span>{formatPrice(deliveryFee)}</span></div>
          <div className="bill-row"><span>Taxes & charges (5%)</span><span>{formatPrice(tax)}</span></div>
          <div className="bill-divider" />
          <div className="bill-row bill-total"><span>To pay</span><span>{formatPrice(total)}</span></div>
          <Link to={user ? "/checkout" : "/login"} className="btn btn-primary btn-block btn-lg cart-checkout-btn">
            {user ? "Proceed to checkout" : "Login to checkout"}
          </Link>
          <p className="cart-bill-note">Safe and secure payments. Estimated delivery in 30 min.</p>
        </aside>
      </div>
    </div>
  );
}
