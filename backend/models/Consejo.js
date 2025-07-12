export default (sequelize, DataTypes) => {
  const Consejo = sequelize.define('Consejo', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    titulo: { type: DataTypes.STRING(100), allowNull: false },
    contenido: { type: DataTypes.TEXT, allowNull: false },
    publico_objetivo: {
      type: DataTypes.ENUM('general', 'universitario', 'ahorro'),
      defaultValue: 'general'
    },
    dificultad: {
      type: DataTypes.ENUM('básico', 'intermedio', 'avanzado'),
      defaultValue: 'básico'
    },
    votos_positivos: { type: DataTypes.INTEGER, defaultValue: 0 },
    votos_negativos: { type: DataTypes.INTEGER, defaultValue: 0 }
  }, {
    tableName: 'consejos',
    timestamps: false
  });

  return Consejo;
};
