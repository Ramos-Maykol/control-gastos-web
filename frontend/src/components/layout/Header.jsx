import React, { useEffect, useState } from 'react';
import './Header.css';

const Header = () => {
  const [nombreUsuario, setNombreUsuario] = useState('');

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      const usuario = JSON.parse(usuarioGuardado);
      setNombreUsuario(usuario.nombre);
    }
  }, []);

  return (
    <header className="header">
      <div className="header__content">
        <div className="header__logo">
          <span role="img" aria-label="money">💰</span>
          <span className="header__logo-text">Mi Control Financiero</span>
        </div>
        <div className="header__user">
          <span className="header__greeting">Hola, {nombreUsuario}! 👋</span>
          <div className="header__avatar">
            {nombreUsuario
              .split(' ')
              .map(n => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
