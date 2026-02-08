import { Routes, Route } from "react-router-dom";
import AppShell from "./components/AppShell";
import Login from "./pages/Login";

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>
    </AppShell>
  );
}
