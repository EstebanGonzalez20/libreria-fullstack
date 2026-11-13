const { Category } = require('../models');

const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({ order: [['nombre', 'ASC']] });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener categorías.', error: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    if (!nombre) return res.status(400).json({ message: 'El nombre de la categoría es obligatorio.' });

    const category = await Category.create({ nombre, descripcion });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear categoría.', error: error.message });
  }
};

module.exports = { getCategories, createCategory };