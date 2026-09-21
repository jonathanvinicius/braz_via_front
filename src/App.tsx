import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PropertiesProvider } from './context/PropertiesContext';
import { HomePage } from './pages/HomePage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminListPage } from './pages/admin/AdminListPage';
import { AdminFormPage } from './pages/admin/AdminFormPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import type { ReactNode } from 'react';

function RequireAdmin({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}

function App() {
  return (
    <AuthProvider>
      <PropertiesProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/imovel/:slug" element={<PropertyDetailPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route
              path="/admin"
              element={
                <RequireAdmin>
                  <AdminLayout />
                </RequireAdmin>
              }
            >
              <Route index element={<AdminListPage />} />
              <Route path="novo" element={<AdminFormPage />} />
              <Route path="editar/:id" element={<AdminFormPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </PropertiesProvider>
    </AuthProvider>
  );
}

export default App;
