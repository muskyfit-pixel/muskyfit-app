import { NavLink } from "react-router-dom"

const linkStyle = {
  flex: 1,
  padding: "12px",
  textAlign: "center" as const,
  textDecoration: "none",
  fontWeight: 600,
  color: "#111"
}

export default function ClientNav() {
  return (
    <nav style={{
      display: "flex",
      borderTop: "1px solid #ddd",
      position: "sticky",
      bottom: 0,
      background: "#fff"
    }}>
      <NavLink to="/app" end style={linkStyle}>Home</NavLink>
      <NavLink to="/app/food" style={linkStyle}>Food</NavLink>
      <NavLink to="/app/training" style={linkStyle}>Training</NavLink>
      <NavLink to="/app/progress" style={linkStyle}>Progress</NavLink>
      <NavLink to="/app/account" style={linkStyle}>Account</NavLink>
    </nav>
  )
}
