import { useNavigate } from "react-router-dom";

/**
 * NotFoundPage Component
 *
 * Handles unmatched routes (404 Error) by displaying a user-friendly error message
 * and a convenient button to safely redirect the user back to the home page.
 */
export default function NotFoundPage() {
  // Hook to handle programmatic navigation back to safety
  const navigate = useNavigate();

  return (
    <div className="container" style={{ textAlign: "center" }}>
      {/* HTTP 404 Status Code Heading */}
      <h2>404</h2>

      {/* Friendly error description message */}
      <p style={{ fontSize: "1.2em", marginBottom: "30px" }}>
        Oops! Page not found.
      </p>

      {/* Action button to return the user to the landing page */}
      <button onClick={() => navigate("/")}>Back to Home</button>
    </div>
  );
}
