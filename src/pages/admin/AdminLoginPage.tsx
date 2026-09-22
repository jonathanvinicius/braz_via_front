import { useState, type FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function AdminLoginPage() {
  const { status, isAuthenticated, login, completeNewPassword } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [session, setSession] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (status === 'loading') {
    return (
      <div className="admin-shell">
        <main className="container admin-main">
          <p>Validando sessão…</p>
        </main>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const requiresNewPassword = Boolean(session);

  const onSubmitLogin = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await login(email, password);
      if (result.status === 'new_password_required') {
        setEmail(result.email);
        setSession(result.session);
        setPassword('');
        return;
      }
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha no login');
    } finally {
      setLoading(false);
    }
  };

  const onSubmitNewPassword = async (event: FormEvent) => {
    event.preventDefault();
    setError('');

    if (newPassword.length < 8) {
      setError('A nova senha deve ter pelo menos 8 caracteres');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }
    if (!session) {
      setError('Sessão expirada. Faça login novamente.');
      return;
    }

    setLoading(true);
    try {
      await completeNewPassword(email, newPassword, session);
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Falha ao definir nova senha',
      );
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
              <h1>
                {requiresNewPassword ? 'Definir nova senha' : 'Entrar no admin'}
              </h1>
              <p>
                {requiresNewPassword
                  ? 'É necessário trocar a senha temporária do Cognito para continuar.'
                  : 'Acesse com o usuário do Cognito.'}
              </p>
            </div>
          </div>

          {requiresNewPassword ? (
            <form className="admin-form" onSubmit={onSubmitNewPassword}>
              <label className="field">
                <span>E-mail</span>
                <input type="email" value={email} disabled />
              </label>
              <label className="field">
                <span>Nova senha</span>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
              </label>
              <label className="field">
                <span>Confirmar nova senha</span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
              </label>
              {error ? <p className="admin-error">{error}</p> : null}
              <div className="admin-form-actions">
                <button
                  type="button"
                  className="btn-ghost"
                  disabled={loading}
                  onClick={() => {
                    setSession(null);
                    setNewPassword('');
                    setConfirmPassword('');
                    setError('');
                  }}
                >
                  Voltar
                </button>
                <button type="submit" className="btn-gold" disabled={loading}>
                  {loading ? 'Salvando…' : 'Salvar senha e entrar'}
                </button>
              </div>
            </form>
          ) : (
            <form className="admin-form" onSubmit={onSubmitLogin}>
              <label className="field">
                <span>E-mail</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                  required
                />
              </label>
              <label className="field">
                <span>Senha</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </label>
              {error ? <p className="admin-error">{error}</p> : null}
              <div className="admin-form-actions">
                <button type="submit" className="btn-gold" disabled={loading}>
                  {loading ? 'Entrando…' : 'Entrar'}
                </button>
              </div>
            </form>
          )}
        </section>
      </main>
    </div>
  );
}
