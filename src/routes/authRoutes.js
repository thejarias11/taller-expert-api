const express = require('express');
const { 
    login, 
    register, 
    getAllUsers, 
    getUserById, 
    deleteUser,
    updateUser
} = require('../controllers/authController');
const authenticateToken = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

const router = express.Router();

// Ruta de login (pública)
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

// Rutas protegidas para gestión de usuarios (solo admin y super_admin)
router.post('/register', authenticateToken, authorizeRoles('super_admin', 'admin'), register);
router.get('/users', authenticateToken, authorizeRoles('super_admin', 'admin'), getAllUsers);
router.get('/users/:id', authenticateToken, authorizeRoles('super_admin', 'admin'), getUserById);
router.put('/users/:id', authenticateToken, authorizeRoles('super_admin', 'admin'), updateUser);
router.delete('/users/:id', authenticateToken, authorizeRoles('super_admin', 'admin'), deleteUser);

module.exports = router;