import { useNavigate } from "react-router-dom";

type Member = {
  id: string;
  name: string;
  goal: string;
  status: string;
};

export default function CoachPortal() {
  const navigate = useNavigate();

  const members: Member[] = [
    {
      id: "1",
      name: "Mitesh Mistry",
      goal: "Strength",
      status: "active",
    },
    {
      id: "2",
      name: "Jane Member",
      goal: "Health",
      status: "active",
    },
  ];

  return (
    <div style={{ width: "100%", padding: 16 }}>
      <h1 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>
        Coach Portal
      </h1>

      {members.map((m) => (
        <button
          key={m.id}
          onClick={() => navigate("/dashboard")}
          style={{
            width: "100%",
            padding: 12,
            marginBottom: 10,
            borderRadius: 8,
            border: "1px solid #333",
            background: "#111",
            color: "#fff",
            textAlign: "left",
          }}
        >
          <div style={{ fontWeight: 600 }}>{m.name}</div>
          <div style={{ fontSize: 13, opacity: 0.8 }}>{m.goal}</div>
          <div style={{ fontSize: 12, opacity: 0.6 }}>{m.status}</div>
        </button>
      ))}
    </div>
  );
}
