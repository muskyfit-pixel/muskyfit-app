import { Link } from "react-router-dom";

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
  return (
    <div>
      {/* HEADER — MATCH LOGIN */}
      <h1
        style={{
          fontSize: 18,
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
          marginBottom: 16,
        }}
      >
        {members.length} profiles
      </p>

      {/* LIST — DENSE, STABLE */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {members.map((m) => (
          <Link
            key={m.id}
            to="/dashboard"
            style={{
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div
              style={{
                background: "#121212",
                border: "1px solid #1f1f1f",
                borderRadius: 12,
                padding: "10px 12px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  {m.name}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "#9e9e9e",
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
                  background:
                    m.status === "active" ? "#1dbf73" : "#e4512e",
                  color: "#fff",
                  fontWeight: 600,
                  textTransform: "uppercase",
                }}
              >
                {m.status}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
