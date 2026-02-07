import { NavLink } from "react-router-dom"

export default function ClientNav() {
  return (
    <nav style={styles.nav}>
      <NavLink to="/app/home" style={styles.link}>Home</NavLink>
      <NavLink to="/app/food" style={styles.link}>Food</NavLink>
      <NavLink to="/app/training" style={styles.link}>Training</NavLink>
      <NavLink to="/app/progress" style={styles.link}>Progress</NavLink>
      <NavLink to="/app/account" style={styles.link}>Account</NavLink>
    </nav>
  )
}

const styles: any = {
  nav: {
    display: "flex",
    justifyContent: "space-around",
    borderTop: "1px solid #e5e5e5",
    padding: "12px 0",
    background: "#fff",
  },
  link: {
    textDecoration: "none",
    fontSize: "14px",
    color: "#333",
  },
}
