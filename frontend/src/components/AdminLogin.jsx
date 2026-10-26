import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';

export default function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function submit(event) {
    event.preventDefault();
    setError('');

    try {
      const data = await api.loginAdmin(password);
      onLogin(data.token);
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <main className="login-page">
      <form className="login-form" onSubmit={submit}>
        <Link to="/">← Назад</Link>
        <h1>Вхід адміністратора</h1>
        <input type="password" placeholder="Пароль" value={password}
          onChange={(event) => setPassword(event.target.value)} required />
        {error && <p className="error">{error}</p>}
        <button>Увійти</button>
      </form>
    </main>
  );
}
