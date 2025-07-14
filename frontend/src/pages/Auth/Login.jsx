// src/pages/Auth/Login.jsx
import api from '../../api/axios';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await axios.post('/api/v1/auth/login', {
                email,
                password
            });

            const token = response.data.token;
            localStorage.setItem('token', token);
            window.location.href = '/dashboard';
        } catch (err) {
            console.error("Error de inicio de sesión:", err);
            setError(err.response?.data?.error?.message || 'Credenciales incorrectas');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        // Contenedor principal con fondo degradado animado
        <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 font-inter
                    bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500
                    animate-gradient-shift relative overflow-hidden">

            {/* Círculos decorativos de fondo (para un toque más juvenil y dinámico) */}
            <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
            <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>


            {/* Contenedor del formulario */}
            <div className="bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg
                        p-8 rounded-2xl shadow-2xl w-full max-w-md z-10
                        border border-white border-opacity-30
                        transform transition-all duration-300 hover:scale-[1.01]
                        flex flex-col items-center"> {/* Added flex-col and items-center for better alignment */}

                {/* Logo o Elemento de Marca */}
                <div className="text-center mb-6">
                    {/* Reemplaza con tu SVG o imagen de logo */}
                    <svg className="mx-auto h-16 w-16 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.592 1M12 8V4m0 8v4m0-4c-1.11 0-2.08-.402-2.592-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h1 className="text-4xl font-extrabold text-gray-900 mt-2">Finanzas</h1>
                </div>

                <h2 className="text-3xl font-bold text-center text-gray-800 mb-3 leading-tight">
                    Bienvenido de nuevo 👋
                </h2>
                <p className="text-center text-gray-600 mb-8 max-w-xs">
                    Inicia sesión para acceder a tu control financiero.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5 w-full">
                    {/* Campo de Correo Electrónico */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                            Correo electrónico
                        </label>
                        <input
                            type="email"
                            id="email"
                            placeholder="tu.correo@ejemplo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm
                                       focus:ring-indigo-500 focus:border-indigo-500
                                       transition duration-300 text-gray-800 placeholder-gray-400
                                       hover:border-indigo-400"
                            aria-label="Correo electrónico"
                        />
                    </div>
                    {/* Campo de Contraseña */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            id="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm
                                       focus:ring-indigo-500 focus:border-indigo-500
                                       transition duration-300 text-gray-800 placeholder-gray-400
                                       hover:border-indigo-400"
                            aria-label="Contraseña"
                        />
                    </div>

                    {/* Mensaje de Error */}
                    {error && (
                        <p className="text-red-700 text-sm text-center bg-red-100 p-3 rounded-lg
                                      border border-red-300 animate-fade-in font-medium">
                            {error}
                        </p>
                    )}

                    {/* Botón de Enviar */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-700 text-white
                                   py-3.5 rounded-lg font-bold text-lg shadow-lg
                                   hover:from-indigo-700 hover:to-purple-800
                                   transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl
                                   focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:ring-opacity-75
                                   disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Iniciando sesión...</span>
                            </>
                        ) : 'Entrar'}
                    </button>
                </form>

                {/* Enlace a la página de registro */}
                <p className="text-center text-gray-500 text-sm mt-8">
                    ¿No tienes una cuenta?{' '}
                    <a href="/register" className="text-indigo-600 hover:underline font-semibold hover:text-indigo-700 transition duration-200">
                        Regístrate aquí
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Login;
