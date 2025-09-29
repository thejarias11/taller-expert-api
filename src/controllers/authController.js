const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Base de datos temporal (en un proyecto real usarías MongoDB, MySQL, etc.)
let users = [];

// Controlador para registro
const register = async (req, res) => {
    try {
        // 1. Obtener datos del cuerpo de la petición
        const { username, password, role = 'empleado' } = req.body;

        // 2. Validar que vengan todos los datos
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: '❌ Usuario y contraseña son obligatorios'
            });
        }

        // 3. Verificar si el usuario ya existe
        const existingUser = users.find(user => user.username === username);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: '❌ El usuario ya existe'
            });
        }

        // 4. Encriptar la contraseña
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 5. Crear el nuevo usuario
        const newUser = {
            id: Date.now().toString(),
            username,
            password: hashedPassword,
            role,
            createdAt: new Date()
        };

        // 6. Guardar el usuario (en memoria por ahora)
        users.push(newUser);

        // 7. Responder con éxito
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
        // 1. Obtener credenciales
        const { username, password } = req.body;

        // 2. Validar datos
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: '❌ Usuario y contraseña son obligatorios'
            });
        }

        // 3. Buscar usuario
        const user = users.find(user => user.username === username);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: '❌ Credenciales inválidas'
            });
        }

        // 4. Verificar contraseña
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: '❌ Credenciales inválidas'
            });
        }

        // 5. Generar token JWT
        const token = jwt.sign(
            { 
                userId: user.id, 
                username: user.username,
                role: user.role 
            },
            process.env.JWT_SECRET || 'secreto_temporal',
            { expiresIn: '24h' }
        );

        // 6. Responder con éxito y token
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