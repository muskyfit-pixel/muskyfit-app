import { BrowserRouter, Routes, Route } from "react-router-dom";
import CoachPortal from "./pages/CoachPortal";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CoachPortal />} />
      </Routes>
    </BrowserRouter>
  );
}
