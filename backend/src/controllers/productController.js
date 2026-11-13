const { Op } = require('sequelize');
const { Product, Category } = require('../models');

// GET /api/products (Filtrado y paginado)
const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      search = '',
      category_id,
      autor,
      epoca,
      tipo,
      includeInactive = 'false'
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const where = {};

    // Eliminación lógica: por defecto solo activos
    if (includeInactive !== 'true') {
      where.activo = true;
    }

    if (search) {
      where[Op.or] = [
        { nombre: { [Op.like]: `%${search}%` } },
        { autor: { [Op.like]: `%${search}%` } },
        { codigo_barras: { [Op.like]: `%${search}%` } }
      ];
    }

    if (category_id) where.category_id = category_id;
    if (autor) where.autor = { [Op.like]: `%${autor}%` };
    if (epoca) where.epoca = { [Op.like]: `%${epoca}%` };
    if (tipo) where.tipo = tipo;

    const { count, rows } = await Product.findAndCountAll({
      where,
      include: [{ model: Category, as: 'category', attributes: ['id', 'nombre'] }],
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']]
    });

    const lowStockThreshold = parseInt(process.env.LOW_STOCK_THRESHOLD || 5);
    const formattedProducts = rows.map(p => {
      const item = p.toJSON();
      return {
        ...item,
        alerta_bajo_stock: item.stock <= lowStockThreshold
      };
    });

    res.json({
      totalItems: count,
      totalPages: Math.ceil(count / parseInt(limit)),
      currentPage: parseInt(page),
      products: formattedProducts
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener productos.', error: error.message });
  }
};

// GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: Category, as: 'category', attributes: ['id', 'nombre', 'descripcion'] }]
    });

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener detalle del producto.', error: error.message });
  }
};

// POST /api/products (Admin)
const createProduct = async (req, res) => {
  try {
    const { codigo_barras, nombre, autor, epoca, tipo, precio, stock, imagen_url, category_id } = req.body;

    // RN-02: Precio mayor a cero
    if (!precio || parseFloat(precio) <= 0) {
      return res.status(400).json({ message: 'RN-02: El precio unitario debe ser mayor a cero (> 0).' });
    }

    if (stock === undefined || parseInt(stock) < 0) {
      return res.status(400).json({ message: 'El stock inicial no puede ser negativo.' });
    }

    const newProduct = await Product.create({
      codigo_barras,
      nombre,
      autor,
      epoca,
      tipo: tipo || 'Físico',
      precio: parseFloat(precio),
      stock: parseInt(stock),
      imagen_url,
      category_id
    });

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear producto.', error: error.message });
  }
};

// PUT /api/products/:id (Admin)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado.' });

    if (req.body.precio !== undefined && parseFloat(req.body.precio) <= 0) {
      return res.status(400).json({ message: 'RN-02: El precio unitario debe ser mayor a cero (> 0).' });
    }

    if (req.body.stock !== undefined && parseInt(req.body.stock) < 0) {
      return res.status(400).json({ message: 'El stock no puede ser negativo.' });
    }

    await product.update(req.body);
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar producto.', error: error.message });
  }
};

// DELETE /api/products/:id (Eliminación lógica - Admin)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado.' });

    await product.update({ activo: false });
    res.json({ message: 'Producto dado de baja lógicamente.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar producto.', error: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};