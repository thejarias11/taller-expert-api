// Base de datos temporal para citas
let appointments = [
    {
        id: 1,
        clientName: "Juan Pérez",
        clientPhone: "3001234567",
        motorcycleModel: "Yamaha R15",
        serviceType: "Cambio de aceite",
        scheduledDate: new Date("2025-10-10T09:00:00.000Z"),
        status: "agendada",
        assignedTo: "admin",
        createdAt: new Date(),
        createdBy: "admin"
    },
    {
        id: 2,
        clientName: "María García",
        clientPhone: "3109876543", 
        motorcycleModel: "Honda CBR 250",
        serviceType: "Afinamiento",
        scheduledDate: new Date("2025-10-11T14:30:00.000Z"),
        status: "agendada",
        assignedTo: "empleado1",
        createdAt: new Date(),
        createdBy: "admin"
    }
];
let nextAppointmentId = 3;

const getAllAppointments = (req, res) => {
    try {
        console.log('📅 Obteniendo todas las citas...');
        
        let filteredAppointments = appointments;

        // Si es empleado, solo ve sus citas asignadas
        if (req.user.role === 'empleado') {
            filteredAppointments = appointments.filter(apt => 
                apt.assignedTo === req.user.userId || apt.assignedTo === req.user.username
            );
            console.log('👤 Citas filtradas para empleado:', filteredAppointments.length);
        }

        console.log('📊 Total de citas encontradas:', filteredAppointments.length);
        
        res.json({
            success: true,
            data: filteredAppointments,
            total: filteredAppointments.length,
            message: `✅ Se encontraron ${filteredAppointments.length} citas`
        });
    } catch (error) {
        console.error('❌ Error al obtener citas:', error);
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

        console.log('🆕 Creando nueva cita para:', clientName);

        // Validaciones
        if (!clientName || !clientPhone || !motorcycleModel || !serviceType || !scheduledDate) {
            return res.status(400).json({
                success: false,
                message: '❌ Todos los campos son obligatorios'
            });
        }

        // Crear nueva cita
        const newAppointment = {
            id: nextAppointmentId++,
            clientName,
            clientPhone,
            motorcycleModel,
            serviceType,
            scheduledDate: new Date(scheduledDate),
            status: 'agendada',
            assignedTo: assignedTo || req.user.username,
            createdAt: new Date(),
            createdBy: req.user.username
        };

        // Guardar cita
        appointments.push(newAppointment);
        
        console.log('✅ Cita creada exitosamente:', newAppointment.id);
        console.log('📊 Total de citas ahora:', appointments.length);

        res.status(201).json({
            success: true,
            message: '✅ Cita agendada exitosamente',
            data: newAppointment
        });

    } catch (error) {
        console.error('❌ Error al crear cita:', error);
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

        console.log('✏️ Actualizando estado de cita ID:', appointmentId);

        const validStatuses = ['agendada', 'en_progreso', 'completada', 'cancelada'];
        
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: '❌ Estado inválido. Use: agendada, en_progreso, completada, cancelada'
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
            appointments[appointmentIndex].assignedTo !== req.user.username) {
            return res.status(403).json({
                success: false,
                message: '❌ No tienes permisos para modificar esta cita'
            });
        }

        appointments[appointmentIndex].status = status;
        appointments[appointmentIndex].updatedAt = new Date();

        console.log('✅ Estado de cita actualizado a:', status);

        res.json({
            success: true,
            message: `✅ Cita ${status} exitosamente`,
            data: appointments[appointmentIndex]
        });

    } catch (error) {
        console.error('❌ Error al actualizar cita:', error);
        res.status(500).json({
            success: false,
            message: '❌ Error al actualizar cita'
        });
    }
};

const deleteAppointment = (req, res) => {
    try {
        const appointmentId = parseInt(req.params.id);
        console.log('🗑️ Eliminando cita ID:', appointmentId);

        const appointmentIndex = appointments.findIndex(apt => apt.id === appointmentId);

        if (appointmentIndex === -1) {
            return res.status(404).json({
                success: false,
                message: '❌ Cita no encontrada'
            });
        }

        const deletedAppointment = appointments.splice(appointmentIndex, 1)[0];
        
        console.log('✅ Cita eliminada:', deletedAppointment.clientName);
        console.log('📊 Total de citas ahora:', appointments.length);

        res.json({
            success: true,
            message: '✅ Cita eliminada exitosamente',
            data: deletedAppointment
        });

    } catch (error) {
        console.error('❌ Error al eliminar cita:', error);
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