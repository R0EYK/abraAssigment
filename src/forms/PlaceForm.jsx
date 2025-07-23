import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const PlaceForm = () => {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const onSubmit = async () => {
    if (!name || !type || !address) {
      setError("All fields are required.");
      return;
    }
    if (name.length > 25) {
      setError("Name must be 25 characters or fewer.");
      return;
    }

    setError("");
    setLoading(true);
    const newPlace = { name, type, address };
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const existing = JSON.parse(localStorage.getItem("places") || "[]");
    localStorage.setItem("places", JSON.stringify([...existing, newPlace]));
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-6 p-4">
      <button
        onClick={() => navigate("/places")}
        className=" px-4 py-2 rounded"
      >
        Go see your saves places
      </button>
      <h1 className="text-2xl font-semibold">
        Please enter your place details
      </h1>

      {error && <p className="text-red-500">{error}</p>}

      <Input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <Select value={type} onValueChange={setType}>
        <SelectTrigger>
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="restaurant">Restaurant</SelectItem>
          <SelectItem value="hotel">Hotel</SelectItem>
          <SelectItem value="park">Park</SelectItem>
        </SelectContent>
      </Select>

      <Input
        placeholder="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      <Button className="text-black" onClick={onSubmit} disabled={loading}>
        {loading ? "Submitting..." : "Submit"}
      </Button>
    </div>
  );
};

export default PlaceForm;
