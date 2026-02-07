import BaseLayout from "../components/BaseLayout";

type Props = {
  user?: {
    todayCalories?: number;
    todayProtein?: number;
    stepsToday?: number;
    lastWeight?: number | string;
  };
};

export default function Dashboard({ user }: Props) {
  const profile = user || {};

  return (
    <BaseLayout title="Your dashboard">
      {/* ===== DASHBOARD STATS ===== */}
      <div style={styles.grid}>
        <Stat
          label="Calories today"
          value={
            profile.todayCalories !== undefined
              ? `${profile.todayCalories} kcal`
              : "—"
          }
        />

        <Stat
          label="Protein today"
          value={
            profile.todayProtein !== undefined
              ? `${profile.todayProtein} g`
              : "—"
          }
        />

        <Stat
          label="Steps"
          value={
            profile.stepsToday !== undefined
              ? profile.stepsToday.toLocaleString()
              : "—"
          }
        />

        <Stat
          label="Last weigh-in"
          value={profile.lastWeight || "—"}
        />
      </div>
    </BaseLayout>
  );
}

/* ===============================
   STAT CARD (MOBILE FIRST)
   =============================== */

function Stat({ label, value }: { label: string; value: any }) {
  return (
    <div style={styles.card}>
      <div style={styles.label}>{label}</div>
      <div style={styles.value}>{value}</div>
    </div>
  );
}

/* ===============================
   STYLES — LOCKED TO SIGN-IN SCALE
   =============================== */

const styles: Record<string, React.CSSProperties> = {
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr", // 🔑 always single column on mobile
    gap: 12,
  },

  card: {
    background: "#111",
    borderRadius: 12,
    padding: "12px 14px",
    color: "#fff",
  },

  label: {
    fontSize: 11,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#aaa",
    marginBottom: 4,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  value: {
    fontSize: 16,
    fontWeight: 600,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
};
