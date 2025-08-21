import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Configure backend here (adjust host/port or use https hosted URL)
 */
const BACKEND = "http://localhost:8080";
// OR if hosted use:
// const BACKEND = "https://8080-bbadebbcfeeedcbfddebbacbbcefccfc.premiumproject.examly.io";

/**
 * Helper to read stored credentials from sessionStorage (key 'neo_auth')
 */
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

/**
 * Helper to prompt and store credentials if not present.
 * (Copy of prompt helper used in AddPlayer)
 */
function getAuthHeader() {
  const key = "neo_auth";
  try {
    const raw = sessionStorage.getItem(key);
    if (raw) {
      const creds = JSON.parse(raw);
      return "Basic " + btoa(`${creds.username}:${creds.password}`);
    }
  } catch (e) {
    // ignore
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

const ViewPlayer = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const doGet = async (url, auth) => {
    console.log("GET ->", url);
    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: auth,
        },
      });
      const text = await res.text().catch(() => "");
      if (!res.ok) {
        console.warn(`GET ${url} returned status ${res.status}`);
        return { ok: false, status: res.status, rawText: text };
      }
      // try to parse JSON
      try {
        const json = text ? JSON.parse(text) : [];
        return { ok: true, body: json };
      } catch (e) {
        console.warn("Failed to parse JSON from", url, e);
        return { ok: false, status: res.status, rawText: text };
      }
    } catch (err) {
      console.error("Network/fetch error when GET", url, err);
      return { ok: false, error: err };
    }
  };

  const loadPlayers = async () => {
    setLoading(true);

    let auth = readAuthHeader();
    if (!auth) {
      auth = getAuthHeader();
      if (!auth) {
        setPlayers([]);
        setLoading(false);
        return;
      }
    }

    try {
      // 1) Try relative (works if proxy configured)
      let result = await doGet("/getAllPlayer", auth);

      // 2) If relative failed, try configured BACKEND
      if (!result.ok) {
        console.warn("Relative GET failed or non-ok, trying BACKEND...", result);
        result = await doGet(`${BACKEND}/getAllPlayer`, auth);
      }

      // 3) fallback: known hosted examly url (in case BACKEND isn't correct)
      if (!result.ok) {
        console.warn("BACKEND GET failed, trying hosted fallback...");
        result = await doGet(
          "https://localhost:8080/getAllPlayer",
          auth
        );
      }

      if (!result.ok) {
        if (result.error) {
          // network level
          console.error("Network error loading players:", result.error);
        } else {
          console.error("Server error loading players:", result.status, result.rawText || "");
        }
        setPlayers([]);
      } else {
        setPlayers(Array.isArray(result.body) ? result.body : []);
      }
    } catch (err) {
      console.error("Unhandled error loading players:", err);
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlayers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="view-player" style={{ padding: 20 }}>
      <h2>All Players</h2>

      <div style={{ marginBottom: 12 }}>
        <button onClick={loadPlayers}>Refresh</button>
        <button
          onClick={() => {
            sessionStorage.removeItem("neo_auth");
            alert("Logged out (session).");
            navigate("/");
          }}
          style={{ marginLeft: 8 }}
        >
          Logout
        </button>
      </div>

      {loading ? (
        <div>Loading players…</div>
      ) : players.length === 0 ? (
        <div>No players registered yet.</div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: 8 }}>Player Name</th>
                <th style={{ textAlign: "left", padding: 8 }}>Player City</th>
                <th style={{ textAlign: "left", padding: 8 }}>Phone</th>
                <th style={{ textAlign: "left", padding: 8 }}>Played In</th>
                <th style={{ textAlign: "left", padding: 8 }}>Player Type</th>
                <th style={{ textAlign: "left", padding: 8 }}>Last Played For</th>
              </tr>
            </thead>
            <tbody>
              {players.map((p, idx) => (
                <tr key={p.playerId ?? idx}>
                  <td style={{ padding: 8 }}>{p.playerName}</td>
                  <td style={{ padding: 8 }}>{p.playerCity}</td>
                  <td style={{ padding: 8 }}>{p.phone}</td>
                  <td style={{ padding: 8 }}>{p.playedIn}</td>
                  <td style={{ padding: 8 }}>{p.playerType}</td>
                  <td style={{ padding: 8 }}>{p.lastPlayedFor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewPlayer;
