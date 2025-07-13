import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Header.css';

const Header = () => {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [mostrarMenu, setMostrarMenu] = useState(false);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    const token = localStorage.getItem('token');

    if (usuarioGuardado) {
      try {
        const usuario = JSON.parse(usuarioGuardado);
        if (usuario?.nombre) {
          setNombreUsuario(usuario.nombre);
        }
      } catch (error) {
        console.error('❌ Error al parsear usuario:', error);
      }
    } else if (token) {
      axios
        .get('http://localhost:3006/api/v1/auth/perfil', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          const usuario = res.data;
          localStorage.setItem('usuario', JSON.stringify(usuario));
          setNombreUsuario(usuario.nombre);
        })
        .catch((err) => {
          console.error('❌ Error al obtener perfil:', err);
        });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.href = '/login';
  };

  const toggleMenu = () => {
    setMostrarMenu(!mostrarMenu);
  };

  return (
    <header className="header">
      <div className="header__content">
        <div className="header__logo">
          <span role="img" aria-label="money">💰</span>
          <span className="header__logo-text">Mi Control Financiero</span>
        </div>
        <div className="header__user">
          <span className="header__greeting">Hola, {nombreUsuario || '...'} 👋</span>
          <div className="header__avatar" onClick={toggleMenu}>
            {nombreUsuario
              ? nombreUsuario
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)
              : 'US'}
            {mostrarMenu && (
              <div className="dropdown-menu">
                <button onClick={handleLogout}>Salir</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
