import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddPlayer.css";

const BACKEND = "http://localhost:8080";

// Popup Component
const Popup = ({ message, onClose, type = "success" }) => {
  return (
    <div className="popup-overlay" role="dialog" aria-modal="true">
      <div className={`popup ${type}`}>
        <div className="popup-content">
          <h3>{type === "success" ? "Success!" : "Error"}</h3>
          <p>{message}</p>
          <button onClick={onClose} className="popup-close-btn">
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default function AddPlayer() {
  const [form, setForm] = useState({
    playerName: "",
    playerCity: "",
    phone: "",
    playedIn: "",
    playerType: "",
    lastPlayedFor: "",
  });

  const [errors, setErrors] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("success");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  // Helper: validation rules
  const rules = {
    playerName: {
      required: true,
      min: 2,
      max: 50,
      pattern: /^[a-zA-Z\s.'-]+$/, // allow spaces, dot, apostrophe, hyphen
      message:
        "Name must be 2-50 characters and contain only letters, spaces or . ' -",
    },
    playerCity: {
      required: true,
      min: 2,
      max: 50,
      pattern: /^[a-zA-Z\s.'-]+$/,
      message: "City must be 2-50 characters and contain only letters or spaces",
    },
    phone: {
      required: true,
      pattern: /^\d{10}$/,
      message: "Phone must be a 10-digit number (digits only)",
    },
    playedIn: {
      required: true,
      message: "Please select where the player has played",
    },
    playerType: {
      required: true,
      message: "Please select a player type",
    },
    lastPlayedFor: {
      required: true,
      message: "Please select the last team",
    },
  };

  // Validate a single field (used for blur and on change optionally)
  const validateField = (name, value) => {
    const rule = rules[name];
    if (!rule) return "";

    const trimmed = typeof value === "string" ? value.trim() : value;

    if (rule.required && (trimmed === "" || trimmed == null)) {
      return rule.message || "This field is required";
    }
    if (rule.pattern && !rule.pattern.test(trimmed)) {
      return rule.message || "Invalid value";
    }
    if (rule.min && trimmed.length < rule.min) {
      return `Must be at least ${rule.min} characters`;
    }
    if (rule.max && trimmed.length > rule.max) {
      return `Must be at most ${rule.max} characters`;
    }
    return "";
  };

  // Validate full form and return errors object
  const validateForm = () => {
    const newErrors = {};
    Object.keys(rules).forEach((field) => {
      const err = validateField(field, form[field]);
      if (err) newErrors[field] = err;
    });
    return newErrors;
  };

  // Update field and clear its error while typing
  const setField = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));

    // Optionally live-validate length/format while typing but keep it simple:
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validate on blur (immediate feedback)
  const handleBlur = (e) => {
    const { name, value } = e.target;
    const err = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: err }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Trim all string values before validating/submitting
    const trimmedForm = Object.fromEntries(
      Object.entries(form).map(([k, v]) =>
        typeof v === "string" ? [k, v.trim()] : [k, v]
      )
    );

    // Validate
    const formErrors = {};
    Object.keys(rules).forEach((field) => {
      const err = validateField(field, trimmedForm[field]);
      if (err) formErrors[field] = err;
    });

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      // focus the first errored field (optional)
      const firstField = Object.keys(formErrors)[0];
      const el = document.querySelector(`[name="${firstField}"]`);
      if (el && typeof el.focus === "function") el.focus();
      return;
    }

    // All good -> submit
    setIsSubmitting(true);
    try {
      const res = await fetch(`${BACKEND}/addPlayer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(trimmedForm),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Status ${res.status}: ${txt}`);
      }

      setPopupMessage("Thanks for the registration!");
      setPopupType("success");
      setShowPopup(true);

      // Optionally reset form
      setForm({
        playerName: "",
        playerCity: "",
        phone: "",
        playedIn: "",
        playerType: "",
        lastPlayedFor: "",
      });
      setErrors({});
    } catch (err) {
      console.error("Failed to post:", err);
      setPopupMessage(
        "Failed to register player. Please check your connection and try again."
      );
      setPopupType("error");
      setShowPopup(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    if (popupType === "success") {
      navigate("/viewplayer");
    }
  };

  return (
    <div className="form-container">
      {showPopup && (
        <Popup message={popupMessage} onClose={handlePopupClose} type={popupType} />
      )}

      <div className="form-card">
        <div className="form-header" />

        <form onSubmit={handleSubmit} className="player-form" noValidate>
          <h2>Register a New Player</h2>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="playerName">Player Name:</label>
              <input
                id="playerName"
                name="playerName"
                value={form.playerName}
                onChange={setField}
                onBlur={handleBlur}
                placeholder="Enter player name"
                className={errors.playerName ? "error-field" : ""}
                aria-invalid={!!errors.playerName}
                aria-describedby={errors.playerName ? "err-playerName" : undefined}
                autoComplete="name"
              />
              {errors.playerName && (
                <div className="error" id="err-playerName">
                  {errors.playerName}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="playerCity">Player City:</label>
              <input
                id="playerCity"
                name="playerCity"
                value={form.playerCity}
                onChange={setField}
                onBlur={handleBlur}
                placeholder="Enter city"
                className={errors.playerCity ? "error-field" : ""}
                aria-invalid={!!errors.playerCity}
                aria-describedby={errors.playerCity ? "err-playerCity" : undefined}
                autoComplete="address-level2"
              />
              {errors.playerCity && (
                <div className="error" id="err-playerCity">
                  {errors.playerCity}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone:</label>
              <input
                id="phone"
                name="phone"
                value={form.phone}
                onChange={setField}
                onBlur={handleBlur}
                placeholder="Enter phone number"
                className={errors.phone ? "error-field" : ""}
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? "err-phone" : undefined}
                inputMode="numeric"
                maxLength={10}
              />
              {errors.phone && (
                <div className="error" id="err-phone">
                  {errors.phone}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="playedIn">Played In:</label>
              <select
                id="playedIn"
                name="playedIn"
                value={form.playedIn}
                onChange={setField}
                onBlur={handleBlur}
                className={errors.playedIn ? "error-field" : ""}
                aria-invalid={!!errors.playedIn}
                aria-describedby={errors.playedIn ? "err-playedIn" : undefined}
              >
                <option value="">Select an option</option>
                <option value="Domestic">Domestic</option>
                <option value="International">International</option>
                <option value="Both">Both</option>
              </select>
              {errors.playedIn && (
                <div className="error" id="err-playedIn">
                  {errors.playedIn}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="playerType">Player Type:</label>
              <select
                id="playerType"
                name="playerType"
                value={form.playerType}
                onChange={setField}
                onBlur={handleBlur}
                className={errors.playerType ? "error-field" : ""}
                aria-invalid={!!errors.playerType}
                aria-describedby={errors.playerType ? "err-playerType" : undefined}
              >
                <option value="">Select a player type</option>
                <option value="Batsman">Batsman</option>
                <option value="Bowler">Bowler</option>
                <option value="Wicket-keeper">Wicket-keeper</option>
                <option value="All-rounder">All-rounder</option>
              </select>
              {errors.playerType && (
                <div className="error" id="err-playerType">
                  {errors.playerType}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="lastPlayedFor">Last Played For:</label>
              <select
                id="lastPlayedFor"
                name="lastPlayedFor"
                value={form.lastPlayedFor}
                onChange={setField}
                onBlur={handleBlur}
                className={errors.lastPlayedFor ? "error-field" : ""}
                aria-invalid={!!errors.lastPlayedFor}
                aria-describedby={errors.lastPlayedFor ? "err-lastPlayedFor" : undefined}
              >
                <option value="">Select an option</option>
                <option value="Team A">Team A</option>
                <option value="Team B">Team B</option>
                <option value="Team C">Team C</option>
                <option value="Team D">Team D</option>
              </select>
              {errors.lastPlayedFor && (
                <div className="error" id="err-lastPlayedFor">
                  {errors.lastPlayedFor}
                </div>
              )}
            </div>
          </div>

          <div className="divider" />

          <button
            type="submit"
            className="submit-btn"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            <span>{isSubmitting ? "Registering..." : "Register Player"}</span>
            <div className="icon" aria-hidden>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                <path fill="none" d="M0 0h24v24H0z"></path>
                <path
                  fill="currentColor"
                  d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
                ></path>
              </svg>
            </div>
          </button>
        </form>
      </div>
    </div>
  );
}
