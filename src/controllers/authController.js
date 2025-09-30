const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Base de datos temporal - VAMOS A CREAR USUARIOS CON CONTRASEÑAS VÁLIDAS
let users = [];

// 🔥 FUNCIÓN PARA CREAR USUARIOS CON CONTRASEÑAS ENCRIPTADAS REALES
const createDefaultUsers = async () => {
    try {
        // Encriptar contraseñas de forma REAL
        const adminPassword = await bcrypt.hash('123456', 10);
        const empleadoPassword = await bcrypt.hash('abcdef', 10);
        
        users = [
            {
                id: '1',
                username: 'admin',
                password: adminPassword, // Contraseña REAL encriptada
                role: 'admin',
                createdAt: new Date()
            },
            {
                id: '2', 
                username: 'empleado1',
                password: empleadoPassword, // Contraseña REAL encriptada
                role: 'empleado',
                createdAt: new Date()
            }
        ];
        
        console.log('✅ Usuarios por defecto creados correctamente');
        console.log('👤 admin / 123456');
        console.log('👤 empleado1 / abcdef');
    } catch (error) {
        console.error('❌ Error creando usuarios:', error);
    }
};

// 🔥 EJECUTAR AL INICIAR
createDefaultUsers();

// Controlador para registro
const register = async (req, res) => {
    try {
        const { username, password, role = 'empleado' } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: '❌ Usuario y contraseña son obligatorios'
            });
        }

        const existingUser = users.find(user => user.username === username);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: '❌ El usuario ya existe'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            id: Date.now().toString(),
            username,
            password: hashedPassword,
            role,
            createdAt: new Date()
        };

        users.push(newUser);

        res.status(201).json({
            success: true,
            message: '✅ Usuario registrado exitosamente',
            user: {
                id: newUser.id,
                username: newUser.username,
                role: newUser.role
            }
        });

    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({
            success: false,
            message: '❌ Error interno del servidor'
        });
    }
};

// Controlador para login
const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        console.log('🔍 Intentando login con:', username); // Para debug

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: '❌ Usuario y contraseña son obligatorios'
            });
        }

        const user = users.find(user => user.username === username);
        
        if (!user) {
            console.log('❌ Usuario no encontrado:', username);
            return res.status(401).json({
                success: false,
                message: '❌ Credenciales inválidas'
            });
        }

        console.log('✅ Usuario encontrado, verificando contraseña...');
        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            console.log('❌ Contraseña incorrecta para:', username);
            return res.status(401).json({
                success: false,
                message: '❌ Credenciales inválidas'
            });
        }

        const token = jwt.sign(
            { 
                userId: user.id, 
                username: user.username,
                role: user.role 
            },
            process.env.JWT_SECRET || 'secreto_temporal',
            { expiresIn: '24h' }
        );

        console.log('✅ Login exitoso para:', username);
        
        res.json({
            success: true,
            message: '✅ Autenticación satisfactoria',
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            success: false,
            message: '❌ Error interno del servidor'
        });
    }
};

module.exports = {
    register,
    login
};