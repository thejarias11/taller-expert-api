// Importar la aplicación principal
const app = require('./src/app');

// Configurar el puerto (usará el del entorno o 3000 por defecto)
const PORT = process.env.PORT || 3000;

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
});