import React, { useState } from 'react';
// Nhớ import file CSS có chứa Tailwind của bạn (thường là index.css hoặc App.css)
import './App.css';
import LoginPage from './pages/LoginPage';
import EmployeeDashboard from './pages/EmployeeDashboard';
import SubmitRequestPage from './pages/SubmitRequestPage';

type AppView = 'dashboard' | 'submit';

// Dùng React.FC để định nghĩa type cho functional component
const App: React.FC = () => {
  const [loggedInUser, setLoggedInUser] = useState<string>(localStorage.getItem('loggedInUser') || '');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(Boolean(localStorage.getItem('loggedInUser')));
  const [currentView, setCurrentView] = useState<AppView>('dashboard');

  const handleLoginSuccess = (loggedInEmail: string) => {
    localStorage.setItem('loggedInUser', loggedInEmail);
    setLoggedInUser(loggedInEmail);
    setIsAuthenticated(true);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    setLoggedInUser('');
    setIsAuthenticated(false);
    setCurrentView('dashboard');
  };

  return (
      <div className="App">
        {isAuthenticated ? (
            currentView === 'dashboard' ? (
                <EmployeeDashboard
                    userEmail={loggedInUser}
                    onLogout={handleLogout}
                    onNavigateToSubmit={() => setCurrentView('submit')}
                />
            ) : (
                <SubmitRequestPage
                    userEmail={loggedInUser}
                    onBackToDashboard={() => setCurrentView('dashboard')}
                />
            )
        ) : (
            <LoginPage onLoginSuccess={handleLoginSuccess} />
        )}

      </div>
  );
}

export default App;