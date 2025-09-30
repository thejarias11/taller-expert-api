// Base de datos temporal para productos
let products = [];
let nextProductId = 1;

const getAllProducts = (req, res) => {
    try {
        res.json({
            success: true,
            data: products,
            total: products.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '❌ Error al obtener productos'
        });
    }
};

const getProductById = (req, res) => {
    try {
        const product = products.find(p => p.id === parseInt(req.params.id));
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: '❌ Producto no encontrado'
            });
        }

        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '❌ Error al obtener producto'
        });
    }
};

const createProduct = (req, res) => {
    try {
        const { name, description, price, stock, category } = req.body;

        if (!name || !price || !stock) {
            return res.status(400).json({
                success: false,
                message: '❌ Nombre, precio y stock son obligatorios'
            });
        }

        const newProduct = {
            id: nextProductId++,
            name,
            description: description || '',
            price: parseFloat(price),
            stock: parseInt(stock),
            category: category || 'repuesto',
            createdAt: new Date(),
            createdBy: req.user.userId
        };

        products.push(newProduct);

        res.status(201).json({
            success: true,
            message: '✅ Producto creado exitosamente',
            data: newProduct
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '❌ Error al crear producto'
        });
    }
};

const updateProduct = (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        const productIndex = products.findIndex(p => p.id === productId);

        if (productIndex === -1) {
            return res.status(404).json({
                success: false,
                message: '❌ Producto no encontrado'
            });
        }

        const { name, description, price, stock, category } = req.body;

        // Actualizar solo los campos proporcionados
        if (name) products[productIndex].name = name;
        if (description) products[productIndex].description = description;
        if (price) products[productIndex].price = parseFloat(price);
        if (stock) products[productIndex].stock = parseInt(stock);
        if (category) products[productIndex].category = category;

        products[productIndex].updatedAt = new Date();
        products[productIndex].updatedBy = req.user.userId;

        res.json({
            success: true,
            message: '✅ Producto actualizado exitosamente',
            data: products[productIndex]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '❌ Error al actualizar producto'
        });
    }
};

const deleteProduct = (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        const productIndex = products.findIndex(p => p.id === productId);

        if (productIndex === -1) {
            return res.status(404).json({
                success: false,
                message: '❌ Producto no encontrado'
            });
        }

        products.splice(productIndex, 1);

        res.json({
            success: true,
            message: '✅ Producto eliminado exitosamente'
        });
    } catch (error) {
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