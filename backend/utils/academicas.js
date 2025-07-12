const calcularCostoCredito = (carrera) => {
    const costos = {
        'Ingeniería': 250,
        'Administración': 200,
        'Derecho': 180,
        'Medicina': 300
    };
    return costos[carrera] || 150;
};

const estimarGastosSemestre = (creditos, carrera) => {
    const costoPorCredito = calcularCostoCredito(carrera);
    const total = creditos * costoPorCredito;
    return {
        matricula: total,
        materiales: total * 0.15,
        transporte: 150 * 6 // 6 meses
    };
};

module.exports = { calcularCostoCredito, estimarGastosSemestre };
