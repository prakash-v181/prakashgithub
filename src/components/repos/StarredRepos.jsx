import React, { useEffect } from "react";
import { useNavigate, useRoutes } from "react-router-dom";

// Pages List
import Dashboard from "./components/dashboard/Dashboard";
import Profile from "./components/user/Profile";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import CreateRepo from "./components/repo/CreateRepo";      // if you created this earlier
import StarredRepos from "./components/repo/StarredRepos";  // ⭐ NEW import

// Auth Context
import { useAuth } from "./authContext";

const ProjectRoutes = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const userIdFromStorage = localStorage.getItem("userId");
    const path = window.location.pathname;

    if (userIdFromStorage && !currentUser) {
      setCurrentUser(userIdFromStorage);
    }

    // If NOT logged in and not on /auth or /signup, redirect to /auth
    if (!userIdFromStorage && !["/auth", "/signup"].includes(path)) {
      navigate("/auth");
    }

    // If logged in and on /auth, redirect to home
    if (userIdFromStorage && path === "/auth") {
      navigate("/");
    }
  }, [currentUser, navigate, setCurrentUser]);

  const element = useRoutes([
    {
      path: "/",
      element: <Dashboard />,
    },
    {
      path: "/auth",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/profile",
      element: <Profile />,
    },
    {
      path: "/create",       // if you added create page
      element: <CreateRepo />,
    },
    {
      path: "/repo",         // ⭐ NEW route
      element: <StarredRepos />,
    },
  ]);

  return element;
};

export default ProjectRoutes;
