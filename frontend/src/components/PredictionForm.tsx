import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { predictPrice } from "../api/predictionClient";

export default function PredictionForm() {
  const navigate = useNavigate();

  // Initialize form state with all 9 features required by the model
  const [formData, setFormData] = useState<any>({
    location_clean: "",
    Area_sqft: "",
    Bathroom: "",
    Balcony: "",
    Floor_Num: "",
    furnishing: "Semi-Furnished",
    transaction: "Resale",
    ownership: "Freehold",
    facing: "North",
  });

  const [loading, setLoading] = useState(false);
  const [activeErrorField, setActiveErrorField] = useState<string | null>(null);
  const [isFadingOut, setIsFadingOut] = useState(false);

  // References for handling keyboard navigation across inputs
  const input2Ref = useRef<HTMLInputElement>(null);
  const input3Ref = useRef<HTMLInputElement>(null);
  const input4Ref = useRef<HTMLInputElement>(null);
  const input5Ref = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { id, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [id]: value,
    }));

    if (activeErrorField === id) {
      setIsFadingOut(true);
      setTimeout(() => {
        setActiveErrorField(null);
        setIsFadingOut(false);
      }, 400);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent,
    nextRef?: React.RefObject<HTMLInputElement | null>,
  ) => {
    if (e.key === "Enter") {
      if (nextRef && nextRef.current) {
        e.preventDefault();
        nextRef.current.focus();
      }
    }
  };

  const triggerSmoothError = (fieldName: string) => {
    setIsFadingOut(false);
    setActiveErrorField(fieldName);

    setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(() => {
        setActiveErrorField(null);
        setIsFadingOut(false);
      }, 400);
    }, 3000);
  };

  const predictPriceHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.location_clean) {
      triggerSmoothError("location_clean");
      return;
    }
    if (!formData.Area_sqft) {
      triggerSmoothError("Area_sqft");
      return;
    }
    if (!formData.Bathroom) {
      triggerSmoothError("Bathroom");
      return;
    }
    if (!formData.Balcony) {
      triggerSmoothError("Balcony");
      return;
    }
    if (!formData.Floor_Num) {
      triggerSmoothError("Floor_Num");
      return;
    }

    // Map frontend fields to backend expected payload keys
    const payload: any = {
      location: formData.location_clean,
      carpet_area_sqft: parseFloat(formData.Area_sqft),
      floor_num: parseInt(formData.Floor_Num),
      bathroom: parseInt(formData.Bathroom),
      balcony: parseInt(formData.Balcony),
      furnishing: formData.furnishing,
      transaction: formData.transaction,
      ownership: formData.ownership,
      facing: formData.facing,
    };

    setLoading(true);
    try {
      const res: any = await predictPrice(payload);
      navigate("/result", {
        state: {
          predictedPrice: res.predicted_price,
          currency: res.currency || "₹",
        },
      });
    } catch (err: any) {
      console.error(err);
      alert("Connection failed! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>House Price Predictor</h2>

      <form id="predictionForm" onSubmit={predictPriceHandler} noValidate>
        {/* Location Input */}
        <div className="input-group">
          <input
            type="text"
            id="location_clean"
            placeholder="Location"
            value={formData.location_clean}
            onChange={handleChange}
            onKeyDown={(e) => handleKeyDown(e, input2Ref)}
          />
          {activeErrorField === "location_clean" && (
            <span
              className={`field-error-msg ${isFadingOut ? "fade-out" : ""}`}
            >
              Please fill in this field.
            </span>
          )}
        </div>

        {/* Area (Sqft) Input */}
        <div className="input-group">
          <input
            ref={input2Ref}
            type="number"
            id="Area_sqft"
            placeholder="Area (Sqft)"
            value={formData.Area_sqft}
            onChange={handleChange}
            onKeyDown={(e) => handleKeyDown(e, input3Ref)}
          />
          {activeErrorField === "Area_sqft" && (
            <span
              className={`field-error-msg ${isFadingOut ? "fade-out" : ""}`}
            >
              Please fill in this field.
            </span>
          )}
        </div>

        {/* Bathrooms Input */}
        <div className="input-group">
          <input
            ref={input3Ref}
            type="number"
            id="Bathroom"
            placeholder="Bathrooms"
            value={formData.Bathroom}
            onChange={handleChange}
            onKeyDown={(e) => handleKeyDown(e, input4Ref)}
          />
          {activeErrorField === "Bathroom" && (
            <span
              className={`field-error-msg ${isFadingOut ? "fade-out" : ""}`}
            >
              Please fill in this field.
            </span>
          )}
        </div>

        {/* Balconies Input */}
        <div className="input-group">
          <input
            ref={input4Ref}
            type="number"
            id="Balcony"
            placeholder="Balconies"
            value={formData.Balcony}
            onChange={handleChange}
            onKeyDown={(e) => handleKeyDown(e, input5Ref)}
          />
          {activeErrorField === "Balcony" && (
            <span
              className={`field-error-msg ${isFadingOut ? "fade-out" : ""}`}
            >
              Please fill in this field.
            </span>
          )}
        </div>

        {/* Floor Number Input */}
        <div className="input-group">
          <input
            ref={input5Ref}
            type="number"
            id="Floor_Num"
            placeholder="Floor Number"
            value={formData.Floor_Num}
            onChange={handleChange}
          />
          {activeErrorField === "Floor_Num" && (
            <span
              className={`field-error-msg ${isFadingOut ? "fade-out" : ""}`}
            >
              Please fill in this field.
            </span>
          )}
        </div>

        {/* Furnishing Select */}
        <div className="input-group">
          <select
            id="furnishing"
            value={formData.furnishing}
            onChange={handleChange}
          >
            <option value="Furnished">Furnished</option>
            <option value="Semi-Furnished">Semi-Furnished</option>
            <option value="Unfurnished">Unfurnished</option>
          </select>
        </div>

        {/* Transaction Select */}
        <div className="input-group">
          <select
            id="transaction"
            value={formData.transaction}
            onChange={handleChange}
          >
            <option value="Resale">Resale</option>
            <option value="New Property">New Property</option>
          </select>
        </div>

        {/* Ownership Select */}
        <div className="input-group">
          <select
            id="ownership"
            value={formData.ownership}
            onChange={handleChange}
          >
            <option value="Freehold">Freehold</option>
            <option value="Leasehold">Leasehold</option>
            <option value="Co-operative society">Co-operative society</option>
            <option value="Power of Attorney">Power of Attorney</option>
          </select>
        </div>

        {/* Facing Select */}
        <div className="input-group">
          <select id="facing" value={formData.facing} onChange={handleChange}>
            <option value="North">North</option>
            <option value="South">South</option>
            <option value="East">East</option>
            <option value="West">West</option>
            <option value="North-East">North-East</option>
            <option value="North-West">North-West</option>
            <option value="South-East">South-East</option>
            <option value="South-West">South-West</option>
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Predicting..." : "Predict Price"}
        </button>
      </form>
    </div>
  );
}
