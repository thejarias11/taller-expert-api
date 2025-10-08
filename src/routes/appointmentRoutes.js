const express = require('express');
const {
    getAllAppointments,
    createAppointment,
    updateAppointmentStatus,
    deleteAppointment
} = require('../controllers/appointmentController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Rutas públicas para usuarios autenticados
router.get('/', getAllAppointments);

// Rutas para admin y empleados
router.post('/', authorizeRoles('admin', 'empleado'), createAppointment);
router.put('/:id/status', authorizeRoles('admin', 'empleado'), updateAppointmentStatus);

// Rutas solo para administradores
router.delete('/:id', authorizeRoles('admin'), deleteAppointment);

module.exports = router;