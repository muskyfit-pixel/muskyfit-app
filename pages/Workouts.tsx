import { useState, useEffect } from "react";
import { Play, Save } from "lucide-react";
import BaseLayout from "../components/BaseLayout";
import { storage } from "../services/storageService";
import {
  Workout,
  ClientProfile,
  WorkoutSession,
  SetLog,
} from "../types";

export default function Workouts() {
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSession, setActiveSession] = useState<WorkoutSession | null>(null);
  const [sessionLogs, setSessionLogs] = useState<Record<string, SetLog[]>>({});

  useEffect(() => {
    const user = storage.getAuth();
    if (user) {
      const current = storage.getProfileById(user.id);
      if (current) setProfile(current);
    }
    setLoading(false);
  }, []);

  const getLastWeight = (exerciseId: string) => {
    if (!profile?.workouts) return 0;
    for (const w of profile.workouts) {
      const ex = w.exercises.find((e) => e.exerciseId === exerciseId);
      if (ex?.logs?.length) return ex.logs[0].weight;
    }
    return 0;
  };

  const startSession = (session: WorkoutSession) => {
    const logs: Record<string, SetLog[]> = {};
    session.exercises.forEach((ex) => {
      const last = getLastWeight(ex.exerciseId);
      const reps = parseInt(ex.reps.split("-")[0]) || 8;
      logs[ex.exerciseId] = Array.from({ length: ex.sets }).map(() => ({
        weight: last,
        reps,
      }));
    });
    setSessionLogs(logs);
    setActiveSession(session);
  };

  const updateSet = (
    exerciseId: string,
    idx: number,
    field: keyof SetLog,
    value: string
  ) => {
    const num = value === "" ? 0 : Number(value);
    setSessionLogs((prev) => {
      const updated = [...prev[exerciseId]];
      updated[idx] = { ...updated[idx], [field]: num };
      return { ...prev, [exerciseId]: updated };
    });
  };

  const saveSession = () => {
    if (!profile || !activeSession) return;

    const workout: Workout = {
      id: Date.now().toString(),
      name: activeSession.title,
      type: "Strength",
      duration: 60,
      date: new Date().toISOString(),
      exercises: activeSession.exercises.map((ex) => ({
        ...ex,
        logs: sessionLogs[ex.exerciseId],
      })),
    };

    const updated = {
      ...profile,
      workouts: [workout, ...(profile.workouts || [])],
    };

    storage.saveRecord(updated);
    setProfile(updated);
    setActiveSession(null);
  };

  if (loading) {
    return (
      <BaseLayout>
        <p>Loading workouts…</p>
      </BaseLayout>
    );
  }

  /* ===============================
     ACTIVE SESSION (LOGGER)
     =============================== */
  if (activeSession) {
    return (
      <BaseLayout>
        <h1 style={styles.title}>{activeSession.title}</h1>

        {activeSession.exercises.map((ex, exIdx) => (
          <div key={exIdx} style={styles.card}>
            <div style={styles.cardHeader}>
              <div>
                <div style={styles.label}>
                  {exIdx < 2 ? "Main exercise" : "Support exercise"}
                </div>
                <div style={styles.exerciseName}>{ex.name}</div>
              </div>
              <div style={styles.sets}>
                {ex.sets} × {ex.reps}
              </div>
            </div>

            {sessionLogs[ex.exerciseId]?.map((set, sIdx) => (
              <div key={sIdx} style={styles.setRow}>
                <span style={styles.setIndex}>{sIdx + 1}</span>

                <input
                  type="number"
                  value={set.weight}
                  onChange={(e) =>
                    updateSet(ex.exerciseId, sIdx, "weight", e.target.value)
                  }
                  style={styles.input}
                  placeholder="kg"
                />

                <input
                  type="number"
                  value={set.reps}
                  onChange={(e) =>
                    updateSet(ex.exerciseId, sIdx, "reps", e.target.value)
                  }
                  style={styles.input}
                  placeholder="reps"
                />
              </div>
            ))}
          </div>
        ))}

        <button onClick={saveSession} style={styles.primaryButton}>
          <Save size={14} /> Save workout
        </button>
      </BaseLayout>
    );
  }

  /* ===============================
     SESSION LIST
     =============================== */
  return (
    <BaseLayout>
      <h1 style={styles.title}>Workouts</h1>

      {profile?.plan ? (
        profile.plan.sessions.map((s, idx) => (
          <div key={idx} style={styles.card}>
            <div style={styles.exerciseName}>{s.title}</div>
            <button
              onClick={() => startSession(s)}
              style={styles.secondaryButton}
            >
              <Play size={14} /> Start
            </button>
          </div>
        ))
      ) : (
        <p>No plan assigned yet.</p>
      )}
    </BaseLayout>
  );
}

/* ===============================
   STYLES — SIGN-IN SCALE
   =============================== */

const styles: Record<string, React.CSSProperties> = {
  title: {
    fontSize: 18,
    fontWeight: 600,
    textAlign: "center",
    marginBottom: 12,
  },
  card: {
    background: "#fff",
    border: "1px solid #ddd",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    fontSize: 11,
    color: "#888",
    textTransform: "uppercase",
  },
  exerciseName: {
    fontSize: 14,
    fontWeight: 600,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  sets: {
    fontSize: 12,
    fontWeight: 600,
  },
  setRow: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  setIndex: {
    width: 20,
    textAlign: "center",
    fontSize: 12,
    color: "#aaa",
  },
  input: {
    flex: 1,
    padding: 8,
    fontSize: 13,
    borderRadius: 8,
    border: "1px solid #ccc",
    textAlign: "center",
  },
  primaryButton: {
    width: "100%",
    padding: "12px 14px",
    fontSize: 14,
    fontWeight: 600,
    borderRadius: 10,
    border: "none",
    background: "#000",
    color: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  secondaryButton: {
    marginTop: 8,
    width: "100%",
    padding: "10px",
    fontSize: 13,
    borderRadius: 10,
    border: "1px solid #ddd",
    background: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
};
