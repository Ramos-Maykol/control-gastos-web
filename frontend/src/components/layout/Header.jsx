import React from 'react';
import './Header.css';

const Header = () => {
    return (
        <header className="header">
            <div className="header__content">
                <div className="header__logo">
                    <span role="img" aria-label="money">💰</span>
                    <span className="header__logo-text">Mi Control Financiero</span>
                </div>
                <div className="header__user">
                    <span className="header__greeting">Hola, María! 👋</span>
                    <div className="header__avatar">MG</div>
                </div>
            </div>
        </header>
    );
};

export default Header;
