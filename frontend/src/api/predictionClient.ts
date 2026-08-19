import type {
  PredictionRequest,
  PredictionResponse,
} from "../types/prediction";

// Define the base URL for the backend API, falling back to localhost if not specified in environment variables
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

/**
 * Sends a house details payload to the backend API and returns the predicted price response.
 *
 * @param data - The house features and prediction parameters (PredictionRequest).
 * @returns A promise that resolves to the prediction result (PredictionResponse).
 * @throws Throws an error if the HTTP request fails or the API returns an error detail.
 */
export async function predictPrice(
  data: PredictionRequest,
): Promise<PredictionResponse> {
  // Make a POST request to the FastAPI /predict endpoint with JSON data
  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  // Handle non-2xx HTTP responses by extracting error details
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to fetch prediction");
  }

  // Parse and return the successful JSON response
  return response.json();
}
