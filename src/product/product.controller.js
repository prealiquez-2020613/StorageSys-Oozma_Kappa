import Product from './product.model.js'
import Category from '../category/category.model.js'
import Supplier from '../supplier/supplier.model.js'

// AGREGAR PRODUCTO
export const addProduct = async (req, res) => {
    try {
        const data = req.body

        const categoryExists = await Category.findById(data.category)
        if (!categoryExists) return res.status(404).send({ success: false, message: 'Category not found' })

        const supplierExists = await Supplier.findById(data.supplier)
        if (!supplierExists) return res.status(404).send({ success: false, message: 'Supplier not found' })

        if (data.soldUnits) return res.status(403).send({ message: 'You cannot set soldUnits on creation' })

        const newProduct = new Product(data)
        await newProduct.save()

        return res.send({ success: true, message: 'Product added successfully' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ success: false, message: 'General error adding product', err })
    }
}

// LISTAR PRODUCTOS
export const getProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('category').populate('supplier')
        return res.send({ success: true, products })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ success: false, message: 'Error retrieving products', err })
    }
}

// BUSCAR PRODUCTO POR ID
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params
        const product = await Product.findById(id).populate('category').populate('supplier')
        if (!product) return res.status(404).send({ success: false, message: 'Product not found' })
        return res.send({ success: true, product })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ success: false, message: 'Error retrieving product', err })
    }
}

// ACTUALIZAR PRODUCTO
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params
        const data = req.body

        if (data.category) {
            const exists = await Category.findById(data.category)
            if (!exists) return res.status(404).send({ success: false, message: 'Category not found' })
        }

        if (data.supplier) {
            const exists = await Supplier.findById(data.supplier)
            if (!exists) return res.status(404).send({ success: false, message: 'Supplier not found' })
        }

        if (data.soldUnits) return res.status(403).send({ message: 'You cannot modify soldUnits directly' })

        const updated = await Product.findByIdAndUpdate(id, data, { new: true })
        if (!updated) return res.status(404).send({ success: false, message: 'Product not found' })

        return res.send({ success: true, message: 'Product updated', updated })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ success: false, message: 'Error updating product', err })
    }
}

// ELIMINAR PRODUCTO (con confirmación)
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params
        const { confirm } = req.query

        if (confirm !== 'true') {
            return res.status(400).send({
                success: false,
                message: 'Confirmation required. Use ?confirm=true in query params'
            })
        }

        const deleted = await Product.findByIdAndDelete(id)
        if (!deleted) return res.status(404).send({ success: false, message: 'Product not found' })

        return res.send({ success: true, message: 'Product deleted successfully' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ success: false, message: 'Error deleting product', err })
    }
}

// PRODUCTOS SIN STOCK
export const getOutOfStockProducts = async (req, res) => {
    try {
        const products = await Product.find({ stock: 0 })
        return res.send({ success: true, products })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ success: false, message: 'Error retrieving out-of-stock products', err })
    }
}

// PRODUCTOS MÁS MOVIDOS
export const getMostMovedProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ soldUnits: -1 }).limit(10)
        return res.send({ success: true, products })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ success: false, message: 'Error retrieving most moved products', err })
    }
}

// PRODUCTOS POR CATEGORÍA
export const getProductsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params
        const products = await Product.find({ category: categoryId }).populate('category')
        return res.send({ success: true, products })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ success: false, message: 'Error retrieving by category', err })
    }
}

// BÚSQUEDA POR NOMBRE
export const searchProductsByName = async (req, res) => {
    try {
        const { name } = req.query
        const products = await Product.find({ name: { $regex: name, $options: 'i' } })
        return res.send({ success: true, products })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ success: false, message: 'Error searching products', err })
    }
}
