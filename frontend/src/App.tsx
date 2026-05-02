import { useState } from 'react';

import Dashboard from './pages/Dashboard/Dashboard';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Home from './pages/Home/Home';

export default function App() {
  const [page, setPage] = useState('home');

  return (
    <>
      {page === 'home' && <Home onNavigate={setPage} />}

      {page === 'login' && (
        <Login
          onNavigateToRegister={() => setPage('register')}
          onNavigateToDashboard={() => setPage('dashboard')} 
        />
      )}

      {page === 'register' && (
        <Register onNavigateToLogin={() => setPage('login')} />
      )}

      {page === 'dashboard' && <Dashboard />}
    </>
  );
}