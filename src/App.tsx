import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/home";
import MemberDatabase from "./pages/MemberDatabase";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/members" element={<MemberDatabase />} />
      </Routes>
    </BrowserRouter>
  );
}
