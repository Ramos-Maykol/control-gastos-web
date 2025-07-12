import { useState } from 'react';
import axios from 'axios';
import './Login.css'; // Si deseas aplicar estilos

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:3006/api/v1/auth/login', {
        email,
        password
      });

      const token = response.data.token;
      localStorage.setItem('token', token);
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Credenciales incorrectas');
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Entrar</button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default Login;
