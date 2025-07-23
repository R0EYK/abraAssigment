import React from "react";
import { useState, useEffect } from "react";
import MapComponent from "../components/ui/Map";
import { useNavigate } from "react-router-dom";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

const PlacesPage = () => {
  const navigate = useNavigate();

  const [places, setPlaces] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("places") || "[]");
    setPlaces(stored);
  }, []);

  const geocodeAddress = async (address) => {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          address
        )}&key=${GOOGLE_MAPS_API_KEY}`
      );
      const data = await res.json();
      if (data.status === "OK" && data.results.length > 0) {
        return data.results[0].geometry.location;
      }
      return null;
    } catch (error) {
      console.error("Geocoding failed:", error);
      return null;
    }
  };

  const fetchWeather = async (lat, lon) => {
    const API_KEY = OPENWEATHER_API_KEY;
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );
      if (!res.ok) throw new Error("Failed to fetch weather");
      const data = await res.json();
      return data;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const handlePlaceClick = async (place) => {
    const coords = await geocodeAddress(place.address);
    if (!coords) {
      alert("Could not find coordinates for this address");
      return;
    }

    const data = await fetchWeather(coords.lat, coords.lng);
    setWeatherData(data);
  };

  return (
    <div className="p-4 mx-auto">
      <button onClick={() => navigate("/")} className=" px-4 py-2 rounded">
        Add New Place
      </button>
      <h1 className="text-2xl font-semibold mb-4">Places</h1>
      {places.length === 0 ? (
        <p>No places added yet.</p>
      ) : (
        <div>
          <MapComponent />

          {weatherData && (
            <div className="mt-4 bg-gray-100 p-4 rounded">
              <h3 className="text-lg font-semibold">
                Weather in {weatherData.name}
              </h3>
              <p>Temperature: {weatherData.main.temp}°C</p>
              <p>Condition: {weatherData.weather[0].description}</p>
            </div>
          )}

          <h2 className="text-xl font-semibold mt-4">List of Places</h2>
          <h1>Filter places by category:</h1>
          <ul className="space-y-4">
            {places.map((place, index) => (
              <li
                key={index}
                onClick={() => handlePlaceClick(place)}
                className="border p-4 rounded cursor-pointer hover:bg-gray-100 transition"
              >
                <p>
                  <strong>Name:</strong> {place.name}
                </p>
                <p>
                  <strong>Type:</strong> {place.type}
                </p>
                <p>
                  <strong>Address:</strong> {place.address}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PlacesPage;
