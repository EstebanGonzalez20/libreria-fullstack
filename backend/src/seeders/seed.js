const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const { sequelize, User, Category, Product } = require('../models');

async function seed() {
  try {
    // 1. Crear la base de datos si no existe
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'libreria_db'}\`;`);
    await connection.end();

    // 2. Sincronizar tablas y cargar datos iniciales
    await sequelize.sync({ force: true });
    console.log('Base de datos y tablas sincronizadas.');

    const adminHash = await bcrypt.hash('admin123', 10);
    const clientHash = await bcrypt.hash('cliente123', 10);

    await User.bulkCreate([
      { nombre: 'Administrador Librería', email: 'admin@libreria.com', password_hash: adminHash, role: 'ADMIN' },
      { nombre: 'Laura Lectora', email: 'cliente@libreria.com', password_hash: clientHash, role: 'CLIENTE' }
    ]);

    const categories = await Category.bulkCreate([
      { nombre: 'Ficción y Literatura', descripcion: 'Novelas clásicas y contemporáneas' },
      { nombre: 'Ciencia Ficción y Fantasía', descripcion: 'Mundos imaginarios, distopías y épica' },
      { nombre: 'Historia y Ensayo', descripcion: 'Crónicas históricas, filosofía y pensamiento' },
      { nombre: 'Desarrollo y Tecnología', descripcion: 'Programación, arquitectura de software e IA' }
    ]);

    await Product.bulkCreate([
      {
        codigo_barras: '9780307474728',
        nombre: 'Cien años de soledad',
        autor: 'Gabriel García Márquez',
        epoca: 'Siglo XX',
        tipo: 'Tapa Blanda',
        precio: 18.50,
        stock: 25,
        imagen_url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=500&q=80',
        category_id: categories[0].id
      },
      {
        codigo_barras: '9780441172719',
        nombre: 'Dune',
        autor: 'Frank Herbert',
        epoca: 'Siglo XX',
        tipo: 'Tapa Dura',
        precio: 24.90,
        stock: 4, // Dispara alerta de bajo stock (<=5)
        imagen_url: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=500&q=80',
        category_id: categories[1].id
      },
      {
        codigo_barras: '9780132350884',
        nombre: 'Clean Code',
        autor: 'Robert C. Martin',
        epoca: 'Contemporánea',
        tipo: 'Tapa Blanda',
        precio: 42.00,
        stock: 15,
        imagen_url: 'https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&w=500&q=80',
        category_id: categories[3].id
      },
      {
        codigo_barras: '9788499924212',
        nombre: 'Sapiens: De animales a dioses',
        autor: 'Yuval Noah Harari',
        epoca: 'Contemporánea',
        tipo: 'Tapa Blanda',
        precio: 21.00,
        stock: 30,
        imagen_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=500&q=80',
        category_id: categories[2].id
      }
    ]);

    console.log('Datos iniciales cargados correctamente.');
    process.exit(0);
  } catch (error) {
    console.error('Error al ejecutar seed:', error);
    process.exit(1);
  }
}

seed();