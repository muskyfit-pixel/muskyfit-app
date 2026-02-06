import { useState, useRef } from "react";
import {
  Upload,
  RefreshCw,
  Download,
  Send,
} from "lucide-react";
import BaseLayout from "../components/BaseLayout";
import { editProgressPhoto } from "../services/geminiService";

export default function ProgressLab() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string);
      setEditedImage(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleEdit = async () => {
    if (!selectedImage || !prompt) return;

    setIsProcessing(true);
    setError(null);

    try {
      const base64 = selectedImage.split(",")[1];
      const mime = selectedImage.split(";")[0].split(":")[1];

      const result = await editProgressPhoto(base64, mime, prompt);
      if (result) setEditedImage(result);
      else setError("Could not process this image. Try a different request.");
    } catch {
      setError("Could not connect to the image lab.");
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setSelectedImage(null);
    setEditedImage(null);
    setPrompt("");
    setError(null);
  };

  return (
    <BaseLayout>
      {/* ===== TITLE ===== */}
      <h1 style={styles.title}>Progress lab</h1>
      <p style={styles.subtitle}>
        Clean up progress photos before sharing
      </p>

      {/* ===== IMAGE PICKER ===== */}
      {!selectedImage ? (
        <div style={styles.uploadBox}>
          <Upload size={28} />
          <p style={styles.uploadText}>Upload a photo</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            style={styles.primaryButton}
          >
            Select photo
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleFileChange}
          />
        </div>
      ) : (
        <>
          {/* ===== IMAGE PREVIEW ===== */}
          <div style={styles.imageWrap}>
            <img
              src={editedImage || selectedImage}
              alt="Progress"
              style={styles.image}
            />
          </div>

          {/* ===== PROMPT ===== */}
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Example: remove background clutter"
            style={styles.textarea}
          />

          {error && <div style={styles.error}>{error}</div>}

          {/* ===== ACTIONS ===== */}
          <button
            onClick={handleEdit}
            disabled={isProcessing || !prompt}
            style={{
              ...styles.primaryButton,
              opacity: isProcessing ? 0.6 : 1,
            }}
          >
            {isProcessing ? "Processing…" : "Create new image"}
            <Send size={14} />
          </button>

          <div style={styles.secondaryRow}>
            <button onClick={reset} style={styles.secondaryButton}>
              <RefreshCw size={14} /> Start again
            </button>

            {editedImage && (
              <button style={styles.secondaryButton}>
                <Download size={14} /> Save
              </button>
            )}
          </div>
        </>
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
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginBottom: 12,
  },
  uploadBox: {
    border: "1px dashed #ddd",
    borderRadius: 12,
    padding: 20,
    textAlign: "center",
  },
  uploadText: {
    fontSize: 13,
    margin: "8px 0",
  },
  imageWrap: {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 12,
  },
  image: {
    width: "100%",
    display: "block",
  },
  textarea: {
    width: "100%",
    minHeight: 90,
    fontSize: 13,
    padding: 10,
    borderRadius: 10,
    border: "1px solid #ddd",
    marginBottom: 8,
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
  secondaryRow: {
    display: "flex",
    gap: 8,
    marginTop: 8,
  },
  secondaryButton: {
    flex: 1,
    padding: "10px",
    fontSize: 12,
    borderRadius: 10,
    border: "1px solid #ddd",
    background: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  error: {
    fontSize: 12,
    color: "#c00",
    marginBottom: 8,
  },
};
