export default (sequelize, DataTypes) => {
  const Categoria = sequelize.define('Categoria', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    tipo: {
      type: DataTypes.ENUM('ingreso', 'egreso'),
      allowNull: false
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    es_global: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'categorias',
    timestamps: false,
    validate: {
      validCategoriaScope() {
        if (this.es_global && this.usuario_id !== null) {
          throw new Error('Una categoría global no debe tener usuario_id');
        }
        if (!this.es_global && this.usuario_id === null) {
          throw new Error('Una categoría personal debe tener usuario_id');
        }
      }
    }
  });

  Categoria.associate = (models) => {
    Categoria.belongsTo(models.Usuario, {
      foreignKey: 'usuario_id'
    });
    Categoria.hasMany(models.Movimiento, {
      foreignKey: 'categoria_id',
      as: 'movimientos'
    });
  };

  return Categoria;
};
