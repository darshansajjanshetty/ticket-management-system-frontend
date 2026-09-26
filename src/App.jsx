import { Navigate, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AgentDashboard from './pages/AgentDashboard';
import AgentsPage from './pages/AgentsPage';
import CreateTicket from './pages/CreateTicket';
import CustomerDashboard from './pages/CustomerDashboard';
import CustomersPage from './pages/CustomersPage';
import KnowledgeBasePage from './pages/KnowledgeBasePage';
import Login from './pages/Login';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import Register from './pages/Register';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import TicketDetails from './pages/TicketDetails';
import TicketsPage from './pages/TicketsPage';
import { useAuth } from './context/AuthContext';

function App() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const dashboardPath = user && (user.role === 'admin' || user.role === 'agent') ? '/agent-dashboard' : '/customer-dashboard';

  return (
    <>
      <Navbar sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen((current) => !current)} />
      <main className="app-shell">
        <Routes>
          <Route path="/" element={user ? <Navigate to={dashboardPath} replace /> : <Navigate to="/login" replace />} />
          <Route path="/login" element={user ? <Navigate to={dashboardPath} replace /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to={dashboardPath} replace /> : <Register />} />

          <Route
            path="/dashboard"
            element={<Navigate to={dashboardPath} replace />}
          />

          <Route
            path="/customer-dashboard"
            element={
              <ProtectedRoute requiredRole="customer">
                <CustomerDashboard sidebarOpen={sidebarOpen} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/agent-dashboard"
            element={
              <ProtectedRoute requiredRole="agent">
                <AgentDashboard sidebarOpen={sidebarOpen} />
              </ProtectedRoute>
            }
          />

          <Route path="/admin-dashboard" element={<Navigate to="/agent-dashboard" replace />} />

          <Route
            path="/tickets"
            element={
              <ProtectedRoute>
                <TicketsPage sidebarOpen={sidebarOpen} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tickets/new"
            element={
              <ProtectedRoute requiredRole="customer">
                <CreateTicket />
              </ProtectedRoute>
            }
          />

          <Route
            path="/customers"
            element={
              <ProtectedRoute requiredRole="agent">
                <CustomersPage sidebarOpen={sidebarOpen} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/agents"
            element={
              <ProtectedRoute requiredRole="agent">
                <AgentsPage sidebarOpen={sidebarOpen} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reports"
            element={
              <ProtectedRoute requiredRole="agent">
                <ReportsPage sidebarOpen={sidebarOpen} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/knowledge-base"
            element={
              <ProtectedRoute>
                <KnowledgeBasePage sidebarOpen={sidebarOpen} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <NotificationsPage sidebarOpen={sidebarOpen} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage sidebarOpen={sidebarOpen} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tickets/:id"
            element={
              <ProtectedRoute>
                <TicketDetails />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to={user ? dashboardPath : '/login'} replace />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
