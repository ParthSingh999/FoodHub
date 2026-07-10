import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { restaurants } from "../data/restaurants.js";
import { addFoodItem, foodItems } from "../data/foodItems.js";
import { formatPrice, getOrders } from "../utils/helpers.js";
import "./Admin.css";

const emptyForm = {
  name: "",
  image: "",
  description: "",
  price: "",
  category: "",
  restaurantId: restaurants[0]?.id || "",
  rating: "4.5",
  isVeg: true,
  popular: false,
  prepTime: "",
};

export default function Admin() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [menuItems, setMenuItems] = useState(() => foodItems);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setOrders(getOrders());
    setMenuItems(foodItems);
  }, []);

  const stats = useMemo(() => {
    const revenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
    const delivered = orders.filter((order) => order.status === "Delivered").length;
    const pending = orders.filter((order) => ["Placed", "Preparing", "On the way"].includes(order.status)).length;
    const topDish = [...menuItems].sort((a, b) => b.rating - a.rating)[0];

    return {
      revenue,
      delivered,
      pending,
      topDish,
      totalOrders: orders.length,
      activeRestaurants: restaurants.length,
    };
  }, [menuItems, orders]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.description.trim() || !form.price) {
      setMessage("Please fill in the name, description, and price.");
      return;
    }

    const createdItem = addFoodItem({
      ...form,
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      rating: Number(form.rating || 4.5),
      categoryId: form.category.trim().toLowerCase().replace(/\s+/g, "-"),
      category: form.category.trim(),
      restaurantId: form.restaurantId || restaurants[0]?.id || "r1",
      isVeg: Boolean(form.isVeg),
      popular: Boolean(form.popular),
      prepTime: form.prepTime.trim() || "15 mins",
    });

    setMenuItems([createdItem, ...foodItems]);
    setForm(emptyForm);
    setMessage(`Added “${createdItem.name}” to the menu.`);
  };

  return (
    <div className="container admin-page">
      <section className="admin-shell">
        <div className="admin-header">
          <div>
            <span className="badge badge-amber">Admin control panel</span>
            <h1>Food management</h1>
            <p>Add new dishes, organize your menu, and keep the catalog updated.</p>
          </div>
          <div className="admin-header-badge">
            <span>Live menu items</span>
            <strong>{menuItems.length}</strong>
          </div>
        </div>

        <div className="admin-stats-grid">
          <div className="stat-card">
            <span>Total orders</span>
            <strong>{stats.totalOrders}</strong>
          </div>
          <div className="stat-card">
            <span>Pending</span>
            <strong>{stats.pending}</strong>
          </div>
          <div className="stat-card">
            <span>Revenue</span>
            <strong>{formatPrice(stats.revenue)}</strong>
          </div>
          <div className="stat-card">
            <span>Top dish</span>
            <strong>{stats.topDish?.name || "—"}</strong>
          </div>
        </div>

        <div className="admin-workspace">
          <section className="card admin-form-card">
            <div className="card-head">
              <div>
                <h2>Add food item</h2>
                <p>Create a new dish and push it live to the shop.</p>
              </div>
            </div>

            <form className="admin-form" onSubmit={handleSubmit}>
              <div className="form-grid">
                <label className="field">
                  <span>Name</span>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="Crispy Chicken Wrap" required />
                </label>
                <label className="field">
                  <span>Image URL</span>
                  <input name="image" value={form.image} onChange={handleChange} placeholder="https://example.com/food.jpg" />
                </label>
                <label className="field">
                  <span>Price</span>
                  <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} placeholder="9.99" required />
                </label>
                <label className="field">
                  <span>Category</span>
                  <input name="category" value={form.category} onChange={handleChange} placeholder="Burgers" required />
                </label>
                <label className="field">
                  <span>Restaurant</span>
                  <select name="restaurantId" value={form.restaurantId} onChange={handleChange}>
                    {restaurants.map((restaurant) => (
                      <option key={restaurant.id} value={restaurant.id}>{restaurant.name}</option>
                    ))}
                  </select>
                </label>
                <label className="field">
                  <span>Rating</span>
                  <input name="rating" type="number" min="1" max="5" step="0.1" value={form.rating} onChange={handleChange} />
                </label>
                <label className="field">
                  <span>Prep time</span>
                  <input name="prepTime" value={form.prepTime} onChange={handleChange} placeholder="20 mins" />
                </label>
                <label className="field checkbox-field">
                  <input name="isVeg" type="checkbox" checked={form.isVeg} onChange={handleChange} />
                  <span>Vegetarian</span>
                </label>
                <label className="field checkbox-field">
                  <input name="popular" type="checkbox" checked={form.popular} onChange={handleChange} />
                  <span>Show as popular</span>
                </label>
              </div>

              <label className="field">
                <span>Description</span>
                <textarea name="description" value={form.description} onChange={handleChange} rows="4" placeholder="Describe the dish, flavor, and ingredients" required />
              </label>

              {message ? <p className={`form-message ${message.includes("Please") ? "error" : "success"}`}>{message}</p> : null}

              <button type="submit" className="btn btn-primary">Add food item</button>
            </form>
          </section>

          <aside className="admin-side">
            <section className="card admin-side-card">
              <div className="card-head">
                <div>
                  <h2>Recently added</h2>
                  <p>Newest dishes in your menu.</p>
                </div>
              </div>

              <ul className="menu-preview-list">
                {menuItems.slice(0, 6).map((item) => (
                  <li key={item.id} className="menu-preview-item">
                    <div>
                      <strong>{item.name}</strong>
                      <p>{item.category || item.categoryId || "Menu item"} · {formatPrice(item.price)}</p>
                    </div>
                    <span className={`badge ${item.popular ? "badge-amber" : "badge-neutral"}`}>{item.popular ? "Popular" : "Live"}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="card admin-side-card">
              <div className="card-head">
                <div>
                  <h2>Quick insights</h2>
                  <p>At-a-glance admin summary.</p>
                </div>
              </div>
              <div className="quick-insights">
                <div>
                  <span>Active restaurants</span>
                  <strong>{stats.activeRestaurants}</strong>
                </div>
                <div>
                  <span>Delivered</span>
                  <strong>{stats.delivered}</strong>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </section>
    </div>
  );
}
