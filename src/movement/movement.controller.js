import Movement from './movement.model.js'
import Product from '../product/product.model.js'
import User from '../user/user.model.js'

export const getAllMovements = async (req, res) => {
    try {
        const movements = await Movement.find()
            .populate('product', 'name')
            .populate('employee', 'name email')
            .sort({ date: -1 })

        return res.send({
            message: 'Movements retrieved successfully',
            success: true,
            movements
        })
    } catch (error) {
        return res.status(500).send({
            message: 'Error retrieving movements',
            success: false,
            error
        })
    }
}

export const createMovement = async (req, res) => {
    try {
        const { product, type, quantity, employee, reason, destination } = req.body

        const productDoc = await Product.findById(product)
        if (!productDoc) {
            return res.status(404).send({ success: false, message: 'Product not found' })
        }

        const employeeID = await User.findById(employee)
        if (!employeeID) {
            return res.status(404).send({ success: false, message: 'Employee not found' })
        }

        if (quantity <= 0) {
            return res.status(400).send({ success: false, message: 'Quantity must be greater than 0' })
        }

        if (type === 'EXIT') {
            if (quantity > productDoc.stock) {
                return res.status(400).send({
                    success: false,
                    message: `Insufficient stock for product '${productDoc.name}'. Available: ${productDoc.stock}`
                })
            }

            const num1 = productDoc.stock * 1
            const num2 = quantity * 1
            const total = num1 - num2
            productDoc.stock = total

            const movementUnits = productDoc.soldUnits * 1
            const totalMovementUnits = movementUnits + num2
            productDoc.soldUnits = totalMovementUnits
        } else if (type === 'ENTRY') {

            const num1 = productDoc.stock * 1
            const num2 = quantity * 1
            const total = num1 + num2
            productDoc.stock = total

        } else {
            return res.status(400).send({ success: false, message: 'Invalid movement type' })
        }

        const movement = new Movement({
            product: productDoc._id,
            type,
            quantity,
            employee,
            reason,
            destination
        })

        await movement.save()
        await productDoc.save()

        return res.send({
            success: true,
            message: 'Movement recorded successfully',
            movement
        })
    } catch (error) {
        console.error(error)
        return res.status(500).send({
            success: false,
            message: 'Error creating movement',
            error
        })
    }
}


export const getMovementById = async (req, res) => {
    try {
        const movement = await Movement.findById(req.params.id)
            .populate('product', 'name')
            .populate('employee', 'name email')

        if (!movement) {
            return res.status(404).send({
                message: 'Movement not found',
                success: false
            })
        }

        return res.send({
            message: 'Movement retrieved successfully',
            success: true,
            movement
        })
    } catch (error) {
        return res.status(500).send({
            message: 'Error retrieving movement',
            success: false,
            error
        })
    }
}

export const deleteMovement = async (req, res) => {
    try {
        const { id } = req.params

        const movement = await Movement.findById(id)
        if (!movement) {
            return res.status(404).send({ success: false, message: 'Movement not found' })
        }

        const product = await Product.findById(movement.product)
        if (!product) {
            return res.status(404).send({ success: false, message: 'Associated product not found' })
        }

        const quantity = movement.quantity

        if (movement.type === 'EXIT') {

            const num1 = quantity * 1
            const num2 = product.stock * 1
            const stockTotal = num1 + num2
            product.stock = stockTotal

            const num3 = product.soldUnits * 1
            const soldUnitsTotal = num3 - num2
            product.soldUnits = soldUnitsTotal

            if (product.soldUnits < 0) product.soldUnits = 0

        } else if (movement.type === 'ENTRY') {

            const num1 = product.stock * 1
            const num2 = quantity * 1
            const stockTotal = num1 - num2

            product.stock = stockTotal
            if (product.stock < 0) product.stock = 0
        }

        await product.save()
        await movement.deleteOne()

        return res.send({
            success: true,
            message: 'Movement deleted and inventory updated'
        })
    } catch (error) {
        console.error(error)
        return res.status(500).send({
            success: false,
            message: 'Error deleting movement',
            error
        })
    }
}

export const filterMovements = async (req, res) => {
    try {
        const { type, product, from, to } = req.params
        const filters = {}

        if (type) filters.type = type
        if (product) filters.product = product
        if (from || to) {
            filters.date = {}
            if (from) filters.date.$gte = new Date(from)
            if (to) filters.date.$lte = new Date(to)
        }

        const movements = await Movement.find(filters)
            .populate('product', 'name')
            .populate('employee', 'name email')
            .sort({ date: -1 })

        return res.send({
            message: 'Filtered movements retrieved',
            success: true,
            movements
        })
    } catch (error) {
        return res.status(500).send({
            message: 'Error filtering movements',
            success: false,
            error
        })
    }
}
