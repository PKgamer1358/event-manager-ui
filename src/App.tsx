import React from "react";
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { useAuth } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import EventList from "./pages/EventList";
import EventDetails from "./pages/EventDetails";
import MyRegistrations from "./pages/MyRegistrations";
import AdminUsers from "./pages/AdminUsers";
import AdminEventRegistrations from "./pages/AdminEventRegistrations";
import Notifications from "./pages/Notifications";
import MainLayout from "./layouts/MainLayout";
import theme from "./theme";

/* =======================
   AUTH GATE
======================= */
const AuthGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { loading } = useAuth();

  if (loading) {
    return <div style={{ padding: 40 }}>Loading…</div>;
  }

  return <>{children}</>;
};

/* =======================
   APP
======================= */
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthGate>
        <AppRoutes />
      </AuthGate>
    </ThemeProvider>
  );
}

/* =======================
   ROUTES
======================= */
const AppRoutes: React.FC = () => {

  return (
    <>
      <Routes>
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/events"
          element={
            <PrivateRoute>
              <MainLayout>
                <EventList />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/events/:id"
          element={
            <PrivateRoute>
              <MainLayout>
                <EventDetails />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/my-registrations"
          element={
            <PrivateRoute>
              <MainLayout>
                <MyRegistrations />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <PrivateRoute superAdminOnly>
              <MainLayout>
                <AdminUsers />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/events/registrations"
          element={
            <PrivateRoute superAdminOnly>
              <MainLayout>
                <AdminEventRegistrations />
              </MainLayout>
            </PrivateRoute>
          }
        />



        <Route
          path="/notifications"
          element={
            <PrivateRoute>
              <MainLayout>
                <Notifications />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;
