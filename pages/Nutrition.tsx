import { useState, useEffect } from "react";
import { Search, Plus, X } from "lucide-react";
import BaseLayout from "../components/BaseLayout";
import { storage } from "../services/storageService";
import { FoodLog, ClientProfile } from "../types";
import { searchFoodCsv, FoodDatabaseItem } from "../services/foodService";

export default function Nutrition() {
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<FoodDatabaseItem[]>([]);
  const [selectedFood, setSelectedFood] = useState<FoodDatabaseItem | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const user = storage.getAuth();
    if (user) {
      const current = storage.getProfileById(user.id);
      if (current) setProfile(current);
    }
  }, []);

  useEffect(() => {
    if (searchTerm.length >= 2) {
      setResults(searchFoodCsv(searchTerm));
    } else {
      setResults([]);
    }
  }, [searchTerm]);

  const handleAddFood = () => {
    if (!selectedFood || !profile) return;

    const log: FoodLog = {
      id: Date.now().toString(),
      name: selectedFood.display_name,
      calories: Math.round(selectedFood.calories * quantity),
      protein: Math.round(selectedFood.protein * quantity),
      carbs: Math.round(selectedFood.carbs * quantity),
      fats: Math.round(selectedFood.fats * quantity),
      portion_unit: selectedFood.portion_unit,
      quantity,
      timestamp: new Date().toISOString(),
    };

    const updated = {
      ...profile,
      foodLogs: [log, ...(profile.foodLogs || [])],
    };

    storage.saveRecord(updated);
    setProfile(updated);
    setSelectedFood(null);
    setSearchTerm("");
  };

  const today = new Date().toDateString();
  const todayLogs = (profile?.foodLogs || []).filter(
    (l) => new Date(l.timestamp).toDateString() === today
  );

  return (
    <BaseLayout>
      {/* ===== TITLE ===== */}
      <h1 style={styles.title}>Nutrition</h1>

      {/* ===== SEARCH ===== */}
      <div style={styles.searchWrap}>
        <Search size={16} />
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search food"
          style={styles.search}
        />
      </div>

      {/* ===== SEARCH RESULTS ===== */}
      {results.length > 0 && (
        <div style={styles.results}>
          {results.map((f) => (
            <button
              key={f.id}
              onClick={() => {
                setSelectedFood(f);
                setQuantity(1);
              }}
              style={styles.resultRow}
            >
              <span style={styles.foodName}>{f.display_name}</span>
              <Plus size={14} />
            </button>
          ))}
        </div>
      )}

      {/* ===== TODAY LOGS ===== */}
      <div style={styles.section}>
        <div style={styles.sectionLabel}>Today</div>

        {todayLogs.map((l) => (
          <div key={l.id} style={styles.logRow}>
            <span style={styles.foodName}>
              {l.name} × {l.quantity}
            </span>
            <span style={styles.kcal}>{l.calories} kcal</span>
          </div>
        ))}
      </div>

      {/* ===== ADD FOOD MODAL ===== */}
      {selectedFood && (
        <div style={styles.modalBackdrop}>
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>{selectedFood.display_name}</h2>

            <div style={styles.qtyRow}>
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>

            <div style={styles.modalActions}>
              <button onClick={() => setSelectedFood(null)}>Cancel</button>
              <button onClick={handleAddFood}>Add</button>
            </div>
          </div>
        </div>
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

  searchWrap: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    border: "1px solid #ddd",
    borderRadius: 10,
    padding: "8px 10px",
    marginBottom: 12,
  },

  search: {
    border: "none",
    outline: "none",
    flex: 1,
    fontSize: 14,
  },

  results: {
    border: "1px solid #eee",
    borderRadius: 10,
    marginBottom: 16,
  },

  resultRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 12px",
    borderBottom: "1px solid #eee",
    background: "#fff",
    cursor: "pointer",
  },

  section: {
    marginTop: 8,
  },

  sectionLabel: {
    fontSize: 11,
    color: "#888",
    marginBottom: 6,
    textTransform: "uppercase",
  },

  logRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
    borderBottom: "1px solid #eee",
  },

  foodName: {
    fontSize: 13,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  kcal: {
    fontSize: 12,
    color: "#888",
    whiteSpace: "nowrap",
  },

  modalBackdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  modal: {
    background: "#fff",
    borderRadius: 12,
    padding: 16,
    width: "90%",
    maxWidth: 320,
  },

  modalTitle: {
    fontSize: 16,
    fontWeight: 600,
    marginBottom: 12,
  },

  qtyRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  modalActions: {
    display: "flex",
    gap: 8,
  },
};
