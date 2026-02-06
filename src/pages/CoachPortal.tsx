import { useNavigate } from "react-router-dom";

return (
  <div style={{ width: "100%", overflow: "hidden" }}>


const members = [
  {
    id: "1",
    name: "Mitesh Mistry",
    goal: "Strength",
    days: "6 days / week",
    status: "reviewing",
  },
  {
    id: "2",
    name: "Jane Member",
    goal: "Health",
    days: "4 days / week",
    status: "active",
  },
];

export default function CoachPortal() {
  const navigate = useNavigate();

  return (
    <div style={{ width: "100%" }}>
      {/* HEADER */}
      <h1
        style={{
          fontSize: 16,
          fontWeight: 700,
          marginBottom: 6,
        }}
      >
        Member database
      </h1>

      <p
        style={{
          fontSize: 12,
          color: "#bdbdbd",
          marginBottom: 14,
        }}
      >
        {members.length} profiles
      </p>

      {/* LIST */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {members.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => navigate("/coach")}
            style={{
              width: "100%",
              textAlign: "left",
              background: "#121212",
              border: "1px solid #1f1f1f",
              borderRadius: 12,
              padding: "10px 12px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer",
              outline: "none",
            }}
          >
            <div style={{ minWidth: 0 }}>
              {/* NAME — SMALLER */}
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  lineHeight: "16px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {m.name}
              </div>

              {/* SUBTEXT — SMALLER */}
              <div
                style={{
                  fontSize: 11,
                  color: "#9e9e9e",
                  marginTop: 2,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {m.goal} • {m.days}
              </div>
            </div>

            <div
              style={{
                fontSize: 10,
                padding: "4px 8px",
                borderRadius: 999,
                background: m.status === "active" ? "#1dbf73" : "#e4512e",
                color: "#fff",
                fontWeight: 700,
                textTransform: "uppercase",
                flexShrink: 0,
                marginLeft: 10,
              }}
            >
              {m.status}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
