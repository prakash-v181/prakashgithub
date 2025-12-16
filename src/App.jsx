import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import Dashboard from "./pages/Dashboard/Dashboard";
import Profile from "./pages/Profile/Profile";
import NewRepo from "./pages/NewRepo/NewRepo";
import Repo from "./pages/Repo/Repo";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* MAIN */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/new" element={<NewRepo />} />
        <Route path="/repo/:id" element={<Repo />} />

        {/* FALLBACK */}
        <Route
          path="*"
          element={<h2 style={{ padding: "2rem" }}>Page Not Found</h2>}
        />
      </Routes>
    </Router>
  );
};

export default App;



// import React from "react";
// import "./App.css";
// import ProjectRoutes from "./Routes";

// function App() {
//   return <ProjectRoutes />;
// }

// export default App;
