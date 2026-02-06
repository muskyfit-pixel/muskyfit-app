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
        overflowX: "hidden",
        boxSizing: "border-box",
      }}
    >
      <h1
        style={{
          fontSize: 14,
          fontWeight: 600,
          marginBottom: 12,
        }}
      >
        MEMBER DATABASE
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
          {/* NAME — SMALLER */}
          <h2
            style={{
              margin: 0,
              fontSize: 16,
              fontWeight: 700,
              lineHeight: 1.2,
            }}
          >
            {m.name}
          </h2>

          {/* SUBTEXT */}
          <p
            style={{
              margin: "6px 0 10px",
              fontSize: 12,
              color: "#666",
            }}
          >
            {m.goal} • {m.days}
          </p>

          {/* BUTTON — SMALLER */}
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
