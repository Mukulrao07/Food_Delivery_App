import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import swiggyImg from "./Logo.jpg";
import { IoSearchOutline, IoCartOutline, IoPersonOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Header({ searchQuery, setSearchQuery, fetchSuggestions }) {
  const [input, setInput] = useState(searchQuery || "");
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);
  const debounceRef = useRef(null);
  const { cart } = useCart();
  const itemCount = cart ? cart.reduce((s, it) => s + (it.qty || 1), 0) : 0;

  useEffect(() => {
    setInput(searchQuery || "");
  }, [searchQuery]);

  useEffect(() => {
    // Close when clicking outside
    function onClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!input || input.trim().length === 0) {
      setSuggestions([]);
      setOpen(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        let items = [];
        if (typeof fetchSuggestions === "function") {
          items = await fetchSuggestions(input);
        } else {
          // Fallback: localStorage-based suggestions (recent searches)
          const history = JSON.parse(localStorage.getItem("search_history") || "[]");
          items = history.filter((s) => s.toLowerCase().includes(input.toLowerCase()));
        }
        setSuggestions(items || []);
        setOpen(true);
      } catch (err) {
        setSuggestions([]);
        setOpen(false);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [input, fetchSuggestions]);

  const navigate = useNavigate();

  function applySuggestion(s) {
    // support both string suggestions and {id,name}
    const value = typeof s === "string" ? s : s.name;
    setInput(value);
    setOpen(false);
    setSearchQuery(value);

    // navigate to restaurant if id present
    if (s && typeof s === "object" && s.id) {
      // pass restaurant location/name in navigation state for RestaurantMenu
      navigate(`/restaurant/${s.id}`, { state: { restaurantLocation: s.location } });
    }

    // Save to history
    try {
      const history = JSON.parse(localStorage.getItem("search_history") || "[]");
      const dedup = [value, ...history.filter((h) => h !== value)].slice(0, 10);
      localStorage.setItem("search_history", JSON.stringify(dedup));
    } catch {}
  }

  async function onSubmit(e) {
    e.preventDefault();
    // If we have an exact match from suggestions that includes an id, navigate
    const match = suggestions && suggestions.find((s) => {
      if (!s) return false;
      if (typeof s === 'string') return s.toLowerCase() === input.toLowerCase();
      return s.name && s.name.toLowerCase() === input.toLowerCase();
    });

    setSearchQuery(input);
    setOpen(false);

    if (match && typeof match === 'object' && match.id) {
      navigate(`/restaurant/${match.id}`);
    } else {
      applySuggestion(input);
    }
  }

  return (
    <nav ref={containerRef} className="sticky top-0 z-50 bg-white shadow-md h-20 flex items-center justify-between px-8 md:px-12">
      {/* Logo */}
      <Link to="/" className="flex items-center">
        <img src={swiggyImg} alt="FoodApp" className="w-12 h-auto mr-2" />
        <span className="text-2xl font-bold text-orange-500">FoodApp</span>
      </Link>

      {/* Search Bar */}
      <div className="relative flex-1 mx-6">
        <IoSearchOutline className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 text-lg" />
        <form onSubmit={onSubmit}>
          <input
            type="text"
            placeholder="Search for restaurants or dishes"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => { if (suggestions.length) setOpen(true); }}
            className="w-full pl-10 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
            aria-autocomplete="list"
            aria-expanded={open}
            aria-controls="search-suggestions"
          />
        </form>

        {/* Suggestions dropdown */}
        {open && (
          <div id="search-suggestions" className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-auto z-50">
            {loading && <div className="p-3 text-sm text-gray-500">Searching...</div>}
            {!loading && suggestions && suggestions.length === 0 && (
              <div className="p-3 text-sm text-gray-500">No suggestions</div>
            )}
            {!loading && suggestions && suggestions.map((s, idx) => {
              const label = typeof s === 'string' ? s : `${s.name}${s.location ? ' — ' + s.location : ''}`;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => applySuggestion(s)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Menu */}
      <ul className="flex space-x-6 items-center text-gray-700 font-semibold">
        <li className="flex items-center cursor-pointer hover:text-orange-500 transition relative">
          <IoCartOutline className="mr-1 text-xl" />
          <Link to="/cart">Cart</Link>
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{itemCount}</span>
          )}
        </li>
        <li className="flex items-center cursor-pointer hover:text-orange-500 transition">
          <IoPersonOutline className="mr-1 text-xl" />
          <Link to="/signin">Sign In</Link>
        </li>
        <li className="hidden md:flex items-center cursor-pointer hover:text-orange-500 transition">
          <Link to="/offers">Offers</Link>
        </li>
        <li className="hidden md:flex items-center cursor-pointer hover:text-orange-500 transition">
          <Link to="/help">Help</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Header;
