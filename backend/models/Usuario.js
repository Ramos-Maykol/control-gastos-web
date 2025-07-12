export default (sequelize, DataTypes) => {
  const Usuario = sequelize.define('Usuario', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING(100), allowNull: false },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },
    password: { type: DataTypes.STRING(255), allowNull: false },
    salt: { type: DataTypes.STRING(64), allowNull: false },
    edad: {
      type: DataTypes.INTEGER,
      validate: { min: 18, max: 25 }
    },
    ciudad: { type: DataTypes.STRING(100), defaultValue: 'Trujillo' },
    fecha_registro: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    tableName: 'usuarios',
    timestamps: false
  });

  Usuario.associate = (models) => {
    Usuario.hasMany(models.Movimiento, { foreignKey: 'usuario_id' });
    Usuario.hasMany(models.Categoria, { foreignKey: 'usuario_id' });
    Usuario.hasMany(models.MetaAhorro, { foreignKey: 'usuario_id' });
    Usuario.hasMany(models.Alerta, { foreignKey: 'usuario_id' });
  };

  return Usuario;
};
