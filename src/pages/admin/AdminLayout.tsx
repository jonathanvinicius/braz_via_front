import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function AdminLayout() {
  const { logout } = useAuth();

  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <div className="container admin-topbar-inner">
          <Link to="/admin" className="admin-brand">
            <img src="/logo-mark.png" alt="" />
            <div>
              <strong>BRAZVIA Admin</strong>
              <small>Gestão de anúncios</small>
            </div>
          </Link>
          <nav className="admin-nav">
            <NavLink to="/admin" end>
              Anúncios
            </NavLink>
            <NavLink to="/admin/novo">Novo anúncio</NavLink>
            <Link to="/">Ver site</Link>
            <button type="button" className="btn-ghost" onClick={logout}>
              Sair
            </button>
          </nav>
        </div>
      </header>
      <main className="container admin-main">
        <Outlet />
      </main>
    </div>
  );
}
