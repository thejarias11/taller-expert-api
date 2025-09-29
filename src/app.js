// Importar dependencias
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importar rutas
const authRoutes = require('./routes/authRoutes');

// Crear aplicación Express
const app = express();

// Middlewares
app.use(cors()); // Permitir peticiones de otros dominios
app.use(express.json()); // Permitir que el servidor entienda JSON

// Usar rutas
app.use('/api/auth', authRoutes);

// Ruta de prueba
app.get('/api/health', (req, res) => {
    res.json({ 
        message: '✅ Servidor de Taller Expert funcionando correctamente',
        timestamp: new Date().toISOString()
    });
});

// Exportar la aplicación
module.exports = app;