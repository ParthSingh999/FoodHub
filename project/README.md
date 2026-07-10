# FoodHub 🍔

A modern food delivery web app inspired by Zomato, built with **React + Vite** using JavaScript (no TypeScript). Original branding, dummy data, and a premium red & white theme with dark mode.

## Features

- **Home** — hero with search, food categories, popular restaurants, trending dishes, promo banners
- **Restaurants** — filterable listing (rating, cost, cuisine, delivery time) + live search
- **Restaurant details** — dynamic route `/restaurant/:id`, banner, info strip, collapsible menu with add-to-cart and quantity steppers
- **Cart** — add / remove / update quantity, bill breakdown, persists to `localStorage`
- **Checkout** — address form with validation, payment options, order summary, places order (protected route)
- **Auth** — login & signup with form validation, users stored in `localStorage`
- **Profile** — user info, order history, logout (protected route)
- **Offers** — promo banners, restaurant deals, copyable promo codes
- **Extras** — dark mode toggle, favorites/wishlist, toast notifications, loading skeletons, 404 page
- Responsive across desktop, tablet, and mobile (hamburger menu)

## Tech & structure

- React 18 (functional components + hooks)
- React Router DOM v6 (dynamic routing, protected routes)
- Global state via `useContext`: `CartContext`, `AuthContext`, `ThemeContext`, `ToastContext`, `FavoritesContext`
- CSS files per component (no CSS-in-JS, no UI framework)
- Dummy data in `src/data` (20 restaurants, 50 food items, 7 categories)

```
src/
├── components/   Navbar, Footer, SearchBar, RestaurantCard, CategoryCard,
│                 FoodCard, FilterBar, CartItem, RestaurantMenu, HeroSection,
│                 Loader, PromoBanner, ScrollToTop, ProtectedRoute
├── context/      CartContext, AuthContext, ThemeContext, ToastContext, FavoritesContext
├── data/         restaurants.js, foodItems.js, categories.js, filterOptions.js
├── pages/        Home, Restaurants, RestaurantDetails, Cart, Checkout,
│                 Login, Signup, Profile, Offers, NotFound
├── utils/        helpers.js
├── App.jsx       routing setup
├── main.jsx      providers + entry
└── index.css     design system / global styles
```

## Run the project

```bash
npm install      # install dependencies
npm run dev      # start dev server (http://localhost:5173)
npm run build    # production build
npm run preview  # preview the production build
```

## Notes

- User accounts, cart, favorites, orders and theme are stored in `localStorage` — no backend required.
- Restaurant and food images are referenced from Pexels stock photos (not downloaded).
- Passwords are stored in plain text in `localStorage` purely for this front-end demo; never do this in production.
