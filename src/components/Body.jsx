import React, { useState, useEffect } from "react";
import ApiCalling from "./ApiCalling";
import { getRestaurants } from "../utils/restaurantData";

function Body({ searchQuery }) {
  const [restaurants, setRestaurants] = useState([]);
  const [allRestaurants, setAllRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getRestaurants()
      .then((data) => {
        setRestaurants(data);
        setAllRestaurants(data);
      })
      .catch((error) => console.error("Error fetching data:", error))
      .finally(() => setLoading(false));
  }, []);

  const handleRating = () => {
    const filtered = allRestaurants.filter((item) => item.rating >= 4.4);
    setRestaurants(filtered);
  };

  const handleReset = () => {
    setRestaurants(allRestaurants);
  };

  const filteredRestaurants = restaurants.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8">
      <h1 className="font-bold text-2xl mb-6">
        Restaurants with online food delivery in Ujjain
      </h1>

      <div className="flex mb-6">
        <button
          onClick={handleRating}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-full shadow-md transition duration-300 mr-4"
        >
          Rating 4.4+
        </button>

        <button
          onClick={handleReset}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-full shadow-md transition duration-300"
        >
          Reset
        </button>
      </div>

      <ApiCalling restaurants={filteredRestaurants} loading={loading} />
    </div>
  );
}

export default Body;
