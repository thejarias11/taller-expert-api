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

module.exports = {
    login,
    verifyAdminCredentials
};