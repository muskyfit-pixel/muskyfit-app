import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MuskyLogo from "../components/MuskyLogo";

export default function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState<"member" | "coach">("member");

  return (
    <div className="page">
      <MuskyLogo size={56} />

      <div style={{ textAlign: "center" }}>
        <div className="h1">SIGN IN</div>
        <div className="subtle">OFFICIAL MUSKYFIT ENTRANCE</div>
      </div>

      <div className="role-toggle">
        <button
          className={`role-btn ${role === "member" ? "active" : ""}`}
          onClick={() => setRole("member")}
        >
          MEMBER
        </button>
        <button
          className={`role-btn ${role === "coach" ? "active" : ""}`}
          onClick={() => setRole("coach")}
        >
          COACH
        </button>
      </div>

      <input className="input" placeholder="Email address" />
      <input className="input" placeholder="Password" type="password" />

      <button
        className="btn btn-primary"
        onClick={() => navigate(role === "coach" ? "/coach" : "/member")}
      >
        SIGN IN
      </button>

      <div style={{ marginTop: 20 }} className="card">
        <strong>✨ QUICK DEMO ACCESS</strong>
        <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
          <button
            className="btn btn-light"
            onClick={() => navigate("/coach")}
          >
            COACH MODE
          </button>
          <button
            className="btn btn-light"
            onClick={() => navigate("/member")}
          >
            MEMBER MODE
          </button>
        </div>
      </div>
    </div>
  );
}
