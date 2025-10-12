const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    console.log('🔐 Verificando autenticación para:', req.path);
    console.log('📝 Header recibido:', authHeader ? 'Bearer ' + authHeader.split(' ')[1].substring(0, 20) + '...' : 'null');

    if (!token) {
        console.log('❌ No se encontró token');
        return res.status(401).json({
            success: false,
            message: 'Token de acceso requerido'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto_temporal');
        console.log('✅ Token válido para usuario:', decoded.username);
        req.user = decoded;
        next();
    } catch (error) {
        console.log('❌ Token inválido:', error.message);
        return res.status(403).json({
            success: false,
            message: 'Token invalido o expirado'
        });
    }
};

module.exports = authenticateToken;