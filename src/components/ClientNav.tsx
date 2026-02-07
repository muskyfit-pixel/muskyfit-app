import { NavLink } from "react-router-dom"

const linkStyle = ({ isActive }: { isActive: boolean }) => ({
  marginRight: 16,
  textDecoration: "none",
  fontWeight: isActive ? "bold" : "normal",
  color: "#111"
})

export default function ClientNav() {
  return (
    <nav style={{ padding: 12, borderBottom: "1px solid #ddd" }}>
      <NavLink to="/app/home" style={linkStyle}>Home</NavLink>
      <NavLink to="/app/food" style={linkStyle}>Food</NavLink>
      <NavLink to="/app/training" style={linkStyle}>Training</NavLink>
      <NavLink to="/app/progress" style={linkStyle}>Progress</NavLink>
      <NavLink to="/app/account" style={linkStyle}>Account</NavLink>
    </nav>
  )
}
