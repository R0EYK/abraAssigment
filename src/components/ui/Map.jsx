import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const MapComponent = () => {
  const [places, setPlaces] = useState([]);
  const [locations, setLocations] = useState([]);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("places") || "[]");
    setPlaces(stored);
  }, []);

  useEffect(() => {
    const fetchCoordinates = async () => {
      const coords = await Promise.all(
        places.map(async (place) => {
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
              place.address
            )}&key=${GOOGLE_MAPS_API_KEY}`
          );
          const data = await response.json();
          const location = data.results[0]?.geometry.location;
          return location
            ? { ...place, lat: location.lat, lng: location.lng }
            : null;
        })
      );
      setLocations(coords.filter(Boolean));
    };

    if (places.length > 0) {
      fetchCoordinates();
    }
  }, [places]);

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <GoogleMap
      zoom={10}
      center={locations[0] || { lat: 32.0853, lng: 34.7818 }}
      mapContainerStyle={{ width: "100vw", height: "100vh" }}
    >
      {locations.map((loc, index) => (
        <Marker key={index} position={{ lat: loc.lat, lng: loc.lng }} />
      ))}
    </GoogleMap>
  );
};

export default MapComponent;
