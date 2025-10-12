const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Base de datos temporal - SOLO EMPLEADOS REGISTRADOS
let users = [];

// 🔥 FUNCIÓN PARA CREAR ADMIN AL INICIAR
const createDefaultAdmin = async () => {
    try {
        // Encriptar "Admin000" de forma REAL
        const adminPassword = await bcrypt.hash('Admin000', 10);
        
        users = [
            {
                id: '1',
                username: 'admin',
                password: adminPassword, // ✅ Contraseña REAL encriptada
                role: 'super_admin',
                nombre: 'Administrador Principal',
                email: 'admin@tallerexpert.com',
                sucursal_id: null,
                activo: true,
                createdAt: new Date()
            }
        ];
        
        console.log('✅ Admin principal creado: admin / Admin000');
    } catch (error) {
        console.error('❌ Error creando admin:', error);
    }
};

// 🔥 EJECUTAR AL INICIAR
createDefaultAdmin();

// Controlador para login
const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        console.log('🔐 Intentando login:', username);
        console.log('📋 Usuarios en sistema:', users.map(u => u.username));

        // Validar datos
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Usuario y contraseña son obligatorios'
            });
        }

        // Buscar usuario
        const user = users.find(user => user.username === username && user.activo);
        
        if (!user) {
            console.log('❌ Usuario no encontrado o inactivo:', username);
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas o usuario inactivo'
            });
        }

        console.log('✅ Usuario encontrado, verificando contraseña...');

        // Verificar contraseña
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            console.log('❌ Contraseña incorrecta para:', username);
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        // Generar token JWT
        const token = jwt.sign(
            { 
                userId: user.id, 
                username: user.username,
                role: user.role,
                sucursal_id: user.sucursal_id,
                nombre: user.nombre
            },
            process.env.JWT_SECRET || 'secreto_temporal',
            { expiresIn: '8h' }
        );

        console.log('✅ Login exitoso:', user.username, '- Rol:', user.role);
        
        res.json({
            success: true,
            message: '✅ Acceso concedido',
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
                nombre: user.nombre,
                sucursal_id: user.sucursal_id
            }
        });

    } catch (error) {
        console.error('❌ Error en login:', error);
        res.status(500).json({
            success: false,
            message: '❌ Error interno del servidor'
        });
    }
};

// Función para verificar credenciales admin
const verifyAdminCredentials = async (username, password) => {
    try {
        const user = users.find(u => u.username === username && u.activo);
        if (!user) return false;
        
        return await bcrypt.compare(password, user.password);
    } catch (error) {
        console.error('Error verificando credenciales:', error);
        return false;
    }
};

// Controlador para registro de nuevos usuarios
const register = async (req, res) => {
    try {
        const { username, password, role, nombre, email } = req.body;

        console.log('👤 Intentando registrar usuario:', username);

        // Validar datos requeridos
        if (!username || !password || !role || !nombre) {
            return res.status(400).json({
                success: false,
                message: '❌ Username, password, role y nombre son obligatorios'
            });
        }

        // Verificar que el username no exista
        const userExists = users.find(u => u.username === username);
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: '❌ El username ya existe'
            });
        }

        // Validar rol
        const validRoles = ['super_admin', 'admin', 'empleado'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({
                success: false,
                message: '❌ Rol inválido. Debe ser: super_admin, admin o empleado'
            });
        }

        // Encriptar contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear nuevo usuario
        const newUser = {
            id: (users.length + 1).toString(),
            username,
            password: hashedPassword,
            role,
            nombre,
            email: email || '',
            sucursal_id: null,
            activo: true,
            createdAt: new Date(),
            createdBy: req.user ? req.user.username : 'system'
        };

        // Agregar a la lista de usuarios
        users.push(newUser);

        console.log('✅ Usuario creado exitosamente:', username, '- Rol:', role);
        console.log('📊 Total usuarios ahora:', users.length);
        console.log('👥 Lista usuarios actualizada:', users.map(u => `${u.username} (${u.role})`));

        // Responder (sin incluir la contraseña)
        const userResponse = {
            id: newUser.id,
            username: newUser.username,
            role: newUser.role,
            nombre: newUser.nombre,
            email: newUser.email,
            activo: newUser.activo,
            createdAt: newUser.createdAt
        };

        res.status(201).json({
            success: true,
            message: '✅ Usuario creado exitosamente',
            data: userResponse
        });

    } catch (error) {
        console.error('❌ Error registrando usuario:', error);
        res.status(500).json({
            success: false,
            message: '❌ Error interno del servidor'
        });
    }
};

// Controlador para obtener todos los usuarios
const getAllUsers = (req, res) => {
    try {
        console.log('👥 Obteniendo todos los usuarios...');
        
        // Filtrar usuarios activos y remover contraseñas
        const usersResponse = users
            .filter(u => u.activo)
            .map(u => ({
                id: u.id,
                username: u.username,
                role: u.role,
                nombre: u.nombre,
                email: u.email,
                activo: u.activo,
                createdAt: u.createdAt
            }));

        console.log('📊 Total usuarios encontrados:', usersResponse.length);

        res.json({
            success: true,
            data: usersResponse,
            total: usersResponse.length,
            message: `✅ Se encontraron ${usersResponse.length} usuarios`
        });

    } catch (error) {
        console.error('❌ Error obteniendo usuarios:', error);
        res.status(500).json({
            success: false,
            message: '❌ Error al obtener usuarios'
        });
    }
};

