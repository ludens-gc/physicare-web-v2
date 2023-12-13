import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import { AuthContext } from "./context/AuthContext";
import { useContext } from "react";
import Search from "./pages/Search";
import Profile from "./pages/Profile";
import Chats from "./pages/Chats";
import Sheets from "./pages/Sheets";

const App = () => {
  const { currentUser } = useContext(AuthContext);

  const ProtectedRoute = ({ children }) => {
    console.log(console.log(currentUser));
    console.log(currentUser ? "true" : "false");
    return currentUser ? children : <Navigate to="/signin" />;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <Search />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:id"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chats"
          element={
            <ProtectedRoute>
              <Chats />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Sheets"
          element={
            <ProtectedRoute>
              <Sheets />
            </ProtectedRoute>
          }
        />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<h1>Not found</h1>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
