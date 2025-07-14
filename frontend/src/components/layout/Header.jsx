import React, { useEffect, useState, useRef, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Header.css';

const Header = ({ onToggleSidebar, isMobile }) => {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const cargarUsuario = async () => {
      try {
        const usuarioGuardado = localStorage.getItem('usuario');
        if (usuarioGuardado) {
          setNombreUsuario(JSON.parse(usuarioGuardado)?.nombre || 'Usuario');
        } else {
          const { data } = await axios.get('http://localhost:3006/api/v1/auth/perfil', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setNombreUsuario(data.nombre);
          localStorage.setItem('usuario', JSON.stringify(data));
        }
      } catch (error) {
        console.error('Error al cargar perfil:', error);
        localStorage.clear();
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    
    cargarUsuario();
  }, [navigate]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMostrarMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const iniciales = nombreUsuario
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() || '')
    .join('');
  
  if (loading) return <div className="header-placeholder"></div>;

  return (
    <header className="header">
      <div className="header__left">
        {isMobile && (
          <button className="header__menu-button" onClick={onToggleSidebar} aria-label="Abrir menú">
            ☰
          </button>
        )}
        <div className="header__logo">
          💰 <span className="header__logo-text">Mi Control Financiero</span>
        </div>
      </div>
      
      <div className="header__right">
        <span className="header__greeting">Hola, {nombreUsuario} 👋</span>
        <div className="header__user-menu">
          <button className="header__avatar" onClick={() => setMostrarMenu(prev => !prev)} aria-label="Menú de usuario">
            {iniciales || 'US'}
          </button>
          {mostrarMenu && (
            <div className="dropdown-menu" ref={dropdownRef}>
              <button onClick={handleLogout} className="dropdown-item">
                🚪 Salir
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default memo(Header);