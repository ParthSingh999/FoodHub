import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { formatPrice, saveAddress, getAddress } from "../utils/helpers.js";
import "./Checkout.css";

const API_BASE = "https://foodhub-production-9792.up.railway.app/api";

export default function Checkout() {
  const { items, subtotal, deliveryFee, tax, total, clearCart } = useCart();
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const savedAddr = getAddress();
  const [form, setForm] = useState({
    name: user?.username || "", phone: "",
    line1: savedAddr?.line1 || "", city: savedAddr?.city || "", zip: savedAddr?.zip || "", notes: "",
  });
  const [payment, setPayment] = useState("cod");
  const [errors, setErrors] = useState({});
  const [placing, setPlacing] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!/^[0-9+\-\s]{7,15}$/.test(form.phone.trim())) e.phone = "Enter a valid phone number";
    if (!form.line1.trim()) e.line1 = "Address is required";
    if (!form.city.trim()) e.city = "City is required";
    if (!/^[0-9A-Za-z\s-]{3,10}$/.test(form.zip.trim())) e.zip = "Enter a valid ZIP";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePlace = async (e) => {
    e.preventDefault();
    if (!validate()) { toast("Please fix the highlighted fields", "error"); return; }

    setPlacing(true);
    saveAddress({ line1: form.line1, city: form.city, zip: form.zip });

    try {
      const token = localStorage.getItem("fh_token") || "";
      const address = `${form.line1}, ${form.city} ${form.zip}${form.notes ? " – " + form.notes : ""}`;
      const paymentMode = payment === "cod" ? "COD" : "ONLINE";

      // Build order payload with productId for each cart item
      const orderPayload = {
        address,
        paymentMode,
        deliveryFee: 40,
        discount: 0,
        tip: 0,
        items: items.map((i) => ({
          productId: i.productId || i.id,   // use productId from DB if available, fallback to cart id
          quantity: i.qty,
          name: i.name,
          price: i.price,
        })),
      };

      const response = await fetch(`${API_BASE}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(orderPayload),
      });

      const data = await response.json();

      if (!response.ok) {
        // If products not in DB yet (e.g. demo items), show helpful message
        toast(data.error || "Order failed. Please try again.", "error");
        setPlacing(false);
        return;
      }

      clearCart();
      toast("Order placed successfully!", "success");
      navigate("/profile");
    } catch (err) {
      toast("Could not reach server. Please check your connection.", "error");
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container cart-empty">
        <span className="empty-emoji">🧾</span>
        <h1>Nothing to check out</h1>
        <p>Your cart is empty. Add some food first!</p>
        <Link to="/restaurants" className="btn btn-primary btn-lg">Browse restaurants</Link>
      </div>
    );
  }

  return (
    <div className="container checkout-page">
      <h1 className="checkout-title">Checkout</h1>
      <form className="checkout-layout" onSubmit={handlePlace} noValidate>
        <div className="checkout-main">
          <section className="checkout-card">
            <h3>Delivery address</h3>
            <div className="field"><label>Full name</label><input value={form.name} onChange={set("name")} className={errors.name ? "err" : ""} />{errors.name && <p className="error-text">{errors.name}</p>}</div>
            <div className="field"><label>Phone number</label><input value={form.phone} onChange={set("phone")} placeholder="+91 98765 43210" className={errors.phone ? "err" : ""} />{errors.phone && <p className="error-text">{errors.phone}</p>}</div>
            <div className="field"><label>Street address</label><input value={form.line1} onChange={set("line1")} placeholder="123 Main Street, Apt 4B" className={errors.line1 ? "err" : ""} />{errors.line1 && <p className="error-text">{errors.line1}</p>}</div>
            <div className="checkout-row">
              <div className="field"><label>City</label><input value={form.city} onChange={set("city")} className={errors.city ? "err" : ""} />{errors.city && <p className="error-text">{errors.city}</p>}</div>
              <div className="field"><label>ZIP code</label><input value={form.zip} onChange={set("zip")} className={errors.zip ? "err" : ""} />{errors.zip && <p className="error-text">{errors.zip}</p>}</div>
            </div>
            <div className="field"><label>Delivery notes (optional)</label><textarea rows="2" value={form.notes} onChange={set("notes")} placeholder="Leave at door, ring bell, etc." /></div>
          </section>

          <section className="checkout-card">
            <h3>Payment method</h3>
            <div className="pay-options">
              {[{id:"cod",label:"Cash on delivery",icon:"💵"},{id:"upi",label:"UPI / Wallet",icon:"📱"},{id:"card",label:"Credit / Debit card",icon:"💳"}].map((p) => (
                <label key={p.id} className={`pay-opt ${payment === p.id ? "active" : ""}`}>
                  <input type="radio" name="payment" checked={payment === p.id} onChange={() => setPayment(p.id)} />
                  <span className="pay-icon">{p.icon}</span><span>{p.label}</span>
                </label>
              ))}
            </div>
          </section>
        </div>

        <aside className="checkout-summary">
          <h3>Order summary</h3>
          <div className="summary-items">
            {items.map((i) => (
              <div key={i.id} className="summary-item">
                <span className="summary-qty">{i.qty}×</span>
                <span className="summary-name">{i.name}</span>
                <span className="summary-price">{formatPrice(i.price * i.qty)}</span>
              </div>
            ))}
          </div>
          <div className="bill-divider" />
          <div className="bill-row"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
          <div className="bill-row"><span>Delivery</span><span>{formatPrice(deliveryFee)}</span></div>
          <div className="bill-row"><span>Tax</span><span>{formatPrice(tax)}</span></div>
          <div className="bill-divider" />
          <div className="bill-row bill-total"><span>Total</span><span>{formatPrice(total)}</span></div>
          <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={placing}>
            {placing ? "Placing order…" : `Place order · ${formatPrice(total)}`}
          </button>
        </aside>
      </form>
    </div>
  );
}
