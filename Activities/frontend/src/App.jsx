import { AuthProvider } from "./contexts/AuthContext.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import "./styles/App.css";
import Inventory from "./pages/Inventory.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
// no redirects

function App() {
return (
  <BrowserRouter>
  <AuthProvider>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/inventory" element={<Inventory />} />
    </Routes>
    </AuthProvider>
  </BrowserRouter>
  );
}

export default App;
