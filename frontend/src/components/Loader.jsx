// src/components/Loader.jsx
import React from 'react';
import './Loader.css'; // opcional, si deseas animación

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="loader" />
      <p>Cargando...</p>
    </div>
  );
};

export default Loader;
