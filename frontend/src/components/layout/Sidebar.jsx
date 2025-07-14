import React from 'react';
import { NavLink, useLocation } from 'react-router-dom'; // Import useLocation
import './Sidebar.css';
import { useState } from 'react';

const Sidebar = ({ isVisible, isCollapsed, onToggleCollapse, onCloseSidebar, isMobile }) => {
  const [showSubmenu, setShowSubmenu] = useState(false);
  const location = useLocation(); // Get current location

  const toggleSubmenu = (e) => {
    // Evita que el evento de clic cierre el sidebar principal
    e.stopPropagation();
    setShowSubmenu(prev => !prev);
  };

  const handleLinkClick = () => {
    if (isMobile) {
      onCloseSidebar();
    }
  };

  // Function to determine if 'Transacciones' link should be active
  const isTransaccionesActive = () => {
    return location.pathname.startsWith('/transacciones') || location.pathname.startsWith('/movimientos');
  };

  // Clases dinámicas para el sidebar
  const sidebarClasses = [
    'sidebar',
    isVisible ? 'sidebar--visible' : '',
    isCollapsed ? 'sidebar--collapsed' : ''
  ].filter(Boolean).join(' ');

  return (
    <aside className={sidebarClasses}>
      <nav className="sidebar__nav">
        {!isMobile && (
          <button
            className="sidebar__toggle-btn"
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? "Expandir menú" : "Colapsar menú"}
          >
            {isCollapsed ? '→' : '←'}
          </button>
        )}

        {/* Los NavLink ahora cierran el menú en móvil al hacer clic */}
        <NavLink to="/dashboard" className="sidebar__item" onClick={handleLinkClick}>
          📊 <span className="sidebar__text">Dashboard</span>
        </NavLink>
        {/*
          Modificación aquí:
          Usamos la prop `isActive` con una función que verifica
          si la ruta actual es "/transacciones" O comienza con "/movimientos".
        */}
        <NavLink
          to="/transacciones"
          className={({ isActive }) =>
            isTransaccionesActive() ? 'sidebar__item active' : 'sidebar__item'
          }
          onClick={handleLinkClick}
        >
          💸 <span className="sidebar__text">Transacciones</span>
        </NavLink>
        <NavLink to="/reportes" className="sidebar__item" onClick={handleLinkClick}>
          📈 <span className="sidebar__text">Reportes</span>
        </NavLink>
        <NavLink to="/metas-ahorro" className="sidebar__item" onClick={handleLinkClick}>
          🎯 <span className="sidebar__text">Metas</span>
        </NavLink>
        <NavLink to="/educacion-financiera" className="sidebar__item" onClick={handleLinkClick}>
          📚 <span className="sidebar__text">Educación</span>
        </NavLink>

        <div className="sidebar__item sidebar__submenu-toggle" onClick={toggleSubmenu}>
          ⚙️ <span className="sidebar__text">Configuración</span>
          <span className={`arrow ${showSubmenu ? 'open' : ''}`}>▶</span>
        </div>

        <div className={`sidebar__submenu ${showSubmenu ? 'open' : ''}`}>
          <NavLink to="/configuracion/categoria" className="sidebar__subitem" onClick={handleLinkClick}>
            🗂️ <span className="sidebar__text">Categorías</span>
          </NavLink>
        </div>
      </nav>
    </aside>
  );
};

export default React.memo(Sidebar);