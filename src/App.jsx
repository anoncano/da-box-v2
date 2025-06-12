import { Routes, Route } from "react-router-dom";
import Admin from "./pages/Admin";
import General from "./pages/General";
import Login from "./pages/Login";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/general" element={<General />} />
    </Routes>
  );
}
