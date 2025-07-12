import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
    return (
        <aside className="sidebar">
            <nav className="sidebar__nav">
                <NavLink to="/dashboard" className="sidebar__item">
                    📊 <span>Dashboard</span>
                </NavLink>
                <NavLink to="/movimientos" className="sidebar__item">
                    💸 <span>Transacciones</span>
                </NavLink>
                <NavLink to="/reportes" className="sidebar__item">
                    📈 <span>Reportes</span>
                </NavLink>
                <NavLink to="/metas" className="sidebar__item">
                    🎯 <span>Metas de Ahorro</span>
                </NavLink>
                <NavLink to="/educacion" className="sidebar__item">
                    📚 <span>Educación Financiera</span>
                </NavLink>
                <NavLink to="/configuracion" className="sidebar__item">
                    ⚙️ <span>Configuración</span>
                </NavLink>
            </nav>
        </aside>
    );
};

export default Sidebar;
