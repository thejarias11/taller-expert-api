const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

const router = express.Router();

// Por ahora, solo creamos la estructura básica
// Mañana agregaremos los controladores reales

// Ruta temporal para testing
router.get('/', authenticateToken, (req, res) => {
    res.json({
        success: true,
        message: '✅ Ruta de productos funcionando',
        user: req.user
    });
});

router.post('/', authenticateToken, authorizeRoles('admin'), (req, res) => {
    res.json({
        success: true,
        message: '✅ Crear producto funcionando',
        data: req.body
    });
});

module.exports = router;