import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { api } from './api';
import AdminLogin from './components/AdminLogin';
import AdminPage from './components/AdminPage';
import MenuPage from './components/MenuPage';

export default function App() {
  const [isAdmin, setIsAdmin] = useState(Boolean(sessionStorage.getItem('adminToken')));

  function login(token) {
    sessionStorage.setItem('adminToken', token);
    setIsAdmin(true);
  }

  async function logout() {
    try {
      await api.logoutAdmin();
    } finally {
      sessionStorage.removeItem('adminToken');
      setIsAdmin(false);
    }
  }

  useEffect(() => {
    if (isAdmin) api.checkAdmin().catch(logout);
  }, []);

  return (
    <Routes>
      <Route path="/" element={<MenuPage />} />
      <Route path="/admin" element={isAdmin ? <AdminPage onLogout={logout} /> : <AdminLogin onLogin={login} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
