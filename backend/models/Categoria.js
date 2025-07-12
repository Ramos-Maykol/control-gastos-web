export default (sequelize, DataTypes) => {
  const Categoria = sequelize.define('Categoria', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING(100), allowNull: false },
    tipo: {
      type: DataTypes.ENUM('ingreso', 'egreso'),
      allowNull: false
    },
    usuario_id: { type: DataTypes.INTEGER, allowNull: true },
    es_global: { type: DataTypes.BOOLEAN, defaultValue: false }
  }, {
    tableName: 'categorias',
    timestamps: false
  });

  Categoria.associate = (models) => {
    Categoria.belongsTo(models.Usuario, { foreignKey: 'usuario_id' });
    Categoria.hasMany(models.Movimiento, { foreignKey: 'categoria_id' });
  };

  return Categoria;
};
