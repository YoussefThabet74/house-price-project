import PredictionForm from "../components/PredictionForm";

/**
 * HomePage Component
 *
 * This is the main entry point (home view) of the frontend application.
 * It renders the core house price prediction form component where users
 * can input property features and get valuation results.
 */
export default function HomePage() {
  // Render the prediction form as the primary view on the homepage
  return <PredictionForm />;
}