// Controlador para obtener usuario por ID
const getUserById = (req, res) => {
    try {
        const userId = req.params.id;
        
        console.log('🔍 Buscando usuario con ID:', userId);
        
        const user = users.find(u => u.id === userId && u.activo);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: '❌ Usuario no encontrado'
            });
        }

        // Respuesta sin contraseña
        const userResponse = {
            id: user.id,
            username: user.username,
            role: user.role,
            nombre: user.nombre,
            email: user.email,
            activo: user.activo,
            createdAt: user.createdAt
        };

        console.log('✅ Usuario encontrado:', user.username);
        
        res.json({
            success: true,
            data: userResponse,
            message: '✅ Usuario obtenido exitosamente'
        });
        
    } catch (error) {
        console.error('❌ Error obteniendo usuario:', error);
        res.status(500).json({
            success: false,
            message: '❌ Error al obtener usuario'
        });
    }
};

// Controlador para eliminar usuario (desactivar)
const deleteUser = (req, res) => {
    try {
        const userId = req.params.id;
        
        console.log('🗑️ Desactivando usuario con ID:', userId);
        
        const userIndex = users.findIndex(u => u.id === userId);
        
        if (userIndex === -1) {
            return res.status(404).json({
                success: false,
                message: '❌ Usuario no encontrado'
            });
        }

        const user = users[userIndex];

        // No permitir eliminar el admin principal
        if (user.username === 'admin' && user.role === 'super_admin') {
            return res.status(403).json({
                success: false,
                message: '❌ No se puede eliminar el administrador principal'
            });
        }

        // Desactivar usuario en lugar de eliminar
        users[userIndex].activo = false;
        users[userIndex].deletedAt = new Date();
        users[userIndex].deletedBy = req.user.username;
        
        console.log('✅ Usuario desactivado:', user.username);
        console.log('📊 Usuarios activos:', users.filter(u => u.activo).length);

        res.json({
            success: true,
            message: '✅ Usuario desactivado exitosamente',
            data: { id: userId, username: user.username }
        });

    } catch (error) {
        console.error('❌ Error desactivando usuario:', error);
        res.status(500).json({
            success: false,
            message: '❌ Error al desactivar usuario'
        });
    }
};

// Controlador para actualizar usuario
const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const { username, nombre, email, role, password } = req.body;

        console.log('✏️ Intentando actualizar usuario:', userId);
        console.log('📊 Datos recibidos:', { username, nombre, email, role, password: password ? '***' : 'No cambiar' });
        console.log('👤 Usuario solicitante:', req.user ? req.user.username : 'Desconocido');

        // Buscar usuario por ID
        const userIndex = users.findIndex(u => u.id === userId && u.activo);
        
        if (userIndex === -1) {
            return res.status(404).json({
                success: false,
                message: '❌ Usuario no encontrado'
            });
        }

        const user = users[userIndex];

        // Validar que el username no esté en uso por otro usuario
        if (username && username !== user.username) {
            const usernameExists = users.find(u => u.username === username && u.id !== userId && u.activo);
            if (usernameExists) {
                return res.status(400).json({
                    success: false,
                    message: '❌ El username ya está en uso por otro usuario'
                });
            }
        }

        // Actualizar campos
        if (username) user.username = username;
        if (nombre) user.nombre = nombre;
        if (email !== undefined) user.email = email; // Permitir email vacío
        if (role) {
            const validRoles = ['super_admin', 'admin', 'empleado'];
            if (!validRoles.includes(role)) {
                return res.status(400).json({
                    success: false,
                    message: '❌ Rol inválido. Debe ser: super_admin, admin o empleado'
                });
            }
            user.role = role;
        }

        // Actualizar contraseña si se proporciona
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
            console.log('🔒 Contraseña actualizada para:', user.username);
        }

        // Agregar metadatos de actualización
        user.updatedAt = new Date();
        user.updatedBy = req.user ? req.user.username : 'system';

        console.log('✅ Usuario actualizado exitosamente:', user.username);

        // Responder sin incluir la contraseña
        const userResponse = {
            id: user.id,
            username: user.username,
            role: user.role,
            nombre: user.nombre,
            email: user.email,
            activo: user.activo,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };

        res.json({
            success: true,
            message: '✅ Usuario actualizado exitosamente',
            data: userResponse
        });

    } catch (error) {
        console.error('❌ Error actualizando usuario:', error);
        res.status(500).json({
            success: false,
            message: '❌ Error interno del servidor'
        });
    }
};

module.exports = {
    login,
    register,
    getAllUsers,
    getUserById,
    deleteUser,
    updateUser,
    verifyAdminCredentials
};