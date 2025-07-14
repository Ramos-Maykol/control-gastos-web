import db from '../models/index.js'; // Asegúrate de que esta línea esté presente si usas 'db'
const { MetaAhorro } = db; // Asumiendo que 'db' está importado y contiene MetaAhorro

export const crearMeta = async (req, res, next) => {
    try {
        const { titulo, monto_objetivo, fecha_fin, descripcion } = req.body; // Añade descripcion aquí

        if (new Date(fecha_fin) <= new Date()) {
            return res.status(400).json({ error: 'La fecha final debe ser futura' });
        }

        const meta = await MetaAhorro.create({
            usuario_id: req.usuario.id,
            titulo,
            descripcion, // Incluye la descripción al crear
            monto_objetivo,
            fecha_fin
        });

        res.status(201).json(meta);
    } catch (error) {
        next(error);
    }
};

export const actualizarProgreso = async (req, res, next) => {
    try {
        const meta = await MetaAhorro.findOne({
            where: { id: req.params.id, usuario_id: req.usuario.id }
        });

        if (!meta) {
            return res.status(404).json({ error: 'Meta no encontrada' });
        }

        // ✅ NUEVO LOG: Ver el objeto meta completo tal como se recupera de la DB
        console.log("Debug - Meta object retrieved from DB:", meta.toJSON());
        console.log("Debug - Raw meta.monto_actual from DB (type:", typeof meta.monto_actual, "):", meta.monto_actual);
        console.log("Debug - Raw req.body.monto from request (type:", typeof req.body.monto, "):", req.body.monto);

        // Convertir el monto actual de la meta a un número flotante, asegurando que sea un número
        const currentMontoAsNumber = Number(meta.monto_actual); 
        // Convertir el monto a añadir (del request) a un número flotante
        const amountToAdd = Number(req.body.monto); 

        // Validar que las conversiones fueron exitosas
        if (isNaN(currentMontoAsNumber) || isNaN(amountToAdd)) {
            console.error("Error: currentMontoAsNumber or amountToAdd is NaN after Number() conversion", { currentMontoAsNumber, amountToAdd });
            return res.status(400).json({ error: 'Valores de monto inválidos proporcionados.' });
        }

        // Realizar la suma
        const nuevoMontoCalculado = currentMontoAsNumber + amountToAdd;

        // Convertir el monto objetivo a un número flotante para la comparación
        const objetivoAsNumber = Number(meta.monto_objetivo); 

        if (isNaN(objetivoAsNumber) || nuevoMontoCalculado > objetivoAsNumber) {
            console.error("Error: Objetivo inválido o monto excede el objetivo.", { nuevoMontoCalculado, objetivoAsNumber });
            return res.status(400).json({ error: 'El monto a añadir excede el objetivo de la meta o el objetivo es inválido.' });
        }

        // ✅ Debugging: Log values before formatting
        console.log("Debug - currentMontoAsNumber (parsed):", currentMontoAsNumber);
        console.log("Debug - amountToAdd (parsed):", amountToAdd);
        console.log("Debug - nuevoMontoCalculado (before toFixed):", nuevoMontoCalculado);

        // ✅ CORRECCIÓN CLAVE: Formatear el nuevo monto a una cadena con 2 decimales
        // antes de enviarlo a la base de datos. Esto asegura el formato DECIMAL(10, 2).
        const nuevoMontoParaDB = nuevoMontoCalculado.toFixed(2);

        console.log("Debug - nuevoMontoParaDB (formatted for DB):", nuevoMontoParaDB); // Log the final value being sent

        const actualizada = await meta.update({ monto_actual: nuevoMontoParaDB });
        res.json(actualizada);
    } catch (error) {
        // Mejorar el manejo de errores para depuración
        console.error("Error en actualizarProgreso (catch block):", error);
        next(error);
    }
};

export const obtenerMetas = async (req, res, next) => {
    try {
        const metas = await MetaAhorro.findAll({
            where: { usuario_id: req.usuario.id },
            order: [['fecha_fin', 'ASC']]
        });

        res.json(metas);
    } catch (error) {
        next(error);
    }
};
