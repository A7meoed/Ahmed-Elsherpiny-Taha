import type { PredictionRequest, PredictionResponse } from "../types/prediction";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export class PredictionApiError extends Error {}

export async function predictPrice(payload: PredictionRequest): Promise<PredictionResponse> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new PredictionApiError("Could not reach the prediction service. Is the backend running?");
  }

  if (!response.ok) {
    const detail = await response.json().catch(() => null);
    throw new PredictionApiError(detail?.detail ?? `Request failed with status ${response.status}`);
  }

  return (await response.json()) as PredictionResponse;
}

export async function fetchLocations(): Promise<string[]> {
  const response = await fetch("/locations.json");
  if (!response.ok) return [];
  return (await response.json()) as string[];
}
