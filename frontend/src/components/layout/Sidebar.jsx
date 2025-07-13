import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
    const [showSubmenu, setShowSubmenu] = useState(false);

    const toggleSubmenu = () => {
        setShowSubmenu(!showSubmenu);
    };

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

                {/* Configuración con submenú */}
                <div className="sidebar__item sidebar__submenu-toggle" onClick={toggleSubmenu}>
                    ⚙️ <span>Configuración</span>
                </div>
                {showSubmenu && (
                    <div className="sidebar__submenu">
                        <NavLink to="/configuracion/categoria" className="sidebar__subitem">
                            🗂️ <span>Categoría</span>
                        </NavLink>
                    </div>
                )}
            </nav>
        </aside>
    );
};

export default Sidebar;
