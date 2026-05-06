import React, { useState, Suspense, lazy, useRef, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./components/ToastContext";
import { getRestaurants } from "./utils/restaurantData";

const Body = lazy(() => import("./components/Body"));
const RestaurantMenu = lazy(() => import("./components/RestaurantMenu"));
const Cart = lazy(() => import("./components/pages/Cart"));
const Checkout = lazy(() => import("./components/pages/Checkout"));
const SignIn = lazy(() => import("./components/pages/SignIn"));
const Offers = lazy(() => import("./components/pages/Offers"));
const Help = lazy(() => import("./components/pages/Help"));

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const restaurantsCacheRef = useRef(null);

  const fetchSuggestions = useCallback(async (query) => {
    try {
      if (!restaurantsCacheRef.current) {
        const data = await getRestaurants();
        restaurantsCacheRef.current = data;
      }
      const q = (query || "").toLowerCase();
      return (restaurantsCacheRef.current || [])
        .filter((r) => {
          const name = (r.name || "").toLowerCase();
          const loc = (r.location || "").toLowerCase();
          return name.includes(q) || loc.includes(q);
        })
        .slice(0, 10)
        .map((r) => ({ id: r.id, name: r.name, location: r.location }));
    } catch (err) {
      return [];
    }
  }, []);

  return (
    <Router>
      <ToastProvider>
        <CartProvider>
          <div className="dark">
            {/* Header */}
            <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} fetchSuggestions={fetchSuggestions} />

        {/* Routes (lazy-loaded) */}
        <Suspense fallback={<div className="p-4">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Body searchQuery={searchQuery} />} />
            <Route path="/restaurant/:id" element={<RestaurantMenu />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/offers" element={<Offers />} />
            <Route path="/help" element={<Help />} />
          </Routes>
        </Suspense>

            {/* Footer */}
            <Footer />
          </div>
        </CartProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;
