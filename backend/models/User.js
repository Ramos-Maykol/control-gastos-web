// models/User.js
export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    contraseña: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'usuarios'
  });

  User.associate = (models) => {
    User.hasMany(models.Movimiento, { foreignKey: 'usuario_id' });
  };

  return User;
};
