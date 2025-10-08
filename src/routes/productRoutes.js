const express = require('express');
const { 
    getAllProducts, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct 
} = require('../controllers/productController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Rutas públicas para todos los usuarios autenticados
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Rutas solo para administradores
router.post('/', authorizeRoles('admin'), createProduct);
router.put('/:id', authorizeRoles('admin'), updateProduct);
router.delete('/:id', authorizeRoles('admin'), deleteProduct);

module.exports = router;