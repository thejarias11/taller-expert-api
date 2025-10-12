const express = require('express');
const router = express.Router();
const saleController = require('../controllers/saleController');
const authenticateToken = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Middleware de autenticación para todas las rutas
router.use(authenticateToken);

// Rutas para productos (para seleccionar en ventas)
router.get('/products', saleController.getProducts);

// Rutas para ventas
router.post('/', saleController.createSale);
router.get('/', saleController.getSales);
router.get('/stats', saleController.getSalesStats);
router.get('/:id', saleController.getSaleById);

// Rutas que requieren permisos especiales
router.delete('/:id', authorizeRoles('super_admin', 'admin'), saleController.deleteSale);

module.exports = router;
