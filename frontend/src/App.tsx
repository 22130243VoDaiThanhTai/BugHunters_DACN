import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage';
import EmployeeDashboard from './pages/EmployeeDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import SubmitRequestPage from './pages/SubmitRequestPage';
import PendingRequestsPage from './pages/PendingRequestsPage';
import HistoryPage from './pages/HistoryPage';
import RequestDetailsPage from './pages/RequestDetailsPage';
import LeaveDetail from './pages/LeaveDetail';

const RequireAuth: React.FC<{ isAuthenticated: boolean; children: React.ReactElement }> = ({
  isAuthenticated,
  children,
}) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const PendingRequestRoute: React.FC<{ userEmail: string }> = ({ userEmail }) => {
  const navigate = useNavigate();
  const { requestId } = useParams();
  const [searchParams] = useSearchParams();
  const requestIdNumber = Number(requestId);
  const initialAction = searchParams.get('action') === 'reject' ? 'reject' : 'view';

  if (!requestId || Number.isNaN(requestIdNumber)) {
    return <Navigate to="/pending" replace />;
  }

  return (
    <RequestDetailsPage
      userEmail={userEmail}
      requestId={requestIdNumber}
      onBack={() => navigate('/pending')}
      onBackToDashboard={() => navigate('/dashboard')}
      initialAction={initialAction}
    />
  );
};

const HistoryDetailRoute: React.FC<{ userEmail: string }> = ({ userEmail }) => {
  const navigate = useNavigate();
  const { requestId } = useParams();
  const requestIdNumber = Number(requestId);

  if (!requestId || Number.isNaN(requestIdNumber)) {
    return <Navigate to="/history" replace />;
  }

  return <LeaveDetail requestId={requestIdNumber} userEmail={userEmail} onBack={() => navigate('/history')} />;
};

const App: React.FC = () => {
  const navigate = useNavigate();
  const [loggedInUser, setLoggedInUser] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<'EMPLOYEE' | 'MANAGER' | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [roleReady, setRoleReady] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('loggedInUser');

    if (savedUser) {
      setLoggedInUser(savedUser);
      setIsAuthenticated(true);
    }

    setAuthReady(true);
  }, []);

  useEffect(() => {
    const loadRole = async () => {
      if (!isAuthenticated || !loggedInUser) {
        setUserRole(null);
        setRoleReady(true);
        return;
      }

      try {
        setRoleReady(false);
        const response = await fetch(`http://localhost:8080/api/leave/dashboard?email=${encodeURIComponent(loggedInUser)}`);
        const data = await response.json();

        if (response.ok && data?.success && data?.user?.role) {
          const roleValue = String(data.user.role).toUpperCase();
          setUserRole(roleValue === 'MANAGER' ? 'MANAGER' : 'EMPLOYEE');
          return;
        }

        setUserRole('EMPLOYEE');
      } catch {
        setUserRole('EMPLOYEE');
      } finally {
        setRoleReady(true);
      }
    };

    loadRole();
  }, [isAuthenticated, loggedInUser]);

  const handleLoginSuccess = (loggedInEmail: string) => {
    localStorage.setItem('loggedInUser', loggedInEmail);
    setLoggedInUser(loggedInEmail);
    setIsAuthenticated(true);
    navigate('/dashboard', { replace: true });
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setLoggedInUser('');
    setIsAuthenticated(false);
    setUserRole(null);
    setRoleReady(false);
    navigate('/login', { replace: true });
  };

  if (!authReady || (isAuthenticated && !roleReady)) {
    return <div className="App" />;
  }

  const isManager = userRole === 'MANAGER';

  return (
    <div className="App">
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage onLoginSuccess={handleLoginSuccess} />}
        />
        <Route
          path="/"
          element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />}
        />
        <Route
          path="/dashboard"
          element={
            <RequireAuth isAuthenticated={isAuthenticated}>
              {isManager ? (
                <ManagerDashboard
                  userEmail={loggedInUser}
                  onLogout={handleLogout}
                  onNavigateToPending={() => navigate('/pending')}
                />
              ) : (
                <EmployeeDashboard
                  userEmail={loggedInUser}
                  onLogout={handleLogout}
                  onNavigateToSubmit={() => navigate('/submit')}
                  onNavigateToPending={() => navigate('/pending')}
                  onNavigateToHistory={() => navigate('/history')}
                />
              )}
            </RequireAuth>
          }
        />
        <Route
          path="/submit"
          element={
            <RequireAuth isAuthenticated={isAuthenticated}>
              {isManager ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <SubmitRequestPage
                  userEmail={loggedInUser}
                  onBackToDashboard={() => navigate('/dashboard')}
                  onNavigateToHistory={() => navigate('/history')}
                />
              )}
            </RequireAuth>
          }
        />
        <Route
          path="/pending"
          element={
            <RequireAuth isAuthenticated={isAuthenticated}>
              <PendingRequestsPage
                userEmail={loggedInUser}
                onBackToDashboard={() => navigate('/dashboard')}
                onNavigateToSubmit={!isManager ? () => navigate('/submit') : undefined}
                onNavigateToHistory={!isManager ? () => navigate('/history') : undefined}
                onViewDetails={(id, action = 'view') => navigate(`/pending/${id}?action=${action}`)}
              />
            </RequireAuth>
          }
        />
        <Route
          path="/pending/:requestId"
          element={
            <RequireAuth isAuthenticated={isAuthenticated}>
              <PendingRequestRoute userEmail={loggedInUser} />
            </RequireAuth>
          }
        />
        <Route
          path="/history"
          element={
            <RequireAuth isAuthenticated={isAuthenticated}>
              {isManager ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <HistoryPage
                  userEmail={loggedInUser}
                  onBackToDashboard={() => navigate('/dashboard')}
                  onNavigateToSubmit={() => navigate('/submit')}
                  onViewDetail={(id) => navigate(`/history/${id}`)}
                />
              )}
            </RequireAuth>
          }
        />
        <Route
          path="/history/:requestId"
          element={
            <RequireAuth isAuthenticated={isAuthenticated}>
              {isManager ? <Navigate to="/dashboard" replace /> : <HistoryDetailRoute userEmail={loggedInUser} />}
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />} />
      </Routes>
    </div>
  );
};

export default App;