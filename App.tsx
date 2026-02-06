import { Routes, Route } from "react-router-dom";
import MemberDatabase from "./pages/MemberDatabase";
import Plan from "./pages/Plan";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MemberDatabase />} />
      <Route path="/plan" element={<Plan />} />
    </Routes>
  );
}
