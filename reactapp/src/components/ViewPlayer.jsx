import React, { useEffect, useState } from "react";
import "./ViewPlayer.css";

const BACKEND = "http://localhost:8080";

const fetchJson = async (url) => {
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const text = await res.text();
    let parsed = null;
    try {
      parsed = text ? JSON.parse(text) : null;
    } catch (e) {
      console.error("Response not valid JSON:", text);
    }

    return { ok: res.ok, status: res.status, body: parsed };
  } catch (err) {
    console.error("Network error:", err);
    throw err;
  }
};

const ViewPlayer = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPlayers = async () => {
    setLoading(true);
    setError(null);

    try {
      const { ok, status, body } = await fetchJson(`${BACKEND}/getAllPlayer`);
      if (!ok) {
        setPlayers([]);
        setError(`Failed to fetch players (status ${status})`);
        return;
      }

      let arr = [];
      if (Array.isArray(body)) {
        arr = body;
      } else if (body && Array.isArray(body.data)) {
        arr = body.data;
      } else if (body && typeof body === "object") {
        arr = [body];
      }

      setPlayers(arr);
    } catch (err) {
      setPlayers([]);
      setError("Network or parsing error — check console.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlayers();
    // if you ever want to auto-refresh, you can setInterval here
    // return cleanup if you do
  }, []);

  return (
    
    <div className="view-container">
      
      <h2>All Players</h2>

      {loading ? (
        <div className="msg">
          <span className="spinner" aria-hidden="true" /> Loading players…
        </div>
      ) : error ? (
        <div className="msg error-msg" role="alert">
          {error}
        </div>
      ) : players.length === 0 ? (
        <div className="msg">No players found.</div>
      ) : (
        <div className="table-card" role="region" aria-label="Players table">
          <div className="table-scroll">
            <table className="players-table">
              <thead>
                <tr>
                  <th>Player Name</th>
                  <th>Player City</th>
                  <th>Phone</th>
                  <th>Played In</th>
                  <th>Player Type</th>
                  <th>Last Played For</th>
                </tr>
              </thead>
              <tbody>
                {players.map((p, idx) => {
                  const key = p.playerId ?? p.id ?? `p-${idx}`;
                  return (
                    <tr key={key}>
                      <td data-label="Player Name">{p.playerName ?? p.name ?? "-"}</td>
                      <td data-label="Player City">{p.playerCity ?? p.city ?? "-"}</td>
                      <td data-label="Phone">{p.phone ?? "-"}</td>
                      <td data-label="Played In">{p.playedIn ?? "-"}</td>
                      <td data-label="Player Type">{p.playerType ?? "-"}</td>
                      <td data-label="Last Played For">{p.lastPlayedFor ?? "-"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewPlayer;
