import {
  Navigate,
  Routes,
  Route,
  BrowserRouter as Router,
} from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "./lib/axios.js";
import SignupPage from "./pages/SignupPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import Layout from "./components/layout/Layout.jsx";
import SearchPage from "./components/SearchPage.jsx";

export default function App() {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/auth/user");
        return res.data;
      } catch (err) {
        if (err.response && err.response.status === 401) {
          return null;
        }
        console.error(err.response?.data?.message || "Something went wrong");
      }
    },
  });

  const { data: posts } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await axiosInstance.get("/posts/");
      return res.data;
    },
  });

  if (isLoading) return null;

  return (
    <Routes>
      {/* Routes that don't use the Layout */}
      <Route
        path="/login"
        element={!authUser ? <LoginPage /> : <Navigate to={"/"} />}
      />
      <Route
        path="/signup"
        element={!authUser ? <SignupPage /> : <Navigate to={"/"} />}
      />

      {/* Routes that use the Layout */}

      <Route
        path="/"
        element={
          <Layout>
            {authUser ? <HomePage /> : <Navigate to={"/login"} />}
          </Layout>
        }
      />
      <Route
        path="/search/:q"
        element={
          <Layout>
            <SearchPage />
          </Layout>
        }
      />
      <>
        {!authUser ? (
          <Route path="*" element={<Navigate to={"/login"} />} />
        ) : (
          <>
            {/* Authenticated users go to ProfilePage */}
            <Route
              path="/profile/:username"
              element={
                <Layout>
                  <ProfilePage />
                </Layout>
              }
            />
            {/* Add other routes if needed */}
          </>
        )}
      </>
    </Routes>
  );
}
