import React from "react";
import { Link } from "react-router-dom";
import devorbitLogo from "../assets/devorbit.svg";

const Navbar: React.FC = () => {
  return (
    <nav>
      <Link to="/">
        <div>
          <img src={devorbitLogo} alt="DevOrbit Logo" />
          <h3>DevOrbit</h3>
        </div>
      </Link>
      <div>
        <Link to="/create">
          <p>Create a Repository</p>
        </Link>
        <Link to="/profile">
          <p>Profile</p>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
