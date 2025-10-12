const express = require('express');
const router = express.Router();
const saleController = require('../controllers/saleController');
const authenticateToken = require('../middleware/authMiddleware');

// Middleware de autenticación para todas las rutas
router.use(authenticateToken);

// Rutas para productos (para seleccionar en ventas)
router.get('/products', saleController.getProducts);

// Rutas para ventas
router.post('/', saleController.createSale);
router.get('/', saleController.getSales);
router.get('/stats', saleController.getSalesStats);
router.get('/:id', saleController.getSaleById);

module.exports = router;
