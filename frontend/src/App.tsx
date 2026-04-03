import React, { useState } from 'react';
// Nhớ import file CSS có chứa Tailwind của bạn (thường là index.css hoặc App.css)
import './App.css';
import LoginPage from './pages/LoginPage';
import EmployeeDashboard from './pages/EmployeeDashboard';

// Dùng React.FC để định nghĩa type cho functional component
const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
      Boolean(localStorage.getItem('loggedInUser'))
  );

  const handleLoginSuccess = (loggedInEmail: string) => {
    localStorage.setItem('loggedInUser', loggedInEmail);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    setIsAuthenticated(false);
  };

  return (
      <div className="App">
        {isAuthenticated ? (
            <EmployeeDashboard onLogout={handleLogout} />
        ) : (
            <LoginPage onLoginSuccess={handleLoginSuccess} />
        )}

      </div>
  );
}

export default App;