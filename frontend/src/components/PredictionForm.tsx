import { useEffect, useState, type FormEvent } from "react";
import { fetchLocations } from "../api/predictionClient";
import type { PredictionRequest } from "../types/prediction";

interface Props {
  onSubmit: (payload: PredictionRequest) => void;
  isLoading: boolean;
}

const FURNISHING_OPTIONS = ["Furnished", "Semi-Furnished", "Unfurnished"] as const;
const TRANSACTION_OPTIONS = ["New Property", "Resale"] as const;
const OWNERSHIP_OPTIONS = ["Freehold", "Leasehold", "Co-operative Society", "Power of Attorney"];
const FACING_OPTIONS = ["East", "West", "North", "South", "North-East", "North-West", "South-East", "South-West"];

const initialForm: PredictionRequest = {
  location: "",
  carpet_area_sqft: 0,
  floor_num: 0,
  bathroom: 1,
  balcony: 0,
  furnishing: "Semi-Furnished",
  transaction: "Resale",
  ownership: "Freehold",
  facing: "East",
};

export default function PredictionForm({ onSubmit, isLoading }: Props) {
  const [form, setForm] = useState<PredictionRequest>(initialForm);
  const [locations, setLocations] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchLocations().then(setLocations);
  }, []);

  function validate(): boolean {
    const nextErrors: Record<string, string> = {};
    if (!form.location) nextErrors.location = "Please select a location.";
    if (!form.carpet_area_sqft || form.carpet_area_sqft <= 0) {
      nextErrors.carpet_area_sqft = "Area must be greater than 0.";
    }
    if (form.bathroom < 0) nextErrors.bathroom = "Bathrooms cannot be negative.";
    if (form.balcony < 0) nextErrors.balcony = "Balconies cannot be negative.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (validate()) onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="prediction-form">
      <label>
        Location
        <select
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        >
          <option value="">Select a location</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
        {errors.location && <span className="field-error">{errors.location}</span>}
      </label>

      <label>
        Carpet Area (sqft)
        <input
          type="number"
          min={1}
          value={form.carpet_area_sqft || ""}
          onChange={(e) => setForm({ ...form, carpet_area_sqft: Number(e.target.value) })}
        />
        {errors.carpet_area_sqft && <span className="field-error">{errors.carpet_area_sqft}</span>}
      </label>

      <label>
        Floor
        <input
          type="number"
          value={form.floor_num}
          onChange={(e) => setForm({ ...form, floor_num: Number(e.target.value) })}
        />
      </label>

      <label>
        Bathrooms
        <input
          type="number"
          min={0}
          value={form.bathroom}
          onChange={(e) => setForm({ ...form, bathroom: Number(e.target.value) })}
        />
        {errors.bathroom && <span className="field-error">{errors.bathroom}</span>}
      </label>

      <label>
        Balconies
        <input
          type="number"
          min={0}
          value={form.balcony}
          onChange={(e) => setForm({ ...form, balcony: Number(e.target.value) })}
        />
        {errors.balcony && <span className="field-error">{errors.balcony}</span>}
      </label>

      <label>
        Furnishing
        <select
          value={form.furnishing}
          onChange={(e) => setForm({ ...form, furnishing: e.target.value as PredictionRequest["furnishing"] })}
        >
          {FURNISHING_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </label>

      <label>
        Transaction
        <select
          value={form.transaction}
          onChange={(e) => setForm({ ...form, transaction: e.target.value as PredictionRequest["transaction"] })}
        >
          {TRANSACTION_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </label>

      <label>
        Ownership
        <select
          value={form.ownership}
          onChange={(e) => setForm({ ...form, ownership: e.target.value })}
        >
          {OWNERSHIP_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </label>

      <label>
        Facing
        <select value={form.facing} onChange={(e) => setForm({ ...form, facing: e.target.value })}>
          {FACING_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </label>

      <button type="submit" disabled={isLoading}>
        {isLoading ? "Predicting..." : "Predict Price"}
      </button>
    </form>
  );
}
