// SCRIPT DE DEBUGGING PARA CONSOLA DEL NAVEGADOR
// Copiar y pegar este código en la consola del navegador (F12)

// Función para probar la carga de productos
async function testLoadProducts() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/products', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        console.log('📦 Productos obtenidos:', data);
        return data;
    } catch (error) {
        console.error('❌ Error cargando productos:', error);
    }
}

// Función para probar obtener un producto específico
async function testGetProduct(id) {
    try {
        const token = localStorage.getItem('token');
        console.log('🔍 Probando obtener producto ID:', id);
        const response = await fetch(`/api/products/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        console.log('📦 Producto obtenido:', data);
        return data;
    } catch (error) {
        console.error('❌ Error obteniendo producto:', error);
    }
}

// Función para probar citas
async function testLoadAppointments() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/appointments', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        console.log('📅 Citas obtenidas:', data);
        return data;
    } catch (error) {
        console.error('❌ Error cargando citas:', error);
    }
}

// Para usar:
console.log('🔧 Scripts de debugging cargados.');
console.log('Ejecuta: testLoadProducts() para ver los productos');
console.log('Ejecuta: testGetProduct(1) para probar obtener producto ID 1');
console.log('Ejecuta: testLoadAppointments() para ver las citas');