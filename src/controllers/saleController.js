// Base de datos temporal para ventas
let sales = [];
let saleCounter = 1;

// Importar productos desde productController (simulado)
// En un proyecto real, esto vendría de una base de datos
let products = [
    {
        id: '1',
        name: 'Aceite Motul 15W40',
        description: 'Aceite sintético para motocicletas',
        price: 45000,
        stock: 25,
        category: 'lubricante'
    },
    {
        id: '2',
        name: 'Llanta Michelin 110/90-16',
        description: 'Llanta trasera para motocicletas sport',
        price: 180000,
        stock: 8,
        category: 'llanta'
    },
    {
        id: '3',
        name: 'Cadena DID 520',
        description: 'Cadena de transmisión reforzada',
        price: 85000,
        stock: 15,
        category: 'repuesto'
    },
    {
        id: '4',
        name: 'Filtro de Aire K&N',
        description: 'Filtro de aire deportivo reutilizable',
        price: 120000,
        stock: 12,
        category: 'repuesto'
    },
    {
        id: '5',
        name: 'Casco Shoei RF-1400',
        description: 'Casco integral premium',
        price: 850000,
        stock: 5,
        category: 'accesorio'
    }
];

// Controlador para obtener todos los productos disponibles
const getProducts = (req, res) => {
    try {
        const { search, category, minPrice, maxPrice } = req.query;
        
        let filteredProducts = [...products];

        // Filtrar por búsqueda de texto
        if (search) {
            const searchLower = search.toLowerCase();
            filteredProducts = filteredProducts.filter(product => 
                product.name.toLowerCase().includes(searchLower) ||
                product.description.toLowerCase().includes(searchLower)
            );
        }

        // Filtrar por categoría
        if (category && category !== 'all') {
            filteredProducts = filteredProducts.filter(product => 
                product.category === category
            );
        }

        // Filtrar por rango de precios
        if (minPrice) {
            filteredProducts = filteredProducts.filter(product => 
                product.price >= parseFloat(minPrice)
            );
        }

        if (maxPrice) {
            filteredProducts = filteredProducts.filter(product => 
                product.price <= parseFloat(maxPrice)
            );
        }

        // Solo mostrar productos con stock disponible
        filteredProducts = filteredProducts.filter(product => product.stock > 0);

        res.json({
            success: true,
            products: filteredProducts,
            total: filteredProducts.length
        });

    } catch (error) {
        console.error('❌ Error obteniendo productos:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Controlador para crear una nueva venta
const createSale = async (req, res) => {
    try {
        const { items, paymentMethod, notes } = req.body;
        const userId = req.user.userId;
        const username = req.user.username;

        // Validaciones
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Debe incluir al menos un producto en la venta'
            });
        }

        // Validar disponibilidad de stock y calcular totales
        let totalAmount = 0;
        const saleItems = [];

        for (const item of items) {
            const product = products.find(p => p.id === item.productId);
            
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Producto con ID ${item.productId} no encontrado`
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Stock insuficiente para ${product.name}. Disponible: ${product.stock}, Solicitado: ${item.quantity}`
                });
            }

            const itemTotal = product.price * item.quantity;
            totalAmount += itemTotal;

            saleItems.push({
                productId: product.id,
                productName: product.name,
                price: product.price,
                quantity: item.quantity,
                subtotal: itemTotal
            });

            // Actualizar stock del producto
            product.stock -= item.quantity;
        }

        // Crear la venta
        const newSale = {
            id: saleCounter.toString(),
            saleNumber: `V-${String(saleCounter).padStart(6, '0')}`,
            items: saleItems,
            totalAmount,
            paymentMethod: paymentMethod || 'cash',
            notes: notes || '',
            sellerId: userId,
            sellerName: username,
            createdAt: new Date(),
            status: 'completed'
        };

        sales.push(newSale);
        saleCounter++;

        console.log('✅ Nueva venta creada:', newSale.saleNumber, '- Total:', totalAmount);

        res.status(201).json({
            success: true,
            message: '✅ Venta registrada exitosamente',
            sale: newSale
        });

    } catch (error) {
        console.error('❌ Error creando venta:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Controlador para obtener todas las ventas
const getSales = (req, res) => {
    try {
        const { startDate, endDate, sellerId, customerName } = req.query;
        
        let filteredSales = [...sales];

        // Filtrar por rango de fechas
        if (startDate) {
            const start = new Date(startDate);
            filteredSales = filteredSales.filter(sale => 
                new Date(sale.createdAt) >= start
            );
        }

        if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999); // Incluir todo el día
            filteredSales = filteredSales.filter(sale => 
                new Date(sale.createdAt) <= end
            );
        }

        // Filtrar por vendedor
        if (sellerId) {
            filteredSales = filteredSales.filter(sale => 
                sale.sellerId === sellerId
            );
        }

        // Filtrar por nombre de cliente (deshabilitado - ya no se almacenan datos del cliente)
        // if (customerName) {
        //     const searchLower = customerName.toLowerCase();
        //     filteredSales = filteredSales.filter(sale => 
        //         sale.customer.name.toLowerCase().includes(searchLower)
        //     );
        // }

        // Ordenar por fecha (más recientes primero)
        filteredSales.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // Calcular estadísticas
        const totalSales = filteredSales.length;
        const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.totalAmount, 0);
        const averageSale = totalSales > 0 ? totalRevenue / totalSales : 0;

        res.json({
            success: true,
            sales: filteredSales,
            statistics: {
                totalSales,
                totalRevenue,
                averageSale: Math.round(averageSale)
            }
        });

    } catch (error) {
        console.error('❌ Error obteniendo ventas:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Controlador para obtener una venta específica
const getSaleById = (req, res) => {
    try {
        const { id } = req.params;
        
        console.log('🔍 Buscando venta con ID:', id, 'tipo:', typeof id);
        console.log('📋 Ventas disponibles:', sales.map(s => ({id: s.id, numero: s.saleNumber})));
        
        const sale = sales.find(s => s.id === id);
        
        if (!sale) {
            console.log('❌ Venta no encontrada con ID:', id);
            return res.status(404).json({
                success: false,
                message: 'Venta no encontrada'
            });
        }
        
        console.log('✅ Venta encontrada:', sale.saleNumber);

        res.json({
            success: true,
            data: sale
        });

    } catch (error) {
        console.error('❌ Error obteniendo venta:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Controlador para obtener estadísticas de ventas
const getSalesStats = (req, res) => {
    try {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        // Ventas del día
        const todaySales = sales.filter(sale => 
            new Date(sale.createdAt) >= today
        );
        
        // Ventas del mes
        const monthSales = sales.filter(sale => 
            new Date(sale.createdAt) >= thisMonth
        );

        // Productos más vendidos
        const productSales = {};
        sales.forEach(sale => {
            sale.items.forEach(item => {
                if (!productSales[item.productName]) {
                    productSales[item.productName] = {
                        name: item.productName,
                        quantity: 0,
                        revenue: 0
                    };
                }
                productSales[item.productName].quantity += item.quantity;
                productSales[item.productName].revenue += item.subtotal;
            });
        });

        const topProducts = Object.values(productSales)
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 5);

        res.json({
            success: true,
            stats: {
                today: {
                    count: todaySales.length,
                    revenue: todaySales.reduce((sum, sale) => sum + sale.totalAmount, 0)
                },
                month: {
                    count: monthSales.length,
                    revenue: monthSales.reduce((sum, sale) => sum + sale.totalAmount, 0)
                },
                total: {
                    count: sales.length,
                    revenue: sales.reduce((sum, sale) => sum + sale.totalAmount, 0)
                },
                topProducts
            }
        });

    } catch (error) {
        console.error('❌ Error obteniendo estadísticas:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Controlador para eliminar una venta
const deleteSale = (req, res) => {
    try {
        const saleId = req.params.id;
        
        console.log('🗑️ Eliminando venta con ID:', saleId);
        
        const saleIndex = sales.findIndex(sale => sale.id === saleId);
        
        if (saleIndex === -1) {
            return res.status(404).json({
                success: false,
                message: '❌ Venta no encontrada'
            });
        }

        const saleToDelete = sales[saleIndex];
        
        // Verificar permisos: solo admin puede eliminar ventas de otros
        if (req.user.role !== 'admin' && req.user.role !== 'super_admin' && 
            saleToDelete.sellerId !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: '❌ No tienes permisos para eliminar esta venta'
            });
        }

        // Opcional: Restaurar stock de productos (si se desea esta funcionalidad)
        // for (let item of saleToDelete.items) {
        //     const product = products.find(p => p.id === item.productId);
        //     if (product) {
        //         product.stock += item.quantity;
        //     }
        // }
        
        // Eliminar la venta
        const deletedSale = sales.splice(saleIndex, 1)[0];
        
        console.log('✅ Venta eliminada:', deletedSale.saleNumber);
        console.log('📊 Total de ventas ahora:', sales.length);

        res.json({
            success: true,
            message: '✅ Venta eliminada exitosamente',
            data: deletedSale
        });

    } catch (error) {
        console.error('❌ Error al eliminar venta:', error);
        res.status(500).json({
            success: false,
            message: '❌ Error al eliminar venta'
        });
    }
};

module.exports = {
    getProducts,
    createSale,
    getSales,
    getSaleById,
    getSalesStats,
    deleteSale
};
