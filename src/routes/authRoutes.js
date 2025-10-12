const express = require('express');
const { login } = require('../controllers/authController');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

// Ruta de login
router.post('/login', login);

// Ruta para verificar token de autenticación
router.get('/verify', authenticateToken, (req, res) => {
    res.json({ 
        success: true,
        message: '✅ Token válido',
        user: {
            userId: req.user.userId,
            username: req.user.username,
            role: req.user.role
        }
    });
});
// router.post('/register', register); // ← ESTA LÍNEA DEBE ELIMINARSE

module.exports = router;