import { Outlet } from "react-router-dom";
import ClientNav from "../components/ClientNav";

export default function ClientShell() {
  return (
    <div style={{ maxWidth: 480, margin: "0 auto" }}>
      <ClientNav />
      <main style={{ padding: "16px" }}>
        <Outlet />
      </main>
    </div>
  );
}
