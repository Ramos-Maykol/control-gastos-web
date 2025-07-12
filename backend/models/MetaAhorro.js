export default (sequelize, DataTypes) => {
  const MetaAhorro = sequelize.define('MetaAhorro', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    usuario_id: { type: DataTypes.INTEGER, allowNull: false },
    titulo: { type: DataTypes.STRING(100), allowNull: false },
    descripcion: { type: DataTypes.TEXT },
    monto_objetivo: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: 0.01 }
    },
    monto_actual: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
      validate: { min: 0 }
    },
    fecha_inicio: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW
    },
    fecha_fin: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  }, {
    tableName: 'metas_ahorro',
    timestamps: false
  });

  MetaAhorro.associate = (models) => {
    MetaAhorro.belongsTo(models.Usuario, { foreignKey: 'usuario_id' });
  };

  return MetaAhorro;
};
