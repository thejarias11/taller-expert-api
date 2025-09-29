const express = require('express');
const { register, login } = require('../controllers/authController');

const router = express.Router();

// Ruta para registro de usuarios
router.post('/register', register);

// Ruta para inicio de sesión
router.post('/login', login);

module.exports = router;