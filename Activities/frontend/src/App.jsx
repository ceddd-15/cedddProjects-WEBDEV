import { AuthProvider } from "./contexts/AuthContext.jsx";
import Login from "./pages/Login.jsx";
import "./styles/App.css";
import Inventory from "./pages/Inventory.jsx";
function App() {
  return (
    <AuthProvider>
      <Inventory></Inventory>
    </AuthProvider>
  );
}

export default App;
