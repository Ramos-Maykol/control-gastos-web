import { useState, useEffect } from 'react';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Redirigir si ya hay sesión activa
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      window.location.href = '/dashboard';
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:3006/api/v1/auth/login', {
        email,
        password
      });

      const { token, usuario } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('usuario', JSON.stringify(usuario));

      window.location.href = '/dashboard';

    } catch (err) {
      const errorMsg = err.response?.data?.error?.message || err.response?.data?.error || 'Error al iniciar sesión';
      setError(errorMsg);
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Entrar</button>
      </form>

      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
    </div>
  );
};

export default Login;
