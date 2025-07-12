export default (sequelize, DataTypes) => {
  const Movimiento = sequelize.define('Movimiento', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    usuario_id: { type: DataTypes.INTEGER, allowNull: false },
    categoria_id: { type: DataTypes.INTEGER, allowNull: false },
    monto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: 0.01 }
    },
    descripcion: { type: DataTypes.TEXT },
    fecha: { type: DataTypes.DATEONLY, allowNull: false },
    tipo: {
      type: DataTypes.ENUM('ingreso', 'egreso'),
      allowNull: false
    },
    recurrente: { type: DataTypes.BOOLEAN, defaultValue: false },
    etiquetas: { type: DataTypes.JSON }
  }, {
    tableName: 'movimientos',
    timestamps: false
  });

  Movimiento.associate = (models) => {
    Movimiento.belongsTo(models.Usuario, { foreignKey: 'usuario_id' });
    Movimiento.belongsTo(models.Categoria, { foreignKey: 'categoria_id' });
  };

  return Movimiento;
};
