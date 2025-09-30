const express = require('express');
const { register, login } = require('../controllers/authController');
// ELIMINA ESTA LÍNEA: const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Ruta para registro de usuarios - PÚBLICA (sin autenticación)
router.post('/register', register);

// Ruta para inicio de sesión - PÚBLICA (sin autenticación)
router.post('/login', login);

module.exports = router;