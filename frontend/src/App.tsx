import { useState } from "react";
import "./App.css";
import "./index.css";
import { AuthProvider } from "./AuthContext";
import ProjectRoutes from "./Routes";
import { BrowserRouter as Router } from "react-router-dom";

function App() {
  const [count, setCount] = useState<number>(0);

  return (
    <AuthProvider>
      <Router>
        <ProjectRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
