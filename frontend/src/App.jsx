// src/App.js
import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard/Dashboard';
import Login from './pages/Auth/Login';
import PrivateRoute from './components/routing/PrivateRoute';
import CreateMovimiento from './pages/Movimientos/CreateMovimiento';
import CategoriaPage from './pages/Configuracion/CategoriaPage';
import ReportsPage from './pages/Reports/ReportsPage';
import MetasAhorroPage from './pages/MetasAhorro/MetasAhorroPage'; // ¡Importa la nueva página!
import './App.css';

// El Layout ahora es un componente interno de App para simplificar
const AppLayout = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    // Usamos useCallback para evitar re-crear la función en cada render
    const handleResize = useCallback(() => {
        const mobile = window.innerWidth <= 768;
        setIsMobile(mobile);
        // En escritorio el sidebar no está "escondido" por defecto, en móvil sí
        if (!mobile) {
            setIsSidebarVisible(true);
        } else {
            setIsSidebarVisible(false);
        }
    }, []);

    useEffect(() => {
        handleResize(); // Llama al inicio para establecer el estado inicial correcto
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [handleResize]);

    const toggleSidebar = () => {
        setIsSidebarVisible(prev => !prev);
    };

    const toggleSidebarCollapse = () => {
        setIsSidebarCollapsed(prev => !prev);
    };

    // Clases dinámicas para el contenedor principal
    const appContainerClasses = [
        'app-container',
        isMobile && isSidebarVisible ? 'sidebar-open-mobile' : '',
        !isMobile && isSidebarCollapsed ? 'sidebar-collapsed-desktop' : ''
    ].filter(Boolean).join(' ');

    return (
        <div className={appContainerClasses}>
            {isMobile && isSidebarVisible && <div className="overlay" onClick={toggleSidebar}></div>}
            <Header
                onToggleSidebar={toggleSidebar}
                isMobile={isMobile}
            />
            <Sidebar
                isVisible={isSidebarVisible}
                isCollapsed={isSidebarCollapsed}
                onToggleCollapse={toggleSidebarCollapse}
                onCloseSidebar={toggleSidebar} // Reutilizamos la función toggle
                isMobile={isMobile}
            />
            <div className="body-container">
                <main className="page-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route element={<PrivateRoute />}>
                    <Route element={<AppLayout />}>
                        <Route index element={<Navigate to="/dashboard" replace />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/movimientos/nuevo" element={<CreateMovimiento />} />
                        <Route path="/configuracion/categoria" element={<CategoriaPage />} />
                        <Route path="/transacciones" element={<CreateMovimiento />} />
                        <Route path="/reportes" element={<ReportsPage />} />
                        <Route path="/metas-ahorro" element={<MetasAhorroPage />} /> {/* ¡Nueva ruta para Metas de Ahorro! */}
                        <Route path="/educacion-financiera" element={<div>Educación Financiera</div>} />
                    </Route>
                </Route>
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
