import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Configure backend here (adjust host/port or use https hosted URL)
 */
const BACKEND = "http://localhost:8080";
// OR if hosted use:
// const BACKEND = "https://8080-bbadebbcfeeedcbfddebbacbbcefccfc.premiumproject.examly.io";

function getAuthHeader() {
  const key = "neo_auth";
  try {
    const raw = sessionStorage.getItem(key);
    if (raw) {
      const creds = JSON.parse(raw);
      return "Basic " + btoa(`${creds.username}:${creds.password}`);
    }
  } catch (e) {
    // ignore parse errors
  }

  const username = prompt("Enter API username:");
  if (!username) return null;
  const password = prompt("Enter API password:");
  if (!password) return null;

  const obj = { username, password };
  try {
    sessionStorage.setItem(key, JSON.stringify(obj));
  } catch (e) {
    console.warn("sessionStorage set failed", e);
  }
  return "Basic " + btoa(`${username}:${password}`);
}

function readAuthHeader() {
  try {
    const raw = sessionStorage.getItem("neo_auth");
    if (!raw) return null;
    const creds = JSON.parse(raw);
    return "Basic " + btoa(`${creds.username}:${creds.password}`);
  } catch {
    return null;
  }
}

const initialState = {
  playerName: "",
  playerCity: "",
  phone: "",
  playedIn: "",
  playerType: "",
  lastPlayedFor: "",
};

export default function AddPlayer() {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const setField = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const validate = () => {
    const e = {};
    if (!form.playerName.trim()) e.playerName = "Name is required";
    if (!form.playerCity.trim()) e.playerCity = "Player City is required";
    if (!form.phone.trim()) e.phone = "Phone is required";
    if (!form.playedIn) e.playedIn = "Played In is required";
    if (!form.playerType) e.playerType = "Player Type is required";
    if (!form.lastPlayedFor) e.lastPlayedFor = "Last Played For is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    const payload = { ...form };

    // read stored credentials or prompt
    let auth = readAuthHeader();
    if (!auth) auth = getAuthHeader();
    if (!auth) {
      alert("Authentication required to save player.");
      setSubmitting(false);
      return;
    }

    async function doPost(url) {
      console.log("POST ->", url);
      console.log("Payload:", payload);
      console.log("Authorization header:", auth ? auth.slice(0, 12) + "..." : auth); // avoid logging full secret
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: auth,
          },
          body: JSON.stringify(payload),
        });
        const text = await res.text().catch(() => "");
        let parsed;
        try {
          parsed = text ? JSON.parse(text) : "";
        } catch (e) {
          parsed = text;
        }
        console.log(`Response from ${url} -> status: ${res.status}`, parsed);
        return { ok: res.ok, status: res.status, body: parsed, rawText: text };
      } catch (err) {
        console.error("Network/fetch error when posting to", url, err);
        return { ok: false, error: err };
      }
    }

    try {
      // Try relative path first (works if proxy is configured)
      let result = await doPost("/addPlayer");

      if (!result.ok) {
        // Try BACKEND constant
        console.warn("Relative POST failed or returned non-ok. Trying BACKEND...");
        result = await doPost(`${BACKEND}/addPlayer`);
      }

      if (!result.ok) {
        // Final fallback: known hosted Examly url (in case BACKEND isn't correct)
        console.warn("BACKEND POST failed. Trying hosted examly fallback...");
        result = await doPost(
          "https://localhost:8080/addPlayer"
        );
      }

      if (!result.ok) {
        if (result.error) {
          alert("Network error. See console for details.");
        } else {
          const msg =
            result.body && typeof result.body === "object"
              ? JSON.stringify(result.body)
              : result.rawText || result.status;
          alert("Failed to register player. Server response: " + msg);
        }
        setSubmitting(false);
        return;
      }

      // success
      alert("Thanks for the registration!");
      setForm(initialState);
      setErrors({});
      navigate("/viewplayer");
    } catch (err) {
      console.error("Unhandled error in handleSubmit:", err);
      alert("Unexpected error. See console.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: "24px auto", padding: 16 }}>
      <h2>Register a New Player</h2>

      <form onSubmit={handleSubmit} noValidate>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="playerName">Player Name:</label>
          <input
            id="playerName"
            name="playerName"
            type="text"
            value={form.playerName}
            onChange={setField}
            style={{ width: "100%", padding: 8, marginTop: 6 }}
          />
          {errors.playerName && <div style={{ color: "red", marginTop: 6 }}>{errors.playerName}</div>}
        </div>

        <div style={{ marginBottom: 12 }}>
          <label htmlFor="playerCity">Player City:</label>
          <input
            id="playerCity"
            name="playerCity"
            type="text"
            value={form.playerCity}
            onChange={setField}
            style={{ width: "100%", padding: 8, marginTop: 6 }}
          />
          {errors.playerCity && <div style={{ color: "red", marginTop: 6 }}>{errors.playerCity}</div>}
        </div>

        <div style={{ marginBottom: 12 }}>
          <label htmlFor="phone">Phone:</label>
          <input
            id="phone"
            name="phone"
            type="text"
            value={form.phone}
            onChange={setField}
            style={{ width: "100%", padding: 8, marginTop: 6 }}
          />
          {errors.phone && <div style={{ color: "red", marginTop: 6 }}>{errors.phone}</div>}
        </div>

        <div style={{ marginBottom: 12 }}>
          <label htmlFor="playedIn">Played In:</label>
          <select
            id="playedIn"
            name="playedIn"
            value={form.playedIn}
            onChange={setField}
            style={{ width: "100%", padding: 8, marginTop: 6 }}
          >
            <option value="">-- Select --</option>
            <option value="Domestic">Domestic</option>
            <option value="International">International</option>
            <option value="National">National</option>
          </select>
          {errors.playedIn && <div style={{ color: "red", marginTop: 6 }}>{errors.playedIn}</div>}
        </div>

        <div style={{ marginBottom: 12 }}>
          <label htmlFor="playerType">Player Type:</label>
          <select
            id="playerType"
            name="playerType"
            value={form.playerType}
            onChange={setField}
            style={{ width: "100%", padding: 8, marginTop: 6 }}
          >
            <option value="">-- Select --</option>
            <option value="Batsman">Batsman</option>
            <option value="Bowler">Bowler</option>
            <option value="All-Rounder">All-Rounder</option>
          </select>
          {errors.playerType && <div style={{ color: "red", marginTop: 6 }}>{errors.playerType}</div>}
        </div>

        <div style={{ marginBottom: 16 }}>
          <label htmlFor="lastPlayedFor">Last Played For:</label>
          <select
            id="lastPlayedFor"
            name="lastPlayedFor"
            value={form.lastPlayedFor}
            onChange={setField}
            style={{ width: "100%", padding: 8, marginTop: 6 }}
          >
            <option value="">-- Select --</option>
            <option value="Team A">Team A</option>
            <option value="Team B">Team B</option>
            <option value="Team C">Team C</option>
            <option value="Team D">Team D</option>
            <option value="Team E">Team E</option>
            <option value="Team F">Team F</option>
          </select>
          {errors.lastPlayedFor && <div style={{ color: "red", marginTop: 6 }}>{errors.lastPlayedFor}</div>}
        </div>

        <button
          type="submit"
          disabled={submitting}
          style={{ padding: "8px 14px", background: "#28a745", color: "#fff", border: "none", borderRadius: 4 }}
        >
          {submitting ? "Registering..." : "Register Player"}
        </button>
      </form>
    </div>
  );
}
