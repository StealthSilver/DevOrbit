import "./App.css";
import "./index.css";
import { AuthProvider } from "./AuthContext";
import ProjectRoutes from "./Routes";
import { BrowserRouter as Router } from "react-router-dom";

function App() {
  return (
    <AuthProvider>
      <Router>
        <ProjectRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
