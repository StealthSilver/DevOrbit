import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../AuthContext";
import { PageHeader } from "@primer/react";
import { Box, Button } from "@primer/react";
import devorbitLogo from "../../assets/devorbit.svg";
import { Link } from "react-router-dom";

const Signup: React.FC = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { setCurrentUser } = useAuth();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        "https://devorbit-m60c.onrender.com/signup",
        {
          email,
          password,
          username,
        }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);

      setCurrentUser(res.data.userId);
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      alert("Signup Failed!");
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
              <PageHeader.Title>Sign Up</PageHeader.Title>
            </PageHeader.TitleArea>
          </PageHeader>
        </Box>

        <form onSubmit={handleSignup}>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

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
            {loading ? "Loading..." : "Signup"}
          </Button>
        </form>

        <p>
          Already have an account? <Link to="/auth">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
