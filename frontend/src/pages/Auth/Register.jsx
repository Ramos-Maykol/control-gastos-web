// src/pages/Auth/Register.jsx
import api from '../../api/axios';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [edad, setEdad] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setIsLoading(true);

        // --- Validaciones en el frontend ---
        if (!nombre || !email || !password || !confirmPassword || !edad) {
            setError('Todos los campos son obligatorios.');
            setIsLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            setIsLoading(false);
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Por favor, introduce un email válido.');
            setIsLoading(false);
            return;
        }

        const parsedEdad = parseInt(edad);
        if (isNaN(parsedEdad) || parsedEdad < 18 || parsedEdad > 25) {
            setError('La edad debe estar entre 18 y 25 años.');
            setIsLoading(false);
            return;
        }
        // --- Fin de validaciones en el frontend ---

        try {
            const response = await api.post('/api/v1/auth/registrar', {
                nombre,
                email,
                password,
                edad: parsedEdad // Asegúrate de enviar la edad como número
            });

            setSuccessMessage('¡Registro exitoso! Redirigiendo al inicio de sesión...');
            // Limpia los campos después del registro exitoso
            setNombre('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setEdad('');

            // Redirige al login después de un breve retraso
            setTimeout(() => {
                navigate('/login');
            }, 2000); // 2 segundos de retraso
        } catch (err) {
            console.error("Error de registro:", err);
            setError(err.response?.data?.error || 'Error al registrar el usuario. Inténtalo de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        // Contenedor principal con fondo degradado animado (igual que Login.jsx)
        <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 font-inter
                    bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500
                    animate-gradient-shift relative overflow-hidden">

            {/* Círculos decorativos de fondo (igual que Login.jsx) */}
            <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
            <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

            {/* Contenedor del formulario - Efecto "Glassmorphism" (igual que Login.jsx) */}
            <div className="bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg
                        p-8 rounded-2xl shadow-2xl w-full max-w-md z-10
                        border border-white border-opacity-30
                        transform transition-all duration-300 hover:scale-[1.01]
                        flex flex-col items-center">

                {/* Logo o Elemento de Marca (igual que Login.jsx) */}
                <div className="text-center mb-6">
                    <svg className="mx-auto h-16 w-16 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.592 1M12 8V4m0 8v4m0-4c-1.11 0-2.08-.402-2.592-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h1 className="text-4xl font-extrabold text-gray-900 mt-2">Finanzas</h1>
                </div>

                <h2 className="text-3xl font-bold text-center text-gray-800 mb-3 leading-tight">
                    Crea tu cuenta ✨
                </h2>
                <p className="text-center text-gray-600 mb-8 max-w-xs">
                    Únete a nuestra comunidad y toma el control de tus finanzas.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5 w-full">
                    {/* Campo de Nombre */}
                    <div>
                        <label htmlFor="nombre" className="block text-sm font-semibold text-gray-700 mb-2">
                            Nombre Completo
                        </label>
                        <input
                            type="text"
                            id="nombre"
                            placeholder="Tu nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm
                                       focus:ring-indigo-500 focus:border-indigo-500
                                       transition duration-300 text-gray-800 placeholder-gray-400
                                       hover:border-indigo-400"
                            aria-label="Nombre completo"
                        />
                    </div>

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

                    {/* Campo de Confirmar Contraseña */}
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                            Confirmar Contraseña
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm
                                       focus:ring-indigo-500 focus:border-indigo-500
                                       transition duration-300 text-gray-800 placeholder-gray-400
                                       hover:border-indigo-400"
                            aria-label="Confirmar contraseña"
                        />
                    </div>

                    {/* Campo de Edad */}
                    <div>
                        <label htmlFor="edad" className="block text-sm font-semibold text-gray-700 mb-2">
                            Edad (entre 18 y 25 años)
                        </label>
                        <input
                            type="number"
                            id="edad"
                            placeholder="Ej: 20"
                            value={edad}
                            onChange={(e) => setEdad(e.target.value)}
                            min="18" // Validación mínima HTML5
                            max="25" // Validación máxima HTML5
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm
                                       focus:ring-indigo-500 focus:border-indigo-500
                                       transition duration-300 text-gray-800 placeholder-gray-400
                                       hover:border-indigo-400"
                            aria-label="Edad"
                        />
                    </div>

                    {/* Mensaje de Error */}
                    {error && (
                        <p className="text-red-700 text-sm text-center bg-red-100 p-3 rounded-lg
                                      border border-red-300 animate-fade-in font-medium">
                            {error}
                        </p>
                    )}

                    {/* Mensaje de Éxito */}
                    {successMessage && (
                        <p className="text-green-700 text-sm text-center bg-green-100 p-3 rounded-lg
                                      border border-green-300 animate-fade-in font-medium">
                            {successMessage}
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
                                <span>Registrando...</span>
                            </>
                        ) : 'Registrarse'}
                    </button>
                </form>

                {/* Enlace a la página de login */}
                <p className="text-center text-gray-500 text-sm mt-8">
                    ¿Ya tienes una cuenta?{' '}
                    <a href="/login" className="text-indigo-600 hover:underline font-semibold hover:text-indigo-700 transition duration-200">
                        Inicia sesión aquí
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Register;
