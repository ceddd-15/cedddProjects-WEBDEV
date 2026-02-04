import { AuthProvider } from "./contexts/AuthContext.jsx";
import Login from "./pages/Login.jsx";
import "./styles/App.css";

function App() {
  return (
    <AuthProvider>
      <Login></Login>
    </AuthProvider>
  );
}

export default App;
