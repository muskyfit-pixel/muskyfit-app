<div
  style={{
    background: "black",
    color: "lime",
    padding: 6,
    fontSize: 11,
    textAlign: "center",
  }}
>
  BUILD v1.0.7 – 06 FEB 2026
</div>


import { useNavigate } from "react-router-dom";

const members = [
  {
    id: "1",
    name: "Mitesh Mistry",
    goal: "Strength",
    days: "6 days/week",
  },
];

export default function MemberDatabase() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        maxWidth: 420,
        margin: "0 auto",
        padding: 16,
        boxSizing: "border-box",
      }}
    >
      {/* DEPLOY TEST HEADER */}
      <h1
        style={{
          fontSize: 14,
          background: "red",
          color: "white",
          padding: 8,
          textAlign: "center",
        }}
      >
        DEPLOY TEST – IF YOU SEE RED, IT WORKS
      </h1>

      {members.map((m) => (
        <div
          key={m.id}
          style={{
            width: "100%",
            padding: 14,
            borderRadius: 14,
            background: "#ffffff",
            marginBottom: 16,
            boxSizing: "border-box",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 15,
              fontWeight: 600,
            }}
          >
            {m.name}
          </h2>

          <p
            style={{
              margin: "4px 0 8px",
              fontSize: 12,
              color: "#555",
            }}
          >
            {m.goal} • {m.days}
          </p>

          <button
            type="button"
            onClick={() => navigate("/plan")}
            style={{
              width: "100%",
              padding: "10px 12px",
              fontSize: 13,
              borderRadius: 10,
              background: "#16a34a",
              color: "#ffffff",
              border: "none",
              fontWeight: 600,
            }}
          >
            AUTHORISE & BUILD PLAN
          </button>
        </div>
      ))}
    </div>
  );
}
