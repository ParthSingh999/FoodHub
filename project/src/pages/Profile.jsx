import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { formatPrice } from "../utils/helpers.js";
import "./Profile.css";

export default function Profile() {
  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [orders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const handleLogout = () => { logout(); toast("Logged out successfully", "info"); navigate("/"); };
  const joined = new Date(user?.joinedOn || Date.now()).toLocaleDateString(undefined, { year: "numeric", month: "long" });

  return (
    <div className="container profile-page">
      <div className="profile-head">
        <div className="profile-avatar">{user.username.charAt(0).toUpperCase()}</div>
        <div>
          <h1>{user.username}</h1>
          <p className="muted">{user.email}</p>
          <span className="badge badge-neutral">Member since {joined}</span>
        </div>
        <button className="btn btn-outline" onClick={handleLogout}>Logout</button>
      </div>

      <section className="profile-section">
        <div className="profile-section-head">
          <h2>Order history</h2>
          <Link to="/restaurants" className="view-all">Order again →</Link>
        </div>
        {orders.length === 0 ? (
          <div className="empty-state">
            <span className="empty-emoji">📦</span>
            <h3>No orders yet</h3>
            <p>Your placed orders will appear here with full details.</p>
            <Link to="/restaurants" className="btn btn-primary">Start ordering</Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => {
              const isOpen = selectedOrderId === order.id;
              const itemCount = (order.items || []).reduce((sum, item) => sum + (item.qty || 0), 0);
              const statusClass = order.status === "Delivered" ? "badge-green" : order.status === "Preparing" ? "badge-amber" : "badge-blue";

              return (
                <article key={order.id} className="order-card">
                  <div className="order-card-head">
                    <div>
                      <div className="order-card-id-row">
                        <strong>{order.id}</strong>
                        <span className="chip chip-muted">{itemCount} item{itemCount !== 1 ? "s" : ""}</span>
                      </div>
                      <p className="muted">{new Date(order.date).toLocaleString()} · {order.payment?.toUpperCase() || "PAYMENT"}</p>
                    </div>
                    <span className={`badge ${statusClass}`}>{order.status}</span>
                  </div>

                  <div className="order-preview-row">
                    <div className="order-preview-items">
                      {(order.items || []).slice(0, 3).map((item, idx) => (
                        <span key={`${order.id}-${idx}`} className="order-item-pill">{item.qty}× {item.name}</span>
                      ))}
                      {(order.items || []).length > 3 && <span className="order-item-pill extra">+{(order.items || []).length - 3} more</span>}
                    </div>
                    <div className="order-total-block">
                      <span className="muted">Total paid</span>
                      <strong>{formatPrice(order.total || 0)}</strong>
                    </div>
                  </div>

                  <div className="order-card-foot">
                    <span className="muted">Tap below for billing, address, and item details.</span>
                    <button className="order-view-btn" onClick={() => setSelectedOrderId(isOpen ? null : order.id)}>
                      {isOpen ? "Hide details" : "View details"}
                    </button>
                  </div>

                  {isOpen && (
                    <div className="order-details">
                      <div className="order-details-grid">
                        <div className="detail-panel">
                          <h4>Order items</h4>
                          <ul className="detail-list">
                            {(order.items || []).map((item, idx) => (
                              <li key={`${order.id}-item-${idx}`} className="detail-item-row">
                                <span>{item.name}</span>
                                <strong>{item.qty} × {formatPrice(item.price)}</strong>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="detail-panel">
                          <h4>Billing summary</h4>
                          <div className="detail-item-row"><span>Subtotal</span><strong>{formatPrice(order.subtotal || 0)}</strong></div>
                          <div className="detail-item-row"><span>Delivery</span><strong>{formatPrice(order.deliveryFee || 0)}</strong></div>
                          <div className="detail-item-row"><span>Tax</span><strong>{formatPrice(order.tax || 0)}</strong></div>
                          <div className="detail-item-row total-row"><span>Total</span><strong>{formatPrice(order.total || 0)}</strong></div>
                        </div>
                      </div>

                      <div className="detail-panel detail-panel-full">
                        <h4>Delivery & receipt</h4>
                        <div className="delivery-meta">
                          <div>
                            <span>Recipient</span>
                            <strong>{order.customerName || user.username}</strong>
                          </div>
                          <div>
                            <span>Phone</span>
                            <strong>{order.phone || "—"}</strong>
                          </div>
                          <div>
                            <span>Payment method</span>
                            <strong>{order.payment?.toUpperCase() || "N/A"}</strong>
                          </div>
                        </div>
                        <div className="delivery-meta secondary-meta">
                          <div>
                            <span>Address</span>
                            <strong>{order.address?.line1 || "—"}</strong>
                          </div>
                          <div>
                            <span>City / ZIP</span>
                            <strong>{[order.address?.city, order.address?.zip].filter(Boolean).join(" / ") || "—"}</strong>
                          </div>
                          <div>
                            <span>Delivery notes</span>
                            <strong>{order.address?.notes || "No notes"}</strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
