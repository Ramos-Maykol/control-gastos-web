// src/pages/Movimientos/CreateMovimiento.jsx
import React, { useState, useEffect } from 'react';
import { crearMovimiento } from '../../api/movimientos';
import { getCategorias } from '../../api/categoria';
import { useNavigate, useSearchParams } from 'react-router-dom';
// Ya no necesitamos importar CreateMovimiento.css, todo se manejará con Tailwind CSS.

const CreateMovimiento = () => {
    const [searchParams] = useSearchParams();
    // Determina el tipo inicial basado en el parámetro de URL, por defecto 'ingreso'
    const tipoInicial = searchParams.get('tipo') === 'egreso' ? 'egreso' : 'ingreso';

    const [tipo, setTipo] = useState(tipoInicial);
    const [monto, setMonto] = useState('');
    const [fecha, setFecha] = useState(() => new Date().toISOString().split('T')[0]);
    const [descripcion, setDescripcion] = useState('');
    const [categoria_id, setCategoriaId] = useState('');
    const [categorias, setCategorias] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Estado para el botón de carga
    const navigate = useNavigate();

    useEffect(() => {
        const cargarCategorias = async () => {
            try {
                const res = await getCategorias();
                setCategorias(res.data);
            } catch (err) {
                console.error(err);
                setError('Error al cargar categorías. Intenta recargar la página.');
            }
        };
        cargarCategorias();
    }, []);

    // Reinicia la categoría seleccionada cuando el tipo cambia
    useEffect(() => {
        setCategoriaId('');
    }, [tipo]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Validaciones básicas en el frontend
        if (!monto || parseFloat(monto) <= 0) {
            setError('El monto debe ser un número positivo.');
            setIsLoading(false);
            return;
        }
        if (!fecha) {
            setError('La fecha es obligatoria.');
            setIsLoading(false);
            return;
        }
        if (!descripcion.trim()) {
            setError('La descripción es obligatoria.');
            setIsLoading(false);
            return;
        }
        if (!categoria_id) {
            setError('Debes seleccionar una categoría.');
            setIsLoading(false);
            return;
        }

        try {
            await crearMovimiento({
                tipo,
                monto: parseFloat(monto),
                fecha,
                descripcion,
                categoria_id: parseInt(categoria_id) // Asegúrate de enviar el ID como número
            });
            navigate('/dashboard'); // Redirige al dashboard al éxito
        } catch (err) {
            console.error("Error al crear movimiento:", err);
            // Mensaje de error más amigable
            setError(err.response?.data?.error || 'No se pudo crear el movimiento. Verifica los datos.');
        } finally {
            setIsLoading(false);
        }
    };

    // Clases condicionales para el título y el botón según el tipo de movimiento
    const titleColorClass = tipo === 'egreso' ? 'text-red-600' : 'text-green-600';
    const buttonGradientClass = tipo === 'egreso'
        ? 'from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 focus:ring-red-300'
        : 'from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 focus:ring-green-300';
    const buttonIcon = tipo === 'egreso' ? '➖' : '➕'; // Icono para el título

    // Clases condicionales para el fondo de la página
    const backgroundGradientClass = tipo === 'egreso'
        ? 'from-red-100 via-orange-100 to-pink-100' // Tonos claros de rojo/naranja
        : 'from-green-100 via-blue-100 to-purple-100'; // Tonos claros de verde/azul/morado

    // Clases condicionales para los círculos decorativos de fondo
    const blob1BgClass = tipo === 'egreso' ? 'bg-orange-200' : 'bg-blue-200';
    const blob2BgClass = tipo === 'egreso' ? 'bg-red-200' : 'bg-purple-200';
    const blob3BgClass = tipo === 'egreso' ? 'bg-pink-200' : 'bg-green-200';


    return (
        // Contenedor principal con fondo degradado animado y círculos decorativos
        <div className={`min-h-screen flex items-center justify-center p-4 sm:p-6 font-inter
                    bg-gradient-to-br ${backgroundGradientClass}
                    animate-gradient-shift relative overflow-hidden`}>

            {/* Círculos decorativos de fondo */}
            <div className={`absolute top-1/4 left-1/4 w-48 h-48 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob ${blob1BgClass}`}></div>
            <div className={`absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000 ${blob2BgClass}`}></div>
            <div className={`absolute top-1/2 right-1/4 w-32 h-32 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000 ${blob3BgClass}`}></div>

            {/* Contenedor del formulario - Efecto "Glassmorphism" */}
            <div className="bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg
                        p-8 rounded-2xl shadow-2xl w-full max-w-lg z-10
                        border border-white border-opacity-30
                        transform transition-all duration-300 hover:scale-[1.01]
                        flex flex-col items-center">

                {/* Encabezado del formulario */}
                <div className="flex justify-between items-center w-full mb-6">
                    <h2 className={`text-3xl font-bold text-gray-800 ${titleColorClass}`}>
                        {buttonIcon} {tipo === 'egreso' ? 'Nuevo Gasto' : 'Nuevo Ingreso'}
                    </h2>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold
                                   hover:bg-gray-300 transition-colors duration-200 text-sm"
                    >
                        Volver
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 w-full">
                    {/* Campo Tipo de Movimiento */}
                    <div>
                        <label htmlFor="tipo" className="block text-sm font-semibold text-gray-700 mb-2">
                            Tipo de Movimiento:
                        </label>
                        <select
                            id="tipo"
                            value={tipo}
                            onChange={(e) => setTipo(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm
                                       focus:ring-indigo-500 focus:border-indigo-500
                                       transition duration-300 text-gray-800
                                       hover:border-indigo-400 appearance-none bg-white pr-8" // appearance-none para customizar flecha
                        >
                            <option value="ingreso">Ingreso</option>
                            <option value="egreso">Egreso</option>
                        </select>
                    </div>

                    {/* Campo Monto */}
                    <div>
                        <label htmlFor="monto" className="block text-sm font-semibold text-gray-700 mb-2">
                            Monto:
                        </label>
                        <input
                            type="number"
                            id="monto"
                            value={monto}
                            onChange={(e) => setMonto(e.target.value)}
                            step="0.01"
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm
                                       focus:ring-indigo-500 focus:border-indigo-500
                                       transition duration-300 text-gray-800 placeholder-gray-400
                                       hover:border-indigo-400"
                            placeholder="Ej: 150.75"
                        />
                    </div>

                    {/* Campo Fecha */}
                    <div>
                        <label htmlFor="fecha" className="block text-sm font-semibold text-gray-700 mb-2">
                            Fecha:
                        </label>
                        <input
                            type="date"
                            id="fecha"
                            value={fecha}
                            onChange={(e) => setFecha(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm
                                       focus:ring-indigo-500 focus:border-indigo-500
                                       transition duration-300 text-gray-800 placeholder-gray-400
                                       hover:border-indigo-400"
                        />
                    </div>

                    {/* Campo Categoría */}
                    <div>
                        <label htmlFor="categoria" className="block text-sm font-semibold text-gray-700 mb-2">
                            Categoría:
                        </label>
                        <select
                            id="categoria"
                            value={categoria_id}
                            onChange={(e) => setCategoriaId(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm
                                       focus:ring-indigo-500 focus:border-indigo-500
                                       transition duration-300 text-gray-800
                                       hover:border-indigo-400 appearance-none bg-white pr-8"
                        >
                            <option value="">-- Selecciona una categoría --</option>
                            {categorias
                                .filter(cat => cat.tipo === tipo)
                                .map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                                ))}
                        </select>
                    </div>

                    {/* Campo Descripción */}
                    <div>
                        <label htmlFor="descripcion" className="block text-sm font-semibold text-gray-700 mb-2">
                            Descripción:
                        </label>
                        <textarea
                            id="descripcion"
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm
                                       focus:ring-indigo-500 focus:border-indigo-500
                                       transition duration-300 text-gray-800 placeholder-gray-400
                                       hover:border-indigo-400 resize-y" // resize-y permite redimensionar verticalmente
                            placeholder="Ej: Pago de alquiler, Venta de producto, Salario mensual..."
                        />
                    </div>

                    {/* Mensaje de Error */}
                    {error && (
                        <p className="text-red-700 text-sm text-center bg-red-100 p-3 rounded-lg
                                      border border-red-300 animate-fade-in font-medium">
                            {error}
                        </p>
                    )}

                    {/* Botón de Guardar Movimiento */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full bg-gradient-to-r ${buttonGradientClass} text-white
                                   py-3.5 rounded-lg font-bold text-lg shadow-lg
                                   transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl
                                   focus:outline-none focus:ring-4 focus:ring-opacity-75
                                   disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center space-x-2`}
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Guardando...</span>
                            </>
                        ) : 'Guardar Movimiento'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateMovimiento;
