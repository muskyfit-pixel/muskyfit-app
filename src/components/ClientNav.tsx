import { NavLink } from "react-router-dom"

const linkStyle = ({ isActive }: { isActive: boolean }) => ({
  marginRight: "16px",
  textDecoration: "none",
  fontWeight: isActive ? "bold" : "normal"
})

export default function ClientNav() {
  return (
    <nav style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
      <NavLink to="/app/home" style={linkStyle}>Home</NavLink>
      <NavLink to="/app/food" style={linkStyle}>Food</NavLink>
      <NavLink to="/app/training" style={linkStyle}>Training</NavLink>
      <NavLink to="/app/progress" style={linkStyle}>Progress</NavLink>
      <NavLink to="/app/account" style={linkStyle}>Account</NavLink>
    </nav>
  )
}
