// Base de datos temporal para productos
let products = [
    {
        id: 1,
        name: "Aceite Motul 10W40",
        description: "Aceite sintético para motos de alta cilindrada",
        price: 45.99,
        stock: 25,
        category: "lubricante",
        createdAt: new Date(),
        createdBy: "admin"
    },
    {
        id: 2,
        name: "Filtro de Aire Original",
        description: "Filtro de aire para motos 150-200cc",
        price: 18.50,
        stock: 15,
        category: "repuesto", 
        createdAt: new Date(),
        createdBy: "admin"
    }
];
let nextProductId = 3;

const getAllProducts = (req, res) => {
    try {
        console.log('📦 Obteniendo todos los productos...');
        console.log('Total de productos:', products.length);
        
        res.json({
            success: true,
            data: products,
            total: products.length,
            message: `✅ Se encontraron ${products.length} productos`
        });
    } catch (error) {
        console.error('❌ Error al obtener productos:', error);
        res.status(500).json({
            success: false,
            message: '❌ Error al obtener productos'
        });
    }
};

const getProductById = (req, res) => {
    try {
        const rawId = req.params.id;
        console.log('🔍 ID de producto recibido (raw):', rawId, 'tipo:', typeof rawId);
        
        const productId = parseInt(rawId);
        console.log('🔍 ID parseado:', productId, 'es NaN:', isNaN(productId));
        
        if (isNaN(productId)) {
            return res.status(400).json({
                success: false,
                message: '❌ ID de producto inválido'
            });
        }
        
        console.log('🔍 Buscando producto ID:', productId);
        console.log('📋 Productos disponibles:', products.map(p => ({id: p.id, nombre: p.name})));
        
        const product = products.find(p => p.id === productId);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: '❌ Producto no encontrado'
            });
        }

        res.json({
            success: true,
            data: product,
            message: '✅ Producto encontrado'
        });
    } catch (error) {
        console.error('❌ Error al obtener producto:', error);
        res.status(500).json({
            success: false,
            message: '❌ Error al obtener producto'
        });
    }
};

const createProduct = (req, res) => {
    try {
        const { name, description, price, stock, category } = req.body;
        
        console.log('🆕 Creando nuevo producto:', { name, price, stock });

        // Validaciones
        if (!name || !price || !stock) {
            return res.status(400).json({
                success: false,
                message: '❌ Nombre, precio y stock son obligatorios'
            });
        }

        // Crear nuevo producto
        const newProduct = {
            id: nextProductId++,
            name,
            description: description || '',
            price: parseFloat(price),
            stock: parseInt(stock),
            category: category || 'repuesto',
            createdAt: new Date(),
            createdBy: req.user.username
        };

        // Guardar producto
        products.push(newProduct);
        
        console.log('✅ Producto creado exitosamente:', newProduct.id);
        console.log('📊 Total de productos ahora:', products.length);

        res.status(201).json({
            success: true,
            message: '✅ Producto creado exitosamente',
            data: newProduct
        });

    } catch (error) {
        console.error('❌ Error al crear producto:', error);
        res.status(500).json({
            success: false,
            message: '❌ Error al crear producto'
        });
    }
};

const updateProduct = (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        const { name, description, price, stock, category } = req.body;

        console.log('✏️ Actualizando producto ID:', productId);

        const productIndex = products.findIndex(p => p.id === productId);

        if (productIndex === -1) {
            return res.status(404).json({
                success: false,
                message: '❌ Producto no encontrado'
            });
        }

        // Actualizar campos
        if (name) products[productIndex].name = name;
        if (description) products[productIndex].description = description;
        if (price) products[productIndex].price = parseFloat(price);
        if (stock) products[productIndex].stock = parseInt(stock);
        if (category) products[productIndex].category = category;

        products[productIndex].updatedAt = new Date();
        products[productIndex].updatedBy = req.user.username;

        console.log('✅ Producto actualizado:', products[productIndex]);

        res.json({
            success: true,
            message: '✅ Producto actualizado exitosamente',
            data: products[productIndex]
        });

    } catch (error) {
        console.error('❌ Error al actualizar producto:', error);
        res.status(500).json({
            success: false,
            message: '❌ Error al actualizar producto'
        });
    }
};

const deleteProduct = (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        console.log('🗑️ Eliminando producto ID:', productId);

        const productIndex = products.findIndex(p => p.id === productId);

        if (productIndex === -1) {
            return res.status(404).json({
                success: false,
                message: '❌ Producto no encontrado'
            });
        }

        const deletedProduct = products.splice(productIndex, 1)[0];
        
        console.log('✅ Producto eliminado:', deletedProduct.name);
        console.log('📊 Total de productos ahora:', products.length);

        res.json({
            success: true,
            message: '✅ Producto eliminado exitosamente',
            data: deletedProduct
        });

    } catch (error) {
        console.error('❌ Error al eliminar producto:', error);
        res.status(500).json({
            success: false,
            message: '❌ Error al eliminar producto'
        });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};