import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./authContext";
import ProjectRoutes from "./Routes";
import "./index.css";



// existing styles
import "./index.css";
import "./App.css";

// NEW: GitHub-like UI styles
import "./github-ui.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AuthProvider>
        <ProjectRoutes />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);




// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import App from './App.jsx'
// import './index.css'
// import { AuthProvider } from './authContext.jsx'
// import ProjectRoutes from './Routes.jsx';
// import { BrowserRouter as Router } from 'react-router-dom'

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <AuthProvider>
//     <Router>
//       <ProjectRoutes />
//     </Router>
//   </AuthProvider>
// );
