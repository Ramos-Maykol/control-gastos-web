const calcularProyeccionAhorros = (movimientos) => {
    const ultimos3Meses = movimientos
        .filter(m => m.tipo === 'ingreso')
        .slice(-3)
        .reduce((sum, m) => sum + m.monto, 0);
    
    const promedioAhorro = ultimos3Meses / 3;
    const proyeccion = {
        semestral: promedioAhorro * 6,
        anual: promedioAhorro * 12,
        porDia: promedioAhorro / 30
    };
    
    return proyeccion;
};

const analizarHabitosGasto = (movimientos) => {
    const categorias = {};
    movimientos
        .filter(m => m.tipo === 'egreso')
        .forEach(m => {
            categorias[m.categoria] = (categorias[m.categoria] || 0) + m.monto;
        });
    
    return Object.entries(categorias)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);
};

module.exports = { calcularProyeccionAhorros, analizarHabitosGasto };
