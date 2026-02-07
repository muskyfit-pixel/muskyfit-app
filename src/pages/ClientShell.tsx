import { Outlet } from "react-router-dom"
import ClientNav from "../components/ClientNav"

export default function ClientShell() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      
      {/* Top navigation */}
      <ClientNav />

      {/* Main content */}
      <main style={{ flex: 1, padding: "16px" }}>
        <Outlet />
      </main>

    </div>
  )
}
