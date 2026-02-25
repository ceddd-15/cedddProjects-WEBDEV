import { AuthProvider } from "./contexts/AuthContext.jsx";
import Login from "./pages/Login.jsx";
import "./styles/App.css";
import Inventory from "./pages/Inventory.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing.jsx";

function App() {
return (
  <BrowserRouter>
  <AuthProvider>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/inventory" element={<Inventory />} />
    </Routes>
    </AuthProvider>
  </BrowserRouter>
  );
}

export default App;
