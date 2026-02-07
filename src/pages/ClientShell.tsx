import { Outlet, NavLink } from "react-router-dom"

export default function ClientShell() {
  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <h1 style={styles.title}>MuskyFit</h1>
      </header>

      <main style={styles.main}>
        <Outlet />
      </main>

      <nav style={styles.nav}>
        <NavLink to="/app/home" style={styles.link}>Home</NavLink>
        <NavLink to="/app/food" style={styles.link}>Food</NavLink>
        <NavLink to="/app/training" style={styles.link}>Training</NavLink>
        <NavLink to="/app/progress" style={styles.link}>Progress</NavLink>
        <NavLink to="/app/account" style={styles.link}>Account</NavLink>
      </nav>
    </div>
  )
}

const styles = {
  app: {
    display: "flex",
    flexDirection: "column" as const,
    minHeight: "100vh",
    background: "#ffffff",
  },
  header: {
    padding: "14px",
    borderBottom: "1px solid #eee",
    textAlign: "center" as const,
  },
  title: {
    margin: 0,
    fontSize: "18px",
  },
  main: {
    flex: 1,
    padding: "16px",
  },
  nav: {
    display: "flex",
    justifyContent: "space-around",
    borderTop: "1px solid #eee",
    padding: "10px 0",
  },
  link: {
    textDecoration: "none",
    fontSize: "14px",
    color: "#333",
  },
}
