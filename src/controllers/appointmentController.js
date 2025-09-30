// Base de datos temporal para citas
let appointments = [];
let nextAppointmentId = 1;

const getAllAppointments = (req, res) => {
    try {
        let filteredAppointments = appointments;

        // Si es empleado, solo ve sus citas asignadas
        if (req.user.role === 'empleado') {
            filteredAppointments = appointments.filter(apt => 
                apt.assignedTo === req.user.userId
            );
        }

        res.json({
            success: true,
            data: filteredAppointments,
            total: filteredAppointments.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '❌ Error al obtener citas'
        });
    }
};

const createAppointment = (req, res) => {
    try {
        const { 
            clientName, 
            clientPhone, 
            motorcycleModel, 
            serviceType, 
            scheduledDate,
            assignedTo 
        } = req.body;

        if (!clientName || !clientPhone || !motorcycleModel || !serviceType || !scheduledDate) {
            return res.status(400).json({
                success: false,
                message: '❌ Todos los campos son obligatorios'
            });
        }

        const newAppointment = {
            id: nextAppointmentId++,
            clientName,
            clientPhone,
            motorcycleModel,
            serviceType,
            scheduledDate: new Date(scheduledDate),
            status: 'agendada',
            assignedTo: assignedTo || req.user.userId,
            createdAt: new Date(),
            createdBy: req.user.userId
        };

        appointments.push(newAppointment);

        res.status(201).json({
            success: true,
            message: '✅ Cita agendada exitosamente',
            data: newAppointment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '❌ Error al crear cita'
        });
    }
};

const updateAppointmentStatus = (req, res) => {
    try {
        const appointmentId = parseInt(req.params.id);
        const { status } = req.body;

        const validStatuses = ['agendada', 'en_progreso', 'completada', 'cancelada'];
        
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: '❌ Estado inválido'
            });
        }

        const appointmentIndex = appointments.findIndex(apt => apt.id === appointmentId);

        if (appointmentIndex === -1) {
            return res.status(404).json({
                success: false,
                message: '❌ Cita no encontrada'
            });
        }

        // Verificar permisos
        if (req.user.role === 'empleado' && 
            appointments[appointmentIndex].assignedTo !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: '❌ No tienes permisos para modificar esta cita'
            });
        }

        appointments[appointmentIndex].status = status;
        appointments[appointmentIndex].updatedAt = new Date();

        res.json({
            success: true,
            message: `✅ Cita ${status} exitosamente`,
            data: appointments[appointmentIndex]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '❌ Error al actualizar cita'
        });
    }
};

const deleteAppointment = (req, res) => {
    try {
        const appointmentId = parseInt(req.params.id);
        const appointmentIndex = appointments.findIndex(apt => apt.id === appointmentId);

        if (appointmentIndex === -1) {
            return res.status(404).json({
                success: false,
                message: '❌ Cita no encontrada'
            });
        }

        appointments.splice(appointmentIndex, 1);

        res.json({
            success: true,
            message: '✅ Cita eliminada exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '❌ Error al eliminar cita'
        });
    }
};

module.exports = {
    getAllAppointments,
    createAppointment,
    updateAppointmentStatus,
    deleteAppointment
};