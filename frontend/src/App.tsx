import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ResultPage from "./pages/ResultPage";
import NotFoundPage from "./pages/NotFoundPage";

/**
 * App Component
 *
 * The root component of the frontend application.
 * Sets up client-side routing using React Router, defining paths for
 * the homepage, result page, and catching undefined routes with a 404 page.
 */
export default function App() {
  return (
    <Router>
      {/* Define the main routing switch container */}
      <Routes>
        {/* Route for the default landing / prediction input page */}
        <Route path="/" element={<HomePage />} />

        {/* Route for displaying the price prediction calculation outcome */}
        <Route path="/result" element={<ResultPage />} />

        {/* Catch-all wildcard route for handling unmatched URLs (404 Not Found) */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}
