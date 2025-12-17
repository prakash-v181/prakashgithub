import React, { useEffect } from "react";
import { useNavigate, useRoutes } from "react-router-dom";
import { useAuth } from "./authContext";

import Dashboard from "./components/dashboard/Dashboard";
import Profile from "./components/user/Profile";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import CreateRepo from "./components/repos/CreateRepo";
import RepoDetail from "./components/repos/RepoDetail";
import ProtectedRoute from "./ProtectedRoute";

const ProjectRoutes = () => {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    const pathname = window.location.pathname;

    // Logged-in user should not see auth pages
    if (currentUser && ["/auth", "/signup"].includes(pathname)) {
      navigate("/", { replace: true });
    }

    // Guest user should not see protected pages
    if (!currentUser && !["/auth", "/signup"].includes(pathname)) {
      navigate("/auth", { replace: true });
    }
  }, [currentUser, loading, navigate]);

  const routes = useRoutes([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      ),
    },

    // ✅ Logged-in user's own profile
    {
      path: "/profile",
      element: (
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      ),
    },

    // ✅ Public GitHub-style profile
    {
      path: "/profile/:username",
      element: (
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      ),
    },

    {
      path: "/new",
      element: (
        <ProtectedRoute>
          <CreateRepo />
        </ProtectedRoute>
      ),
    },

    {
      path: "/repo/:repoId",
      element: (
        <ProtectedRoute>
          <RepoDetail />
        </ProtectedRoute>
      ),
    },

    {
      path: "/auth",
      element: <Login />,
    },

    {
      path: "/signup",
      element: <Signup />,
    },
  ]);

  return routes;
};

export default ProjectRoutes;




// import React, { useEffect } from "react";
// import { useNavigate, useRoutes } from "react-router-dom";
// import { useAuth } from "./authContext";

// import Dashboard from "./components/dashboard/Dashboard";
// import Profile from "./components/user/Profile";
// import Login from "./components/auth/Login";
// import Signup from "./components/auth/Signup";
// import CreateRepo from "./components/repos/CreateRepo";
// import RepoDetail from "./components/repos/RepoDetail";
// import ProtectedRoute from "./ProtectedRoute";

// const ProjectRoutes = () => {
//   const { currentUser, loading } = useAuth();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!loading) {
//       const pathname = window.location.pathname;

//       if (currentUser && ["/auth", "/signup"].includes(pathname)) {
//         navigate("/", { replace: true });
//       }

//       if (!currentUser && !["/auth", "/signup"].includes(pathname)) {
//         navigate("/auth", { replace: true });
//       }
//     }
//   }, [currentUser, loading, navigate]);

//   const routes = useRoutes([
//     {
//       path: "/",
//       element: (
//         <ProtectedRoute>
//           <Dashboard />
//         </ProtectedRoute>
//       ),
//     },

//     {
//       // ✅ GitHub-style profile
//       path: "/profile/:username",
//       element: (
//         <ProtectedRoute>
//           <Profile />
//         </ProtectedRoute>
//       ),
//     },

//     {
//       path: "/new",
//       element: (
//         <ProtectedRoute>
//           <CreateRepo />
//         </ProtectedRoute>
//       ),
//     },

//     {
//       path: "/repo/:repoId",
//       element: (
//         <ProtectedRoute>
//           <RepoDetail />
//         </ProtectedRoute>
//       ),
//     },

//     {
//       path: "/auth",
//       element: <Login />,
//     },

//     {
//       path: "/signup",
//       element: <Signup />,
//     },
//   ]);

//   return routes;
// };

// export default ProjectRoutes;


// import React, { useEffect } from "react";
// import {useNavigate, useRoutes} from 'react-router-dom'

// // Pages List
// import Dashboard from "./components/dashboard/Dashboard";
// import Profile from "./components/user/Profile";
// import Login from "./components/auth/Login";
// import Signup from "./components/auth/Signup";

// // Auth Context
// import { useAuth } from "./authContext";

// const ProjectRoutes = ()=>{
//     const {currentUser, setCurrentUser} = useAuth();
//     const navigate = useNavigate();

//     useEffect(()=>{
//         const userIdFromStorage = localStorage.getItem("userId");

//         if(userIdFromStorage && !currentUser){
//             setCurrentUser(userIdFromStorage);
//         }

//         if(!userIdFromStorage && !["/auth", "/signup"].includes(window.location.pathname))
//         {
//             navigate("/auth");
//         }

//         if(userIdFromStorage && window.location.pathname=='/auth'){
//             navigate("/");
//         }
//     }, [currentUser, navigate, setCurrentUser]);

//     let element = useRoutes([
//         {
//             path:"/",
//             element:<Dashboard/>
//         },
//         {
//             path:"/auth",
//             element:<Login/>
//         },
//         {
//             path:"/signup",
//             element:<Signup/>
//         },
//         {
//             path:"/profile",
//             element:<Profile/>
//         }
//     ]);

//     return element;
// }

// export default ProjectRoutes;