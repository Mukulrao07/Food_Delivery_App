import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useToast } from "./ToastContext";

function ApiCalling({ restaurants, loading = false }) {
  if (!restaurants || restaurants.length === 0) {
    if (loading) {
      // skeleton grid
      return (
        <div className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="border rounded-lg overflow-hidden shadow-sm bg-white">
                <div className="w-full h-48 bg-gray-200 animate-pulse" />
                <div className="p-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return <h3 className="p-5">No restaurants found.</h3>;
  }

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80";
  };

  const onLoadVisible = (e) => {
    e.target.classList.remove("opacity-0");
  };

  return (
    <div className="p-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-5">
        {restaurants.map((item) => (
          <CardWithAdd
            key={`${item.id}-${item.image}`}
            item={item}
            onError={handleImageError}
          />
        ))}
        </div>
      </div>
    );
  }

function CardWithAdd({ item, onError }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const { showToast } = useToast();

  const fallbackImage =
    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80";
  const defaultSrc = item.image || fallbackImage;

  const onAdd = () => {
    addItem({ id: item.id, name: item.name, price: item.price, image: item.image }, 1);
    setAdded(true);
    showToast(`${item.name} added to cart`);
    setTimeout(() => setAdded(false), 1000);
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm bg-white flex flex-col transition-all hover:shadow-md hover:scale-105">
      <div className="w-full h-40 bg-center bg-cover">
        <img
          src={defaultSrc}
          alt={item.name}
          loading="lazy"
          decoding="async"
          onError={onError}
          className={`w-full h-40 object-cover transition-opacity duration-300`}
        />
      </div>

      <div className="p-3 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-sm line-clamp-2">{item.name}</h3>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-gray-600">⭐ {item.rating}</span>
            <span className="text-xs text-gray-500">{item.deliveryTime}</span>
          </div>
          <p className="text-xs text-gray-600 line-clamp-1 mt-1">{item.location}</p>
        </div>
        <div className="flex items-center justify-between mt-2">
          <p className="font-bold text-sm">{item.price}</p>
          <button onClick={onAdd} className="bg-orange-500 text-white px-3 py-1 rounded text-xs hover:bg-orange-600 transition cursor-pointer">
            {added ? 'Added' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ApiCalling;
