import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard/Dashboard';
import Login from './pages/Auth/Login';
import PrivateRoute from './components/routing/PrivateRoute';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirigir root al login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Login (pública) */}
        <Route path="/login" element={<Login />} />

        {/* Ruta protegida */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </PrivateRoute>
          }
        />

        {/* Página 404 */}
        <Route path="*" element={<p>Página no encontrada</p>} />
      </Routes>
    </Router>
  );
}

// Layout general solo para rutas privadas
const Layout = ({ children }) => (
  <div className="app-container">
    <Header />
    <div className="body-container">
      <Sidebar />
      <main className="page-content">{children}</main>
    </div>
  </div>
);

export default App;
