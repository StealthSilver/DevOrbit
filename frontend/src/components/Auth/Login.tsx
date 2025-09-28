import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../AuthContext";
import { PageHeader } from "@primer/react";
import { Box, Button } from "@primer/react";
import devorbitLogo from "../../assets/devorbit.svg";
import { Link } from "react-router-dom";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setCurrentUser } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:3000/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);

      setCurrentUser(res.data.userId);
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      alert("Login Failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-logo">
        <img src={devorbitLogo} alt="Logo" />
      </div>

      <div className="auth-box">
        <Box>
          <PageHeader>
            <PageHeader.TitleArea variant="large">
              <PageHeader.Title>Sign In</PageHeader.Title>
            </PageHeader.TitleArea>
          </PageHeader>
        </Box>

        <form onSubmit={handleLogin}>
          <label>Email address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Loading..." : "Login"}
          </Button>
        </form>

        <p>
          New to GitHub? <Link to="/signup">Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
