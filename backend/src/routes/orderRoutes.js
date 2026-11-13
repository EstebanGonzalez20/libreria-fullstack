const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus
} = require('../controllers/orderController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

router.post('/', verifyToken, createOrder);
router.get('/', verifyToken, getOrders);
router.get('/:id', verifyToken, getOrderById);
router.patch('/:id/status', verifyToken, isAdmin, updateOrderStatus);

module.exports = router;