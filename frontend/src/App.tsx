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
import EmployeeLayout from './components/EmployeeLayout';
import ManagerLayout from './components/ManagerLayout';

const RequireAuth: React.FC<{ isAuthenticated: boolean; children: React.ReactElement }> = ({
  isAuthenticated,
  children,
}) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const PendingRequestRoute: React.FC<{ userEmail: string; onLogout: () => void }> = ({ userEmail, onLogout }) => {
  const navigate = useNavigate();
  const { requestId } = useParams();
  const [searchParams] = useSearchParams();
  const requestIdNumber = Number(requestId);
  const initialAction = searchParams.get('action') === 'reject' ? 'reject' : 'view';

  if (!requestId || Number.isNaN(requestIdNumber)) {
    return <Navigate to="/pending" replace />;
  }

  return (
    <ManagerLayout managerName="" onLogout={onLogout} pageTitle="Detail Requests" pageSubtitle="Review leave request details">
      <RequestDetailsPage
        userEmail={userEmail}
        requestId={requestIdNumber}
        onBack={() => navigate('/pending')}
        onBackToDashboard={() => navigate('/dashboard')}
        initialAction={initialAction}
      />
    </ManagerLayout>
  );
};

const HistoryDetailRoute: React.FC<{ userEmail: string; onLogout: () => void; userName?: string }> = ({ userEmail, onLogout, userName }) => {
  const navigate = useNavigate();
  const { requestId } = useParams();
  const requestIdNumber = Number(requestId);

  if (!requestId || Number.isNaN(requestIdNumber)) {
    return <Navigate to="/history" replace />;
  }

  return (
    <EmployeeLayout userEmail={userEmail} userName={userName} onLogout={onLogout} pageTitle="Leave Detail">
      <LeaveDetail requestId={requestIdNumber} userEmail={userEmail} onBack={() => navigate('/history')} />
    </EmployeeLayout>
  );
};

const App: React.FC = () => {
  const navigate = useNavigate();
  const [loggedInUser, setLoggedInUser] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<'EMPLOYEE' | 'MANAGER' | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [roleReady, setRoleReady] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('loggedInUser');
    const savedName = localStorage.getItem('loggedInUserName');

    if (savedUser) {
      setLoggedInUser(savedUser);
      setIsAuthenticated(true);
    }
    if (savedName) {
      setUserName(savedName);
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
          if (data.user.fullName) {
            setUserName(data.user.fullName);
            localStorage.setItem('loggedInUserName', data.user.fullName);
          }
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
    setUserName('');
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
                <EmployeeLayout
                  userEmail={loggedInUser}
                  userName={userName}
                  userRole="Employee"
                  onLogout={handleLogout}
                  pageTitle="Submit Request"
                >
                  <SubmitRequestPage
                    userEmail={loggedInUser}
                    onBackToDashboard={() => navigate('/dashboard')}
                    onNavigateToHistory={() => navigate('/history')}
                  />
                </EmployeeLayout>
              )}
            </RequireAuth>
          }
        />
        <Route
          path="/pending"
          element={
            <RequireAuth isAuthenticated={isAuthenticated}>
              {isManager ? (
                <ManagerLayout
                  managerName={userName}
                  onLogout={handleLogout}
                  pageTitle="Pending Requests"
                  pageSubtitle="Review and manage your team's upcoming absences."
                >
                  <PendingRequestsPage
                    userEmail={loggedInUser}
                    onBackToDashboard={() => navigate('/dashboard')}
                    onViewDetails={(id, action = 'view') => navigate(`/pending/${id}?action=${action}`)}
                  />
                </ManagerLayout>
              ) : (
                <EmployeeLayout
                  userEmail={loggedInUser}
                  userName={userName}
                  userRole="Employee"
                  onLogout={handleLogout}
                  pageTitle="Pending Requests"
                >
                  <PendingRequestsPage
                    userEmail={loggedInUser}
                    onBackToDashboard={() => navigate('/dashboard')}
                    onNavigateToSubmit={() => navigate('/submit')}
                    onNavigateToHistory={() => navigate('/history')}
                    onViewDetails={(id, action = 'view') => navigate(`/pending/${id}?action=${action}`)}
                  />
                </EmployeeLayout>
              )}
            </RequireAuth>
          }
        />
        <Route
          path="/pending/:requestId"
          element={
            <RequireAuth isAuthenticated={isAuthenticated}>
              <PendingRequestRoute userEmail={loggedInUser} onLogout={handleLogout} />
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
                <EmployeeLayout
                  userEmail={loggedInUser}
                  userName={userName}
                  userRole="Employee"
                  onLogout={handleLogout}
                  pageTitle="Leave History"
                >
                  <HistoryPage
                    userEmail={loggedInUser}
                    onBackToDashboard={() => navigate('/dashboard')}
                    onNavigateToSubmit={() => navigate('/submit')}
                    onViewDetail={(id) => navigate(`/history/${id}`)}
                  />
                </EmployeeLayout>
              )}
            </RequireAuth>
          }
        />
        <Route
          path="/history/:requestId"
          element={
            <RequireAuth isAuthenticated={isAuthenticated}>
              {isManager ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <HistoryDetailRoute userEmail={loggedInUser} onLogout={handleLogout} userName={userName} />
              )}
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />} />
      </Routes>
    </div>
  );
};

export default App;