import { useParams, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useToast } from "./ToastContext";
import { getRestaurants } from "../utils/restaurantData";

function RestaurantMenu() {
  const { id } = useParams();
  const { state } = useLocation();
  const restaurantLocation = state?.restaurantLocation || null;

  const [items, setItems] = useState([]);
  const [restaurantName, setRestaurantName] = useState(restaurantLocation || "");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getRestaurants()
      .then((data) => {
        if (!mounted) return;
        if (restaurantLocation) {
          // show all items that belong to the same restaurant (match by location string)
          const matched = data.filter((d) => (d.location || "").toLowerCase().includes(restaurantLocation.toLowerCase()));
          setItems(matched);
          setRestaurantName(restaurantLocation);
        } else {
          // fallback: find by id and also show other items with same location
          const found = data.find((d) => String(d.id) === String(id));
          if (found) {
            const matched = data.filter((d) => (d.location || "").toLowerCase().includes((found.location || "").toLowerCase()));
            setItems(matched);
            setRestaurantName(found.location || "");
          } else {
            setItems([]);
          }
        }
      })
      .catch(() => {
        if (!mounted) return;
        setItems([]);
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [id, restaurantLocation]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">{restaurantName ? restaurantName : `Restaurant Menu - ${id}`}</h1>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border rounded p-4 shadow-sm">
              <div className="flex items-center">
                <div className="w-20 h-20 bg-gray-200 rounded mr-4 animate-pulse" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                </div>
                <div className="ml-4">
                  <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {!loading && items.length === 0 && <p>No menu items found.</p>}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {items.map((it) => (
              <div key={it.id} className="border rounded p-4 shadow-sm">
                <div className="flex items-center">
                  <img
                    src={it.image}
                    alt={it.name}
                    className="w-20 h-20 object-cover rounded mr-4"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=400&q=80";
                    }}
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{it.name}</h3>
                    <p className="text-sm text-gray-600">⭐ {it.rating} • {it.deliveryTime}</p>
                    <p className="text-sm mt-2 font-bold">{it.price}</p>
                  </div>
                  <div className="ml-4">
                    <AddToCartButton item={it} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

  function AddToCartButton({ item }) {
    const { addItem } = useCart();
    const [adding, setAdding] = useState(false);
    const { showToast } = useToast();

    const onAdd = () => {
      addItem({ id: item.id, name: item.name, price: item.price, image: item.image }, 1);
      setAdding(true);
      showToast(`${item.name} added to cart`);
      setTimeout(() => setAdding(false), 1200);
    };

    return (
      <button onClick={onAdd} className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600 transition cursor-pointer">
        {adding ? 'Added' : 'Add'}
      </button>
    );
  }

  export default RestaurantMenu;
