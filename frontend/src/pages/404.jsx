import { useNavigate } from "react-router-dom";
import React from "react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div style={{
      height         : "100vh",
      display        : "flex",
      flexDirection  : "column",
      alignItems     : "center",
      justifyContent : "center",
      background     : "#0f172a",
      color          : "#f1f5f9",
      textAlign      : "center",
      padding        : "24px",
    }}>

      {/* Big 404 */}
      <h1 style={{
        fontSize  : "8rem",
        fontWeight: 700,
        color     : "#2dd4bf",
        margin    : 0,
        lineHeight: 1,
      }}>
        404
      </h1>

      {/* Message */}
      <h2 style={{ fontSize: "1.5rem", fontWeight: 600, margin: "16px 0 8px" }}>
        Page Not Found
      </h2>
      <p style={{ color: "#94a3b8", fontSize: "0.95rem", marginBottom: "32px" }}>
        The page you are looking for does not exist.
      </p>

      {/* Buttons */}
      <div style={{ display: "flex", gap: "12px" }}>

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          style={{
            padding      : "10px 24px",
            borderRadius : "8px",
            border       : "1px solid #334155",
            background   : "transparent",
            color        : "#94a3b8",
            fontSize     : "0.9rem",
            cursor       : "pointer",
          }}
        >
          ← Go Back
        </button>

        {/* Home button */}
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            padding      : "10px 24px",
            borderRadius : "8px",
            border       : "none",
            background   : "#2dd4bf",
            color        : "#0f172a",
            fontSize     : "0.9rem",
            fontWeight   : 600,
            cursor       : "pointer",
          }}
        >
          Go to Dashboard
        </button>

      </div>
    </div>
  );
}