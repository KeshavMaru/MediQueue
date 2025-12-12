import { Routes, Route, Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import DoctorPage from "./pages/DoctorPage";
import BookingStatus from "./pages/BookingStatus";
import MyAppointments from "./pages/MyAppointments";
import RoleSelection from "./pages/RoleSelection";
import DoctorLogin from "./pages/DoctorLogin";
import DoctorSignup from "./pages/DoctorSignup";
import PatientLogin from "./pages/PatientLogin";
import PatientSignup from "./pages/PatientSignup";
import "./App.css";

// Protected route component
function ProtectedRoute({ element, requiredRole }: { element: React.ReactNode; requiredRole?: string }) {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <div style={{ padding: "40px", textAlign: "center", fontSize: "1.2em" }}>🔄 Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return <>{element}</>;
}

export default function App() {
  const { user, logout, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div style={{ padding: "40px", textAlign: "center", fontSize: "1.2em" }}>🔄 Loading...</div>;
  }

  return (
    <div>
      <nav>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", maxWidth: "1400px", margin: "0 auto" }}>
          <Link to="/" style={{ fontSize: "1.5em", fontWeight: "bold", color: "white", textDecoration: "none" }}>🏥 MediQueue</Link>
          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                {isAuthenticated ? (
              <>
                <span style={{ color: "white", fontWeight: "600" }}>👤 {user?.full_name || "User"}</span>
                    {user?.user_type === 'patient' && (
                      <Link to="/my-appointments" style={{ color: 'white', textDecoration: 'none', fontWeight: '600' }}>📋 My Appointments</Link>
                    )}
                {/* Show Admin button only on landing or role-selection pages */}
                {(location.pathname === "/" || location.pathname === "/role-selection") && (
                  <Link to="/admin-login" style={{ color: "white", textDecoration: "none", fontWeight: "600" }}>⚙️ Admin</Link>
                )}
                <button
                  onClick={async () => {
                    await logout();
                    window.location.href = "/";
                  }}
                  style={{
                    padding: "10px 16px",
                    fontSize: "0.95em",
                    fontWeight: "700",
                    background: "rgba(255, 255, 255, 0.2)",
                    color: "white",
                    border: "2px solid white",
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "white";
                    e.currentTarget.style.color = "#0066cc";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
                    e.currentTarget.style.color = "white";
                  }}
                >
                  🚪 Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/role-selection" style={{ color: "white", textDecoration: "none", fontWeight: "600", padding: "10px 16px", background: "rgba(255, 255, 255, 0.2)", borderRadius: "8px" }}>🔐 Login</Link>
                {/* Admin button only on landing or role-selection pages */}
                {(location.pathname === "/" || location.pathname === "/role-selection") && (
                  <Link to="/admin-login" style={{ color: "white", textDecoration: "none", fontWeight: "600", padding: "10px 16px", background: "rgba(0, 102, 204, 0.4)", borderRadius: "8px" }}>⚙️ Admin</Link>
                )}
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="container">
        <Routes>
          <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/role-selection" />} />
          <Route path="/role-selection" element={isAuthenticated ? <Navigate to="/" /> : <RoleSelection />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          
          {/* Doctor Routes */}
          <Route path="/doctor/login" element={isAuthenticated ? <Navigate to="/" /> : <DoctorLogin />} />
          <Route path="/doctor/signup" element={isAuthenticated ? <Navigate to="/" /> : <DoctorSignup />} />
          
          {/* Patient Routes */}
          <Route path="/patient/login" element={isAuthenticated ? <Navigate to="/" /> : <PatientLogin />} />
          <Route path="/patient/signup" element={isAuthenticated ? <Navigate to="/" /> : <PatientSignup />} />
          
          {/* Admin/Doctor Routes */}
          <Route path="/admin" element={<ProtectedRoute element={<Admin />} requiredRole="admin" />} />
          <Route path="/doctor/:id" element={<DoctorPage />} />
          <Route path="/my-appointments" element={<MyAppointments />} />
          
          {/* Booking Routes */}
          <Route path="/booking/:id" element={<BookingStatus />} />
        </Routes>
      </div>
    </div>
  );
}
