import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PredictionForm from "../components/PredictionForm";
import { predictPrice, PredictionApiError } from "../api/predictionClient";
import type { PredictionRequest } from "../types/prediction";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function handleSubmit(payload: PredictionRequest) {
    setIsLoading(true);
    setError(null);
    try {
      const result = await predictPrice(payload);
      navigate("/result", { state: { predictedPrice: result.predicted_price } });
    } catch (err) {
      setError(err instanceof PredictionApiError ? err.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="page">
      <h1>House Price Predictor</h1>
      <p>Enter the property details below to get an estimated price.</p>
      {error && <div className="banner banner-error">{error}</div>}
      <PredictionForm onSubmit={handleSubmit} isLoading={isLoading} />
    </main>
  );
}
