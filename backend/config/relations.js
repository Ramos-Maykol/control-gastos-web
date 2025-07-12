const Usuario = require('../models/Usuario');
const Categoria = require('../models/Categoria');
const Movimiento = require('../models/Movimiento');
const MetaAhorro = require('../models/MetaAhorro');
const Alerta = require('../models/Alerta');

// Relación Usuario-Categoría
Usuario.hasMany(Categoria, { foreignKey: 'usuario_id' });
Categoria.belongsTo(Usuario, { foreignKey: 'usuario_id' });

// Relación Usuario-Movimientos
Usuario.hasMany(Movimiento, { foreignKey: 'usuario_id' });
Movimiento.belongsTo(Usuario, { foreignKey: 'usuario_id' });

// Relación Categoría-Movimientos
Categoria.hasMany(Movimiento, { foreignKey: 'categoria_id' });
Movimiento.belongsTo(Categoria, { foreignKey: 'categoria_id' });

// Relación Usuario-Metas
Usuario.hasMany(MetaAhorro, { foreignKey: 'usuario_id' });
MetaAhorro.belongsTo(Usuario, { foreignKey: 'usuario_id' });

// Relación Usuario-Alertas
Usuario.hasMany(Alerta, { foreignKey: 'usuario_id' });
Alerta.belongsTo(Usuario, { foreignKey: 'usuario_id' });

module.exports = { Usuario, Categoria, Movimiento, MetaAhorro, Alerta };
