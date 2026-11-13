const { sequelize, Order, OrderItem, Product, Category, User } = require('../models');

// POST /api/orders (Transaccional con descuento automático de stock y RN-01 / RN-03)
const createOrder = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { items } = req.body; // [{ product_id, cantidad }]
    const user_id = req.user.id;

    if (!items || !Array.isArray(items) || items.length === 0) {
      await t.rollback();
      return res.status(400).json({ message: 'El carrito de compras está vacío.' });
    }

    const wholesaleMinQty = parseInt(process.env.WHOLESALE_MIN_QTY || 5);
    const wholesaleDiscountPct = parseFloat(process.env.WHOLESALE_DISCOUNT_PERCENT || 10);

    let subtotal = 0;
    const categoryTotals = {}; // { category_id: { qty: 0, amount: 0 } }
    const orderItemsData = [];

    for (const item of items) {
      const product = await Product.findByPk(item.product_id, {
        transaction: t,
        lock: t.LOCK.UPDATE
      });

      if (!product || !product.activo) {
        await t.rollback();
        return res.status(404).json({ message: `Producto ID ${item.product_id} no disponible.` });
      }

      // RN-01: Stock Mínimo
      if (item.cantidad > product.stock) {
        await t.rollback();
        return res.status(400).json({
          message: `RN-01: Stock insuficiente para "${product.nombre}". Disponible: ${product.stock}, solicitado: ${item.cantidad}.`
        });
      }

      const unitPrice = parseFloat(product.precio);
      const lineTotal = unitPrice * item.cantidad;
      subtotal += lineTotal;

      // Acumular cantidades por categoría para evaluar RN-03
      if (!categoryTotals[product.category_id]) {
        categoryTotals[product.category_id] = { qty: 0, amount: 0 };
      }
      categoryTotals[product.category_id].qty += item.cantidad;
      categoryTotals[product.category_id].amount += lineTotal;

      // Descuento automático de stock (RF-02.3)
      await product.update(
        { stock: product.stock - item.cantidad },
        { transaction: t }
      );

      orderItemsData.push({
        product_id: product.id,
        cantidad: item.cantidad,
        precio_unitario: unitPrice
      });
    }

    // RN-03: Descuento mayorista si se supera cantidad N de unidades de una misma categoría
    let descuento_aplicado = 0;
    for (const catId of Object.keys(categoryTotals)) {
      if (categoryTotals[catId].qty >= wholesaleMinQty) {
        descuento_aplicado += categoryTotals[catId].amount * (wholesaleDiscountPct / 100);
      }
    }

    const total = Math.max(0, subtotal - descuento_aplicado);

    const order = await Order.create({
      user_id,
      fecha: new Date(),
      subtotal: subtotal.toFixed(2),
      descuento_aplicado: descuento_aplicado.toFixed(2),
      total: total.toFixed(2),
      estado: 'PAGADO'
    }, { transaction: t });

    for (const itemData of orderItemsData) {
      await OrderItem.create({
        order_id: order.id,
        ...itemData
      }, { transaction: t });
    }

    await t.commit();

    const fullOrder = await Order.findByPk(order.id, {
      include: [
        { model: OrderItem, as: 'items', include: [{ model: Product, as: 'product' }] }
      ]
    });

    res.status(201).json({
      message: 'Orden procesada exitosamente.',
      order: fullOrder
    });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: 'Error al procesar la orden.', error: error.message });
  }
};

// GET /api/orders
const getOrders = async (req, res) => {
  try {
    const where = req.user.role === 'ADMIN' ? {} : { user_id: req.user.id };

    const orders = await Order.findAll({
      where,
      include: [
        { model: User, as: 'user', attributes: ['id', 'nombre', 'email'] },
        {
          model: OrderItem,
          as: 'items',
          include: [{ model: Product, as: 'product', attributes: ['id', 'nombre', 'codigo_barras'] }]
        }
      ],
      order: [['fecha', 'DESC']]
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener órdenes.', error: error.message });
  }
};

// GET /api/orders/:id
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'nombre', 'email'] },
        {
          model: OrderItem,
          as: 'items',
          include: [{ model: Product, as: 'product' }]
        }
      ]
    });

    if (!order) return res.status(404).json({ message: 'Orden no encontrada.' });

    if (req.user.role !== 'ADMIN' && order.user_id !== req.user.id) {
      return res.status(403).json({ message: 'No autorizado para ver esta orden.' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la orden.', error: error.message });
  }
};

// PATCH /api/orders/:id/status (Admin)
const updateOrderStatus = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { estado } = req.body;
    const validStates = ['PENDIENTE', 'PAGADO', 'CANCELADO', 'COMPLETADO'];

    if (!validStates.includes(estado)) {
      await t.rollback();
      return res.status(400).json({ message: 'Estado de orden inválido.' });
    }

    const order = await Order.findByPk(req.params.id, {
      include: [{ model: OrderItem, as: 'items' }],
      transaction: t
    });

    if (!order) {
      await t.rollback();
      return res.status(404).json({ message: 'Orden no encontrada.' });
    }

    // Si se cancela una orden que no estaba cancelada, restaurar el stock
    if (estado === 'CANCELADO' && order.estado !== 'CANCELADO') {
      for (const item of order.items) {
        const product = await Product.findByPk(item.product_id, { transaction: t });
        if (product) {
          await product.update({ stock: product.stock + item.cantidad }, { transaction: t });
        }
      }
    }

    await order.update({ estado }, { transaction: t });
    await t.commit();

    res.json({ message: `Estado actualizado a ${estado}`, order });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: 'Error al actualizar estado de orden.', error: error.message });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus
};