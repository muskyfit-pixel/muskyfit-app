import { BrowserRouter, Routes, Route } from "react-router-dom";
import CoachPortal from "./pages/CoachPortal";

export default function App() {
  return (
    <BrowserRouter>
      <div
        style={{
          minHeight: "100vh",
          width: "100%",
          maxWidth: 420,
          margin: "0 auto",
          padding: 16,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Routes>
          <Route path="/" element={<CoachPortal />} />
          <Route path="/coach" element={<CoachPortal />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
