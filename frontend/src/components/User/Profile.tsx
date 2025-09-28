import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Navbar from "../Navbar";
import { UnderlineNav } from "@primer/react";
import { BookIcon, RepoIcon } from "@primer/octicons-react";
import HeatMapProfile from "./Heatmap";
import { useAuth } from "../../AuthContext";

interface UserDetails {
  username: string;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState<UserDetails>({
    username: "username",
  });
  const { setCurrentUser } = useAuth();

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userId = localStorage.getItem("userId");
      if (userId) {
        try {
          const response = await axios.get(
            `http://localhost:3000/userProfile/${userId}`
          );
          setUserDetails(response.data);
        } catch (err) {
          console.error("Cannot fetch user details: ", err);
        }
      }
    };
    fetchUserDetails();
  }, []);

  return (
    <>
      <Navbar />
      <UnderlineNav aria-label="Repository">
        <UnderlineNav.Item aria-current="page" icon={BookIcon}>
          Overview
        </UnderlineNav.Item>

        <UnderlineNav.Item onClick={() => navigate("/repo")} icon={RepoIcon}>
          Starred Repositories
        </UnderlineNav.Item>
      </UnderlineNav>

      <button
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          setCurrentUser(null);
          window.location.href = "/auth";
        }}
        className="logout-btn"
      >
        Logout
      </button>

      <div className="profile-page">
        <div className="user-section">
          <div className="profile-image"></div>
          <h3>{userDetails.username}</h3>
          <button className="follow-btn">Follow</button>
          <div className="follower">
            <p>10 Followers</p>
            <p>3 Following</p>
          </div>
        </div>

        <div className="heatmap-section">
          <HeatMapProfile />
        </div>
      </div>
    </>
  );
};

export default Profile;
