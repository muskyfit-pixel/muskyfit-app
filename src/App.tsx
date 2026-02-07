import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import Login from "./pages/Login";
import { User } from "./types";

function App() {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (u: User) => {
    setUser(u);
  };

  return (
    <Routes>
      <Route path="/" element={<Login onLogin={handleLogin} />} />
    </Routes>
  );
}

export default App;
