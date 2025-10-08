const express = require('express');
const { login } = require('../controllers/authController'); // Solo importamos login
// ELIMINAMOS el register del import

const router = express.Router();

// SOLO RUTA DE LOGIN - ELIMINAMOS REGISTER
router.post('/login', login);

// ELIMINAMOS completamente la ruta de register
// router.post('/register', register); // ← ESTA LÍNEA DEBE ELIMINARSE

module.exports = router;