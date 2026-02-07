import { Outlet } from "react-router-dom"
import ClientNav from "../components/ClientNav"

export default function ClientShell() {
  return (
    <div style={{ minHeight: "100vh", background: "#ffffff" }}>
      <ClientNav />

      <main style={{ padding: "16px" }}>
        <Outlet />
      </main>
    </div>
  )
}
