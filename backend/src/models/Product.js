const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  codigo_barras: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  nombre: {
    type: DataTypes.STRING(180),
    allowNull: false
  },
  autor: {
    type: DataTypes.STRING(120),
    allowNull: true
  },
  epoca: {
    type: DataTypes.STRING(80),
    allowNull: true
  },
  tipo: {
    type: DataTypes.STRING(80),
    allowNull: true,
    defaultValue: 'Físico'
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      // RN-02: Todo producto debe poseer un precio unitario mayor a cero (>0)
      min: 0.01
    }
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  imagen_url: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  activo: {
    // RF-02.1: Eliminación lógica
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false
  }
}, {
  tableName: 'products',
  timestamps: true
});

module.exports = Product;