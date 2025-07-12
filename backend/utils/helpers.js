const formatearFecha = (fecha, formato = 'es-PE') => {
    const opciones = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'America/Lima'
    };
    return new Date(fecha).toLocaleDateString(formato, opciones);
};

const generarCodigoVerificacion = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const parsearMoneda = (monto) => {
    return new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: 'PEN',
        minimumFractionDigits: 2
    }).format(monto);
};

module.exports = { formatearFecha, generarCodigoVerificacion, parsearMoneda };
