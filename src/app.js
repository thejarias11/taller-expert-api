// Importar dependencias
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const saleRoutes = require('./routes/saleRoutes');

// Crear aplicación Express
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Servir archivos estáticos (HTML, CSS, JS)
app.use(express.static('public'));

// Usar rutas
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/sales', saleRoutes);

// Ruta de prueba
app.get('/api/health', (req, res) => {
    res.json({ 
        message: '✅ Servidor de Taller Expert funcionando correctamente',
        timestamp: new Date().toISOString()
    });
});

// Exportar la aplicación
module.exports = app;