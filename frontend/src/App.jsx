import { useState } from 'react'
import './App.css'
import { Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import TicketsPage from "./pages/TicketsPage.jsx";
import TicketDetailPage from "./pages/TicketDetailPage.jsx";
import TicketEditPage from "./pages/TicketEditPage.jsx";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./auth/ProtectedRoute";
import { getAccessToken, logout } from "./auth/auth";

export default function App() {
  const token = getAccessToken();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="container">
      <div style={{ padding: "1rem" }}>
        <header className="card nav">
          <div className="nav-left">
            <div className="brand">Rebel Remedies Helpdesk</div>
          </div>

          <div className="nav-right">
            {token && (
              <button className="btn" onClick={handleLogout}>
                Logout
              </button>
            )}
          </div>
        </header>

        <div className="spacer" />
        <Routes>
          <Route path="/" element={<Navigate to="/tickets" replace />} />
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/tickets"
            element={
              <ProtectedRoute>
                <TicketsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tickets/:id"
            element={
              <ProtectedRoute>
                <TicketDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tickets/:id/edit"
            element={
              <ProtectedRoute>
                <TicketEditPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}