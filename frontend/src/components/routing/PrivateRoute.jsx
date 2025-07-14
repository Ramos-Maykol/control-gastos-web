import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Loader from '../Loader';
import axios from 'axios';

const PrivateRoute = () => {
  const [authStatus, setAuthStatus] = useState('checking');

  const verifyToken = async (token) => {
    try {
      const { data } = await axios.get('http://localhost:3006/api/v1/auth/perfil', {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 5000
      });

      // Validar si el perfil fue recibido correctamente
      return data && data.nombre; // o cualquier campo que sepas que siempre viene si el token es válido
    } catch (error) {
      console.error('❌ Token inválido o error en el servidor:', error);
      return false;
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setAuthStatus('unauthenticated');
        return;
      }

      const isValid = await verifyToken(token);

      if (isValid) {
        setAuthStatus('authenticated');
      } else {
        localStorage.clear();
        setAuthStatus('unauthenticated');
      }
    };

    checkAuth();
  }, []);

  if (authStatus === 'checking') return <Loader />;
  return authStatus === 'authenticated' ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
