const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

const router = express.Router();

// Ruta temporal para testing
router.get('/', authenticateToken, (req, res) => {
    res.json({
        success: true,
        message: '✅ Ruta de citas funcionando',
        user: req.user
    });
});

router.post('/', authenticateToken, authorizeRoles('admin', 'empleado'), (req, res) => {
    res.json({
        success: true,
        message: '✅ Crear cita funcionando',
        data: req.body
    });
});

module.exports = router;