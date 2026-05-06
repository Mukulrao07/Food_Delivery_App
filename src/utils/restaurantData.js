import axios from "axios";
import localRestaurants from "../data/restaurants";

const REMOTE_URL = "http://localhost:3001/restaurants";
const IMAGE_BASE = "https://res.cloudinary.com/swiggy/image/upload/";

function normalizeName(value) {
  return (value || "").replace(/\s+/g, " ").trim();
}

function toNumber(value) {
  const n = typeof value === "number" ? value : parseFloat(String(value || "").replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function buildImageUrl(raw) {
  if (!raw) return "";
  if (typeof raw === "string" && raw.startsWith("http")) return raw;
  return `${IMAGE_BASE}${raw}`;
}

function mapRestaurant(raw, index) {
  const r = raw?.info ? raw.info : raw;

  const name = normalizeName(r?.name || r?.restaurantName);
  const location = normalizeName(r?.areaName || r?.locality || r?.location);
  const rating = toNumber(r?.avgRating || r?.rating);
  const deliveryTime = r?.sla?.slaString || r?.deliveryTime || r?.slaString || "";
  const price = r?.costForTwo || r?.price || "";

  const image =
    buildImageUrl(r?.cloudinaryImageId) ||
    buildImageUrl(r?.imageId) ||
    r?.image ||
    "";

  const baseId = r?.id || r?.restaurantId || r?.resId || "";
  const id = baseId ? String(baseId) : `${name || "restaurant"}-${location || "na"}-${index}`;

  return {
    id,
    name,
    image,
    rating,
    deliveryTime,
    location,
    price,
  };
}

function normalizeList(data) {
  const list = Array.isArray(data)
    ? data
    : Array.isArray(data?.restaurants)
    ? data.restaurants
    : Array.isArray(data?.data?.restaurants)
    ? data.data.restaurants
    : Array.isArray(data?.data)
    ? data.data
    : [];

  const mapped = list.map((r, i) => mapRestaurant(r, i)).filter((r) => r.name);

  // Dedupe by id or name+location to avoid repeats from noisy APIs
  const seen = new Set();
  return mapped.filter((r) => {
    const key = r.id || `${r.name}-${r.location}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export async function getRestaurants() {
  try {
    const res = await axios.get(REMOTE_URL, { timeout: 5000 });
    const normalized = normalizeList(res.data);
    if (normalized.length > 0) return normalized;
  } catch {}

  return normalizeList(localRestaurants);
}
