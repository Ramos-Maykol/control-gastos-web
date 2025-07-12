export default (sequelize, DataTypes) => {
  const Alerta = sequelize.define('Alerta', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    usuario_id: { type: DataTypes.INTEGER, allowNull: false },
    mensaje: { type: DataTypes.STRING(255), allowNull: false },
    tipo_alerta: {
      type: DataTypes.ENUM('gasto_limite', 'recordatorio', 'meta'),
      allowNull: false
    },
    fecha_alerta: { type: DataTypes.DATEONLY, allowNull: false },
    activa: { type: DataTypes.BOOLEAN, defaultValue: true },
    parametros: { type: DataTypes.JSON }
  }, {
    tableName: 'alertas',
    timestamps: false
  });

  Alerta.associate = (models) => {
    Alerta.belongsTo(models.Usuario, { foreignKey: 'usuario_id' });
  };

  return Alerta;
};
