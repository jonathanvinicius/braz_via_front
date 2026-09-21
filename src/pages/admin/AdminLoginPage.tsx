import { useState, type FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function AdminLoginPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@brazvia.local');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha no login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-shell">
      <main className="container admin-main">
        <section className="admin-form-page">
          <div className="admin-list-head">
            <div>
              <h1>Entrar no admin</h1>
              <p>Use o usuário local enquanto o Cognito não está ligado.</p>
            </div>
          </div>
          <form className="admin-form" onSubmit={onSubmit}>
            <label className="field">
              <span>E-mail</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
              />
            </label>
            <label className="field">
              <span>Senha</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </label>
            {error ? <p className="admin-error">{error}</p> : null}
            <div className="admin-form-actions">
              <button type="submit" className="btn-gold" disabled={loading}>
                {loading ? 'Entrando…' : 'Entrar'}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
