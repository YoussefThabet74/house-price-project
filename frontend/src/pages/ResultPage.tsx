import { useLocation, useNavigate } from "react-router-dom";

/**
 * ResultPage Component
 *
 * Displays the predicted house price received from the backend navigation state,
 * along with the currency unit, and provides a button to reset and perform a new prediction.
 */
export default function ResultPage() {
  // Hook to access router state passed from the previous page
  const location = useLocation();

  // Hook to programmatically navigate between routes
  const navigate = useNavigate();

  // Extract predictedPrice and currency from location state, with safe default fallback values
  const { predictedPrice, currency } = location.state || {
    predictedPrice: "N/A",
    currency: "Rupees",
  };

  return (
    <div className="container" style={{ textAlign: "center" }}>
      {/* Page Title */}
      <h2>Prediction Result</h2>

      {/* Display the main predicted price outcome */}
      <div id="result" style={{ fontSize: "1.8em", margin: "30px 0" }}>
        Price: {predictedPrice} {currency}
      </div>

      {/* Button to navigate back to the home page for a new prediction */}
      <button onClick={() => navigate("/")}>Predict Another House</button>
    </div>
  );
}
