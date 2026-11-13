const express = require('express');
const router = express.Router();
const { getCategories, createCategory } = require('../controllers/categoryController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

router.get('/', getCategories);
router.post('/', verifyToken, isAdmin, createCategory);

module.exports = router;