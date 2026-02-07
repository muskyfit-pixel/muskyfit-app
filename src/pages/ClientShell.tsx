import { Routes, Route, Navigate } from "react-router-dom";
import ClientNav from "../components/ClientNav";

import Home from "./Home";
import Food from "./Food";
import Training from "./Training";
import Progress from "./Progress";
import Account from "./Account";

export default function ClientShell() {
  return (
    <div style={{ maxWidth: 480, margin: "0 auto" }}>
      <ClientNav />

      <Routes>
        <Route path="/" element={<Navigate to="home" />} />
        <Route path="home" element={<Home />} />
        <Route path="food" element={<Food />} />
        <Route path="training" element={<Training />} />
        <Route path="progress" element={<Progress />} />
        <Route path="account" element={<Account />} />
      </Routes>
    </div>
  );
}
