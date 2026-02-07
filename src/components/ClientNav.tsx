import { NavLink } from "react-router-dom";

export default function ClientNav() {
  return (
    <nav style={{ padding: 12, borderBottom: "1px solid #ddd" }}>
      <NavLink to="/app">Home</NavLink>{" | "}
      <NavLink to="/app/food">Food</NavLink>{" | "}
      <NavLink to="/app/training">Training</NavLink>{" | "}
      <NavLink to="/app/progress">Progress</NavLink>{" | "}
      <NavLink to="/app/account">Account</NavLink>
    </nav>
  );
}
