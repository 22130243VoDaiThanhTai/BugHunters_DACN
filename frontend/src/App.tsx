import React from 'react';
// Nhớ import file CSS có chứa Tailwind của bạn (thường là index.css hoặc App.css)
import './App.css';
import LoginPage from './pages/LoginPage';

// Dùng React.FC để định nghĩa type cho functional component
const App: React.FC = () => {
  return (
      <div className="App">
        <LoginPage />

      </div>
  );
}

export default App;