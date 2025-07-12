import fs from 'fs';
import path, { dirname } from 'path';
import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const basename = path.basename(__filename);

const db = {};

// Leer todos los archivos del directorio excepto este mismo
const files = fs.readdirSync(__dirname).filter(
  file => file !== basename && file.endsWith('.js')
);

// Cargar dinámicamente cada modelo
for (const file of files) {
  try {
    const modulePath = pathToFileURL(path.join(__dirname, file)).href;
    const modelModule = await import(modulePath);

    if (typeof modelModule.default !== 'function') {
      console.warn(`⚠️ El archivo ${file} no exporta una función default válida.`);
      continue;
    }

    const model = modelModule.default(sequelize, DataTypes);
    db[model.name] = model;
    console.log(`✅ Modelo cargado: ${model.name}`);
  } catch (error) {
    console.error(`❌ Error al cargar el modelo "${file}":`, error);
  }
}

// Ejecutar asociaciones
for (const modelName of Object.keys(db)) {
  if (typeof db[modelName].associate === 'function') {
    db[modelName].associate(db);
    console.log(`🔗 Asociación ejecutada para: ${modelName}`);
  }
}

// Instancias globales
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Exportar modelos individualmente (útil en muchos casos)
export const Categoria = db.Categoria;
export const Movimiento = db.Movimiento;
export const Usuario = db.Usuario;
export const Consejo = db.Consejo;
export const MetaAhorro = db.MetaAhorro;
export const Alerta = db.Alerta;

export default db;
